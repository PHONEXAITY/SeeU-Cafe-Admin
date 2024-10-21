// components/CustomerMap.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '1', uv: 4000, pv: 2400, amt: 2400 },
  { name: '2', uv: -3000, pv: 1398, amt: 2210 },
  { name: '3', uv: -2000, pv: -9800, amt: 2290 },
  { name: '4', uv: 2780, pv: 3908, amt: 2000 },
  { name: '5', uv: -1890, pv: 4800, amt: 2181 },
  { name: '6', uv: 2390, pv: -3800, amt: 2500 },
  { name: '7', uv: 3490, pv: 4300, amt: 2100 },
];

const CustomerMap = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Customer Map</h2>
      <div className="flex justify-end space-x-2 mb-4">
        <button className="px-3 py-1 bg-gray-800 text-white rounded">Monthly</button>
        <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded">Weekly</button>
        <button className="px-3 py-1 bg-gray-200 text-gray-800 rounded">Today</button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="pv" fill="#8884d8" />
          <Bar dataKey="uv" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerMap;