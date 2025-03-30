import api from './api';

export const userService = {
  // เพิ่มฟังก์ชันที่เสริมเข้าไป
  getAllUsers: (params = {}) => {
    const { page = 1, limit = 10, search = '', role = '', sortBy = 'createdAt', sortDir = 'desc' } = params;
    return api.get('/users', { 
      params: { page, limit, search, role, sortBy, sortDir } 
    });
  },
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserRoles: () => api.get('/roles'),
  changeUserRole: (userId, roleId) => api.patch(`/users/${userId}/role`, { roleId }),
  updateUserStatus: (userId, status) => api.patch(`/users/${userId}/status`, { status }),
  resetUserPassword: (userId) => api.post(`/users/${userId}/reset-password`),
  exportUsers: (format = 'csv', filters = {}) => {
    return api.get(`/users/export/${format}`, { 
      params: filters,
      responseType: 'blob'
    });
  }
};