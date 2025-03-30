'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/api';
import Cookies from 'js-cookie';

// Async actions
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Login attempt with credentials:', JSON.stringify(credentials));
      const response = await authService.login(credentials);
      if (response.data.access_token && typeof window !== 'undefined') {
        Cookies.set('auth_token', response.data.access_token, { expires: 7 }); // Store token in cookie for 7 days
      }
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error details:', error.message);

      // Handle form errors on client-side
      if (typeof window !== 'undefined' && window.loginFormErrorsCallback) {
        window.loginFormErrorsCallback({
          email: '',
          password: error.message || 'เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง',
        });
      }

      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      if (typeof window !== 'undefined') {
        Cookies.remove('auth_token'); // Remove token on logout
      }
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      if (typeof window !== 'undefined') {
        Cookies.remove('auth_token'); // Remove token even if logout fails
      }
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (error) {
      console.error('Fetch user profile failed:', error);
      if (error.response && error.response.status === 401) {
        if (typeof window !== 'undefined') {
          Cookies.remove('auth_token'); // Clear token on 401
        }
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(error.message || 'Fetch profile failed');
    }
  }
);

// Initial state
const initialState = {
  user: null,
  token: typeof window !== 'undefined' ? Cookies.get('auth_token') || null : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  redirectPath: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRedirectPath: (state, action) => {
      state.redirectPath = action.payload;
    },
    clearRedirect: (state) => {
      state.redirectPath = null;
    },
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
    setInitialized: (state, action) => {
      state.isInitialized = action.payload;
    },
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null; // Clear error on logout, even if it fails
      })
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        if (!state.isInitialized) {
          state.isLoading = true;
        }
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isInitialized = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload === 'unauthorized') {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
        state.error = action.payload;
      });
  },
});

// Export actions
export const logout = logoutUser; // Alias for logoutUser
export const { setRedirectPath, clearRedirect, startLoading, stopLoading, setInitialized, reset } = authSlice.actions;

// Export selectors (renamed selectCurrentUser to selectUser for consistency with your components)
export const selectUser = (state) => state.auth.user; // Changed from selectCurrentUser
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectRedirectPath = (state) => state.auth.redirectPath;
export const selectAuthInitialized = (state) => state.auth.isInitialized;
export const selectAuthToken = (state) => state.auth.token;

export default authSlice.reducer;