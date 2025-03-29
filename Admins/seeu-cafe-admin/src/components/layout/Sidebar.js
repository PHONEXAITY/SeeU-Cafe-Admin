'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FaTimes, FaHome, FaShoppingBag, FaShoppingCart, FaUsers, 
  FaTruck, FaChartBar, FaComments, FaBell, FaCog, FaUserFriends,
  FaBlog, FaPercent, FaImages, FaThLarge, FaCreditCard, FaBoxOpen
} from 'react-icons/fa';
import Image from 'next/image';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const pathname = usePathname();
  const { user, hasRole } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile, setSidebarOpen]);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <FaHome className="w-5 h-5" />,
      href: '/dashboard',
      roleRequired: null, // Everyone can access
    },
    {
      title: 'Products',
      icon: <FaShoppingBag className="w-5 h-5" />,
      href: '/products',
      roleRequired: 'admin', // Only admin and above can access
    },
    {
      title: 'Categories',
      icon: <FaBoxOpen className="w-5 h-5" />,
      href: '/categories',
      roleRequired: 'admin',
    },
    {
      title: 'Orders',
      icon: <FaShoppingCart className="w-5 h-5" />,
      href: '/orders',
      roleRequired: 'staff', // Staff and above can access
    },
    {
      title: 'Users',
      icon: <FaUsers className="w-5 h-5" />,
      href: '/users',
      roleRequired: 'admin',
    },
    {
      title: 'Shipping',
      icon: <FaTruck className="w-5 h-5" />,
      href: '/shipping',
      roleRequired: 'admin',
    },
    {
      title: 'Analytics',
      icon: <FaChartBar className="w-5 h-5" />,
      href: '/analytics',
      roleRequired: 'admin',
    },
    {
      title: 'Reviews',
      icon: <FaComments className="w-5 h-5" />,
      href: '/reviews',
      roleRequired: 'staff',
    },
    {
      title: 'Notifications',
      icon: <FaBell className="w-5 h-5" />,
      href: '/notifications',
      roleRequired: 'staff',
    },
    {
      title: 'Customers',
      icon: <FaUserFriends className="w-5 h-5" />,
      href: '/customers',
      roleRequired: 'staff',
    },
    {
      title: 'Blog',
      icon: <FaBlog className="w-5 h-5" />,
      href: '/blog',
      roleRequired: 'admin',
    },
    {
      title: 'Promotions',
      icon: <FaPercent className="w-5 h-5" />,
      href: '/promotions',
      roleRequired: 'admin',
    },
    {
      title: 'Slideshow',
      icon: <FaImages className="w-5 h-5" />,
      href: '/slideshow',
      roleRequired: 'admin',
    },
    {
      title: 'Gallery',
      icon: <FaThLarge className="w-5 h-5" />,
      href: '/gallery',
      roleRequired: 'admin',
    },
    {
      title: 'Payment',
      icon: <FaCreditCard className="w-5 h-5" />,
      href: '/payment',
      roleRequired: 'admin',
    },
    {
      title: 'Settings',
      icon: <FaCog className="w-5 h-5" />,
      href: '/settings',
      roleRequired: 'admin',
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (!item.roleRequired) return true;
    return hasRole(item.roleRequired);
  });

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brown-800 transition duration-300 ease-in-out transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0 lg:z-30`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 bg-brown-900">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Image 
                src="/images/logo.png" 
                alt="SeeU Cafe" 
                width={40} 
                height={40}
                className="rounded-full"
              />
              <span className="ml-2 text-white font-semibold text-lg">SeeU Cafe</span>
            </div>
          </div>
          <button
            className="lg:hidden text-gray-200 hover:text-white focus:outline-none"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar user info */}
        <div className="px-4 py-3 border-b border-brown-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-full bg-brown-600 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={user.name} 
                    width={40} 
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-white">
                    {user?.name?.charAt(0) || 'A'}
                  </span>
                )}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name || 'Administrator'}</p>
              <p className="text-xs text-brown-300">{user?.email || 'admin@seeucafe.com'}</p>
            </div>
          </div>
        </div>

        {/* Sidebar navigation */}
        <nav className="mt-4 px-2 space-y-1 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {filteredMenuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                pathname === item.href
                  ? 'bg-brown-700 text-white'
                  : 'text-brown-200 hover:bg-brown-700 hover:text-white'
              }`}
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <div className={`mr-3 ${
                pathname === item.href
                  ? 'text-white'
                  : 'text-brown-400 group-hover:text-brown-300'
              }`}>
                {item.icon}
              </div>
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-brown-700">
          <div className="text-xs text-brown-400 text-center">
            <p>&copy; {new Date().getFullYear()} SeeU Cafe</p>
            <p className="mt-1">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;