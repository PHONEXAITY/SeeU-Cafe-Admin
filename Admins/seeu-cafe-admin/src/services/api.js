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


const loadingCallbacks = {
  startLoading: () => {},
  stopLoading: () => {}
};


let dispatchFunction = null;
let logoutAction = null;
let startLoadingAction = null;
let stopLoadingAction = null;


export const setupApiRedux = ({ dispatch, actions }) => {
  dispatchFunction = dispatch;
  if (actions) {
    logoutAction = actions.logout;
    startLoadingAction = actions.startLoading;
    stopLoadingAction = actions.stopLoading;
  }
};


export const setLoadingCallbacks = (callbacks) => {
  if (callbacks) {
    loadingCallbacks.startLoading = callbacks.startLoading || (() => {});
    loadingCallbacks.stopLoading = callbacks.stopLoading || (() => {});
  }
};

api.interceptors.request.use(
  (config) => {
    
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`, config.data);
    
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url;
      console.error(`API Error ${status} from ${url}:`, error.response.data);
      
      switch (status) {
        case 400: 
          console.error('400 Bad Request - Check if request data is correct:', {
            url,
            method: error.config?.method,
            requestData: error.config?.data,
            responseData: error.response.data
          });
          break;
          
        case 401: 
          console.error('401 Unauthorized - Authentication failed');
          if (dispatchFunction && logoutAction) {
            dispatchFunction(logoutAction());
          }
          break;
          
        case 403: 
          console.error('403 Forbidden - No permission');
          break;
          
        case 404: 
          console.error('404 Not Found:', error.config?.url);
          break;
          
        case 422: 
          console.error('422 Validation Error:', error.response.data);
          break;
          
        case 500: 
          console.error('500 Server Error');
          break;
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => {
    
    const loginData = {
      email: credentials.email,
      password: credentials.password
    };
    
    console.log('Auth Service: Sending login data:', JSON.stringify(loginData));
    
    return api.post('/auth/login', loginData)
      .then(response => {
        console.log('Auth Service: Login response received:', response.data);
        
        
        if (response.data && response.data.access_token) {
          Cookies.set('auth_token', response.data.access_token, { expires: 7 });
        }
        
        return response;
      })
      .catch(error => {
        console.error('Auth Service: Login error:', error);
        
        
        if (error.response) {
          console.error('Error response:', {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers
          });
        }
        
        throw error; 
      });
  },
  
  logout: () => {
    return api.post('/auth/logout')
      .then(response => {
        
        Cookies.remove('auth_token');
        return response;
      });
  },
  
  getProfile: () => api.get('/auth/profile'),
  
  verifyToken: () => api.get('/auth/verify')
};

export const productService = {
  // Products APIs
  getAllProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  
  // Categories APIs
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data),
  updateCategory: (id, data) => api.patch(`/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
  
  // Image upload
  uploadImage: (formData) => api.post('/cloudinary/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

export const orderService = {
  getAllOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
  createOrder: (orderData) => api.post('/orders', orderData),
  deleteOrder: (id) => api.delete(`/orders/${id}`)
};


export const userService = {
  getAllUsers: (params) => api.get('/users', { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.patch(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserRoles: () => api.get('/roles'), 
  getUserRolesByUserId: (userId) => api.get(`/users/${userId}/roles`),
  changeUserRole: (userId, roleId) =>
    api.post('/roles/assign', { userId: Number(userId), roleId: Number(roleId) }),
};


export const roleService = {
  getAllRoles: () => api.get('/roles'),
  getRoleById: (id) => api.get(`/roles/${id}`),
  createRole: (roleData) => api.post('/roles', roleData),
  updateRole: (id, roleData) => api.patch(`/roles/${id}`, roleData),
  deleteRole: (id) => api.delete(`/roles/${id}`),
  assignRoleToUser: (userId, roleId) =>
    api.post('/roles/assign', { userId: Number(userId), roleId: Number(roleId) }),
  removeRoleFromUser: (userId, roleId) =>
    api.delete(`/roles/user/${userId}/role/${roleId}`),
  getUserRoles: (userId) => api.get(`/users/${userId}/roles`),
};


export const analyticsService = {
  getSalesAnalytics: (timeRange, params) => api.get(`/analytics/sales/${timeRange}`, { params }),
  getProductAnalytics: (params) => api.get('/analytics/products', { params }),
  getUserAnalytics: (params) => api.get('/analytics/users', { params }),
  getDashboardStats: () => api.get('/analytics/dashboard')
};


export const reviewService = {
  getAllReviews: (params) => api.get('/reviews', { params }),
  approveReview: (id) => api.patch(`/reviews/${id}/approve`),
  rejectReview: (id) => api.patch(`/reviews/${id}/reject`),
  deleteReview: (id) => api.delete(`/reviews/${id}`)
};


export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  deleteNotification: (id) => api.delete(`/notifications/${id}`)
};


export const shippingService = {
  getShippingMethods: () => api.get('/shipping/methods'),
  updateShippingMethod: (id, data) => api.put(`/shipping/methods/${id}`, data),
  createShippingMethod: (data) => api.post('/shipping/methods', data),
  deleteShippingMethod: (id) => api.delete(`/shipping/methods/${id}`),
  getShippingZones: () => api.get('/shipping/zones'),
  updateShippingZone: (id, data) => api.put(`/shipping/zones/${id}`, data)
};


export const promotionService = {
  getAllPromotions: (params) => api.get('/promotions', { params }),
  getPromotionById: (id) => api.get(`/promotions/${id}`),
  createPromotion: (data) => api.post('/promotions', data),
  updatePromotion: (id, data) => api.put(`/promotions/${id}`, data),
  deletePromotion: (id) => api.delete(`/promotions/${id}`),
  togglePromotionStatus: (id) => api.patch(`/promotions/${id}/toggle`)
};


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


export const slideshowService = {
  getSlides: () => api.get('/slideshow'),
  updateSlide: (id, data) => api.put(`/slideshow/${id}`, data),
  createSlide: (data) => api.post('/slideshow', data),
  deleteSlide: (id) => api.delete(`/slideshow/${id}`),
  reorderSlides: (data) => api.put('/slideshow/reorder', data)
};


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