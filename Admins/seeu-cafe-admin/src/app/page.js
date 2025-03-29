'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/common/LoadingScreen';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // ตรวจสอบสถานะ authentication เมื่อ component mount
    if (!loading) {
      if (isAuthenticated()) {
        console.log('User authenticated in HomePage, redirecting to dashboard...');
        router.replace('/dashboard');
      } else {
        console.log('User not authenticated in HomePage, redirecting to login...');
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // แสดง loading screen ระหว่างตรวจสอบสถานะและเปลี่ยนเส้นทาง
  return loading ? <LoadingScreen /> : null;
}