'use client'
import React from 'react';
import Layout from '@/components/layout/Layout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import SalesAnalytics from '@/components/dashboard/SalesAnalytics';
import TrendingCoffee from '@/components/dashboard/TrendingCoffee';
import RecentOrders from '@/components/dashboard/RecentOrders';
import CustomerMap from '@/components/dashboard/CustomerMap';
import RevenueChart from '@/components/dashboard/RevenueChart';

const Dashboard = () => {
    return (
      <Layout >
        
        <DashboardStats />
        
        <div className="grid gap-8 mb-8 md:grid-cols-2 xl:grid-cols-4 mt-8">
          <div className="md:col-span-2 xl:col-span-3">
            <SalesAnalytics />
          </div>
          <div className="md:col-span-2 xl:col-span-1">
            <TrendingCoffee />
          </div>
        </div>
        
        <div className="container mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Revenue Chart</h2>
          <RevenueChart />
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Customer Map</h2>
          <CustomerMap />
        </div>
      </div>
    </div>
        <div className="mt-8">
          <RecentOrders />
        </div>
      </Layout>
    );
  };
  
  export default Dashboard;