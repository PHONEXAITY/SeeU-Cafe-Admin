'use client'

import React, { useState } from 'react';
import { 
  FaShoppingCart, FaUsers, FaMoneyBillWave, FaBoxOpen, 
  FaChartLine, FaSpinner, FaArrowUp, FaArrowDown, FaCalendarAlt,
  FaCheck, FaExclamationTriangle
} from 'react-icons/fa';
import { useDashboardStats, useSalesAnalytics, timeRangeOptions, formatDateRange } from '@/hooks/analyticsHooks';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/hooks/orderHooks';
import Link from 'next/link';
import Image from 'next/image';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d');
  
  // Fetch dashboard stats
  const { 
    data: stats, 
    isLoading: isLoadingStats, 
    isError: isStatsError 
  } = useDashboardStats();
  
  // Fetch sales analytics data
  const { 
    data: salesData, 
    isLoading: isLoadingSales, 
    isError: isSalesError 
  } = useSalesAnalytics(timeRange);

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      change: stats?.orderChange || 0,
      icon: <FaShoppingCart className="w-8 h-8 text-blue-500" />,
      color: 'blue',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      change: stats?.revenueChange || 0,
      icon: <FaMoneyBillWave className="w-8 h-8 text-green-500" />,
      color: 'green',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      change: stats?.customerChange || 0,
      icon: <FaUsers className="w-8 h-8 text-purple-500" />,
      color: 'purple',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      change: stats?.productChange || 0,
      icon: <FaBoxOpen className="w-8 h-8 text-orange-500" />,
      color: 'orange',
    },
  ];

  // Handle time range change
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <div className="flex items-center mt-2 sm:mt-0">
          <FaCalendarAlt className="mr-2 text-gray-500" />
          <select
            value={timeRange}
            onChange={handleTimeRangeChange}
            className="border border-gray-300 rounded-md focus:outline-none focus:ring-brown-500 focus:border-brown-500 p-2 text-sm"
          >
            {timeRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingStats ? (
          // Loading state
          [...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className="bg-white rounded-lg shadow-md p-6 flex items-center animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ))
        ) : isStatsError ? (
          // Error state
          <div className="col-span-4 text-center py-10">
            <p className="text-red-500">Failed to load dashboard statistics.</p>
          </div>
        ) : (
          // Actual stats cards
          statsCards.map((card, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-md p-6 flex items-start"
            >
              <div className={`p-3 rounded-full bg-${card.color}-100 mr-4`}>
                {card.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-500">{card.title}</h3>
                <div className="flex items-baseline">
                  <span className="text-2xl font-semibold text-gray-800">
                    {card.value}
                  </span>
                  {card.change !== 0 && (
                    <span 
                      className={`ml-2 flex items-center text-sm ${
                        card.change > 0 ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {card.change > 0 ? (
                        <FaArrowUp className="mr-1" />
                      ) : (
                        <FaArrowDown className="mr-1" />
                      )}
                      {Math.abs(card.change).toFixed(1)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">vs. previous period</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-lg font-medium text-gray-800">Sales Overview</h2>
            <p className="text-sm text-gray-500">{formatDateRange(timeRange)}</p>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <FaChartLine className="text-brown-600 mr-2" />
            <span className="text-gray-700 font-medium">
              {isLoadingSales ? 'Loading...' : `${salesData?.salesData?.length || 0} data points`}
            </span>
          </div>
        </div>

        <div className="h-80">
          {isLoadingSales ? (
            // Loading state for chart
            <div className="flex items-center justify-center h-full">
              <FaSpinner className="w-8 h-8 text-brown-600 animate-spin" />
              <span className="ml-2 text-gray-500">Loading chart data...</span>
            </div>
          ) : isSalesError ? (
            // Error state for chart
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">Failed to load sales data.</p>
            </div>
          ) : salesData?.salesData?.length === 0 ? (
            // Empty state for chart
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-gray-500">No sales data available for the selected period.</p>
            </div>
          ) : (
            // Actual chart
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesData?.salesData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Format date based on time range
                    const date = new Date(value);
                    if (timeRange === '7d' || timeRange === '30d') {
                      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    } else {
                      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    }
                  }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Format currency
                    return formatCurrency(value).replace('THB', '฿');
                  }}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                  labelFormatter={(label) => {
                    return new Date(label).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8B5A2B"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#4A90E2"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                  name="Orders"
                  yAxisId={1}
                  // Hide this axis
                  hide={true}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders and Top Products sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Recent Orders</h2>
            <Link 
              href="/orders" 
              className="text-sm text-brown-600 hover:text-brown-800 font-medium"
            >
              View All
            </Link>
          </div>
          
          {isLoadingStats ? (
            // Loading state for recent orders
            [...Array(5)].map((_, i) => (
              <div key={i} className="mb-4 animate-pulse">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : isStatsError || !stats?.recentOrders?.length ? (
            // Error or empty state for recent orders
            <div className="py-6 text-center">
              <p className="text-gray-500">No recent orders available.</p>
            </div>
          ) : (
            // Actual recent orders
            <div className="overflow-y-auto max-h-80">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="mb-4 pb-4 border-b last:border-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                        <FaShoppingCart />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.amount)}
                        </span>
                        <Link
                          href={`/orders/${order.id}`}
                          className="text-xs text-brown-600 hover:text-brown-800"
                        >
                          View details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Top Products</h2>
            <Link 
              href="/products" 
              className="text-sm text-brown-600 hover:text-brown-800 font-medium"
            >
              View All
            </Link>
          </div>
          
          {isLoadingStats ? (
            // Loading state for top products
            [...Array(5)].map((_, i) => (
              <div key={i} className="mb-4 animate-pulse">
                <div className="flex items-center">
                  <div className="h-12 w-12 bg-gray-200 rounded mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : isStatsError || !stats?.topProducts?.length ? (
            // Error or empty state for top products
            <div className="py-6 text-center">
              <p className="text-gray-500">No product data available.</p>
            </div>
          ) : (
            // Actual top products
            <div className="overflow-y-auto max-h-80">
              {stats.topProducts.map((product, index) => (
                <div key={product.id} className="mb-4 pb-4 border-b last:border-0">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-100">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaBoxOpen />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-800">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <span className="text-xs text-gray-500">
                            {product.category}
                          </span>
                          <span className="mx-1 text-gray-300">•</span>
                          <span className="text-xs font-medium text-brown-600">
                            {product.soldCount} sold
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Inventory Alerts and Recent Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Inventory Alerts</h2>
            <Link 
              href="/products?lowStock=true" 
              className="text-sm text-brown-600 hover:text-brown-800 font-medium"
            >
              View All
            </Link>
          </div>
          
          {isLoadingStats ? (
            // Loading state for inventory alerts
            [...Array(3)].map((_, i) => (
              <div key={i} className="mb-3 animate-pulse">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))
          ) : isStatsError || !stats?.lowStockProducts?.length ? (
            // No alerts state
            <div className="py-6 text-center flex flex-col items-center">
              <div className="bg-green-100 rounded-full p-3 mb-2">
                <FaCheck className="text-green-500 w-6 h-6" />
              </div>
              <p className="text-gray-500">All products have sufficient inventory.</p>
            </div>
          ) : (
            // Actual inventory alerts
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div 
                  key={product.id}
                  className="flex items-center p-3 bg-red-50 rounded-lg"
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className="bg-red-100 rounded-full p-2">
                      <FaExclamationTriangle className="text-red-500 w-4 h-4" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Only <span className="font-semibold text-red-600">{product.stock}</span> items left in stock
                    </p>
                  </div>
                  <Link
                    href={`/products/edit/${product.id}`}
                    className="text-xs text-brown-600 hover:text-brown-800 font-medium"
                  >
                    Update
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Reviews */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-800">Recent Reviews</h2>
            <Link 
              href="/reviews" 
              className="text-sm text-brown-600 hover:text-brown-800 font-medium"
            >
              View All
            </Link>
          </div>
          
          {isLoadingStats ? (
            // Loading state for recent reviews
            [...Array(3)].map((_, i) => (
              <div key={i} className="mb-4 animate-pulse">
                <div className="flex items-start">
                  <div className="h-8 w-8 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))
          ) : isStatsError || !stats?.recentReviews?.length ? (
            // No reviews state
            <div className="py-6 text-center">
              <p className="text-gray-500">No recent reviews.</p>
            </div>
          ) : (
            // Actual recent reviews
            <div className="space-y-4 overflow-y-auto max-h-72">
              {stats.recentReviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                        {review.user?.avatar ? (
                          <Image
                            src={review.user.avatar}
                            alt={review.user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-brown-100 text-brown-600">
                            {review.user?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-800">
                          {review.user?.name || 'Anonymous'}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 15.585l-4.146 2.19a1 1 0 01-1.45-1.055l.793-4.62-3.353-3.27a1 1 0 01.555-1.705l4.635-.673L8.48 2.56a1 1 0 011.04-.55 1 1 0 011.04.55l1.446 3.892 4.635.673a1 1 0 01.555 1.705l-3.353 3.27.793 4.62a1 1 0 01-1.45 1.055L10 15.585z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                        <span className="ml-1 text-xs text-gray-500">
                          for "{review.product?.name || 'Unknown Product'}"
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">{review.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;