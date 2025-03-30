'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setInitialized,  // เปลี่ยนจาก initializeAuth เป็น setInitialized
  selectAuthInitialized,
  fetchUserProfile,  // ใช้ fetchUserProfile ตามที่มีใน authSlice
  selectIsAuthenticated,
} from '@/store/slices/authSlice';
import LoadingScreen from '@/components/common/LoadingScreen';
import Cookies from 'js-cookie';

const ReduxAuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectAuthInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isInitialized) return;

    const initAuth = async () => {
      try {
        if (typeof window !== 'undefined') {
          const token = Cookies.get('auth_token');
          if (token) {
            try {
              // ใช้ fetchUserProfile แทน getUserProfile
              const result = await dispatch(fetchUserProfile()).unwrap();
              if (!result || result.role !== 'admin') {
                throw new Error('Unauthorized: Only administrators can access');
              }
            } catch (profileError) {
              console.error('Error fetching profile:', profileError);
              // ลบ cookies ถ้าโปรไฟล์ไม่ถูกต้อง
              Cookies.remove('auth_token');
              Cookies.remove('user');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          Cookies.remove('auth_token');
          Cookies.remove('user');
        }
      } finally {
        // ใช้ setInitialized แทน initializeAuth
        dispatch(setInitialized(true));
      }
    };

    initAuth();
  }, [dispatch, isInitialized]);

  useEffect(() => {
    console.log('ReduxAuthProvider state:', { isInitialized, isAuthenticated });
  }, [isInitialized, isAuthenticated]);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return children;
};

export default ReduxAuthProvider;