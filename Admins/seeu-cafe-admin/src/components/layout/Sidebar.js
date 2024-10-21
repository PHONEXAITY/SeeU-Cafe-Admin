// components/layout/Sidebar.js
import React from 'react';
import { FaCoffee, FaClipboardList, FaUsers, FaCreditCard, FaChartBar, FaCog, FaSignOutAlt } from 'react-icons/fa';

const SidebarItem = ({ icon, text, active }) => (
  <li className={`relative px-6 py-3 ${active ? 'bg-beige-200' : ''}`}>
    <a
      href="#"
      className={`inline-flex items-center w-full text-sm font-semibold transition-colors duration-150 ${
        active ? 'text-brown-600' : 'text-gray-600 hover:text-brown-600'
      }`}
    >
      {active && <span className="absolute inset-y-0 left-0 w-1 bg-brown-500 rounded-tr-lg rounded-br-lg" aria-hidden="true"></span>}
      {icon}
      <span className="ml-4">{text}</span>
    </a>
  </li>
);

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      <aside
        className={`z-20 w-64 overflow-y-auto bg-beige-100 md:block flex-shrink-0 ${
          open ? 'fixed inset-y-0 left-0 z-50' : 'hidden'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <div className="py-4 text-gray-500">
          <a className="ml-6 text-lg font-bold text-brown-600 flex items-center" href="#">
            <img src="" alt="/logo (2).jpg"></img>
          </a>
          <ul className="mt-6">
            <SidebarItem icon={<FaCoffee className="w-5 h-5" />} text="Dashboard" active />
            <SidebarItem icon={<FaClipboardList className="w-5 h-5" />} text="Orders" />
            <SidebarItem icon={<FaUsers className="w-5 h-5" />} text="Customers" />
            <SidebarItem icon={<FaCreditCard className="w-5 h-5" />} text="Payments" />
            <SidebarItem icon={<FaChartBar className="w-5 h-5" />} text="Analytics" />
            <SidebarItem icon={<FaCog className="w-5 h-5" />} text="Settings" />
          </ul>
          <div className="px-6 my-6">
            <button
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-brown-600 border border-transparent rounded-lg active:bg-brown-600 hover:bg-brown-700 focus:outline-none focus:shadow-outline-brown"
            >
              Create Report
              <span className="ml-2" aria-hidden="true">+</span>
            </button>
          </div>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-10 flex items-end bg-black bg-opacity-50 sm:items-center sm:justify-center md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;