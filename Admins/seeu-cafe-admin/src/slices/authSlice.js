import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '@/services/api';
import { toast } from 'react-hot-toast';

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(credentials);
      
      // Store token in localStorage
      localStorage.setItem('token', data.token || data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data.user;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      toast.success('Logged out successfully');
    },
    initializeAuth: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;