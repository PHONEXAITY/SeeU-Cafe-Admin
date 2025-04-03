'use client';

import { useEffect, useState } from 'react';
import api, { authService } from '@/services/api';

export default function ApiTest() {
  const [status, setStatus] = useState('รอตรวจสอบ...');
  const [authStatus, setAuthStatus] = useState('รอตรวจสอบ...');
  const [apiUrl, setApiUrl] = useState('');
  
  useEffect(() => {
    const testConnection = async () => {
      try {
        // Get API base URL for display
        setApiUrl(api.defaults.baseURL || 'ไม่พบ URL');
        
        // Test basic API connectivity
        await api.get('/');
        setStatus('✅ เชื่อมต่อสำเร็จ');
      } catch (error) {
        console.error('API connection error:', error);
        setStatus(`❌ เชื่อมต่อล้มเหลว: ${error.message}`);
      }
      
      // Test auth endpoint
      try {
        await authService.verifyToken();
        setAuthStatus('✅ ตรวจสอบ Auth สำเร็จ');
      } catch (error) {
        console.error('Auth verification error:', error);
        setAuthStatus(`❌ ตรวจสอบ Auth ล้มเหลว: ${error.message}`);
      }
    };
    
    testConnection();
  }, []);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">ทดสอบการเชื่อมต่อ API</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">API URL:</p>
          <p className="text-sm">{apiUrl}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">สถานะการเชื่อมต่อ API:</p>
          <p className="text-sm">{status}</p>
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500">สถานะการตรวจสอบ Auth:</p>
          <p className="text-sm">{authStatus}</p>
        </div>
      </div>
    </div>
  );
}