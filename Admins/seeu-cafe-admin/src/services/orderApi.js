// src/services/api.js
export const orderService = {
    getAllOrders: (params) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.status) queryParams.append('status', params.status);
      if (params.userId) queryParams.append('userId', params.userId);
      if (params.employeeId) queryParams.append('employeeId', params.employeeId);
      
      const queryString = queryParams.toString();
      return api.get(`/orders${queryString ? `?${queryString}` : ''}`);
    },
    
    getOrderById: (id) => api.get(`/orders/${id}`),
    
    getOrderByOrderId: (orderId) => api.get(`/orders/order-id/${orderId}`),
    
    createOrder: (orderData) => api.post('/orders', orderData),
    
    updateOrder: (id, orderData) => api.patch(`/orders/${id}`, orderData),
    
    updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
    
    deleteOrder: (id) => api.delete(`/orders/${id}`),
    
    getOrderDetails: (orderId) => api.get(`/orders/${orderId}/details`),
    
    createOrderDetail: (orderId, detailData) => api.post(`/orders/${orderId}/details`, detailData),
    
    updateOrderDetail: (id, detailData) => api.patch(`/orders/details/${id}`, detailData),
    
    deleteOrderDetail: (id) => api.delete(`/orders/details/${id}`)
  };