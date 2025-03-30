'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { useEffect, useState } from 'react';

export default function StoreProvider({ children }) {
  // State เพื่อตรวจสอบว่า store พร้อมใช้งานหรือไม่
  const [storeReady, setStoreReady] = useState(false);
  
  // ตรวจสอบว่าอยู่ใน client หรือไม่ และรอให้ store พร้อมใช้งาน
  useEffect(() => {
    setStoreReady(true);
  }, []);
  
  // ถ้าไม่ได้อยู่ใน client หรือ store ยังไม่พร้อม แสดง loader หรือ null
  if (!storeReady) {
    return <div className="flex justify-center items-center min-h-screen">กำลังโหลด...</div>;
  }
  
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}