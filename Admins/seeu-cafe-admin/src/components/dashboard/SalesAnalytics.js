// components/dashboard/SalesAnalytics.js
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { time: '09:00 AM', sales: 50 },
  { time: '12:00 PM', sales: 150 },
  { time: '04:00 PM', sales: 230 },
  { time: '08:00 PM', sales: 100 },
  { time: '12:00 AM', sales: 150 },
];

const SalesAnalytics = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Sales Analytics</h2>
        <a href="#" className="text-brown-500 text-sm">See all</a>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="sales" stroke="#8B4513" fill="#D2B48C" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesAnalytics;