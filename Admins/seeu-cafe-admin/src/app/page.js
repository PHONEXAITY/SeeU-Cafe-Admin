'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // รอจนกว่า auth state จะพร้อม (ไม่ loading)
    if (!loading) {
      // ถ้า authenticated แล้ว ให้ไปที่ dashboard
      if (isAuthenticated()) {
        router.push('/dashboard');
      } else {
        // ถ้ายังไม่ authenticated ให้ไปที่หน้า login
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // แสดงหน้าว่างระหว่างการตรวจสอบและเปลี่ยนเส้นทาง
  return null;
}