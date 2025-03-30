import {
    FaHome, FaShoppingCart, FaUsers, FaTruck, FaChartBar, FaBell, FaCog, FaBlog,
    FaPercent, FaImages, FaPlayCircle, FaUserCircle, FaClipboardList, FaStar, FaUserTie, FaBox
  } from 'react-icons/fa';
  
  export const menuItems = [
    { id: 'dashboard', icon: <FaHome className="w-5 h-5" />, text: "Dashboard", href: "/dashboard", roleRequired: null },
    {
      id: 'orders',
      icon: <FaShoppingCart className="w-5 h-5" />,
      text: "ການສັ່ງຊື້",
      subItems: [
        { href: "/Orders/list", text: "ລາຍການສັ່ງຊື້" },
        { href: "/Orders/create", text: "ສ້າງລາຍການສັ່ງຊື້ໃໝ່" },
        { href: "/Orders/history", text: "ປະຫວັດການສັ່ງຊື້" }
      ],
      roleRequired: 'staff'
    },
    {
      id: 'users',
      icon: <FaUsers className="w-5 h-5" />,
      text: "ຜູ້ໃຊ້ລະບົບ",
      subItems: [
        { href: "/users/list", text: "ລາຍຊື່ຜູ້ໃຊ້ລະບົບ" },
        { href: "/users/create", text: "ສ້າງຜູ້ໃຊ້ໃໝ່" },
        { href: "/users/roles", text: "ຕຳແໜ່ງຂອງຜູ້ໃຊ້" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'products',
      icon: <FaBox className="w-5 h-5" />,
      text: "ສິນຄ້າ",
      subItems: [
        { href: "/products/list", text: "ລາຍການສິນຄ້າ" },
        { href: "/products/categories", text: "ປະເພດສິນຄ້າ" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'shipping',
      icon: <FaTruck className="w-5 h-5" />,
      text: "ການຈັດສົ່ງ",
      subItems: [
        { href: "/shipping/orders", text: "ການຈັດສົ່ງລາຍການສັ່ງຊື້" },
        { href: "/shipping/tracking", text: "ການຕິດຕາມ" },
        { href: "/shipping/carriers", text: "ຜູ້ໃຫ້ບໍລິການ" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'employees',
      icon: <FaUserTie className="w-5 h-5" />,
      text: "ຈັດການພະນັກງານ",
      subItems: [
        { href: "/employees/list", text: "ລາຍຊື່ພະນັກງານ" },
        { href: "/employees/create", text: "ເພີ່ມພະນັກງານໃໝ່" },
        { href: "/employees/schedule", text: "ຕາຕະລາງເຮັດວຽກ" },
        { href: "/employees/attendance", text: "ການຂາດ, ລາ, ມາສາຍ" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'reviews',
      icon: <FaStar className="w-5 h-5" />,
      text: "Reviews",
      subItems: [
        { href: "/reviews/list", text: "Review List" },
        { href: "/reviews/moderate", text: "Moderate Reviews" }
      ],
      roleRequired: 'staff'
    },
    {
      id: 'analytics',
      icon: <FaChartBar className="w-5 h-5" />,
      text: "ການວິເຄາະ",
      subItems: [
        { href: "/analytics/sales", text: "ການວິເຄາະການຂາຍ" },
        { href: "/analytics/users", text: "ການວິເຄາະຜູ້ໃຊ້" },
        { href: "/analytics/products", text: "ການວິເຄາະສິນຄ້າ" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'notifications',
      icon: <FaBell className="w-5 h-5" />,
      text: "ການແຈ້ງເຕືອນ",
      subItems: [
        { href: "/notifications/all", text: "ການແຈ້ງເຕືອນທັງໝົດ" }
      ],
      roleRequired: 'staff'
    },
    {
      id: 'crm',
      icon: <FaClipboardList className="w-5 h-5" />,
      text: "CRM",
      subItems: [
        { href: "/crm/campaigns", text: "Campaigns" },
        { href: "/crm/customer-list", text: "ລາຍຊື່ລູກຄ້າ" },
        { href: "/crm/segments", text: "ກຸ່ມລູກຄ້າ" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'ux',
      icon: <FaUserCircle className="w-5 h-5" />,
      text: "ປະສົບການຂອງຜູ້ໃຊ້",
      subItems: [
        { href: "/ux/feedback", text: "ຄຳຕິຊົມຂອງຜູ້ໃຊ້" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'blog',
      icon: <FaBlog className="w-5 h-5" />,
      text: "Blog",
      subItems: [
        { href: "/blog/posts", text: "Posts ທັງໝົດ" },
        { href: "/blog/create", text: "ສ້າງ Post ໃໝ່" },
        { href: "/blog/categories", text: "ໝວດໝູ່" },
        { href: "/blog/comments", text: "ຄວາມຄິດເຫັນ" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'promotions',
      icon: <FaPercent className="w-5 h-5" />,
      text: "Promotions",
      subItems: [
        { href: "/promotions/active", text: "Promotions ທີ່ໃຊ້ງານຢູ່" },
        { href: "/promotions/create", text: "ສ້າງ Promotion ໃໝ່" },
        { href: "/promotions/history", text: "ປະຫວັດ Promotion" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'slideshow',
      icon: <FaPlayCircle className="w-5 h-5" />,
      text: "Slideshow",
      subItems: [
        { href: "/slideshow/list", text: "Slides ທັງໝົດ" },
        { href: "/slideshow/create", text: "ສ້າງ Slide ໃໝ່" },
        { href: "/slideshow/settings", text: "ການຕັ້ງຄ່າ Slideshow" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'gallery',
      icon: <FaImages className="w-5 h-5" />,
      text: "ຄັງຮູບພາບ",
      subItems: [
        { href: "/gallery/all", text: "ຮູບພາບທັງໝົດ" },
        { href: "/gallery/upload", text: "ອັບໂຫລດ ຮູບພາບ" },
        { href: "/gallery/albums", text: "Albums" }
      ],
      roleRequired: 'admin'
    },
    {
      id: 'settings',
      icon: <FaCog className="w-5 h-5" />,
      text: "ການຕັ້ງຄ່າ",
      subItems: [
        { href: "/settings/general", text: "ການຕັ້ງຄ່າ ທົ່ວໄປ" },
        { href: "/settings/security", text: "ຄວາມປອດໄພຂອງລະບົບ" },
        { href: "/settings/integrations", text: "ການຮັກສາລະບົບ" }
      ],
      roleRequired: 'admin'
    }
  ];