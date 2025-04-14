"use client";

import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

const getToken = () => {
  if (typeof window !== "undefined") {
    return Cookies.get("auth_token");
  }
  return null;
};

const loadingCallbacks = {
  startLoading: () => {},
  stopLoading: () => {},
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
    console.log(
      `API Request: ${config.method.toUpperCase()} ${config.url}`,
      config.data
    );

    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(
      `API Response: ${response.status} ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);

    if (error.response) {
      const status = error.response.status;
      const url = error.config?.url;
      console.error(`API Error ${status} from ${url}:`, error.response.data);

      switch (status) {
        case 400:
          console.error("400 Bad Request - Check if request data is correct:", {
            url,
            method: error.config?.method,
            requestData: error.config?.data,
            responseData: error.response.data,
          });
          break;

        case 401:
          console.error("401 Unauthorized - Authentication failed");
          if (dispatchFunction && logoutAction) {
            dispatchFunction(logoutAction());
          }
          break;

        case 403:
          console.error("403 Forbidden - No permission");
          break;

        case 404:
          console.error("404 Not Found:", error.config?.url);
          break;

        case 422:
          console.error("422 Validation Error:", error.response.data);
          break;

        case 500:
          console.error("500 Server Error");
          break;
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Request setup error:", error.message);
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => {
    const loginData = {
      email: credentials.email,
      password: credentials.password,
    };

    console.log("Auth Service: Sending login data:", JSON.stringify(loginData));

    return api
      .post("/auth/login", loginData)
      .then((response) => {
        console.log("Auth Service: Login response received:", response.data);

        if (response.data && response.data.access_token) {
          Cookies.set("auth_token", response.data.access_token, { expires: 7 });
        }

        return response;
      })
      .catch((error) => {
        console.error("Auth Service: Login error:", error);

        if (error.response) {
          console.error("Error response:", {
            status: error.response.status,
            data: error.response.data,
            headers: error.response.headers,
          });
        }

        throw error;
      });
  },

  logout: () => {
    return api.post("/auth/logout").then((response) => {
      Cookies.remove("auth_token");
      return response;
    });
  },

  getProfile: () => api.get("/auth/profile"),

  verifyToken: () => api.get("/auth/verify"),
};
export const productService = {
  getAllProducts: (params) => api.get("/products", { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post("/products", data),
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),

  getFoodProducts: (params) => api.get("/food-menu", { params }),
  getFoodProductById: (id) => api.get(`/food-menu/${id}`),
  createFoodProduct: (data) => api.post("/food-menu", data),
  updateFoodProduct: (id, data) => api.patch(`/food-menu/${id}`, data),
  deleteFoodProduct: (id) => api.delete(`/food-menu/${id}`),

  getBeverageProducts: (params) => api.get("/beverage-menu", { params }),
  getBeverageProductById: (id) => api.get(`/beverage-menu/${id}`),
  createBeverageProduct: (data) => api.post("/beverage-menu", data),
  updateBeverageProduct: (id, data) => api.patch(`/beverage-menu/${id}`, data),
  deleteBeverageProduct: (id) => api.delete(`/beverage-menu/${id}`),

  getCategories: () => api.get("/menu-categories"),
  getCategoryById: (id) => api.get(`/menu-categories/${id}`),
  createCategory: (data) => api.post("/menu-categories", data),
  updateCategory: (id, data) => api.patch(`/menu-categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/menu-categories/${id}`),

  uploadImage: (formData) =>
    api.post("/cloudinary/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export const orderService = {
  getAllOrders: (params) => api.get("/orders", { params }),

  getOrderById: (id) => api.get(`/orders/${id}`),

  getOrderByOrderId: (orderId) => api.get(`/orders/by-order-id/${orderId}`),

  createOrder: (orderData) => api.post("/orders", orderData),

  updateOrder: (id, orderData) => api.patch(`/orders/${id}`, orderData),

  updateOrderStatus: (id, status, employeeId, notes) =>
    api.patch(`/orders/${id}/status`, { status, employeeId, notes }),

  updateOrderTime: (id, updateTimeData) =>
    api.patch(`/orders/${id}/time`, updateTimeData),

  deleteOrder: (id) => api.delete(`/orders/${id}`),

  createOrderTimeline: (orderTimelineData) =>
    api.post("/order-timeline", orderTimelineData),

  getOrderTimeline: (orderId) => api.get(`/order-timeline/order/${orderId}`),

  markOrderItemReady: (orderId, orderDetailId) =>
    api.patch(`/orders/${orderId}/items/${orderDetailId}/ready`),

  assignPickupCode: (id) => api.post(`/orders/${id}/pickup-code`),

  createOrderHistory: (id) => api.post(`/orders/${id}/history`),

  updateOrderDetail: (orderId, orderDetailData) => {
    if (orderDetailData.id) {
      return api.patch(`/order-details/${orderDetailData.id}`, orderDetailData);
    } else {
      return api.post(`/orders/${orderId}/details`, orderDetailData);
    }
  },

  markOrderDetailReady: (orderDetailId) =>
    api.patch(`/order-details/${orderDetailId}/ready`),

  deleteOrderDetail: (orderDetailId) =>
    api.delete(`/order-details/${orderDetailId}`),

  createTimeUpdate: (timeUpdateData) =>
    api.post("/time-update", timeUpdateData),

  getTimeUpdates: (orderId) => api.get(`/time-update/order/${orderId}`),

  getUserOrderHistory: (userId) => api.get(`/order-history/user/${userId}`),

  getOrderHistoryByOrderId: (orderId) =>
    api.get(`/order-history/order/${orderId}`),

  updateOrderHistory: (id, historyData) => {
    if (id) {
      return api.patch(`/order-history/${id}`, historyData);
    } else {
      return api.post("/order-history", historyData);
    }
  },

  toggleFavoriteOrderHistory: (id) =>
    api.patch(`/order-history/${id}/favorite`),

  incrementReorderCount: (id) => api.patch(`/order-history/${id}/reorder`),

  getDashboardStats: () => api.get("/orders/admin/dashboard"),
};

export const userService = {
  getAllUsers: (params) => api.get("/users", { params }),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post("/users", userData),
  updateUser: (id, userData) => api.patch(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserRoles: () => api.get("/roles"),
  getUserRolesByUserId: (userId) => api.get(`/users/${userId}/roles`),
  changeUserRole: (userId, roleId) =>
    api.post("/roles/assign", {
      userId: Number(userId),
      roleId: Number(roleId),
    }),
};

export const roleService = {
  getAllRoles: () => api.get("/roles"),
  getRoleById: (id) => api.get(`/roles/${id}`),
  createRole: (roleData) => api.post("/roles", roleData),
  updateRole: (id, roleData) => api.patch(`/roles/${id}`, roleData),
  deleteRole: (id) => api.delete(`/roles/${id}`),
  assignRoleToUser: (userId, roleId) =>
    api.post("/roles/assign", {
      userId: Number(userId),
      roleId: Number(roleId),
    }),
  removeRoleFromUser: (userId, roleId) =>
    api.delete(`/roles/user/${userId}/role/${roleId}`),
  getUserRoles: (userId) => api.get(`/users/${userId}/roles`),
};
export const documentService = {
  getAllDocuments: (params) => api.get("/documents", { params }),

  getDocumentById: (id) => api.get(`/documents/${id}`),

  getDocumentsByUserId: (userId) => api.get(`/documents/user/${userId}`),

  getDocumentsByEmployeeId: (employeeId) =>
    api.get(`/documents/employee/${employeeId}`),

  createDocument: (documentData) => api.post("/documents", documentData),

  uploadDocument: (formData) =>
    api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  updateDocument: (id, documentData) =>
    api.patch(`/documents/${id}`, documentData),

  deleteDocument: (id) => api.delete(`/documents/${id}`),

  downloadDocument: (id) =>
    api.get(`/documents/${id}/download`, {
      responseType: "blob",
    }),

  getDocumentTypes: () => api.get("/documents/types"),

  verifyDocument: (id) => api.patch(`/documents/${id}/verify`),

  rejectDocument: (id, reason) =>
    api.patch(`/documents/${id}/reject`, { reason }),
};

export const employeeService = {
  getAllEmployees: (params) =>
    api.get("/employees", {
      params: {
        position: params?.position,
        ...params,
      },
    }),

  getEmployeeById: (id) => api.get(`/employees/${id}`),

  getEmployeeByEmail: (email) => api.get(`/employees/email/${email}`),

  createEmployee: (employeeData) => api.post("/employees", employeeData),

  updateEmployee: (id, employeeData) =>
    api.patch(`/employees/${id}`, employeeData),

  deleteEmployee: (id) => api.delete(`/employees/${id}`),

  uploadProfilePhoto: (id, formData) =>
    api.post(`/employees/${id}/upload-photo`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getEmployeeDocuments: (id) => api.get(`/employees/${id}/documents`),

  addEmployeeDocument: (employeeId, documentId) =>
    api.post(`/employees/${employeeId}/documents`, { documentId }),

  removeEmployeeDocument: (employeeId, documentId) =>
    api.delete(`/employees/${employeeId}/documents/${documentId}`),

  updateEmployeeStatus: (id, status) =>
    api.patch(`/employees/${id}/status`, { status }),

  getEmployeePositions: () => api.get(`/employees/positions`),

  getEmployeeStatusOptions: () => api.get(`/employees/status-options`),

  getEmployeeByEmployeeId: (employeeId) =>
    api.get(`/employees/employee-id/${employeeId}`),

  getEmployeeStats: () => api.get(`/employees/stats`),
};
export const cloudinaryService = {
  uploadImage: (formData) =>
    api.post("/cloudinary/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
export const analyticsService = {
  getSalesAnalytics: (timeRange, params) =>
    api.get(`/analytics/sales/${timeRange}`, { params }),
  getProductAnalytics: (params) => api.get("/analytics/products", { params }),
  getUserAnalytics: (params) => api.get("/analytics/users", { params }),
  getDashboardStats: () => api.get("/analytics/dashboard"),
};

export const reviewService = {
  getAllReviews: (params) => api.get("/reviews", { params }),
  approveReview: (id) => api.patch(`/reviews/${id}/approve`),
  rejectReview: (id) => api.patch(`/reviews/${id}/reject`),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const notificationService = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch("/notifications/read-all"),
  deleteNotification: (id) => api.delete(`/notifications/${id}`),
};

export const deliveryService = {
  getAllDeliveries: (params) => api.get("/deliveries", { params }),

  getDeliveryById: (id) => api.get(`/deliveries/${id}`),

  getDeliveryByOrderId: (orderId) => api.get(`/deliveries/order/${orderId}`),

  createDelivery: (deliveryData) => api.post("/deliveries", deliveryData),

  updateDelivery: (id, deliveryData) =>
    api.patch(`/deliveries/${id}`, deliveryData),

  updateDeliveryStatus: (id, status, notes) =>
    api.patch(`/deliveries/${id}/status`, { status, notes }),

  updateDeliveryTime: (id, updateTimeDto) =>
    api.patch(`/deliveries/${id}/time`, updateTimeDto),

  deleteDelivery: (id) => api.delete(`/deliveries/${id}`),

  assignDriver: (id, employeeId) =>
    api.patch(`/deliveries/${id}/driver`, { employee_id: employeeId }),

  updateDeliveryLocation: (id, latitude, longitude) =>
    api.post(`/deliveries/${id}/location`, { latitude, longitude }),

  getDeliveryLocations: (id) => api.get(`/deliveries/${id}/locations`),

  confirmDeliveryReceipt: (id, signatureData, notes) =>
    api.post(`/deliveries/${id}/confirm-receipt`, {
      signature: signatureData,
      notes: notes,
    }),

  getDeliveryPerformance: (params) =>
    api.get("/deliveries/performance", { params }),

  getDeliveryDashboardStats: () => api.get("/deliveries/dashboard-stats"),

  getActiveDeliveries: () => api.get("/deliveries/active"),

  cancelDelivery: (id, reason) =>
    api.post(`/deliveries/${id}/cancel`, { reason }),

  reportDeliveryIssue: (id, issueType, description, photos = []) =>
    api.post(`/deliveries/${id}/issues`, {
      issue_type: issueType,
      description,
      photos,
    }),

  trackDelivery: (trackingId) =>
    api.get(`/public/delivery-tracking/${trackingId}`),

  notifyCustomer: (id, notificationType, message) =>
    api.post(`/deliveries/${id}/notify`, {
      notification_type: notificationType,
      message,
    }),

  uploadDeliveryProof: (id, formData) =>
    api.post(`/deliveries/${id}/proof`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getCustomerDeliveryHistory: (customerId) =>
    api.get(`/customers/${customerId}/delivery-history`),

  getDelayedDeliveries: () => api.get("/deliveries/delayed"),

  getDeliveryRoutes: (date) =>
    api.get(`/delivery-routes`, { params: { date } }),
  createDeliveryRoute: (routeData) => api.post(`/delivery-routes`, routeData),
  optimizeDeliveryRoutes: (date) =>
    api.post(`/delivery-routes/optimize`, { date }),
};
export const tableService = {
  getAllTables: (status) => {
    const params = status ? { status } : {};
    return api.get("/tables", { params });
  },

  getAvailableTables: (capacity) => {
    const params = capacity ? { capacity } : {};
    return api.get("/tables/available", { params });
  },

  getTableById: (id) => api.get(`/tables/${id}`),

  getTableByNumber: (number) => api.get(`/tables/number/${number}`),

  createTable: (tableData) => api.post("/tables", tableData),

  updateTable: (id, tableData) => api.patch(`/tables/${id}`, tableData),

  updateTableStatus: (id, status) =>
    api.patch(`/tables/${id}/status`, { status }),

  updateTableTime: (id, timeData) => api.patch(`/tables/${id}/time`, timeData),

  startTableSession: (id) => api.post(`/tables/${id}/start-session`),

  endTableSession: (id) => api.post(`/tables/${id}/end-session`),

  deleteTable: (id) => api.delete(`/tables/${id}`),
};

export const promotionService = {
  getAllPromotions: (params) => api.get("/promotions", { params }),
  getPromotionById: (id) => api.get(`/promotions/${id}`),
  getPromotionByCode: (code) => api.get(`/promotions/code/${code}`),
  createPromotion: (data) => api.post("/promotions", data),
  updatePromotion: (id, data) => api.patch(`/promotions/${id}`, data),
  deletePromotion: (id) => api.delete(`/promotions/${id}`),
  validatePromotion: (data) => api.post("/promotions/validate", data),
  togglePromotionStatus: (id) => api.patch(`/promotions/${id}/toggle`),
};

export const crmService = {
  getCustomers: (params) => api.get("/customers", { params }),
  getCustomerById: (id) => api.get(`/customers/${id}`),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  getCustomerOrders: (id) => api.get(`/customers/${id}/orders`),
  exportCustomers: (params) =>
    api.get("/customers/export", {
      params,
      responseType: "blob",
    }),
};

export const blogCategoriesAPI = {
  getAll: () => api.get("/blog-categories"),
  getById: (id) => api.get(`/blog-categories/${id}`),
  getBySlug: (slug) => api.get(`/blog-categories/slug/${slug}`),
  create: (data) => api.post("/blog-categories", data),
  update: (id, data) => api.patch(`/blog-categories/${id}`, data),
  delete: (id) => api.delete(`/blog-categories/${id}`),
};

export const blogPostsAPI = {
  getAll: (params) => api.get("/blogs", { params }),
  getById: (id) => api.get(`/blogs/${id}`),
  getBySlug: (slug) => api.get(`/blogs/slug/${slug}`),
  create: (data) => api.post("/blogs", data),
  update: (id, data) => api.patch(`/blogs/${id}`, data),
  delete: (id) => api.delete(`/blogs/${id}`),
  updateStatus: (id, status) => api.patch(`/blogs/${id}/status`, { status }),
  uploadImage: (formData) =>
    api.post("/cloudinary/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};

export const galleryService = {
  getAllImages: (params) => api.get("/gallery", { params }),
  getCategories: () => api.get("/gallery/categories"),
  uploadImages: (formData) =>
    api.post("/gallery/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteImage: (id) => api.delete(`/gallery/${id}`),
  updateImageDetails: (id, data) => api.patch(`/gallery/${id}`, data),
};

export const slideshowService = {
  getSlides: (params = {}) => api.get("/slideshow", { params }),
  getActiveSlides: () => api.get("/slideshow/active"),
  getSlideById: (id) => api.get(`/slideshow/${id}`),
  createSlide: (data) => api.post("/slideshow", data),
  createSlideWithImage: (formData) =>
    api.post("/slideshow/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  updateSlide: (id, data) => api.patch(`/slideshow/${id}`, data),
  updateSlideImage: (id, formData) =>
    api.patch(`/slideshow/${id}/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  deleteSlide: (id) => api.delete(`/slideshow/${id}`),
  reorderSlides: (ordersMap) => api.post("/slideshow/reorder", ordersMap),

  getSettings: () => api.get("/slideshow-settings"),
  updateSettings: (data) => api.put("/slideshow-settings", data),
  resetSettings: () => api.put("/slideshow-settings/reset"),

  searchSlides: (query) => api.get("/slideshow", { params: { search: query } }),
};

export const settingsService = {
  getGeneralSettings: () => api.get("/settings/general"),
  updateGeneralSettings: (data) => api.put("/settings/general", data),
  getPaymentSettings: () => api.get("/settings/payment"),
  updatePaymentSettings: (data) => api.put("/settings/payment", data),
  getEmailSettings: () => api.get("/settings/email"),
  updateEmailSettings: (data) => api.put("/settings/email", data),
  getSocialSettings: () => api.get("/settings/social"),
  updateSocialSettings: (data) => api.put("/settings/social", data),
  getStoreSettings: () => api.get("/settings/store"),
  updateStoreSettings: (data) => api.put("/settings/store", data),
};

export default api;
