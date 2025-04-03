"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/services/api";
import Cookies from "js-cookie";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log(
        "Login thunk: Attempting login with credentials:",
        JSON.stringify({
          email: credentials.email,
          password: "******", 
        })
      );

      const response = await authService.login(credentials);

      console.log("Login thunk: Login successful, response:", response.data);

      if (response.data.access_token && typeof window !== "undefined") {
        Cookies.set("auth_token", response.data.access_token, { expires: 7 });
      }

      return response.data;
    } catch (error) {
      console.error("Login thunk: Login failed:", error);

      
      let errorMessage = "Login failed";
      let errorDetails = {};

      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid request format";
            errorDetails = error.response.data;
            break;
          case 401:
            errorMessage = "Invalid credentials";
            break;
          case 404:
            errorMessage = "API endpoint not found";
            break;
          case 500:
            errorMessage = "Server error";
            break;
          default:
            errorMessage = error.response.data?.message || "Login failed";
        }
      }

      
      if (typeof window !== "undefined" && window.loginFormErrorsCallback) {
        if (error.response?.status === 400 || error.response?.status === 401) {
          window.loginFormErrorsCallback({
            email: errorMessage.includes("email") ? errorMessage : "",
            password: errorMessage.includes("password")
              ? errorMessage
              : "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          });
        } else {
          window.loginFormErrorsCallback({
            email: "",
            password: errorMessage || "เข้าสู่ระบบไม่สำเร็จ กรุณาลองอีกครั้ง",
          });
        }
      }

      return rejectWithValue({
        message: errorMessage,
        details: errorDetails,
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      if (typeof window !== "undefined") {
        Cookies.remove("auth_token"); 
      }
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      if (typeof window !== "undefined") {
        Cookies.remove("auth_token"); 
      }
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getProfile();
      return response.data;
    } catch (error) {
      console.error("Fetch user profile failed:", error);
      if (error.response && error.response.status === 401) {
        if (typeof window !== "undefined") {
          Cookies.remove("auth_token"); 
        }
        return rejectWithValue("unauthorized");
      }
      return rejectWithValue(error.message || "Fetch profile failed");
    }
  }
);


const initialState = {
  user: null,
  token:
    typeof window !== "undefined" ? Cookies.get("auth_token") || null : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  redirectPath: null,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
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
        state.error = null; 
      })
      
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
        if (action.payload === "unauthorized") {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
        state.error = action.payload;
      });
  },
});


export const logout = logoutUser; 
export const {
  setRedirectPath,
  clearRedirect,
  startLoading,
  stopLoading,
  setInitialized,
  reset,
} = authSlice.actions;


export const selectUser = (state) => state.auth.user; 
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectRedirectPath = (state) => state.auth.redirectPath;
export const selectAuthInitialized = (state) => state.auth.isInitialized;
export const selectAuthToken = (state) => state.auth.token;

export default authSlice.reducer;
