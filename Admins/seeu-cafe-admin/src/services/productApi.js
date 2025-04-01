// src/services/api.js
export const productService = {
    getAllProducts: (params) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      
      const queryString = queryParams.toString();
      return api.get(`/products${queryString ? `?${queryString}` : ''}`);
    },
    
    getProductById: (id) => api.get(`/products/${id}`),
    
    getFoodMenus: (params) => api.get('/food-menu', { params }),
    
    getBeverageMenus: (params) => api.get('/beverage-menu', { params }),
    
    createFoodMenu: (data) => api.post('/food-menu', data),
    
    createBeverageMenu: (data) => api.post('/beverage-menu', data),
    
    updateFoodMenu: (id, data) => api.patch(`/food-menu/${id}`, data),
    
    updateBeverageMenu: (id, data) => api.patch(`/beverage-menu/${id}`, data),
    
    deleteFoodMenu: (id) => api.delete(`/food-menu/${id}`),
    
    deleteBeverageMenu: (id) => api.delete(`/beverage-menu/${id}`),
    
    getCategories: () => api.get('/menu-categories'),
    
    getCategoryById: (id) => api.get(`/menu-categories/${id}`),
    
    createCategory: (data) => api.post('/menu-categories', data),
    
    updateCategory: (id, data) => api.patch(`/menu-categories/${id}`, data),
    
    deleteCategory: (id) => api.delete(`/menu-categories/${id}`)
  };