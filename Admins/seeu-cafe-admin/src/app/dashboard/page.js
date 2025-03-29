'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import SalesAnalytics from '@/components/dashboard/SalesAnalytics';
import TrendingCoffee from '@/components/dashboard/TrendingCoffee';
import RecentOrders from '@/components/dashboard/RecentOrders';
import CustomerMap from '@/components/dashboard/CustomerMap';
import RevenueChart from '@/components/dashboard/RevenueChart';

const Dashboard = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated()) {
      console.log("User not authenticated, redirecting to login...");
      
      // ใช้ window.location.href แทน router.push เพื่อให้แน่ใจว่าจะ redirect
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }, [isAuthenticated, loading]);

  // ถ้าไม่ได้ authenticated และไม่ได้ loading ให้ redirect ไปหน้า login
  if (!loading && !isAuthenticated()) {
    router.push('/login');
    return null;
  }

  return (
    <Layout>
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