// components/layout/Header.js
import React from 'react';
import { FaBars, FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="z-10 py-4 bg-white shadow-md">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-brown-600">
        {/* Mobile hamburger */}
        <button
          className="p-1 mr-5 -ml-1 rounded-md md:hidden focus:outline-none focus:shadow-outline-brown"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menu"
        >
          <FaBars className="w-6 h-6" />
        </button>
        {/* Search input */}
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-brown-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <FaSearch className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              className="w-full pl-8 pr-2 py-3 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-md focus:placeholder-gray-500 focus:bg-white focus:border-brown-300 focus:outline-none focus:shadow-outline-brown form-input"
              type="text"
              placeholder="Search for menu items, orders, or customers"
              aria-label="Search"
            />
          </div>
        </div>
        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Notifications menu */}
          <li className="relative">
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-brown"
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <FaBell className="w-5 h-5" />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full"
              ></span>
            </button>
          </li>
          {/* Profile menu */}
          <li className="relative">
            <button
              className="align-middle rounded-full focus:shadow-outline-brown focus:outline-none"
              aria-label="Account"
              aria-haspopup="true"
            >
              <img
                className="object-cover w-8 h-8 rounded-full"
                src="https://images.unsplash.com/photo-1502378735452-bc7d86632805?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&s=aa3a807e1bbdfd4364d1f449eaa96d82"
                alt=""
                aria-hidden="true"
              />
            </button>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;