const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get total user count
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update User Profile
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password, profileImage } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.profileImage = profileImage || user.profileImage; // Update profileImage

    if (password) {
      // WARNING: In a real application, hash the password here (e.g., using bcryptjs)
      user.password = password;
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add Address
router.post('/:id/address', async (req, res) => {
  const { id } = req.params;
  const newAddress = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this is the first address, make it default
    if (user.addresses.length === 0) {
      newAddress.isDefault = true;
    } else if (newAddress.isDefault) {
      // If new address is set as default, unset previous default
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json({ message: 'Address added successfully', user: user.addresses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update Address
router.put('/:id/address/:addressId', async (req, res) => {
  const { id, addressId } = req.params;
  const updatedAddress = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Handle default address logic
    if (updatedAddress.isDefault) {
      user.addresses.forEach(addr => (addr.isDefault = false));
    }
    user.addresses[addressIndex] = { ...user.addresses[addressIndex]._doc, ...updatedAddress };

    await user.save();
    res.status(200).json({ message: 'Address updated successfully', user: user.addresses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete Address
router.delete('/:id/address/:addressId', async (req, res) => {
  const { id, addressId } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const initialLength = user.addresses.length;
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);

    if (user.addresses.length === initialLength) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If the deleted address was the default, and there are other addresses, set the first one as default
    if (user.addresses.length > 0 && !user.addresses.some(addr => addr.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.status(200).json({ message: 'Address deleted successfully', user: user.addresses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Set Default Address
router.put('/:id/address/:addressId/default', async (req, res) => {
  const { id, addressId } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const addressToSetDefault = user.addresses.find(addr => addr._id.toString() === addressId);
    if (!addressToSetDefault) {
      return res.status(404).json({ message: 'Address not found' });
    }

    user.addresses.forEach(addr => {
      addr.isDefault = (addr._id.toString() === addressId);
    });

    await user.save();
    res.status(200).json({ message: 'Default address set successfully', user: user.addresses });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add product to wishlist
router.post('/:id/wishlist', async (req, res) => {
  const { id } = req.params;
  const { productId } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();
    res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Remove product from wishlist
router.delete('/:id/wishlist/:productId', async (req, res) => {
  const { id, productId } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(item => item.toString() !== productId);
    await user.save();
    res.status(200).json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get user's wishlist
router.get('/:id/wishlist', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).populate('wishlist'); // Populate product details
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset-password/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset link sent to your email' });
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired' });
    }

    // Set new password
    user.password = req.body.password; // In a real app, you should hash this password
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;