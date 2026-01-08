import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomerNavbar from './CustomerNavbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  const { isLoggedIn, userRole } = useAuth();
  // Default to collapsed (hidden) so full screen is shown initially
  const [isCustomerNavbarCollapsed, setIsCustomerNavbarCollapsed] = useState(true);

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />
      {isLoggedIn && userRole === 'customer' && 
        <CustomerNavbar 
          isCollapsed={isCustomerNavbarCollapsed} 
          setIsCollapsed={setIsCustomerNavbarCollapsed} 
        />
      }

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow pt-16 transition-all duration-300"
      >
        {children}
      </motion.main>

      <motion.div
        className="transition-all duration-300"
      >
        <Footer />
      </motion.div>
    </div>
  );
}
