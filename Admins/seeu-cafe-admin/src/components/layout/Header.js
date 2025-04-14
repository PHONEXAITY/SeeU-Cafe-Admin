"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logoutUser } from "@/store/slices/authSlice";
import {
  FaBars,
  FaBell,
  FaUserCircle,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaShoppingCart,
  FaCoffee,
} from "react-icons/fa";
import { IoNotifications, IoClose } from "react-icons/io5";
import { notificationService } from "@/services/api";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -5,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
};

const notificationItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
    },
  }),
};
const searchbarVariants = {
  closed: {
    width: "40px",
    borderColor: "transparent",
  },
  open: {
    width: "250px",
    borderColor: "rgba(209, 213, 219, 1)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotificationDropdown, setShowNotificationDropdown] =
    useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const mockNotifications = [
          {
            id: "1",
            type: "order",
            title: "คำสั่งซื้อใหม่",
            message:
              "คุณได้รับคำสั่งซื้อใหม่ #12345 จากร้าน See U Cafe สาขาเอกมัย",
            read: false,
            createdAt: new Date().toISOString(),
          },
          {
            id: "2",
            type: "user",
            title: "การลงทะเบียนใหม่",
            message: "มีผู้ใช้ใหม่ลงทะเบียนในระบบ",
            read: true,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "3",
            type: "default",
            title: "อัพเดทระบบ",
            message: "ระบบได้รับการอัพเดทเป็นเวอร์ชันล่าสุดแล้ว",
            read: false,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          },
        ];

        setNotifications(mockNotifications);
        setUnreadCount(
          mockNotifications.filter((notification) => !notification.read).length
        );

        console.log("Using mock notification data instead of API call");
      } catch (error) {
        console.error("Error in mock notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotificationDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleNotificationClick = async (id) => {
    try {
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount((prev) => prev - 1);

      console.log(
        `Marked notification ${id} as read (local state only, no API call)`
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          read: true,
        }))
      );
      setUnreadCount(0);

      console.log(
        "Marked all notifications as read (local state only, no API call)"
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <FaShoppingCart className="h-5 w-5 text-brown-600" />;
      case "user":
        return <FaUserCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <FaBell className="h-5 w-5 text-gray-600" />;
    }
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        searchRef.current?.querySelector("input")?.focus();
      }, 100);
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      className="sticky top-0  bg-white border-b border-gray-200 shadow-sm z-40"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {}
          <div className="flex items-center">
            <motion.button
              type="button"
              className="text-gray-500 hover:text-gray-600 lg:hidden focus:outline-none"
              onClick={() => setSidebarOpen(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open sidebar</span>
              <FaBars className="w-6 h-6" />
            </motion.button>
          </div>

          {}
          <div className="flex items-center space-x-1 md:space-x-4">
            {}
            <motion.div
              variants={itemVariants}
              className="relative"
              ref={searchRef}
            >
              <motion.div
                variants={searchbarVariants}
                initial="closed"
                animate={isSearchExpanded ? "open" : "closed"}
                className="relative flex items-center"
              >
                <motion.button
                  onClick={toggleSearch}
                  className={`absolute left-2 text-gray-400 ${
                    isSearchExpanded ? "pointer-events-none" : ""
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaSearch className="h-4 w-4" />
                </motion.button>

                <motion.input
                  type="text"
                  placeholder="ค้นหา..."
                  className={`w-full py-2 pr-3 pl-8 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all ${
                    isSearchExpanded
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />

                {isSearchExpanded && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-2 text-gray-400"
                    onClick={() => setIsSearchExpanded(false)}
                  >
                    <IoClose className="h-4 w-4" />
                  </motion.button>
                )}
              </motion.div>
            </motion.div>

            {}
            <motion.div
              variants={itemVariants}
              className="relative"
              ref={notificationRef}
            >
              <motion.button
                type="button"
                className="relative p-2 text-gray-500 hover:text-amber-700 hover:bg-gray-100 rounded-full focus:outline-none"
                onClick={() =>
                  setShowNotificationDropdown(!showNotificationDropdown)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="View notifications"
              >
                <IoNotifications className="h-5 w-5" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center"
                    >
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {}
              <AnimatePresence>
                {showNotificationDropdown && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
                  >
                    <div className="rounded-t-lg bg-gradient-to-r from-amber-500 to-amber-700 px-4 py-3 text-white flex justify-between items-center">
                      <h3 className="text-sm font-medium">การแจ้งเตือน</h3>
                      {unreadCount > 0 && (
                        <motion.button
                          onClick={markAllAsRead}
                          className="text-xs bg-white bg-opacity-20 hover:bg-opacity-30 py-1 px-2 rounded-full"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          อ่านทั้งหมด
                        </motion.button>
                      )}
                    </div>

                    {isLoading ? (
                      <div className="px-4 py-8 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
                        </div>
                        <p className="text-gray-500 text-sm mt-2">
                          กำลังโหลด...
                        </p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-12 text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                          <IoNotifications className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm mt-2">
                          ไม่มีการแจ้งเตือน
                        </p>
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            custom={index}
                            variants={notificationItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 ${
                              !notification.read ? "bg-amber-50" : ""
                            }`}
                            onClick={() =>
                              handleNotificationClick(notification.id)
                            }
                          >
                            <div className="flex items-start">
                              <div className="flex-shrink-0 bg-amber-100 rounded-full p-2">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="ml-3 w-0 flex-1">
                                <p
                                  className={`text-sm font-medium ${
                                    !notification.read
                                      ? "text-amber-800"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                  {new Date(
                                    notification.createdAt
                                  ).toLocaleString("th-TH", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </p>
                              </div>
                              {!notification.read && (
                                <div className="h-2 w-2 bg-amber-500 rounded-full"></div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {notifications.length > 0 && (
                      <div className="px-4 py-3 border-t border-gray-100 text-center bg-gray-50">
                        <Link
                          href="/notifications"
                          className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                          onClick={() => setShowNotificationDropdown(false)}
                        >
                          ดูการแจ้งเตือนทั้งหมด
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {}
            <motion.div
              variants={itemVariants}
              className="relative"
              ref={profileRef}
            >
              <motion.button
                type="button"
                className="flex items-center space-x-2 rounded-full focus:outline-none"
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-label="Open user menu"
              >
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 flex items-center justify-center overflow-hidden border-2 border-amber-300 shadow-sm">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="h-6 w-6 text-amber-700" />
                  )}
                </div>
                <span className="text-gray-700 text-sm font-medium hidden md:block">
                  {user?.name || "ผู้ดูแลระบบ"}
                </span>
              </motion.button>

              {}
              <AnimatePresence>
                {showProfileDropdown && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden divide-y divide-gray-100"
                  >
                    <div className="px-4 py-3 bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name || "ผู้ดูแลระบบ"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user?.email || "admin@seeucafe.com"}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link href="/profile">
                        <motion.div
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setShowProfileDropdown(false)}
                          whileHover={{
                            backgroundColor: "rgba(249, 250, 251, 1)",
                          }}
                        >
                          <FaUserCircle className="mr-3 h-4 w-4 text-amber-600" />
                          โปรไฟล์
                        </motion.div>
                      </Link>
                      <Link href="/settings">
                        <motion.div
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setShowProfileDropdown(false)}
                          whileHover={{
                            backgroundColor: "rgba(249, 250, 251, 1)",
                          }}
                        >
                          <FaCog className="mr-3 h-4 w-4 text-amber-600" />
                          ตั้งค่า
                        </motion.div>
                      </Link>
                    </div>

                    <div className="py-1">
                      <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-red-50 group"
                        whileHover={{
                          backgroundColor: "rgba(254, 242, 242, 1)",
                        }}
                      >
                        <FaSignOutAlt className="mr-3 h-4 w-4 text-gray-400 group-hover:text-red-500" />
                        <span className="group-hover:text-red-600">
                          ออกจากระบบ
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
