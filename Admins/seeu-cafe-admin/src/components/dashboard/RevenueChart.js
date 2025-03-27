// components/RevenueChart.js
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, expense: 2400 },
  { name: 'Feb', revenue: 3000, expense: 1398 },
  { name: 'Mar', revenue: 2000, expense: 9800 },
  { name: 'Apr', revenue: 2780, expense: 3908 },
  { name: 'May', revenue: 1890, expense: 4800 },
  { name: 'Jun', revenue: 2390, expense: 3800 },
  { name: 'Jul', revenue: 3490, expense: 4300 },
];

const RevenueChart = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow font-['Phetsarath_OT']">
      <h2 className="text-xl font-semibold mb-4">ລາຍໄດ້</h2>
      <div className="flex justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500">ຍອດຮັບ</p>
          <p className="text-2xl font-bold">$561,623</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">ຄ່າໃຊ້ຈ່າຍ</p>
          <p className="text-2xl font-bold">$126,621</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="expense" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;