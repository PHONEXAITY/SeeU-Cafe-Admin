'use client';

import ApiTest from '@/components/common/ApiTest';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export default function TestPage() {
  const [cookieInfo, setCookieInfo] = useState({ available: false, content: null });

  useEffect(() => {
    // Check for auth_token cookie
    const token = Cookies.get('auth_token');
    
    setCookieInfo({
      available: !!token,
      content: token ? token.substring(0, 20) + '...' : null
    });
    
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">ทดสอบการเชื่อมต่อระบบ</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ApiTest />
        
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">ทดสอบ Cookies</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">auth_token Cookie:</p>
              <p className="text-sm">
                {cookieInfo.available ? 
                  `✅ มี Cookie (${cookieInfo.content})` : 
                  '❌ ไม่พบ Cookie'}
              </p>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-500">
                หากไม่พบ Cookie ให้ลองทำการล็อกอินและกลับมาที่หน้านี้อีกครั้ง
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}