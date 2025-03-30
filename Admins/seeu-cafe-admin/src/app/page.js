'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '@/store/slices/authSlice';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  useEffect(() => {
    // Check authentication status when component mounts
    if (!loading) {
      if (isAuthenticated) {
        console.log('User authenticated in HomePage, redirecting to dashboard...');
        router.replace('/dashboard');
      } else {
        console.log('User not authenticated in HomePage, redirecting to login...');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading screen while checking status and redirecting
  return loading ? <LoadingScreen /> : null;
}