// src/services/api.js
export const analyticsService = {
    getDashboardStats: () => api.get('/analytics/dashboard'),
    
    getSalesAnalytics: (timeRange, filters = {}) => {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        queryParams.append(key, value);
      }
      
      const queryString = queryParams.toString();
      return api.get(`/analytics/sales/${timeRange}${queryString ? `?${queryString}` : ''}`);
    },
    
    getProductAnalytics: (filters = {}) => {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        queryParams.append(key, value);
      }
      
      const queryString = queryParams.toString();
      return api.get(`/analytics/products${queryString ? `?${queryString}` : ''}`);
    },
    
    getUserAnalytics: (filters = {}) => {
      const queryParams = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        queryParams.append(key, value);
      }
      
      const queryString = queryParams.toString();
      return api.get(`/analytics/users${queryString ? `?${queryString}` : ''}`);
    }
  };