'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/api';
import { toast } from 'react-hot-toast';

// Helper to load user from localStorage
const loadUserFromStorage = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // Remove the 'remember' property before sending to API
      const apiCredentials = { ...credentials };
      delete apiCredentials.remember;
      
      console.log('Login attempt with credentials:', JSON.stringify(apiCredentials));
      
      const { data } = await authService.login(apiCredentials);
      console.log('Login response:', data);
      
      if (!data || (!data.token && !data.access_token)) {
        throw new Error('Invalid response from server: No token received');
      }
      
      // Check if user has 'admin' role
      if (!data.user || data.user.role !== 'admin') {
        throw new Error('Unauthorized: Only administrators can access this system');
      }
      
      // Store token and user data (support both token and access_token formats)
      const tokenValue = data.access_token || data.token;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', tokenValue);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Return user data to be stored in Redux state
      return data.user;
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      if (error.message?.includes('Unauthorized: Only administrators')) {
        toast.error('เฉพาะผู้ดูแลระบบเท่านั้นที่สามารถเข้าใช้งานได้');
      } else if (error.response?.status === 401 || 
                error.response?.data?.message?.includes('password') || 
                error.response?.data?.message?.includes('credentials')) {
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
      
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return null;
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if API fails, we'll still clear local storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authService.getProfile();
      
      // Update user in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(data));
      }
      
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      
      // If token is invalid, log the user out
      if (error.response?.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: typeof window !== 'undefined' ? loadUserFromStorage() : null,
    loading: false,
    isInitialized: false,
    error: null,
    redirectTo: null,
  },
  reducers: {
    initializeAuth: (state) => {
      state.isInitialized = true;
    },
    clearRedirect: (state) => {
      state.redirectTo = null;
    },
    logout: (state) => {
      state.user = null;
      state.isInitialized = true;
      state.redirectTo = '/login';
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('Login fulfilled, user:', action.payload);
        state.user = action.payload;
        state.loading = false;
        state.error = null;
        state.redirectTo = '/dashboard'; // Set redirect path after successful login
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: 'An unknown error occurred' };
      })
      
      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
        state.error = null;
        state.redirectTo = '/login';
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.redirectTo = '/login';
      })
      
      // Get profile cases
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        if (action.payload?.status === 401) {
          state.user = null;
          state.redirectTo = '/login';
        }
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { initializeAuth, clearRedirect, logout } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => !!state.auth.user;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthInitialized = (state) => state.auth.isInitialized;
export const selectAuthError = (state) => state.auth.error;
export const selectRedirectPath = (state) => state.auth.redirectTo;

export default authSlice.reducer;