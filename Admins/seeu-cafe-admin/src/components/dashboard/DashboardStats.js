// components/dashboard/DashboardStats.js
import React from 'react';
import { FaShoppingBag, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

const StatCard = ({ icon, title, value, change }) => (
  <div className="bg-white rounded-lg shadow p-4 font-['Phetsarath_OT']">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
      {icon}
    </div>
    <div className="mt-2 h-2 bg-gray-200 rounded-full">
      <div className="h-full bg-brown-500 rounded-full" style={{ width: `${change}%` }}></div>
    </div>
  </div>
);

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard icon={<FaShoppingBag className="text-brown-500 text-2xl" />} title="ຈຳນວນການສັ່ງຊື້ທັງໝົດ" value="21,375" change={75} />
      <StatCard icon={<FaUsers className="text-brown-500 text-2xl" />} title="ຈຳນວນລູກຄ້າໃໝ່" value="1,012" change={45} />
      <StatCard icon={<FaMoneyBillWave className="text-brown-500 text-2xl" />} title="ຍອດຂາຍລວມ" value="$24,254" change={60} />
    </div>
  );
};

export default DashboardStats;