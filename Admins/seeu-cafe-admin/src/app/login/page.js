'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // ใช้ useEffect เพื่อตั้งค่า global callback สำหรับการแสดงข้อผิดพลาดการเข้าสู่ระบบ
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.loginFormErrorsCallback = setErrors;
    }
    
    return () => {
      // ทำความสะอาดเมื่อ component ถูก unmount
      if (typeof window !== 'undefined') {
        delete window.loginFormErrorsCallback;
      }
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      console.log('User already authenticated in LoginPage, redirecting to dashboard...');
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };
    let isValid = true;

    // ตรวจสอบอีเมล
    if (!email) {
      newErrors.email = 'กรุณากรอกอีเมล';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      isValid = false;
    }

    // ตรวจสอบรหัสผ่าน
    if (!password) {
      newErrors.password = 'กรุณากรอกรหัสผ่าน';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
// ในฟังก์ชัน handleSubmit ของ LoginPage
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }
  
  setErrors({
    email: '',
    password: ''
  });
  
  setIsLoading(true);
  
  try {
    console.log('Attempting login with:', { email });
    const success = await login({ email, password, remember: rememberMe });
    
    if (success) {
      // ใช้ window.location.href แทน router.push/replace ในกรณีที่ต้องการ force redirect
      window.location.href = '/dashboard';
    } else {
      setIsLoading(false);
    }
  } catch (error) {
    setIsLoading(false);
    console.error('Login error:', error);
    toast.error(error.message || 'เข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง');
  }
};

  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat p-4 relative font-['Phetsarath_OT'] " 
    style={{ backgroundImage: "url('./cafe(2).jpg')" }}>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl shadow-2xl p-8 transition-all duration-300 ease-in-out hover:shadow-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('/coffee-beans.jpg')" }}></div>
        
        <div className="relative z-10">
          <div className="text-center">
            <Image src="/logo (2).jpg" alt="SeeU Cafe Logo" width={100} height={100} className="mx-auto rounded-full shadow-lg" />
            <h2 className="mt-6 text-3xl font-extrabold text-brown-900">SeeU Cafe</h2>
            <p className="mt-2 text-sm text-brown-600">ເຂົ້າສູ່ລະບົບ Admin</p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <FaEnvelope className="absolute top-3 left-3 text-brown-400" />
                <input 
                  id="email-address" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-brown-300'} placeholder-brown-400 text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out bg-white bg-opacity-70`}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({...errors, email: ''});
                    }
                  }}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <FaLock className="absolute top-3 left-3 text-brown-400" />
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-brown-300'} placeholder-brown-400 text-brown-900 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500 focus:z-10 sm:text-sm transition-all duration-300 ease-in-out bg-white bg-opacity-70`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({...errors, password: ''});
                    }
                  }}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)} 
                  className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-brown-300 rounded transition-all duration-300 ease-in-out" 
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-brown-900">
                  ຈົດຈຳຂ້ອຍ
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-brown-600 hover:text-brown-500">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="flex">
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-coffee-600 hover:border-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-coffee-500 transition-all duration-300 ease-in-out"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'ເຂົ້າສູ່ລະບົບ'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              &copy; {new Date().getFullYear()} SeeU Cafe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;