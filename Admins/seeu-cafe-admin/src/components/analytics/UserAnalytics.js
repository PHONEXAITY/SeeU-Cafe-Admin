'use client'

import React, { useState } from 'react';
import { 
  AreaChart, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  Area, ResponsiveContainer 
} from 'recharts';
import { FaUsers, FaUserPlus, FaUserMinus, FaChartLine } from 'react-icons/fa';
import { MetricCard, ChartFilters } from '@/components/analytics'; 

const UserAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('area');

  // Sample data
  const userData = [
    { 
      date: '2024-03-15', 
      activeUsers: 2500,
      newUsers: 150,
      churnedUsers: 50,
      retentionRate: 95
    },
    { 
      date: '2024-03-16', 
      activeUsers: 2600,
      newUsers: 160,
      churnedUsers: 45,
      retentionRate: 96
    },
    { 
      date: '2024-03-17', 
      activeUsers: 2550,
      newUsers: 145,
      churnedUsers: 48,
      retentionRate: 95.5
    }
  ];

  const segmentsData = [
    { name: 'Regular', value: 60 },
    { name: 'Occasional', value: 25 },
    { name: 'New', value: 15 }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Analytics</h1>
          <p className="text-gray-600">Monitor user engagement and behavior</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Users"
          value={2500}
          change={8.5}
          icon={<FaUsers className="w-6 h-6 text-blue-500" />}
        />
        <MetricCard
          title="New Users"
          value={150}
          change={12.3}
          icon={<FaUserPlus className="w-6 h-6 text-green-500" />}
        />
        <MetricCard
          title="Churn Rate"
          value={2.5}
          change={-0.8}
          suffix="%"
          icon={<FaUserMinus className="w-6 h-6 text-red-500" />}
        />
        <MetricCard
          title="Retention Rate"
          value={95}
          change={1.2}
          suffix="%"
          icon={<FaChartLine className="w-6 h-6 text-purple-500" />}
        />
      </div>

      {/* User Growth Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-semibold">User Growth</h2>
          <ChartFilters
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            chartType={chartType}
            setChartType={setChartType}
          />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={userData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="activeUsers" 
              stackId="1"
              stroke="#8884d8" 
              fill="#8884d8" 
              name="Active Users"
            />
            <Area 
              type="monotone" 
              dataKey="newUsers" 
              stackId="2"
              stroke="#82ca9d" 
              fill="#82ca9d" 
              name="New Users"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* User Segments & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Segments */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">User Segments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentsData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {segmentsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">User Activity</h3>
          <div className="space-y-4">
            {[
              { label: 'Average Session Duration', value: '12m 30s' },
              { label: 'Pages per Session', value: '4.5' },
              { label: 'Bounce Rate', value: '32%' },
              { label: 'Returning Users', value: '68%' }
            ].map((metric, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">{metric.label}</span>
                <span className="font-semibold">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retention Cohort */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">User Retention Cohort</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 border">Cohort</th>
                {[0, 1, 2, 3, 4].map(week => (
                  <th key={week} className="p-2 border">Week {week}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['Mar 2024', 'Feb 2024', 'Jan 2024'].map(month => (
                <tr key={month}>
                  <td className="p-2 border font-medium">{month}</td>
                  {[100, 85, 72, 68, 65].map((retention, i) => (
                    <td 
                      key={i} 
                      className="p-2 border text-center"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${retention/100})`
                      }}
                    >
                      {retention}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserAnalytics;