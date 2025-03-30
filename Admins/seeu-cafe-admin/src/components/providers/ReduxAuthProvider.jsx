'use client'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  initializeAuth,
  selectAuthInitialized,
  getUserProfile,
  selectIsAuthenticated
} from '@/store/slices/authSlice';
import LoadingScreen from '@/components/common/LoadingScreen';

const ReduxAuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectAuthInitialized);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Handle initial auth state
  useEffect(() => {
    if (isInitialized) return; // ป้องกันการทำงานซ้ำ
    
    const initAuth = async () => {
      try {
        // Check if token exists
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          
          if (token) {
            // Verify token by fetching user profile
            const result = await dispatch(getUserProfile()).unwrap();
            // Check if user has 'admin' role
            if (!result || result.role !== 'admin') {
              throw new Error('Unauthorized: Only administrators can access');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear token only on 401 error
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } finally {
        // Mark auth as initialized regardless of outcome
        dispatch(initializeAuth());
      }
    };
    
    initAuth();
  }, [dispatch, isInitialized]);
  
  // Debug logging
  useEffect(() => {
    console.log('ReduxAuthProvider state:', { isInitialized, isAuthenticated });
  }, [isInitialized, isAuthenticated]);
  
  // Show loading screen until authentication is initialized
  if (!isInitialized) {
    return <LoadingScreen />;
  }
  
  return children;
};

export default ReduxAuthProvider;