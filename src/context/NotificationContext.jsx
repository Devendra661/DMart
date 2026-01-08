import React, { createContext, useContext, useState, useEffect } from 'react';
import socket from '../utils/socket';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // socket is already initialized in utils/socket.js

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('new_order', (order) => {
      console.log('New order received:', order);
      const productNames = order.items.map(item => item.name || (item.productId && item.productId.name) || 'Product').slice(0, 2).join(', ');
      const moreCount = order.items.length - 2;
      const message = `New Order: ${productNames}${moreCount > 0 ? ` +${moreCount} more` : ''} - ₹${order.totalAmount.toFixed(2)}`;
      
      const newNotification = {
        id: order._id,
        message: message,
        timestamp: new Date().toLocaleString(),
        orderData: order,
        read: false,
      };
      setNewOrderCount((prevCount) => prevCount + 1);
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      // Optionally, show a toast notification
      // toast.success(`New Order: ${order._id}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socket.off('connect');
      socket.off('new_order');
      socket.off('disconnect');
    };
  }, []);

  const clearNewOrderCount = () => {
    setNewOrderCount(0);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, read: true }))
    );
  };

  const value = {
    newOrderCount,
    notifications,
    clearNewOrderCount,
    markAllNotificationsAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
