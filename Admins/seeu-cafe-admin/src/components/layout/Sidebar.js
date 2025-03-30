'use client';

import React, { useState, useEffect, useRef, useMemo, useReducer } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/slices/authSlice';
import {
  FaTimes, FaCoffee, FaMoon, FaSun, FaChevronDown, FaChevronRight, FaLeaf,
  FaSignOutAlt, FaBars, FaChevronLeft, FaDesktop, FaTabletAlt, FaMobileAlt,
  FaSearch, FaUserCircle, FaCog, FaPlus
} from 'react-icons/fa';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { debounce } from 'lodash';

// ปรับปรุงชุดสีให้เข้ากับร้านคาเฟ่
const colors = {
  primary: { 
    light: '#F5E6D8', // สีครีมอ่อน
    DEFAULT: '#A67244', // น้ำตาลกาแฟเข้ม 
    dark: '#73512F'    // น้ำตาลเอสเปรสโซ
  }, 
  secondary: { 
    light: '#F8F2E9', // ครีมเบจอ่อน
    DEFAULT: '#D9B99B', // สีมอคค่าอ่อน
    dark: '#AC9377'     // สีน้ำตาลทอง
  },
  accent: { 
    light: '#F4D7A7', // สีคาราเมลอ่อน
    DEFAULT: '#E8B86C', // สีคาราเมล
    dark: '#D19C45'    // สีน้ำตาลทอง
  },   
  neutral: { 
    light: '#FFFBF6', // สีขาวงาช้าง
    DEFAULT: '#F0EAE2', // สีเบจอ่อน
    dark: '#3A2E1F'     // น้ำตาลเข้ม
  }
};

// Animation Variants
const sidebarVariants = {
  open: {
    width: '300px',
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 36,
      mass: 2,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  },
  collapsed: {
    width: '88px',
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 36,
      mass: 2,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  },
  closed: {
    width: '300px',
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 36,
      mass: 2
    }
  },
};

const menuItemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
      mass: 1
    }
  },
  closed: {
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2
    }
  },
  collapsed: {
    width: 'auto',
    transition: {
      duration: 0.3
    }
  }
};

const submenuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  visible: {
    opacity: 1,
    height: "auto",
    marginTop: 8,
    marginBottom: 8,
    transition: {
      duration: 0.3,
      ease: "easeInOut" 
    }
  }
};

const textVariants = {
  open: {
    opacity: 1,
    x: 0,
    display: "block",
    transition: {
      duration: 0.3,
      delay: 0.1
    }
  },
  collapsed: {
    opacity: 0,
    x: -10,
    transitionEnd: {
      display: "none"
    },
    transition: {
      duration: 0.2
    }
  }
};

const iconVariants = {
  open: {
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.3
    }
  },
  collapsed: {
    x: 0,
    rotate: 0,
    transition: {
      duration: 0.3
    }
  }
};

const backdropVariants = {
  closed: {
    opacity: 0,
    backdropFilter: "blur(0px)"
  },
  open: {
    opacity: 1,
    backdropFilter: "blur(3px)"
  }
};

const logoVariants = {
  initial: {
    scale: 0.8,
    opacity: 0
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  },
  hover: {
    scale: 1.08,
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.5
    }
  }
};

const tooltipVariants = {
  hidden: {
    opacity: 0,
    x: -10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.2
    }
  }
};

const floatingButtonVariants = {
  initial: {
    opacity: 0,
    scale: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  },
  hover: {
    scale: 1.1,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
  },
  tap: {
    scale: 0.95
  }
};

const quickActionsVariants = {
  initial: {
    opacity: 0,
    y: 20,
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1
    }
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const quickActionItemVariants = {
  initial: (i) => ({
    opacity: 0,
    y: 20,
    x: 20,
    transition: {
      delay: i * 0.05
    }
  }),
  animate: (i) => ({
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      delay: i * 0.05
    }
  }),
  exit: (i) => ({
    opacity: 0,
    x: 10,
    transition: {
      delay: i * 0.05
    }
  })
};
// Import menuItems จาก file อื่น (สมมติว่ามีอยู่แล้ว)
import { menuItems } from './menuItems';

// State Reducer
const initialState = {
  collapsed: false,
  sidebarOpen: false,
  expandedMenus: {},
  searchVisible: false,
  darkMode: false,
  showQuickActions: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_COLLAPSE':
      return { ...state, collapsed: !state.collapsed };
    case 'SET_SIDEBAR_OPEN':
      return { ...state, sidebarOpen: action.payload };
    case 'TOGGLE_SUBMENU':
      return {
        ...state,
        expandedMenus: { ...state.expandedMenus, [action.payload]: !state.expandedMenus[action.payload] }
      };
    case 'SET_EXPANDED_MENUS':
      return { ...state, expandedMenus: action.payload };
    case 'TOGGLE_SEARCH':
      return { ...state, searchVisible: !state.searchVisible };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'TOGGLE_QUICK_ACTIONS':
      return { ...state, showQuickActions: !state.showQuickActions };
    default:
      return state;
  }
}

const MenuItem = ({ item, collapsed, isRtl, darkMode, pathname, toggleSubmenu, expandedMenus, hoverItem, setHoverItem }) => {
  const isActive = item.href ? pathname === item.href || pathname.startsWith(`${item.href}/`) :
    item.subItems?.some(subItem => pathname === subItem.href || pathname.startsWith(`${subItem.href}/`));
  const hasSubmenu = !!item.subItems;
  
  // เพิ่ม animation หลังจาก load component
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
    id={`menu-item-${item.id}`}
      variants={menuItemVariants} 
      className="relative mb-2.5"
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.3 }}
    >
      <Link href={item.href || '#'} onClick={(e) => hasSubmenu && e.preventDefault()}>
        <motion.div
          className={`flex items-center py-3.5 px-4 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden group ${
            isActive
              ? darkMode 
                ? 'bg-accent-dark/40 text-white shadow-lg border border-accent-DEFAULT/20' 
                : 'bg-primary-light/50 text-primary-dark shadow-md border border-primary-DEFAULT/20'
              : darkMode 
                ? 'hover:bg-accent-dark/20 text-white/90 hover:shadow-md' 
                : 'hover:bg-secondary-light/60 text-neutral-dark hover:shadow-sm'
          }`}
          whileHover={{ 
            x: isRtl ? -5 : 5, 
            scale: 1.02,
            backgroundColor: darkMode 
              ? isActive ? 'rgba(209, 156, 69, 0.5)' : 'rgba(209, 156, 69, 0.2)' 
              : isActive ? 'rgba(166, 114, 68, 0.4)' : 'rgba(166, 114, 68, 0.1)'
          }}
          whileTap={{ scale: 0.98 }}
          onClick={() => hasSubmenu && toggleSubmenu(item.id)}
          onHoverStart={() => !collapsed ? null : setHoverItem(`menu-${item.id}`)}
          onHoverEnd={() => !collapsed ? null : setHoverItem(null)}
          role="menuitem"
          aria-haspopup={hasSubmenu}
          aria-expanded={hasSubmenu && expandedMenus[item.id]}
        >
          {/* Active Item Background Animation */}
          {isActive && (
            <motion.div 
              className={`absolute inset-0 rounded-xl ${
                darkMode ? 'bg-accent-DEFAULT/15' : 'bg-primary-DEFAULT/10'
              }`}
              layoutId="activeMenuBackground"
              transition={{ duration: 0.4, type: "spring", bounce: 0.15 }}
            />
          )}
          
          {/* Hover Ripple Effect */}
          <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
            <motion.div
              className={`w-full h-full ${darkMode ? 'bg-accent-DEFAULT/15' : 'bg-primary-DEFAULT/10'}`}
              initial={{ scale: 0, x: '-50%', y: '-50%', opacity: 0 }}
              whileHover={{ scale: 5, opacity: 0.7 }}
              transition={{ duration: 1.2 }}
              style={{ 
                borderRadius: '100%', 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transformOrigin: 'center center'
              }}
            />
          </div>
          
          {/* Icon with animation */}
          <motion.div 
            variants={iconVariants}
            className={`${isActive ? 'scale-110' : ''} transition-transform duration-300 z-10
              ${isActive ? (darkMode ? 'text-white' : 'text-primary-DEFAULT') : 
              (darkMode ? 'text-white/80' : 'text-primary-DEFAULT/80')}`}
            whileHover={{ scale: 1.2, rotate: [0, -10, 10, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            {item.icon}
          </motion.div>
          
          {!collapsed && (
            <motion.span 
              variants={textVariants} 
              className={`ml-3.5 flex-1 font-medium z-10 group-hover:pl-1 transition-all duration-300 
                ${isActive ? 'text-md' : 'text-sm'}`}
            >
              {item.text}
            </motion.span>
          )}
          
          {/* Dropdown Icon with Animation */}
          {hasSubmenu && !collapsed && (
            <motion.div 
              animate={{ 
                rotate: expandedMenus[item.id] ? 180 : 0,
                scale: expandedMenus[item.id] ? 1.2 : 1
              }} 
              transition={{ duration: 0.4, type: "spring" }}
              className="ml-auto z-10"
            >
              <FaChevronDown className="h-3 w-3" />
            </motion.div>
          )}
          
          {/* New Badge with Animation */}
          {item.isNew && (
            <motion.div 
              className={`absolute top-1 ${isRtl ? 'left-1' : 'right-1'} px-1.5 py-0.5 rounded-md text-[10px] font-medium ${
                darkMode ? 'bg-green-500/80 text-white' : 'bg-green-500 text-white'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              ໃໝ່
            </motion.div>
          )}
          
          {/* Notification Counter with Animation */}
          {item.notificationCount > 0 && (
            <motion.div 
              className={`absolute ${isRtl ? 'left-1' : 'right-1'} top-1 min-w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                darkMode ? 'bg-red-500 text-white' : 'bg-red-500 text-white'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              {item.notificationCount > 99 ? '99+' : item.notificationCount}
            </motion.div>
          )}
        </motion.div>
      </Link>
      
      {/* Submenu (when not collapsed) */}
      {hasSubmenu && !collapsed && (
        <AnimatePresence>
          {expandedMenus[item.id] && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`mx-2 my-1 rounded-xl overflow-hidden ${
                darkMode 
                  ? 'bg-neutral-dark/80 border border-accent-dark/20 shadow-lg' 
                  : 'bg-secondary-light/60 border border-primary-light/20 shadow-md'
              }`}
            >
              {item.subItems.map((subItem, index) => (
                <Link key={subItem.href} href={subItem.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.2 }}
                    className={`py-2.5 px-8 text-sm transition-all duration-300 ${
                      pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                        ? darkMode 
                          ? 'bg-accent-dark/50 text-white font-medium' 
                          : 'bg-primary-light/40 text-primary-DEFAULT font-medium'
                        : darkMode 
                          ? 'text-white/80 hover:bg-accent-dark/20 hover:pl-10' 
                          : 'text-neutral-dark/90 hover:bg-primary-light/20 hover:pl-10'
                    }`}
                    whileHover={{ scale: 1.01, x: 3 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center">
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 transition-opacity duration-300 ${
                        pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                          ? darkMode ? 'bg-white' : 'bg-primary-DEFAULT' 
                          : 'opacity-0'
                      }`}></div>
                      {subItem.text}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      
      {/* Tooltip Submenu (when collapsed) */}
      {hasSubmenu && collapsed && (
        <AnimatePresence>
          {hoverItem === `menu-${item.id}` && (
            <motion.div
            className={`fixed z-[100] py-2 px-3 min-w-[200px] rounded-xl shadow-lg border ${
              darkMode 
                ? 'bg-neutral-dark border-accent-dark/30' 
                : 'bg-neutral-light border-secondary-DEFAULT/20'
            }`}
              initial={{ opacity: 0, x: isRtl ? 20 : -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: isRtl ? 10 : -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              style={{
                // ปรับตำแหน่งให้ตรงกับ menu item ที่ hover อยู่
                top: `${document.getElementById(`menu-item-${item.id}`)?.getBoundingClientRect().top}px`,
                [isRtl ? 'right' : 'left']: '88px',
                pointerEvents: 'auto',
              }}
            >
              <div className={`font-medium mb-2 pb-1 border-b ${
                darkMode ? 'border-accent-dark/20' : 'border-primary-light/30'
              }`}>
                {item.text}
              </div>
              <div className="space-y-1">
                {item.subItems.map((subItem, idx) => (
                  <Link key={subItem.href} href={subItem.href}>
                    <motion.div
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, duration: 0.15 }}
                      className={`py-1.5 px-2 rounded-md text-sm ${
                        pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                          ? darkMode 
                            ? 'bg-accent-dark/40 text-white' 
                            : 'bg-primary-light/30 text-primary-DEFAULT'
                          : darkMode 
                            ? 'text-white/80 hover:bg-accent-dark/20' 
                            : 'text-neutral-dark/80 hover:bg-primary-light/20'
                      }`}
                      whileHover={{ x: 3 }}
                    >
                      <div className="flex items-center">
                        <div className={`w-1 h-1 rounded-full mr-2 ${
                          pathname === subItem.href || pathname.startsWith(`${subItem.href}/`)
                            ? darkMode ? 'bg-white' : 'bg-primary-DEFAULT'
                            : 'opacity-0'
                        }`}></div>
                        {subItem.text}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};
// Main Component
const UltraResponsiveCafeSidebar = ({ sidebarOpen: externalSidebarOpen, setSidebarOpen: setExternalSidebarOpen }) => {
  const pathname = usePathname();
  const user = useSelector(selectUser);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { collapsed, sidebarOpen, expandedMenus, searchVisible, darkMode, showQuickActions } = state;
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoverItem, setHoverItem] = useState(null);
  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);
  const userCollapsedRef = useRef(false);

  // Responsive handling with debounce
  useEffect(() => {
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const isMobileSize = width < 768;
      const isTabletSize = width >= 768 && width < 1280;
      const isDesktopSize = width >= 1280;

      setIsMobile(isMobileSize);
      setIsTablet(isTabletSize);
      setIsDesktop(isDesktopSize);

      // ปรับปรุงการจัดการ sidebar state ตาม breakpoint
      if (isMobileSize) {
        dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
      } else if (isTabletSize) {
        // On tablet, default to collapsed unless user has explicitly set it
        if (!userCollapsedRef.current) {
          if (!collapsed) dispatch({ type: 'TOGGLE_COLLAPSE' });
        }
      } else if (isDesktopSize) {
        // On desktop, default to expanded unless user has explicitly set it
        if (!userCollapsedRef.current) {
          if (collapsed) dispatch({ type: 'TOGGLE_COLLAPSE' });
        }
      }
    }, 150);

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, [collapsed]);

  // Load preferences
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('cafe-dark-mode') === 'true';
    const savedRtl = localStorage.getItem('cafe-rtl') === 'true';
    const savedCollapsed = localStorage.getItem('cafe-sidebar-collapsed') === 'true';
    const savedExpandedMenus = JSON.parse(localStorage.getItem('cafe-expanded-menus') || '{}');

    if (savedDarkMode) {
      dispatch({ type: 'TOGGLE_DARK_MODE' });
      document.documentElement.classList.add('cafe-dark-mode');
    }
    if (savedRtl) {
      setIsRtl(true);
      document.documentElement.dir = 'rtl';
    }
    if (savedCollapsed && !isMobile) {
      dispatch({ type: 'TOGGLE_COLLAPSE' });
      userCollapsedRef.current = true;
    }
    if (Object.keys(savedExpandedMenus).length > 0) {
      dispatch({ type: 'SET_EXPANDED_MENUS', payload: savedExpandedMenus });
    }
  }, [isMobile]);
  // Sync external sidebar state
  useEffect(() => {
    if (externalSidebarOpen !== undefined) {
      dispatch({ type: 'SET_SIDEBAR_OPEN', payload: externalSidebarOpen });
    }
  }, [externalSidebarOpen]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
    }
  }, [pathname, isMobile]);

  // Focus search input
  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
        setExternalSidebarOpen?.(false);
      }
      if (showQuickActions && !event.target.closest('.quick-actions-container')) {
        dispatch({ type: 'TOGGLE_QUICK_ACTIONS' });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, sidebarOpen, showQuickActions, setExternalSidebarOpen]);

  // Memoized menu items
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => !item.roleRequired || (user?.roles?.includes(item.roleRequired) || user?.role === item.roleRequired));
  }, [user]);

  const displayedMenuItems = useMemo(() => {
    if (!searchQuery) return filteredMenuItems;
    const query = searchQuery.toLowerCase();
    return filteredMenuItems.filter(item =>
      item.text.toLowerCase().includes(query) ||
      (item.subItems && item.subItems.some(sub => sub.text.toLowerCase().includes(query)))
    );
  }, [filteredMenuItems, searchQuery]);

  // Handlers
  const toggleCollapse = () => {
    dispatch({ type: 'TOGGLE_COLLAPSE' });
    userCollapsedRef.current = !collapsed;
    localStorage.setItem('cafe-sidebar-collapsed', !collapsed ? 'true' : 'false');
  };

  const toggleSubmenu = (menuId) => {
    dispatch({ type: 'TOGGLE_SUBMENU', payload: menuId });
    localStorage.setItem('cafe-expanded-menus', JSON.stringify({ ...expandedMenus, [menuId]: !expandedMenus[menuId] }));
  };

  const toggleSearch = () => {
    dispatch({ type: 'TOGGLE_SEARCH' });
    if (searchVisible) setSearchQuery('');
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
    document.documentElement.classList.toggle('cafe-dark-mode');
    localStorage.setItem('cafe-dark-mode', !darkMode ? 'true' : 'false');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      alert('Logging out...');
    }
  };

  const sidebarState = isMobile ? (sidebarOpen ? 'open' : 'closed') : (collapsed ? 'collapsed' : 'open');
  return (
    <>
      <motion.div
        ref={sidebarRef}
        className={`fixed inset-y-0 ${isRtl ? 'right-0' : 'left-0'} z-40 flex flex-col overflow-hidden 
          lg:static lg:inset-0 lg:z-30 shadow-xl font-['Phetsarath_OT'] ${
          darkMode ? 'bg-neutral-dark text-white border-r border-accent-dark/30' : 'bg-neutral-light text-neutral-dark border-r border-secondary-dark/20'
        }`}
        variants={sidebarVariants}
        initial={false}
        animate={sidebarState}
        style={{ '--color-primary': colors.primary.DEFAULT, '--color-secondary': colors.secondary.DEFAULT, '--color-accent': colors.accent.DEFAULT }}
      >
        {/* Header - ปรับปรุงใหม่ด้วย animation มากขึ้น */}
        <div className={`h-24 relative overflow-hidden ${
          darkMode 
            ? 'bg-gradient-to-r from-primary-dark via-accent-dark to-primary-dark' 
            : 'bg-gradient-to-r from-primary-light via-secondary-light to-primary-light'
        }`}>
          {/* เพิ่ม pattern และเอฟเฟกต์พื้นหลัง */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 right-0 h-px bg-white/60"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10"></div>
            
            {/* วงกลมเรืองแสงเพื่อเพิ่มมิติ */}
            <div className="absolute top-4 -left-6 w-28 h-28 bg-white/10 rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/10 rounded-full transform translate-x-20 translate-y-20"></div>
            <div className="absolute -top-10 left-1/3 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="absolute -top-5 right-1/4 w-16 h-16 bg-white/5 rounded-full"></div>
            
            {/* เพิ่มลายเมล็ดกาแฟสำหรับพื้นหลัง */}
            <svg width="100%" height="100%" className="absolute inset-0 opacity-5" style={{ pointerEvents: 'none' }}>
              <pattern id="coffee-beans" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M10,15 Q15,5 20,15 T30,15 M10,25 Q15,15 20,25 T30,25" 
                  stroke={darkMode ? "white" : "black"} 
                  fill="none" 
                  strokeWidth="1" />
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#coffee-beans)" />
            </svg>
          </div>
          
          <div className="relative flex items-center justify-between h-full px-5">
            <div className="flex items-center space-x-4">
              <motion.div 
                variants={logoVariants} 
                initial="initial" 
                animate="animate" 
                whileHover="hover"
                className="relative"
              >
                <div className={`h-14 w-14 rounded-2xl overflow-hidden flex items-center justify-center border ${
                  darkMode 
                    ? 'bg-white/10 border-white/30 shadow-lg backdrop-blur-sm' 
                    : 'bg-white/80 border-primary-light/60 shadow-lg backdrop-blur-sm'
                }`}>
                  <Image
                    src={darkMode ? '/logo.png' : '/logoMB.png'} 
                    alt="SeeU Cafe Logo"
                    width={54}
                    height={54}
                    className="object-contain"
                  />
                  
                  {/* เพิ่มใบไม้เคลื่อนไหวด้านบนของโลโก้ */}
                  <motion.div
                    className="absolute -top-4 left-1/2 w-6 h-6 -ml-3 opacity-80"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <FaLeaf className="h-4 w-4 text-green-400 transform -rotate-45 filter drop-shadow-md" />
                  </motion.div>
                </div>
                
                {/* เพิ่ม coffee steam animation */}
                <motion.div
                  className="absolute -top-2 left-1/2 -ml-1 w-2 transform"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.7, 0],
                    y: [-5, -15],
                    x: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeOut",
                    delay: 0.5 
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path
                      d="M0,5 Q5,0 5,5 T10,5"
                      stroke={darkMode ? "rgba(255,255,255,0.6)" : "rgba(166,124,91,0.6)"}
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </motion.div>
                
                {/* เพิ่ม coffee steam animation ที่สอง */}
                <motion.div
                  className="absolute -top-3 left-1/2 -ml-3 w-2 transform"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0, 0.5, 0],
                    y: [-2, -12],
                    x: [-1, -3, -1]
                  }}
                  transition={{ 
                    duration: 1.7, 
                    repeat: Infinity, 
                    ease: "easeOut",
                    delay: 0.2
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 10 10">
                    <path
                      d="M0,5 Q5,0 5,5 T10,5"
                      stroke={darkMode ? "rgba(255,255,255,0.5)" : "rgba(166,124,91,0.5)"}
                      strokeWidth="1.5"
                      fill="none"
                    />
                  </svg>
                </motion.div>
              </motion.div>
              
              {!collapsed && (
                <motion.div 
                  variants={textVariants}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <h1 className={`font-bold text-2xl text-[#8B4512]${
                    darkMode ? 'text-white' : 'text-primary-dark'
                  } filter drop-shadow-sm`}>
                    SeeU Cafe
                  </h1>
                  <div className="flex items-center">
                    <p className={`text-xs ${
                      darkMode ? 'text-white/80' : 'text-primary-DEFAULT/90'
                    }`}>
                      ຜູ້ດູແລລະບົບ
                    </p>
                    <motion.span 
                      className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 ml-1.5 align-middle"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="flex items-center space-x-3 z-[60]">
              {!isMobile && (
                <motion.button
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border ${
                    darkMode 
                      ? 'bg-gradient-to-br from-accent-dark to-primary-dark border-accent-DEFAULT/30 text-white hover:bg-accent-dark/80' 
                      : 'bg-gradient-to-br from-primary-light to-secondary-light border-primary-DEFAULT/30 text-primary-DEFAULT hover:bg-primary-light/80'
                  }`}
                  onClick={toggleCollapse}
                  whileHover={{ scale: 1.1, rotate: isRtl ? -10 : 10 }}
                  whileTap={{ scale: 0.9, rotate: isRtl ? 20 : -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  aria-expanded={!collapsed}
                  style={{ zIndex: 60 }}
                >
                  {isRtl ? (collapsed ? <FaChevronLeft /> : <FaChevronRight />) : (collapsed ? <FaChevronRight /> : <FaChevronLeft />)}
                </motion.button>
              )}
              
              {isMobile && (
                <motion.button
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md border ${
                    darkMode 
                      ? 'bg-gradient-to-br from-accent-dark to-primary-dark border-accent-DEFAULT/30 text-white hover:bg-accent-dark/80' 
                      : 'bg-gradient-to-br from-primary-light to-secondary-light border-primary-DEFAULT/30 text-primary-DEFAULT hover:bg-primary-light/80'
                  }`}
                  onClick={() => {
                    dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
                    setExternalSidebarOpen?.(false);
                  }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9, rotate: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  aria-label="Close sidebar"
                >
                  <FaTimes className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
        {/* Search Bar - ปรับปรุงใหม่ */}
        <AnimatePresence>
          {searchVisible && !collapsed && (
            <motion.div
              className="pt-2 px-4 pb-4"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`rounded-xl p-1.5 flex items-center border ${
                  darkMode 
                    ? 'bg-neutral-dark/80 border-accent-dark/30 shadow-inner' 
                    : 'bg-secondary-light/50 border-primary-light/30 shadow-inner'
                }`}>
                <div className="px-3">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <FaSearch className={`h-4 w-4 ${darkMode ? 'text-white/60' : 'text-primary-DEFAULT/70'}`} />
                  </motion.div>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="ຄົ້ນຫາເມນູ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full py-2 pr-4 text-sm focus:outline-none border-0 ${
                    darkMode 
                      ? 'bg-transparent text-white placeholder-white/50' 
                      : 'bg-transparent text-neutral-dark placeholder-primary-DEFAULT/70'
                  }`}
                  aria-label="Search menu"
                />
              </motion.div>
              
              {/* ผลการค้นหา (ถ้ามีการค้นหา) */}
              {searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`mt-2 px-3 py-1.5 rounded-md text-xs ${
                    darkMode ? 'bg-accent-dark/20 text-white/70' : 'bg-primary-light/20 text-primary-dark/70'
                  }`}
                >
                  {displayedMenuItems.length === 0 
                    ? 'ບໍ່ພົບຜົນການຄົ້ນຫາ' 
                    : `ພົບ ${displayedMenuItems.length} ລາຍການ`}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Profile - ปรับปรุงใหม่ */}
        {(!collapsed || (collapsed && !isMobile)) && (
              <motion.div
                className={`px-4 py-4 ${
                  darkMode ? 'border-b border-accent-dark/30' : 'border-b border-secondary-dark/20'
                } ${collapsed ? 'flex justify-center' : ''}`}
                variants={collapsed ? iconVariants : textVariants}
              >
                {collapsed ? (
                  <motion.div
                    className={`h-12 w-12 mx-auto rounded-lg overflow-hidden transition-all duration-200 ${
                      darkMode 
                        ? 'border-2 border-accent-DEFAULT/40 shadow-lg' 
                        : 'border-2 border-primary-DEFAULT/30 shadow-lg'
                    }`}
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                    onHoverStart={() => setHoverItem('profile')}
                    onHoverEnd={() => setHoverItem(null)}
                  >
                    {user?.avatar ? (
                      <Image 
                        src={user.avatar} 
                        alt={user.name} 
                        width={48} 
                        height={48} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className={`h-full w-full flex items-center justify-center ${
                        darkMode ? 'bg-accent-dark/50' : 'bg-primary-light/70'
                      }`}>
                        <span className={`text-md font-bold ${
                          darkMode ? 'text-white' : 'text-primary-DEFAULT'
                        }`}>
                          {user?.name?.charAt(0) || 'A'}
                        </span>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                      darkMode 
                        ? 'bg-gradient-to-br from-accent-dark/40 to-primary-dark/30 border border-accent-dark/40 shadow-xl' 
                        : 'bg-gradient-to-br from-primary-light/50 to-secondary-light/60 border border-primary-light/40 shadow-xl'
                    }`}
                  >
                    {/* Background Effect */}
                    <div className="absolute inset-0 opacity-20">
                      <svg width="100%" height="100%" className="absolute inset-0">
                        <pattern id="profile-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M5,10 Q10,5 15,10 T25,10" 
                            stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(166,114,68,0.1)'} 
                            fill="none" 
                            strokeWidth="1" />
                        </pattern>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#profile-pattern)" />
                      </svg>
                    </div>

                    <div className="flex items-center relative z-10">
                      <motion.div
                        className={`h-14 w-14 rounded-lg overflow-hidden ${
                          darkMode 
                            ? 'border-2 border-accent-dark/60 shadow-md' 
                            : 'border-2 border-primary-DEFAULT/40 shadow-md'
                        }`}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {user?.avatar ? (
                          <Image 
                            src={user.avatar} 
                            alt={user.name} 
                            width={56} 
                            height={56} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className={`h-full w-full flex items-center justify-center ${
                            darkMode ? 'bg-accent-dark/50' : 'bg-primary-light/70'
                          }`}>
                            <span className={`text-lg font-bold ${
                              darkMode ? 'text-accent-DEFAULT' : 'text-primary-DEFAULT'
                            }`}>
                              {user?.name?.charAt(0) || 'A'}
                            </span>
                          </div>
                        )}
                      </motion.div>
                      <div className="ml-4 flex-1">
                        {/* ชื่อผู้ใช้ (เด่นขึ้นด้วยสี accent และขนาดใหญ่ขึ้น) */}
                        <p className={`text-md font-semibold tracking-wide text-[#492b15] ${
                          darkMode 
                            ? 'text-accent-DEFAULT bg-accent-dark/20 px-2 py-1 rounded-md shadow-inner' 
                            : 'text-primary-DEFAULT bg-primary-light/30 px-2 py-1 rounded-md shadow-inner'
                        }`}>
                          {user?.name || 'ຜູ້ດູແລລະບົບ'}
                        </p>
                        {/* อีเมล (เด่นด้วยสี secondary และเอฟเฟกต์) */}
                        <p className={`text-sm mt-1 font-medium text-[#8B4512] ${
                          darkMode 
                            ? 'text-secondary-DEFAULT bg-secondary-dark/20 px-2 py-0.5 rounded-md' 
                            : 'text-secondary-dark bg-secondary-light/30 px-2 py-0.5 rounded-md'
                        }`}>
                          {user?.email || 'admin@seeu.cafe'}
                        </p>
                        {/* Role (ปรับให้ดูทันสมัยขึ้น) */}
                        <motion.div 
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                          className={`mt-2 text-xs px-3 py-1 rounded-full inline-flex items-center text-[#935827] ${
                            darkMode 
                              ? 'bg-gradient-to-r from-accent-DEFAULT/30 to-primary-dark/30 text-accent-light border border-accent-DEFAULT/40' 
                              : 'bg-gradient-to-r from-primary-DEFAULT/20 to-secondary-light/30 text-primary-DEFAULT border border-primary-DEFAULT/40'
                          }`}
                        >
                          <FaCoffee className="w-3 h-3 mr-1 text-[#8B4512]" />
                          {user?.role || 'Admin'}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <AnimatePresence>
                  {collapsed && hoverItem === 'profile' && (
                    <motion.div
                      className={`absolute ${isRtl ? 'right-20' : 'left-20'} top-24 z-50 px-3 py-2 rounded-lg shadow-lg border ${
                        darkMode ? 'bg-neutral-dark border-accent-dark/30 text-white' : 'bg-neutral-light border-secondary-dark/20 text-neutral-dark'
                      }`}
                      initial={{ opacity: 0, x: -10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -5, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-sm font-medium">{user?.name || 'ຜູ້ດູແລລະບົບ'}</p>
                      <p className="text-xs opacity-70">{user?.email || 'admin@seeu.cafe'}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-2 py-4 text-sm">
          {displayedMenuItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              isRtl={isRtl}
              darkMode={darkMode}
              pathname={pathname}
              toggleSubmenu={toggleSubmenu}
              expandedMenus={expandedMenus}
              hoverItem={hoverItem}
              setHoverItem={setHoverItem}
            />
          ))}
        </div>

        {/* Footer - ปรับปรุงใหม่ */}
        <motion.div
          className={`px-4 pt-4 pb-5 mt-auto ${
            darkMode 
              ? 'border-t border-accent-dark/30 bg-gradient-to-b from-transparent to-accent-dark/20' 
              : 'border-t border-secondary-dark/20 bg-gradient-to-b from-transparent to-primary-light/10'
          }`}
          variants={textVariants}
        >
          {!collapsed ? (
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`p-3 rounded-xl shadow-inner border ${
                  darkMode 
                    ? 'bg-accent-dark/20 border-accent-dark/30' 
                    : 'bg-secondary-light/60 border-secondary-DEFAULT/20'
                }`}
              >
                <h4 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-white' : 'text-primary-dark'
                }`}>
                  Quick Access
                </h4>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Link href="/profile">
                    <motion.div
                      className={`flex flex-col items-center p-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-accent-dark/30 hover:bg-accent-dark/50 text-white border-accent-dark/30' 
                          : 'bg-neutral-light hover:bg-primary-light/30 text-primary-DEFAULT border-primary-light/30'
                      }`}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaUserCircle className="h-5 w-5 mb-1" />
                      <span className="text-xs">ໂປຣໄຟລ</span>
                    </motion.div>
                  </Link>
                  <Link href="/settings">
                    <motion.div
                      className={`flex flex-col items-center p-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-accent-dark/30 hover:bg-accent-dark/50 text-white border-accent-dark/30' 
                          : 'bg-neutral-light hover:bg-primary-light/30 text-primary-DEFAULT border-primary-light/30'
                      }`}
                      whileHover={{ scale: 1.05, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCog className="h-5 w-5 mb-1" />
                      <span className="text-xs">ຕັ້ງຄ່າ</span>
                    </motion.div>
                  </Link>
                  <motion.div
                    className={`flex flex-col items-center p-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-accent-dark/30 hover:bg-accent-dark/50 text-white border-accent-dark/30' 
                        : 'bg-neutral-light hover:bg-primary-light/30 text-primary-DEFAULT border-primary-light/30'
                    }`}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="h-5 w-5 mb-1" />
                    <span className="text-xs">ອອກຈາກລະບົບ</span>
                  </motion.div>
                </div>
              </motion.div>
              <div className={`text-xs text-center ${darkMode ? 'text-white/50' : 'text-neutral-dark/60'}`}>
                <p>© {new Date().getFullYear()} SeeU Cafe</p>
                <p className="mt-1">Version 1.2.5</p>
                <motion.div 
                  className="flex items-center justify-center mt-2 space-x-1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <motion.span 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0 }}
                    className={`h-1.5 w-1.5 rounded-full ${darkMode ? 'bg-green-400' : 'bg-primary-DEFAULT'}`}>
                  </motion.span>
                  <motion.span 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 0.6 }}
                    className={`h-1.5 w-1.5 rounded-full ${darkMode ? 'bg-accent-DEFAULT' : 'bg-secondary-DEFAULT'}`}>
                  </motion.span>
                  <motion.span 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: 1.2 }}
                    className={`h-1.5 w-1.5 rounded-full ${darkMode ? 'bg-blue-400' : 'bg-accent-DEFAULT'}`}>
                  </motion.span>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <motion.button
                className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                  darkMode 
                    ? 'bg-accent-dark/30 text-white border-accent-dark/40 hover:bg-accent-dark/50' 
                    : 'bg-secondary-light/50 text-primary-DEFAULT border-primary-light/30 hover:bg-primary-light/40'
                }`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                onHoverStart={() => setHoverItem('logout')}
                onHoverEnd={() => setHoverItem(null)}
                aria-label="Logout"
              >
                <FaSignOutAlt className="h-4 w-4" />
              </motion.button>
              
              <motion.div 
                className="w-8 h-0.5 rounded-full bg-gradient-to-r from-transparent via-gray-300/30 to-transparent"
                animate={{ width: [20, 30, 20] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              />
              
              <motion.button
                className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                  darkMode 
                    ? 'bg-accent-dark/20 text-white/90 border-accent-dark/30 hover:bg-accent-dark/40' 
                    : 'bg-secondary-light/40 text-primary-DEFAULT/90 border-primary-light/20 hover:bg-primary-light/30'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDarkMode}
                onHoverStart={() => setHoverItem('theme')}
                onHoverEnd={() => setHoverItem(null)}
              >
                {darkMode ? (
                  <motion.div
                    initial={{ rotate: 90 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaSun className="h-3.5 w-3.5" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaMoon className="h-3.5 w-3.5" />
                  </motion.div>
                )}
              </motion.button>
              
              <AnimatePresence>
                {hoverItem === 'logout' && (
                  <motion.div
                    className={`absolute ${isRtl ? 'right-20' : 'left-20'} bottom-16 z-50 px-3 py-2 rounded-lg shadow-lg border ${
                      darkMode 
                        ? 'bg-neutral-dark border-accent-dark/30 text-white' 
                        : 'bg-neutral-light border-secondary-dark/20 text-neutral-dark'
                    }`}
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="whitespace-nowrap">ອອກຈາກລະບົບ</p>
                  </motion.div>
                )}
                
                {hoverItem === 'theme' && (
                  <motion.div
                    className={`absolute ${isRtl ? 'right-20' : 'left-20'} bottom-6 z-50 px-3 py-2 rounded-lg shadow-lg border ${
                      darkMode 
                        ? 'bg-neutral-dark border-accent-dark/30 text-white' 
                        : 'bg-neutral-light border-secondary-dark/20 text-neutral-dark'
                    }`}
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="whitespace-nowrap">{darkMode ? 'ໂໝດແສງ' : 'ໂໝດມືດ'}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
        </motion.div>

      {/* Backdrop - ปรับปรุงใหม่ */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm" // z-index ลดลงจาก 40 เป็น 30 เพื่อให้อยู่หลัง sidebar
            style={{
              clipPath: isRtl 
                ? 'inset(0 0 0 300px)' 
                : 'inset(0 300px 0 0)', 
            }}
            onClick={() => {
              dispatch({ type: 'SET_SIDEBAR_OPEN', payload: false });
              setExternalSidebarOpen?.(false);
            }}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(3px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ 
              opacity: { duration: 0.3 },
              backdropFilter: { duration: 0.4 } 
            }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Quick Actions - ปรับปรุงใหม่ */}
      {isMobile && !sidebarOpen && (
        <>
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                className="fixed bottom-24 right-6 z-30 space-y-3 quick-actions-container"
                variants={quickActionsVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {[
                  { 
                    id: 'search', 
                    icon: <FaSearch />, 
                    title: 'ຄົ້ນຫາ', 
                    action: toggleSearch, 
                    visible: !searchVisible 
                  },
                  { 
                    id: 'theme', 
                    icon: darkMode ? <FaSun /> : <FaMoon />, 
                    title: darkMode ? 'ໂໝດແສງ' : 'ໂໝດມືດ', 
                    action: toggleDarkMode 
                  },
                  { 
                    id: 'settings', 
                    icon: <FaCog />, 
                    title: 'ການຕັ້ງຄ່າ', 
                    href: '/settings' 
                  },
                  { 
                    id: 'new', 
                    icon: <FaPlus />, 
                    title: 'ສ້າງໃໝ່', 
                    href: '/orders/create', 
                    primary: true 
                  }
                ].filter(action => action.visible !== false).map((action, idx) => (
                  <motion.div 
                    key={action.id} 
                    className="flex items-center" 
                    variants={quickActionItemVariants}
                    custom={idx}
                    initial={{ opacity: 0, y: 20, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.3 }}
                  >
                    <motion.div
                      className={`${isRtl ? 'mr-2' : 'ml-2'} px-3 py-1.5 rounded-lg shadow-lg border whitespace-nowrap ${
                        darkMode 
                          ? 'bg-neutral-dark text-white border-accent-dark/20' 
                          : 'bg-neutral-light text-neutral-dark border-secondary-DEFAULT/20'
                      }`}
                    >
                      <span className="text-sm font-medium">{action.title}</span>
                    </motion.div>
                    {action.href ? (
                      <Link href={action.href}>
                        <motion.div
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border ${
                            action.primary
                              ? darkMode 
                                ? 'bg-accent-DEFAULT text-white border-accent-light/20' 
                                : 'bg-primary-DEFAULT text-white border-primary-light/20'
                              : darkMode 
                                ? 'bg-accent-dark/50 text-white border-accent-dark/20' 
                                : 'bg-secondary-DEFAULT text-primary-DEFAULT border-secondary-light/20'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {action.icon}
                        </motion.div>
                      </Link>
                    ) : (
                      <motion.button
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border ${
                          action.primary
                            ? darkMode 
                              ? 'bg-accent-DEFAULT text-white border-accent-light/20' 
                              : 'bg-primary-DEFAULT text-white border-primary-light/20'
                            : darkMode 
                              ? 'bg-accent-dark/50 text-white border-accent-dark/20' 
                              : 'bg-secondary-DEFAULT text-primary-DEFAULT border-secondary-light/20'
                        }`}
                        onClick={action.action}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {action.icon}
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-30 border ${
              darkMode 
                ? 'bg-gradient-to-br from-accent-DEFAULT to-accent-dark text-white border-accent-light/20' 
                : 'bg-gradient-to-br from-primary-DEFAULT to-primary-dark text-white border-primary-light/20'
            }`}
            onClick={() => dispatch({ type: 'TOGGLE_QUICK_ACTIONS' })}
            variants={floatingButtonVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            aria-label={showQuickActions ? 'Close quick actions' : 'Open quick actions'}
          >
            {showQuickActions ? (
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                initial={{ rotate: -90 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaBars className="h-6 w-6" />
              </motion.div>
            )}
          </motion.button>
        </>
      )}
      {/* Tablet Mini Menu - ปรับปรุงใหม่ */}
      {isTablet && !isMobile && collapsed && (
        <div className="hidden md:block lg:hidden fixed bottom-8 left-24 z-40">
          <motion.div 
            className="flex flex-col space-y-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {[
              { 
                id: 'tablet-search', 
                icon: <FaSearch />, 
                action: toggleSearch, 
                tooltip: 'ຄົ້ນຫາ',
                color: darkMode ? 'from-amber-500 to-amber-600' : 'from-primary-DEFAULT to-primary-dark'
              },
              { 
                id: 'tablet-dark', 
                icon: darkMode ? <FaSun /> : <FaMoon />, 
                action: toggleDarkMode, 
                tooltip: darkMode ? 'ໂໝດແສງ' : 'ໂໝດມືດ',
                color: darkMode ? 'from-yellow-400 to-yellow-600' : 'from-indigo-500 to-indigo-600'
              },
              { 
                id: 'tablet-settings', 
                icon: <FaCog />, 
                href: '/settings', 
                tooltip: 'ຕັ້ງຄ່າ',
                color: darkMode ? 'from-blue-500 to-blue-600' : 'from-teal-500 to-teal-600'
              },
              { 
                id: 'tablet-expand', 
                icon: <FaChevronRight />, 
                action: () => {
                  dispatch({ type: 'TOGGLE_COLLAPSE' });
                  userCollapsedRef.current = !collapsed;
                  localStorage.setItem('cafe-sidebar-collapsed', 'false');
                }, 
                tooltip: 'ເປີດເມນູເຕັມ',
                color: darkMode ? 'from-accent-dark to-primary-dark' : 'from-primary-light to-primary-DEFAULT'
              }
            ].map((button, index) => (
              <motion.div 
                key={button.id} 
                className="relative" 
                onHoverStart={() => setHoverItem(button.id)} 
                onHoverEnd={() => setHoverItem(null)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                {button.href ? (
                  <Link href={button.href}>
                    <motion.button
                      className={`w-12 h-12 rounded-full flex items-center justify-center border bg-gradient-to-br ${button.color} text-white shadow-lg ${
                        darkMode ? 'border-white/20' : 'border-white/40'
                      }`}
                      whileHover={{ 
                        scale: 1.1, 
                        y: -2, 
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                      }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={button.tooltip}
                    >
                      {button.icon}
                    </motion.button>
                  </Link>
                ) : (
                  <motion.button
                    className={`w-12 h-12 rounded-full flex items-center justify-center border bg-gradient-to-br ${button.color} text-white shadow-lg ${
                      darkMode ? 'border-white/20' : 'border-white/40'
                    }`}
                    onClick={button.action}
                    whileHover={{ 
                      scale: 1.1, 
                      y: -2, 
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' 
                    }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={button.tooltip}
                  >
                    {button.icon}
                  </motion.button>
                )}
                <AnimatePresence>
                  {hoverItem === button.id && (
                    <motion.div
                      className={`absolute left-14 top-1 z-50 px-3 py-2 rounded-lg shadow-lg border ${
                        darkMode 
                          ? 'bg-neutral-dark border-accent-dark/30 text-white' 
                          : 'bg-white border-secondary-dark/20 text-neutral-dark'
                      }`}
                      initial={{ opacity: 0, x: -10, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -5, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="whitespace-nowrap font-medium">{button.tooltip}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Device Indicator - สำหรับโหมด Development */}
      {process.env.NODE_ENV === 'development' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className={`fixed bottom-2 right-2 z-50 px-3 py-1 rounded-full text-xs font-bold ${
            darkMode ? 'bg-accent-dark/40 text-white' : 'bg-primary-light/40 text-primary-DEFAULT'
          }`}
        >
          {isMobile ? (
            <div className="flex items-center"><FaMobileAlt className="mr-1" /> Mobile</div>
          ) : isTablet ? (
            <div className="flex items-center"><FaTabletAlt className="mr-1" /> Tablet</div>
          ) : (
            <div className="flex items-center"><FaDesktop className="mr-1" /> Desktop</div>
          )}
        </motion.div>
      )}
    </>
  );
};
export default UltraResponsiveCafeSidebar;