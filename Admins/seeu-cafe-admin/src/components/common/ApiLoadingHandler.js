'use client'

import { useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import { setLoadingCallbacks } from '@/services/api';

// Component เพื่อเชื่อมต่อระบบ Loading กับ API
export const ApiLoadingHandler = () => {
  const { startLoading, stopLoading } = useLoading();
  
  useEffect(() => {
    // เชื่อมต่อระบบ Loading กับ API
    setLoadingCallbacks({
      startLoading,
      stopLoading
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return null;
};

export default ApiLoadingHandler;