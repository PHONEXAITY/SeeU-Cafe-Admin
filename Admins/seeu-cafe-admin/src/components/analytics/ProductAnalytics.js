'use client'

import React, { useState } from 'react';
import { 
  LineChart, BarChart, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, Line, Bar, Cell,
  ResponsiveContainer 
} from 'recharts';
import { 
  FaEye, FaCartPlus, FaPercent, FaMoneyBillWave 
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { MetricCard, ChartFilters } from '@/components/analytics'; 

const ProductAnalytics = () => {
    const [timeRange, setTimeRange] = useState('7d');
    const [chartType, setChartType] = useState('line');
    const [selectedCategory, setSelectedCategory] = useState('all');
  
    const funnelData = [
        { stage: 'Views', count: 10000 },
        { stage: 'Add to Cart', count: 2000 },
        { stage: 'Checkout', count: 1000 },
        { stage: 'Purchase', count: 800 }
      ];
    
      const productMetrics = [
        {
          date: '2024-03-15',
          views: 1200,
          addToCart: 180,
          purchases: 85,
          revenue: 4250
        },
        {
          date: '2024-03-16',
          views: 1300,
          addToCart: 195,
          purchases: 90,
          revenue: 4500
        }
      ];
  
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Product Analytics</h1>
            <p className="text-gray-600">Track product performance and insights</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Download Report
            </Button>
          </div>
        </div>
  
        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Product Views"
            value={12500}
            change={15.2}
            icon={<FaEye className="w-6 h-6 text-blue-500" />}
          />
          <MetricCard
            title="Add to Cart Rate"
            value={15.8}
            change={2.4}
            suffix="%"
            icon={<FaCartPlus className="w-6 h-6 text-green-500" />}
          />
          <MetricCard
            title="Conversion Rate"
            value={5.2}
            change={-0.8}
            suffix="%"
            icon={<FaPercent className="w-6 h-6 text-purple-500" />}
          />
          <MetricCard
            title="Average Order Value"
            value={85}
            change={3.5}
            prefix="$"
            icon={<FaMoneyBillWave className="w-6 h-6 text-orange-500" />}
          />
        </div>
  
        {/* Product Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-lg font-semibold">Product Performance</h2>
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="coffee">Coffee</option>
                <option value="tea">Tea</option>
                <option value="desserts">Desserts</option>
              </select>
              <ChartFilters
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                chartType={chartType}
                setChartType={setChartType}
              />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={productMetrics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="views"
                stroke="#8884d8"
                name="Views"
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="addToCart"
                stroke="#82ca9d"
                name="Add to Cart"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="purchases"
                stroke="#ffc658"
                name="Purchases"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
  
        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-right">Views</th>
                    <th className="p-2 text-right">Sales</th>
                    <th className="p-2 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={`/api/placeholder/32/32`}
                            alt={`Product ${i}`}
                            className="w-8 h-8 rounded object-cover"
                          />
                          <span>Product {i}</span>
                        </div>
                      </td>
                      <td className="p-2 text-right">{1000 - i * 100}</td>
                      <td className="p-2 text-right">{200 - i * 20}</td>
                      <td className="p-2 text-right">${(2000 - i * 200).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
  
          {/* Category Performance */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Coffee', revenue: 12500, orders: 250 },
                  { name: 'Tea', revenue: 8500, orders: 180 },
                  { name: 'Desserts', revenue: 6300, orders: 120 },
                  { name: 'Snacks', revenue: 4200, orders: 90 }
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue ($)" />
                <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Product Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversion Funnel */}
          <div className="bg-white p-6 rounded-lg shadow-lg lg:col-span-2">
  <h3 className="text-lg font-semibold mb-4">Product Conversion Funnel</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart
      data={funnelData}
      layout="vertical"
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="stage" type="category" />
      <Tooltip />
      <Bar dataKey="count" fill="#8884d8">
        {funnelData.map((entry, index) => (
          <Cell 
            key={`cell-${index}`} 
            fill={`rgb(136, 132, 216, ${1 - index * 0.2})`} 
          />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>
  
          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Avg. Product Rating', value: '4.5/5' },
                { label: 'Review Rate', value: '15%' },
                { label: 'Stock Turnover', value: '5.2 days' },
                { label: 'Return Rate', value: '2.3%' }
              ].map((stat, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">{stat.label}</span>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
export default ProductAnalytics;