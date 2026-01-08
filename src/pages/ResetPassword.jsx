import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaLock } from 'react-icons/fa';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    const loadingToast = toast.loading('Resetting password...');
    try {
      const response = await fetch(`/api/user/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message, { id: loadingToast });
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to reset password', { id: loadingToast });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('An error occurred.', { id: loadingToast });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 flex items-center text-gray-400 left-3">
                <FaLock />
              </span>
              <input
                type="password"
                id="password"
                className="w-full py-2 pl-10 pr-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 flex items-center text-gray-400 left-3">
                <FaLock />
              </span>
              <input
                type="password"
                id="confirmPassword"
                className="w-full py-2 pl-10 pr-3 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 font-semibold text-white transition bg-blue-600 rounded-lg shadow-md cursor-pointer hover:bg-blue-700 hover:shadow-xl"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
