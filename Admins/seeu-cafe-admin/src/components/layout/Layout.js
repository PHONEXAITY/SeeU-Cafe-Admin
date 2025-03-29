// ในไฟล์ src/components/layout/Layout.js

'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function MainLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

 // ใน Layout.js - useEffect
useEffect(() => {
  if (!loading) {
    if (!isAuthenticated()) {
      console.log('User not authenticated in Layout, redirecting to login page');
      setTimeout(() => {
        window.location.href = '/login';
      }, 100);
    } else {
      console.log('User authenticated in Layout');
    }
  }
}, [isAuthenticated, loading, router]);

  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // If not authenticated and not loading, don't render anything (will redirect)
  if (!isAuthenticated() && !loading) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}