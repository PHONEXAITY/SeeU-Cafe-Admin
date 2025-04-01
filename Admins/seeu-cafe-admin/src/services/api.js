'use client';

import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, 
});

const getToken = () => {
  if (typeof window !== 'undefined') {
    return Cookies.get('auth_token');
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
    // Start loading...
    
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Stop loading...
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (dispatchFunction && logoutAction) {
            console.log('401 Unauthorized: Logging out...');
            dispatchFunction(logoutAction());
          }
          break;
          
        case 403:
          console.error('403 Forbidden: No permission');
          toast?.error('ไม่มีสิทธิ์ในการเข้าถึง');
          break;
          
        case 404:
          console.error('404 Not Found:', error.config?.url);
          break;
          
        case 422:
          console.error('422 Validation Error:', error.response.data);
          break;
          
        case 500:
          console.error('500 Server Error');
          toast?.error('เกิดข้อผิดพลาดที่เซิร์ฟเวอร์');
          break;
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      toast?.error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => {
    return api.post('/auth/login', credentials)
      .then(response => {
        // เก็บ token ใน cookie
        if (response.data && response.data.access_token) {
          Cookies.set('auth_token', response.data.access_token, { expires: 7 });
        }
        return response;
      });
  },
  
  logout: () => {
    return api.post('/auth/logout')
      .then(response => {
        // ลบ token จาก cookie
        Cookies.remove('auth_token');
        return response;
      });
  },
  
  getProfile: () => api.get('/auth/profile'),
  
  // เพิ่มฟังก์ชัน verify token
  verifyToken: () => api.get('/auth/verify')
};
export const productService = {
  getAllFoodProducts: async (params = {}) => {
    try {
      const response = await api.get('/food-menu', { params });
      return response.data || { products: [], totalItems: 0, totalPages: 0 }; // Default ค่า
    } catch (error) {
      console.error('Get Food Products Error:', error);
      return { products: [], totalItems: 0, totalPages: 0, error: error.message };
    }
  },

  getAllBeverageProducts: async (params = {}) => {
    try {
      const response = await api.get('/beverage-menu', { params });
      return response.data || { products: [], totalItems: 0, totalPages: 0 }; // Default ค่า
    } catch (error) {
      console.error('Get Beverage Products Error:', error);
      return { products: [], totalItems: 0, totalPages: 0, error: error.message };
    }
  },

  getCategories: async () => {
    try {
      const response = await api.get('/menu-categories');
      return response.data || []; // Default เป็น array ว่าง
    } catch (error) {
      console.error('Get Categories Error:', error);
      return []; // คืนค่า array ว่างถ้าล้มเหลว
    }
  },

  // ฟังก์ชันอื่นๆ คงเดิม แต่ควรเพิ่ม try-catch ถ้ายังไม่มี
  getFoodProductById: async (id) => {
    try {
      const response = await api.get(`/food-menu/${id}`);
      return response.data || {};
    } catch (error) {
      return { error: error.message };
    }
  },

  getBeverageProductById: async (id) => {
    try {
      const response = await api.get(`/beverage-menu/${id}`);
      return response.data || {};
    } catch (error) {
      return { error: error.message };
    }
  },

  createFoodProduct: async (productData) => {
    const response = await api.post('/food-menu', productData);
    return response.data;
  },

  updateFoodProduct: async (id, productData) => {
    const response = await api.put(`/food-menu/${id}`, productData);
    return response.data;
  },

  deleteFoodProduct: async (id) => {
    const response = await api.delete(`/food-menu/${id}`);
    return response.data;
  },

  createBeverageProduct: async (productData) => {
    const response = await api.post('/beverage-menu', productData);
    return response.data;
  },

  updateBeverageProduct: async (id, productData) => {
    const response = await api.put(`/beverage-menu/${id}`, productData);
    return response.data;
  },

  deleteBeverageProduct: async (id) => {
    const response = await api.delete(`/beverage-menu/${id}`);
    return response.data;
  },

  uploadImage: async (formData) => {
    const response = await api.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
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
  updateUser: (id, userData) => api.patch(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserRoles: () => api.get('/roles'),
  getUserRolesByUserId: (userId) => {
    return api.get(`/roles/user/${userId}`);
  },
  changeUserRole: (userId, roleId) => {
    console.log(`กำลังเปลี่ยนตำแหน่งสำหรับผู้ใช้ ${userId} เป็น ${roleId}`);
    return api.post('/roles/assign', { 
      userId: Number(userId), 
      roleId: Number(roleId) 
    });
  },
};
export const roleService = {
  // Get all roles
  getAll: () => api.get('/roles'),
  
  // Get a specific role
  getById: (id) => api.get(`/roles/${id}`),
  
  // Create a new role
  create: (roleData) => api.post('/roles', roleData),
  
  // Update an existing role
  update: (id, roleData) => api.patch(`/roles/${id}`, roleData),
  
  // Delete a role
  delete: (id) => api.delete(`/roles/${id}`),
  
  // Assign role to user
  assignToUser: (userId, roleId) => api.post('/roles/assign', { userId, roleId }),
  
  // Remove role from user
  removeFromUser: (userId, roleId) => api.delete(`/roles/user/${userId}/role/${roleId}`),
  
  // Get user roles
  getUserRoles: (userId) => api.get(`/roles/user/${userId}`),
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