'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import { setupApiRedux } from '@/services/api';

// ป้องกันการสร้าง store หลายตัวบน server
const createStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      // reducers อื่นๆ...
    },
    middleware: (getDefaultMiddleware) => 
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['auth/login/fulfilled', 'auth/getUserProfile/fulfilled'],
        },
      }),
  });
  
  // ตั้งค่า API service หลังจากสร้าง store เรียบร้อยแล้ว
  if (typeof window !== 'undefined') {
    // Import actions ที่จำเป็นสำหรับ API service
    const { logout } = require('./slices/authSlice');
    const { startLoading, stopLoading } = require('./slices/uiSlice');
    
    // ตั้งค่า dispatch function และ actions สำหรับ API service
    setupApiRedux({
      dispatch: store.dispatch,
      actions: {
        logout,
        startLoading,
        stopLoading
      }
    });
  }
  
  return store;
};

// สร้าง store เมื่อใช้งานเฉพาะบน client เท่านั้น
export const store = typeof window !== 'undefined' ? createStore() : null;

// สำหรับใช้กับ Provider
export default store;