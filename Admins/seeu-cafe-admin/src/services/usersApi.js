'use client';

// ส่วนของ userService สำหรับการจัดการผู้ใช้
export const userService = {
  // Get all users with pagination and filtering
  getAllUsers: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.role) queryParams.append('role', params.role);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortDir) queryParams.append('sortDir', params.sortDir);
    
    const queryString = queryParams.toString();
    return api.get(`/users${queryString ? `?${queryString}` : ''}`);
  },
  
  // Get user by ID
  getUserById: (id) => api.get(`/users/${id}`),
  
  // Create new user
  createUser: (userData) => {
    console.log('Sending user data to API:', userData);
    return api.post('/users', userData);
  },
  
  // Update user
  updateUser: (id, userData) => {
    console.log(`Sending PATCH request to /users/${id} with data:`, userData);
    return api.patch(`/users/${id}`, userData);
  },
  
  // Delete user
  deleteUser: (id) => api.delete(`/users/${id}`),
  
  // Change user role - นี่เป็นส่วนเชื่อมระหว่าง user กับ role จึงคงไว้ในส่วนนี้
  changeUserRole: (userId, roleId) => {
    console.log(`กำลังเปลี่ยนตำแหน่งสำหรับผู้ใช้ ${userId} เป็น ${roleId}`);
    return api.post('/roles/assign', { 
      userId: Number(userId), 
      roleId: Number(roleId) 
    });
  },
  
  // Update user status
  updateUserStatus: (userId, status) => api.patch(`/users/${userId}/status`, { status }),
  
  // Reset user password
  resetUserPassword: (userId) => api.post(`/users/${userId}/reset-password`),
  
  // Export users to CSV or other formats
  exportUsers: (format = 'csv', filters = {}) => {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      queryParams.append(key, value);
    }
    
    const queryString = queryParams.toString();
    return api.get(`/users/export/${format}${queryString ? `?${queryString}` : ''}`, {
      responseType: 'blob'
    });
  }
};

// แยกส่วนของ roleService สำหรับการจัดการตำแหน่ง
export const roleService = {
  // Get all roles
  getAll: () => {
    console.log('Fetching all roles');
    return api.get('/roles');
  },
  
  // Get user roles
  getUserRoles: (userId) => {
    console.log(`กำลังดึงตำแหน่งของผู้ใช้รหัส ${userId}`);
    return api.get(`/roles/user/${userId}`);
  },
  
  // Get a specific role by ID
  getById: (id) => {
    console.log(`Fetching role with ID: ${id}`);
    return api.get(`/roles/${id}`);
  },
  
  // Create a new role
  create: (roleData) => {
    console.log('Creating new role with data:', roleData);
    return api.post('/roles', roleData);
  },
  
  // Update an existing role
  update: (id, roleData) => {
    console.log(`Updating role ${id} with data:`, roleData);
    return api.patch(`/roles/${id}`, roleData);
  },
  
  // Delete a role
  delete: (id) => {
    console.log(`Deleting role with ID: ${id}`);
    return api.delete(`/roles/${id}`);
  },
  
  // Assign role to user
  assignToUser: (userId, roleId) => {
    console.log(`กำลังกำหนดตำแหน่ง ${roleId} ให้กับผู้ใช้ ${userId}`);
    return api.post('/roles/assign', { 
      userId: Number(userId), 
      roleId: Number(roleId) 
    });
  },
  
  // Remove role from user
  removeFromUser: (userId, roleId) => {
    console.log(`กำลังลบตำแหน่ง ${roleId} ออกจากผู้ใช้ ${userId}`);
    return api.delete(`/roles/user/${userId}/role/${roleId}`);
  }
};