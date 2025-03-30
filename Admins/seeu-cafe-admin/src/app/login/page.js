'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Image component from Next.js
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthLoading, selectIsAuthenticated, selectAuthInitialized, selectRedirectPath, clearRedirect } from '@/store/slices/authSlice';
import { toast } from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [backgroundsLoaded, setBackgroundsLoaded] = useState(false);
  
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoading = useSelector(selectAuthLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInitialized = useSelector(selectAuthInitialized);
  const redirectPath = useSelector(selectRedirectPath);
  const cafeImg = new Image();
const coffeeBeansImg = new Image();

  // Preload background images
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cafeImg = new window.Image();
      const coffeeBeansImg = new window.Image();
      
      cafeImg.src = './cafe.jpg';
      coffeeBeansImg.src = './coffee-beans.jpg';
      
      let loadedCount = 0;
      const onLoad = () => {
        loadedCount++;
        if (loadedCount === 2) {
          setBackgroundsLoaded(true);
        }
      };
      
      cafeImg.onload = onLoad;
      coffeeBeansImg.onload = onLoad;
      
      // Fallback if images take too long
      const timeout = setTimeout(() => {
        if (!backgroundsLoaded) {
          setBackgroundsLoaded(true);
        }
      }, 3000);
      
      return () => clearTimeout(timeout);
    } else {
      // If running on server-side, set as loaded
      setBackgroundsLoaded(true);
    }
  }, [backgroundsLoaded]);

  // Expose errors callback to window for API error handling
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.loginFormErrorsCallback = setErrors;
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        delete window.loginFormErrorsCallback;
      }
    };
  }, []);

  // Handle redirect after authentication
  useEffect(() => {
    if (!isInitialized) return;

    if (isAuthenticated && !isRedirecting) {
      if (redirectPath) {
        console.log('Redirecting to:', redirectPath);
        setIsRedirecting(true);
        router.push(redirectPath);
        dispatch(clearRedirect()); // Clear redirect path after use
      } else {
        console.log('User is authenticated, redirecting to dashboard...');
        setIsRedirecting(true);
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isRedirecting, redirectPath, router, isInitialized, dispatch]);

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: ''
    };
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = 'กรุณากรอกอีเมล';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
      isValid = false;
    }

    // Password validation
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setErrors({
      email: '',
      password: ''
    });
    
    try {
      console.log('Attempting login with:', { email });
      await dispatch(loginUser({ email, password, remember: rememberMe })).unwrap();
      toast.success('เข้าสู่ระบบสำเร็จ');
      setIsRedirecting(true);
    } catch (error) {
      console.error('Login dispatch error:', error);
      setIsRedirecting(false);
    }
  };

  // ถ้ากำลัง redirect ให้แสดงข้อความ loading
  if (isRedirecting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin inline-block w-10 h-10 border-4 border-brown-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg font-medium">กำลังนำคุณไปยังหน้าแดชบอร์ด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative font-['Phetsarath_OT']"
         style={{ 
           backgroundImage: backgroundsLoaded ? "url('/cafe.jpg')" : "none",
           backgroundColor: !backgroundsLoaded ? "#f3e8d9" : "initial",
           backgroundSize: "cover",
           backgroundPosition: "center",
           backgroundRepeat: "no-repeat"
         }}>
      <div className="absolute inset-0 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-md bg-white bg-opacity-80 rounded-xl shadow-2xl p-8 transition-all duration-300 ease-in-out hover:shadow-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-70" 
             style={{ 
               backgroundImage: backgroundsLoaded ? "url('/coffee-beans.jpg')" : "none",
               backgroundColor: !backgroundsLoaded ? "#e0d0c1" : "initial"
             }}></div>
        
        <div className="relative z-10">
          <div className="text-center">
            {backgroundsLoaded ? (
              <Image src="/logo.png" alt="SeeU Cafe Logo" width={100} height={100} className="mx-auto rounded-full shadow-lg" priority/>
            ) : (
              <div className="w-24 h-24 rounded-full bg-brown-300 animate-pulse mx-auto shadow-lg"></div>
            )}
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
                disabled={isLoading || isRedirecting}
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
              © {new Date().getFullYear()} SeeU Cafe. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;