import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaUserCircle, FaMapMarkerAlt, FaShoppingCart, FaCog, FaSignOutAlt, FaHistory, FaHeart, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function CustomerNavbar({ isCollapsed, setIsCollapsed }) {
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Information', path: '/customer-profile', icon: FaUserCircle },
    { name: 'Address', path: '/customer-profile/address', icon: FaMapMarkerAlt },
    { name: 'Shopping Preferences', path: '/customer-profile/preferences', icon: FaShoppingCart },
    { name: 'My Orders', path: '/customer-profile/my-orders', icon: FaHistory },
    { name: 'Wishlist', path: '/customer-profile/wishlist', icon: FaHeart },
    { name: 'History', path: '/customer-profile/history', icon: FaHistory },
    { name: 'Account Settings', path: '/customer-profile/settings', icon: FaCog },
    { name: 'Logout', icon: FaSignOutAlt, action: logout },
  ];

  return (
    <>
      {/* Toggle Button (Always Visible) */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-20 right-0 z-50 p-3 text-white bg-blue-600 rounded-l-full shadow-lg hover:bg-blue-700 focus:outline-none transition-transform duration-300"
        style={{ transform: isCollapsed ? 'translateX(0)' : 'translateX(-16rem)' }} // Move with the navbar
      >
        {isCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {/* Navbar Panel */}
      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: isCollapsed ? '100%' : '0%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-16 right-0 z-40 bg-white shadow-2xl flex flex-col h-[calc(100vh-64px)] w-64 rounded-l-2xl"
      >
        <div className="flex items-center justify-between p-4 border-b bg-blue-50 rounded-tl-2xl">
          <h2 className="text-lg font-bold text-gray-800">My Account</h2>
        </div>

        <div className="flex flex-col flex-grow gap-2 p-4 overflow-y-auto">
          {navLinks.map((link) =>
            link.path ? (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 rounded-xl transition-all duration-300
                   ${isActive ? 'bg-blue-100 text-blue-700 font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                <link.icon className="w-5 h-5 mr-3" />
                <span>{link.name}</span>
              </NavLink>
            ) : (
              <button
                key={link.name}
                onClick={link.action}
                className="flex items-center w-full py-3 px-4 mt-auto text-red-600 rounded-xl hover:bg-red-50 transition-all duration-300"
              >
                <link.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{link.name}</span>
              </button>
            )
          )}
        </div>
      </motion.nav>
    </>
  );
}
