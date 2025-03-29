'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

// Safe localStorage helper functions
const getLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

const setLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

const removeLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = getLocalStorage('token');
        const storedUser = getLocalStorage('user');
        
        if (storedToken && storedUser) {
          // Validate token by fetching user profile
          try {
            const { data } = await authService.getProfile();
            setUser(data);
            console.log('User authenticated from stored token:', data);
          } catch (profileError) {
            console.error('Error validating stored token:', profileError);
            // Clear invalid tokens
            removeLocalStorage('token');
            removeLocalStorage('user');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        removeLocalStorage('token');
        removeLocalStorage('user');
      } finally {
        setLoading(false);
      }
    };

    // Run the initialization function
    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      // ถ้ามี property 'remember' ใน credentials ให้ลบออกก่อนส่งไป API
      const apiCredentials = { ...credentials };
      delete apiCredentials.remember;
      
      console.log('Login attempt with credentials:', JSON.stringify(apiCredentials));
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api');
      
      const { data } = await authService.login(apiCredentials);
      console.log('Login response:', data);
      
      if (!data || (!data.token && !data.access_token)) {
        throw new Error('Invalid response from server: No token received');
      }
      
      // ตรวจสอบว่าผู้ใช้มี role เป็น admin หรือไม่
      if (!data.user || data.user.role !== 'admin') {
        throw new Error('Unauthorized: Only administrators can access this system');
      }
      
      // Store token and user data (support both token and access_token formats)
      const tokenValue = data.access_token || data.token;
      setLocalStorage('token', tokenValue);
      setLocalStorage('user', JSON.stringify(data.user));
      
      // Show success toast
      toast.success('Login successful');
      
      // อัปเดตสถานะผู้ใช้ก่อนการ redirect
      setUser(data.user);
      
      // ใช้ window.location.href แทน router.push เพื่อให้มั่นใจว่าจะ redirect
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/dashboard';
        }
      }, 100);
      
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // แสดงข้อความข้อผิดพลาดที่เฉพาะเจาะจงมากขึ้น
      if (error.message?.includes('Unauthorized: Only administrators')) {
        toast.error('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าใช้งานได้');
      } else if (error.response?.status === 401 || 
                error.response?.data?.message?.includes('password') || 
                error.response?.data?.message?.includes('credentials')) {
        // อัพเดท state errors ในหน้า login form
        if (typeof window !== 'undefined' && window.loginFormErrorsCallback) {
          window.loginFormErrorsCallback({
            email: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
            password: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
          });
        }
        toast.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      } else {
        toast.error(error.response?.data?.message || 'เข้าสู่ระบบล้มเหลว โปรดลองอีกครั้ง');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      // Call logout API
      await authService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage
      removeLocalStorage('token');
      removeLocalStorage('user');
      
      // Update state
      setUser(null);
      
      // Show success toast
      toast.success('Logged out successfully');
      
      // Redirect to login
      router.push('/login');
      
      setLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const { data } = await authService.updateProfile(userData);
      
      // Update local storage and state
      setLocalStorage('user', JSON.stringify(data));
      setUser(data);
      
      toast.success('Profile updated successfully');
      
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      await authService.changePassword(passwordData);
      
      toast.success('Password changed successfully');
      
      return true;
    } catch (error) {
      console.error('Password change failed:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  // Provide auth context value
  const value = {
    user,
    loading,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};