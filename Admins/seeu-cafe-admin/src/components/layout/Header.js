import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaBell, FaUserCircle, FaCog, FaSignOutAlt, FaSearch, FaShoppingCart, FaCoffee } from 'react-icons/fa';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="z-20 py-4 bg-white shadow-md font-['Phetsarath_OT']">
      <div className="container flex items-center justify-between h-full px-6 mx-auto text-brown-600">

        <button
          className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-brown"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Menu"
        >
          <FaBars className="w-6 h-6" />
        </button>
        
        <div className="flex justify-center flex-1 lg:mr-32">
          <div className="relative w-full max-w-xl mr-6 focus-within:text-brown-500">
            <div className="absolute inset-y-0 flex items-center pl-2">
              <FaSearch className="w-4 h-4" aria-hidden="true" />
            </div>
            <input
              className="w-full pl-8 py-2 pr-2 text-sm text-gray-700 placeholder-gray-600 bg-gray-100 border-0 rounded-xl dark:placeholder-gray-500 dark:focus:shadow-outline-gray dark:focus:placeholder-gray-600 dark:bg-gray-700 dark:text-gray-200 focus:placeholder-gray-500 focus:bg-white focus:border-brown-300 focus:outline-none focus:shadow-outline-brown form-input"
              type="text"
              placeholder="ຄົ້ນຫາການຕັ້ງຄ່າທີ່ຕ້ອງການ"
              aria-label="Search"
            />
          </div>
        </div>

        <ul className="flex items-center flex-shrink-0 space-x-6">
          {/* Quick order button */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-brown"
              aria-label="Quick Order"
            >
              <FaCoffee className="w-5 h-5" />
            </button>
          </li>
          {/* Shopping cart */}
          <li className="flex">
            <button
              className="rounded-md focus:outline-none focus:shadow-outline-brown"
              aria-label="Shopping Cart"
            >
              <FaShoppingCart className="w-5 h-5" />
            </button>
          </li>
          {/* Notifications menu */}
          <li className="relative" ref={notificationRef}>
            <button
              className="relative align-middle rounded-md focus:outline-none focus:shadow-outline-brown"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              aria-label="Notifications"
              aria-haspopup="true"
            >
              <FaBell className="w-5 h-5" />
              <span
                aria-hidden="true"
                className="absolute top-0 right-0 inline-block w-3 h-3 transform translate-x-1 -translate-y-1 bg-red-600 border-2 border-white rounded-full"
              ></span>
            </button>
            {isNotificationOpen && (
              <ul
                className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md"
                aria-label="submenu"
              >
                <li className="flex">
                  <a
                    className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800"
                    href="#"
                  >
                    <span>ໄດ້ຮັບການສັ່ງຊື້ໃໝ່</span>
                    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full">
                      New
                    </span>
                  </a>
                </li>
                <li className="flex">
                  <a
                    className="inline-flex items-center justify-between w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800"
                    href="#"
                  >
                    <span>ສິນຄ້າໝົດໃນສະຕ໊ອກແລ້ວ</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
          {/* Profile menu */}
          <li className="relative" ref={profileRef}>
            <button
              className="align-middle rounded-full focus:shadow-outline-brown focus:outline-none"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
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
            {isProfileMenuOpen && (
              <ul
                className="absolute right-0 w-56 p-2 mt-2 space-y-2 text-gray-600 bg-white border border-gray-100 rounded-md shadow-md"
                aria-label="submenu"
              >
                <li className="flex">
                  <a
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800"
                    href="#"
                  >
                    <FaUserCircle className="w-4 h-4 mr-3" />
                    <span>ໂປຣໄຟລ໌</span>
                  </a>
                </li>
                <li className="flex">
                  <a
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800"
                    href="#"
                  >
                    <FaCog className="w-4 h-4 mr-3" />
                    <span>ການຕັ້ງຄ່າ</span>
                  </a>
                </li>
                <li className="flex">
                  <a
                    className="inline-flex items-center w-full px-2 py-1 text-sm font-semibold transition-colors duration-150 rounded-md hover:bg-gray-100 hover:text-gray-800"
                    href="#"
                  >
                    <FaSignOutAlt className="w-4 h-4 mr-3" />
                    <span>Log out</span>
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;