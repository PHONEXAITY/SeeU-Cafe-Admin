'use client';

import { useEffect } from 'react';
import { setupApiRedux } from '@/services/api';
import { store } from '@/store';
import { logoutUser } from '@/store/slices/authSlice'; // เปลี่ยนจาก logout เป็น logoutUser
import { startLoading, stopLoading } from '@/store/slices/uiSlice';

export default function AppInitializer() {
  useEffect(() => {
    setupApiRedux({
      dispatch: store.dispatch,
      actions: {
        logout: logoutUser, 
        startLoading,
        stopLoading
      }
    });
  }, []);

  return null; 
}