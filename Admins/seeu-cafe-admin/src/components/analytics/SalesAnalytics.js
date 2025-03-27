'use client'

import React, { useState } from 'react';
import { 
  LineChart, BarChart, AreaChart, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  Line, Bar, Area, ResponsiveContainer 
} from 'recharts';
import { FaMoneyBillWave, FaShoppingCart, FaUsers, FaPercent } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { MetricCard, ChartFilters } from '@/components/analytics/index';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const SalesAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartType, setChartType] = useState('line');

  // Sample data
  const salesData = [
    { date: '2024-03-15', revenue: 12500, orders: 150, customers: 120 },
    { date: '2024-03-16', revenue: 11800, orders: 142, customers: 115 },
    { date: '2024-03-17', revenue: 13200, orders: 158, customers: 125 },
    { date: '2024-03-18', revenue: 12800, orders: 145, customers: 118 },
    { date: '2024-03-19', revenue: 14500, orders: 170, customers: 135 },
    { date: '2024-03-20', revenue: 13800, orders: 162, customers: 128 },
    { date: '2024-03-21', revenue: 15200, orders: 180, customers: 142 },
  ];

  const channelData = [
    { name: 'In-store', value: 45 },
    { name: 'Online', value: 35 },
    { name: 'Mobile App', value: 20 }
  ];

  const renderChart = () => {
    const ChartComponent = {
      line: LineChart,
      bar: BarChart,
      area: AreaChart
    }[chartType];

    const DataComponent = {
      line: Line,
      bar: Bar,
      area: Area
    }[chartType];

    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <DataComponent
            yAxisId="left"
            type="monotone"
            dataKey="revenue"
            stroke="#8884d8"
            fill="#8884d8"
            name="Revenue ($)"
          />
          <DataComponent
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            stroke="#82ca9d"
            fill="#82ca9d"
            name="Orders"
          />
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Sales Analytics</h1>
          <p className="text-gray-600">Track your sales performance and metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            Print
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={52500}
          change={12.5}
          prefix="$"
          icon={<FaMoneyBillWave className="w-6 h-6 text-blue-500" />}
        />
        <MetricCard
          title="Total Orders"
          value={845}
          change={-2.3}
          icon={<FaShoppingCart className="w-6 h-6 text-green-500" />}
        />
        <MetricCard
          title="Active Customers"
          value={623}
          change={5.8}
          icon={<FaUsers className="w-6 h-6 text-purple-500" />}
        />
        <MetricCard
          title="Conversion Rate"
          value={3.2}
          change={0.5}
          suffix="%"
          icon={<FaPercent className="w-6 h-6 text-orange-500" />}
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-semibold">Sales Performance</h2>
          <ChartFilters
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            chartType={chartType}
            setChartType={setChartType}
          />
        </div>
        {renderChart()}
      </div>

      {/* Sales Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={`/api/placeholder/40/40`}
                    alt={`Product ${i}`}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-medium">Product {i}</p>
                    <p className="text-sm text-gray-500">{100 - i * 10} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(1000 - i * 100).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales by Channel */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Sales by Channel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={channelData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {channelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;