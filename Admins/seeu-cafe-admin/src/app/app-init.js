'use client';

import { useEffect } from 'react';
import { setupApiRedux } from '@/services/api';
import { store } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { startLoading, stopLoading } from '@/store/slices/uiSlice';

// Component สำหรับตั้งค่า Redux กับ API Service
export default function AppInitializer() {
  useEffect(() => {
    // ตั้งค่า API Service กับ Redux
    setupApiRedux({
      dispatch: store.dispatch,
      actions: {
        logout,
        startLoading,
        stopLoading
      }
    });
  }, []);

  return null; // ไม่ render อะไร
}