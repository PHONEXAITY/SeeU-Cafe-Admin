'use client';

import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Helper to get token from localStorage (only on client)
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Callbacks สำหรับจัดการสถานะการโหลด
const loadingCallbacks = {
  startLoading: () => {},
  stopLoading: () => {}
};

// ตัวแปรเพื่อเก็บ dispatch function ที่จะถูกตั้งค่าภายหลัง
let dispatchFunction = null;
let logoutAction = null;
let startLoadingAction = null;
let stopLoadingAction = null;

// ฟังก์ชันสำหรับตั้งค่า Redux actions และ dispatch
export const setupApiRedux = ({ dispatch, actions }) => {
  dispatchFunction = dispatch;
  if (actions) {
    logoutAction = actions.logout;
    startLoadingAction = actions.startLoading;
    stopLoadingAction = actions.stopLoading;
  }
};

// ฟังก์ชันสำหรับตั้งค่า callbacks
export const setLoadingCallbacks = (callbacks) => {
  if (callbacks) {
    loadingCallbacks.startLoading = callbacks.startLoading || (() => {});
    loadingCallbacks.stopLoading = callbacks.stopLoading || (() => {});
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // เริ่ม loading (จากทั้ง Redux และ LoadingContext)
    if (typeof window !== 'undefined') {
      // ใช้ Redux dispatch ถ้ามี
      if (dispatchFunction && startLoadingAction) {
        dispatchFunction(startLoadingAction());
      }
      
      // ใช้ LoadingContext callback
      if (loadingCallbacks.startLoading) {
        loadingCallbacks.startLoading();
      }
    }
    
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // หยุด loading (จากทั้ง Redux และ LoadingContext)
    if (typeof window !== 'undefined') {
      // ใช้ Redux dispatch ถ้ามี
      if (dispatchFunction && stopLoadingAction) {
        dispatchFunction(stopLoadingAction());
      }
      
      // ใช้ LoadingContext callback
      if (loadingCallbacks.stopLoading) {
        loadingCallbacks.stopLoading();
      }
    }
    
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // หยุด loading (จากทั้ง Redux และ LoadingContext)
    if (typeof window !== 'undefined') {
      // ใช้ Redux dispatch ถ้ามี
      if (dispatchFunction && stopLoadingAction) {
        dispatchFunction(stopLoadingAction());
      }
      
      // ใช้ LoadingContext callback
      if (loadingCallbacks.stopLoading) {
        loadingCallbacks.stopLoading();
      }
    }
    
    return response;
  },
  (error) => {
    // หยุด loading (จากทั้ง Redux และ LoadingContext)
    if (typeof window !== 'undefined') {
      // ใช้ Redux dispatch ถ้ามี
      if (dispatchFunction && stopLoadingAction) {
        dispatchFunction(stopLoadingAction());
      }
      
      // ใช้ LoadingContext callback
      if (loadingCallbacks.stopLoading) {
        loadingCallbacks.stopLoading();
      }
      
      // Handle 401 Unauthorized responses
      if (error.response && error.response.status === 401 && dispatchFunction && logoutAction) {
        dispatchFunction(logoutAction());
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => {
    const { email, password } = credentials;
    const loginData = { email, password };
    
    console.log('Calling login API with:', loginData);
    return api.post('/auth/login', loginData)
      .catch(error => {
        if (error.response) {
          console.error(`Login error [${error.response.status}]:`, error.response.data);
          
          if (error.response.status === 401) {
            error.message = 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
          } else if (error.response.status === 403) {
            error.message = 'ไม่มีสิทธิ์เข้าถึงระบบ';
          }
        }
        throw error;
      });
  },
  logout: () => api.post('/auth/logout'),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.post('/auth/change-password', passwordData)
};

// Product services
export const productService = {
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  uploadImage: (formData) => api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Order services
export const orderService = {
  getAllOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  createOrder: (orderData) => api.post('/orders', orderData),
  deleteOrder: (id) => api.delete(`/orders/${id}`)
};

// User services
export const userService = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserRoles: () => api.get('/roles')
};

// Analytics services
export const analyticsService = {
  getSalesAnalytics: (timeRange, params) => api.get(`/analytics/sales/${timeRange}`, { params }),
  getProductAnalytics: (params) => api.get('/analytics/products', { params }),
  getUserAnalytics: (params) => api.get('/analytics/users', { params }),
  getDashboardStats: () => api.get('/analytics/dashboard')
};

// Review services
export const reviewService = {
  getAllReviews: (params) => api.get('/reviews', { params }),
  approveReview: (id) => api.patch(`/reviews/${id}/approve`),
  rejectReview: (id) => api.patch(`/reviews/${id}/reject`),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};

// Notification services
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};

// Shipping services
export const shippingService = {
  getShippingMethods: () => api.get('/shipping/methods'),
  updateShippingMethod: (id, data) => api.put(`/shipping/methods/${id}`, data),
  createShippingMethod: (data) => api.post('/shipping/methods', data),
  deleteShippingMethod: (id) => api.delete(`/shipping/methods/${id}`),
  getShippingZones: () => api.get('/shipping/zones'),
  updateShippingZone: (id, data) => api.put(`/shipping/zones/${id}`, data)
};

// Promotion services
export const promotionService = {
  getAllPromotions: (params) => api.get('/promotions', { params }),
  getPromotionById: (id) => api.get(`/promotions/${id}`),
  createPromotion: (data) => api.post('/promotions', data),
  updatePromotion: (id, data) => api.put(`/promotions/${id}`, data),
  deletePromotion: (id) => api.delete(`/promotions/${id}`),
  togglePromotionStatus: (id) => api.patch(`/promotions/${id}/toggle`)
};

// CRM services
export const crmService = {
  getCustomers: (params) => api.get('/customers', { params }),
  getCustomerById: (id) => api.get(`/customers/${id}`),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  getCustomerOrders: (id) => api.get(`/customers/${id}/orders`),
  exportCustomers: (params) => api.get('/customers/export', { 
    params, 
    responseType: 'blob' 
  })
};

// Blog services
export const blogService = {
  getAllPosts: (params) => api.get('/blog/posts', { params }),
  getPostById: (id) => api.get(`/blog/posts/${id}`),
  createPost: (data) => api.post('/blog/posts', data),
  updatePost: (id, data) => api.put(`/blog/posts/${id}`, data),
  deletePost: (id) => api.delete(`/blog/posts/${id}`),
  getCategories: () => api.get('/blog/categories'),
  createCategory: (data) => api.post('/blog/categories', data),
  updateCategory: (id, data) => api.put(`/blog/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/blog/categories/${id}`)
};

// Gallery services
export const galleryService = {
  getAllImages: (params) => api.get('/gallery', { params }),
  uploadImages: (formData) => api.post('/gallery/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  deleteImage: (id) => api.delete(`/gallery/${id}`),
  updateImageDetails: (id, data) => api.put(`/gallery/${id}`, data)
};

// Slideshow services
export const slideshowService = {
  getSlides: () => api.get('/slideshow'),
  updateSlide: (id, data) => api.put(`/slideshow/${id}`, data),
  createSlide: (data) => api.post('/slideshow', data),
  deleteSlide: (id) => api.delete(`/slideshow/${id}`),
  reorderSlides: (data) => api.put('/slideshow/reorder', data)
};

// Settings services
export const settingsService = {
  getGeneralSettings: () => api.get('/settings/general'),
  updateGeneralSettings: (data) => api.put('/settings/general', data),
  getPaymentSettings: () => api.get('/settings/payment'),
  updatePaymentSettings: (data) => api.put('/settings/payment', data),
  getEmailSettings: () => api.get('/settings/email'),
  updateEmailSettings: (data) => api.put('/settings/email', data),
  getSocialSettings: () => api.get('/settings/social'),
  updateSocialSettings: (data) => api.put('/settings/social', data),
  getStoreSettings: () => api.get('/settings/store'),
  updateStoreSettings: (data) => api.put('/settings/store', data)
};

export default api;