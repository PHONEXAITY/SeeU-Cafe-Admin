'use client'

import { useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
// นำเข้าทั้งไฟล์แทนการนำเข้าเฉพาะฟังก์ชัน เพื่อแก้ปัญหาการ export/import
import * as apiService from '@/services/api';

// Component เพื่อเชื่อมต่อระบบ Loading กับ API
export const ApiLoadingHandler = () => {
  const { startLoading, stopLoading } = useLoading();
  
  useEffect(() => {
    // เชื่อมต่อระบบ Loading กับ API callback
    if (typeof window !== 'undefined' && apiService.setLoadingCallbacks) {
      apiService.setLoadingCallbacks({
        startLoading,
        stopLoading
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return null;
};

export default ApiLoadingHandler;