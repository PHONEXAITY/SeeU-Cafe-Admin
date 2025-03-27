import React, { useState, useEffect } from 'react';
import ReportDialog from '../Reports/ReportDialog.jsx';
import { 
  FaHome, FaShoppingCart, FaUsers, FaBox, FaTruck, FaStar, 
  FaChartBar, FaBell, FaCog, FaClipboardList, FaUserCircle, 
  FaChevronDown, FaChevronRight, FaBlog, FaPercent, FaImages,
  FaPlayCircle, FaBars, FaUserTie
} from 'react-icons/fa';

const MenuItem = ({ icon, text, subItems, href }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="relative px-6 py-3 font-['Phetsarath_OT']">
       <a href={href} className="w-full">
      <button
        className="inline-flex items-center justify-between w-full text-sm font-semibold transition-colors duration-150 hover:text-brown-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="inline-flex items-center">
          {icon}
          <span className="ml-4">{text}</span>
        </span>
        {subItems && (
          isOpen ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />
        )}
      </button>
      </a>
      {subItems && isOpen && (
        <ul className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-beige-50">
          {subItems.map((item, index) => (
            <li key={index} className="px-2 py-1 transition-colors duration-150 hover:text-brown-600">
              <a className="w-full" href={item.href}>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const menuItems = [
    { 
      icon: <FaHome className="w-5 h-5" />, 
      text: "Dashboard",
      href: "/dashboard"
    },,
    { 
      icon: <FaShoppingCart className="w-5 h-5" />, 
      text: "ການສັ່ງຊື້", 
      subItems: [
        { href: "/Orders/list", text: "ລາຍການສັ່ງຊື້" },
        { href: "/Orders/create", text: "ສ້າງລາຍການສັ່ງຊື້ໃໝ່" },
        { href: "/Orders/history", text: "ປະຫວັດການສັ່ງຊື້" },
      ]
    },
    { 
      icon: <FaUsers className="w-5 h-5" />, 
      text: "ຜູ້ໃຊ້ລະບົບ",
      subItems: [
        { href: "/users/list", text: "ລາຍຊື່ຜູ້ໃຊ້ລະບົບ" },
        { href: "/users/create", text: "ສ້າງຜູ້ໃຊ້ໃໝ່" },
        { href: "/users/roles", text: "ຕຳແໜ່ງຂອງຜູ້ໃຊ້" },
      ]
    },
    { 
      icon: <FaBox className="w-5 h-5" />, 
      text: "ສິນຄ້າ",
      subItems: [
        { href: "/products/list", text: "ລາຍການສິນຄ້າ" },
        { href: "/products/categories", text: "ປະເພດສິນຄ້າ" },
      ]
    },
    { 
      icon: <FaTruck className="w-5 h-5" />, 
      text: "ການຈັດສົ່ງ",
      subItems: [
        { href: "/shipping/orders", text: "ການຈັດສົ່ງລາຍການສັ່ງຊື້" },
        { href: "/shipping/tracking", text: "ການຕິດຕາມ" },
        { href: "/shipping/carriers", text: "ຜູ້ໃຫ້ບໍລິການ" },
      ]
    },
    { 
      icon: <FaUserTie className="w-5 h-5" />, 
      text: "ຈັດການພະນັກງານ",
      subItems: [
        { href: "/employees/list", text: "ລາຍຊື່ພະນັກງານ" },
        { href: "/employees/create", text: "ເພີ່ມພະນັກງານໃໝ່" },
        { href: "/employees/schedule", text: "ຕາຕະລາງເຮັດວຽກ" },
        { href: "/employees/attendance", text: "ການຂາດ, ລາ, ມາສາຍ" },
      ]
    },
    { 
      icon: <FaStar className="w-5 h-5" />, 
      text: "Reviews",
      subItems: [
        { href: "/reviews/list", text: "Review List" },
        { href: "/reviews/moderate", text: "Moderate Reviews" },
      ]
    },
    { 
      icon: <FaChartBar className="w-5 h-5" />, 
      text: "ການວິເຄາະ",
      subItems: [
        { href: "/analytics/sales", text: "ການວິເຄາະການຂາຍ" },
        { href: "/analytics/users", text: "ການວິເຄາະຜູ້ໃຊ້" },
        { href: "/analytics/products", text: "ການວິເຄາະສິນຄ້າ" },
      ]
    },
    { 
      icon: <FaBell className="w-5 h-5" />, 
      text: "ການແຈ້ງເຕືອນ",
      subItems: [
        { href: "/notifications/all", text: "ການແຈ້ງເຕືອນທັງໝົດ" },
      ]
    },
    { 
      icon: <FaClipboardList className="w-5 h-5" />, 
      text: "CRM",
      subItems: [
        { href: "/crm/campaigns", text: "Campaigns" },
        { href: "/crm/customer-list", text: "ລາຍຊື່ລູກຄ້າ" },
        { href: "/crm/segments", text: "ກຸ່ມລູກຄ້າ" },
      ]
    },
    { 
      icon: <FaUserCircle className="w-5 h-5" />, 
      text: "ປະສົບການຂອງຜູ້ໃຊ້",
      subItems: [
        { href: "/ux/feedback", text: "ຄຳຕິຊົມຂອງຜູ້ໃຊ້" },
      ]
    },
    { 
      icon: <FaBlog className="w-5 h-5" />, 
      text: "Blog",
      subItems: [
        { href: "/blog/posts", text: "Posts ທັງໝົດ" },
        { href: "/blog/create", text: "ສ້າງ Post ໃໝ່" },
        { href: "/blog/categories", text: "ໝວດໝູ່" },
        { href: "/blog/comments", text: "ຄວາມຄິດເຫັນ" },
      ]
    },
    { 
      icon: <FaPercent className="w-5 h-5" />, 
      text: "Promotions",
      subItems: [
        { href: "/promotions/active", text: "Promotions ທີ່ໃຊ້ງານຢູ່" },
        { href: "/promotions/create", text: "ສ້າງ Promotion ໃໝ່" },
        { href: "/promotions/history", text: "ປະຫວັດ Promotion" },
      ]
    },
    { 
      icon: <FaPlayCircle className="w-5 h-5" />, 
      text: "Slideshow",
      subItems: [
        { href: "/slideshow/list", text: "Slides ທັງໝົດ" },
        { href: "/slideshow/create", text: "ສ້າງ Slide ໃໝ່" },
        { href: "/slideshow/settings", text: "ການຕັ້ງຄ່າ Slideshow" },
      ]
    },
    { 
      icon: <FaImages className="w-5 h-5" />, 
      text: "ຄັງຮູບພາບ",
      subItems: [
        { href: "/gallery/all", text: "ຮູບພາບທັງໝົດ" },
        { href: "/gallery/upload", text: "ອັບໂຫລດ ຮູບພາບ" },
        { href: "/gallery/albums", text: "Albums" },
      ]
    },
    { 
      icon: <FaCog className="w-5 h-5" />, 
      text: "ການຕັ້ງຄ່າ",
      subItems: [
        { href: "/settings/general", text: "ການຕັ້ງຄ່າ ທົ່ວໄປ" },
        { href: "/settings/security", text: "ຄວາມປອດໄພຂອງລະບົບ" },
        { href: "/settings/integrations", text: "ການຮັກສາລະບົບ" },
      ]
    },
  ];

  return (
    <>
      <aside 
        className={`
          fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto bg-white dark:bg-gray-800 
          transition-all duration-300 ease-in-out transform 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:inset-0
        `}
      >
        <div className="py-4 text-gray-500 dark:text-gray-400 font-['Phetsarath_OT']">
          <div className="ml-6 flex items-center justify-between">
          <a href="/dashboard">
            <img src='/logo (2).jpg' alt='Coffee Shop Logo' className="w-auto h-16 sm:h-20 md:h-24 lg:h-28 object-contain" />
            </a>
            <button
              className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none focus:shadow-outline-brown"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <FaBars className="w-6 h-6" />
            </button>
          </div>
          <ul className="mt-6">
            {menuItems.map((item, index) => (
              <MenuItem key={index} {...item} />
            ))}
          </ul>
          <div className="px-6 my-6">
            <button 
              onClick={() => setShowReportDialog(true)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-brown-600 border border-transparent rounded-lg active:bg-brown-600 hover:bg-brown-700 focus:outline-none focus:shadow-outline-brown"
            >
              ສ້າງການລາຍງານ
              <span className="ml-2" aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </aside>

      {isOpen && isMobile && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <ReportDialog 
        isOpen={showReportDialog} 
        onClose={() => setShowReportDialog(false)} 
      />
    </>
  );
};

export default Sidebar;