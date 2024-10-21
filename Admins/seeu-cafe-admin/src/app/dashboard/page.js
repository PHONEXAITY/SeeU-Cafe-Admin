'use client'
import React from 'react';
import Layout from '@/components/layout/Layout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import SalesAnalytics from '@/components/dashboard/SalesAnalytics';
import TrendingCoffee from '@/components/dashboard/TrendingCoffee';
import RecentOrders from '@/components/dashboard/RecentOrders';

const Dashboard = () => {
    return (
      <Layout>
        <h2 className="my-6 text-2xl font-semibold text-gray-700">
          Dashboard
        </h2>
        
        <DashboardStats />
        
        <div className="grid gap-8 mb-8 md:grid-cols-2 xl:grid-cols-4 mt-8">
          <div className="md:col-span-2 xl:col-span-3">
            <SalesAnalytics />
          </div>
          <div className="md:col-span-2 xl:col-span-1">
            <TrendingCoffee />
          </div>
        </div>
        
        <div className="mt-8">
          <RecentOrders />
        </div>
      </Layout>
    );
  };
  
  export default Dashboard;