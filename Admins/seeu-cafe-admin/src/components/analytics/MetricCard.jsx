import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const MetricCard = ({ title, value, change, icon, prefix = "", suffix = "" }) => {
  const isPositive = change > 0;
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-1">
            {prefix}{value.toLocaleString()}{suffix}
          </h3>
          <div className={`flex items-center mt-2 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? <FaArrowUp /> : <FaArrowDown />}
            <span className="ml-1 text-sm">
              {Math.abs(change)}% vs last period
            </span>
          </div>
        </div>
        <div className="p-3 bg-gray-100 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
};
export default MetricCard;