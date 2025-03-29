'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { FaBars, FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaSearch, FaShoppingCart, FaCoffee } from 'react-icons/fa';
import { notificationService } from '@/services/api';
import Image from 'next/image';
import Link from 'next/link';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await notificationService.getNotifications();
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter(notification => !notification.read).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
    
    // Setup notification polling (every 1 minute)
    const intervalId = setInterval(fetchNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Handle clicks outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark notification as read
  const handleNotificationClick = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(notification => ({
        ...notification,
        read: true
      })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger and Search */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden focus:outline-none"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <FaBars className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-brown-500 focus:ring-1 focus:ring-brown-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Center: Brand */}
          <div className="hidden md:flex md:items-center">
            <Link href="/dashboard">
              <div className="flex items-center cursor-pointer">
                <FaCoffee className="h-8 w-8 text-brown-600 mr-2" />
                <span className="text-xl font-bold text-brown-800">SeeU Cafe Admin</span>
              </div>
            </Link>
          </div>
          
          {/* Right: Notifications and Profile */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                className="relative p-1 text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none"
                onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
              >
                <span className="sr-only">View notifications</span>
                <FaBell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {/* Notification dropdown */}
              {showNotificationDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-brown-600 hover:text-brown-800"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <p className="text-gray-500 text-sm">No notifications</p>
                      </div>
                    ) : (
                      <div className="max-h-60 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0">
                                {/* Icon based on notification type */}
                                {notification.type === 'order' && (
                                  <FaShoppingCart className="h-5 w-5 text-brown-600" />
                                )}
                                {notification.type === 'user' && (
                                  <FaUserCircle className="h-5 w-5 text-blue-600" />
                                )}
                                {/* Add more types as needed */}
                              </div>
                              <div className="ml-3 w-0 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {notifications.length > 0 && (
                      <div className="px-4 py-2 border-t border-gray-200 text-center">
                        <Link
                          href="/notifications"
                          className="text-sm text-brown-600 hover:text-brown-800"
                          onClick={() => setShowNotificationDropdown(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="h-7 w-7 text-gray-400" />
                  )}
                </div>
                <span className="ml-2 text-gray-700 hidden md:block">
                  {user?.name || 'Administrator'}
                </span>
              </button>
              
              {/* Profile dropdown */}
              {showProfileDropdown && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FaUserCircle className="mr-3 h-4 w-4 text-gray-400" />
                      Your Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProfileDropdown(false)}
                    >
                      <FaCog className="mr-3 h-4 w-4 text-gray-400" />
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;