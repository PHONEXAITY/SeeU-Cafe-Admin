'use client'

import React, { createContext, useContext, useState } from 'react';
import LoadingScreen from '@/components/common/LoadingScreen';

// สร้าง Context
const LoadingContext = createContext(null);

// Provider component
export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // เริ่มการโหลด
  const startLoading = () => setLoading(true);
  
  // หยุดการโหลด
  const stopLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {children}
      {loading && <LoadingScreen />}
    </LoadingContext.Provider>
  );
};

// Hook สำหรับใช้งาน loading state
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};