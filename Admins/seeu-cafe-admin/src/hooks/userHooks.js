'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/api';
import { toast } from 'react-hot-toast';


export const useUsers = (filters = {}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      try {
        const { data } = await userService.getAllUsers(filters);
        
        // Log the response structure for debugging
        console.log('User data structure:', data);
        
        // Handle different response formats
        if (data && Array.isArray(data)) {
          // Handle array response format
          return { 
            users: data, 
            totalItems: data.length, 
            totalPages: 1 
          };
        } else if (data && data.data && Array.isArray(data.data)) {
          // Handle paginated response format with data property
          return { 
            users: data.data, 
            totalItems: data.meta?.total || data.data.length,
            totalPages: data.meta?.lastPage || Math.ceil((data.meta?.total || data.data.length) / (filters.limit || 10))
          };
        } else if (data && data.users && Array.isArray(data.users)) {
          // Already in the expected format
          return data;
        } else {
          // Unknown format, return empty results
          console.warn('Unknown user data format:', data);
          return { users: [], totalItems: 0, totalPages: 0 };
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    keepPreviousData: true,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: true,
  });
};


export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const { data } = await userService.getUserById(id);
        // Log the response structure for debugging
        console.log('Single user data structure:', data);
        return data;
      } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
      }
    },
    enabled: !!id, 
    staleTime: 60000, // 1 minute
  });
};


export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => userService.createUser(userData),
    onSuccess: () => {
      
      queryClient.invalidateQueries(['users']);
      toast.success('User created successfully');
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
      
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
};


export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }) => {
      console.log('Updating user:', id, userData);
      return userService.updateUser(id, userData);
    },
    onSuccess: (_, variables) => {
      
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', variables.id]);
      toast.success('User updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
      
      
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error URL:', error.config?.url);
        console.error('Error method:', error.config?.method);
      }
      
      let errorMessage = 'Failed to update user';
      
      if (error.response?.status === 400 && Array.isArray(error.response.data.message)) {
        errorMessage = error.response.data.message.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    },
  });
};


export const useChangeUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, roleId }) => userService.changeUserRole(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', variables.userId]);
      toast.success('User role updated successfully');
    },
    onError: (error) => {
      console.error('Failed to change user role:', error);
      toast.error(error.response?.data?.message || 'Failed to change user role');
    },
  });
};


export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
};


export const useUserRoles = () => {
  return useQuery({
    queryKey: ['userRoles'], 
    queryFn: async () => {
      try {
        const { data } = await userService.getUserRoles();
        console.log('Roles data structure:', data);
        
        // Handle different response formats
        if (data && Array.isArray(data)) {
          return data;
        } else if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        } else {
          console.warn('Unknown role data format:', data);
          return [
            { id: 'admin', name: 'ຜູ້ດູແລລະບົບ' },
            { id: 'manager', name: 'ຜູ້ຈັດການ' },
            { id: 'staff', name: 'ພະນັກງານ' },
            { id: 'customer', name: 'ລູກຄ້າ' }
          ];
        }
      } catch (error) {
        console.error('Error fetching user roles:', error);
        // Provide default roles in case of error
        return [
          { id: 'admin', name: 'ຜູ້ດູແລລະບົບ' },
          { id: 'manager', name: 'ຜູ້ຈັດການ' },
          { id: 'staff', name: 'ພະນັກງານ' },
          { id: 'customer', name: 'ລູກຄ້າ' }
        ];
      }
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 1,
  });
};





export const getUserSingleRole = (user) => {
  
  if (Array.isArray(user.roles) && user.roles.length > 0) {
    
    if (typeof user.roles[0] === 'object') {
      return user.roles[0];
    }
    
    return { id: user.roles[0], name: getRoleName(user.roles[0]) };
  } 
  
  else if (user.role && typeof user.role === 'object') {
    return user.role;
  } 
  
  else if (user.role) {
    return { id: user.role, name: getRoleName(user.role) };
  }
  
  
  return { id: 'customer', name: 'ລູກຄ້າ' };
};


export const getRoleName = (roleId) => {
  // Convert roleId to string in case it's a number
  const roleIdStr = roleId?.toString()?.toLowerCase();
  
  const roleMap = {
    'admin': 'ຜູ້ດູແລລະບົບ',
    'staff': 'ພະນັກງານ',
    'manager': 'ຜູ້ຈັດການ',
    'customer': 'ລູກຄ້າ',
    '1': 'ຜູ້ດູແລລະບົບ', // In case role IDs are numeric
    '2': 'ຜູ້ຈັດການ',
    '3': 'ພະນັກງານ',
    '4': 'ລູກຄ້າ'
  };
  
  return roleMap[roleIdStr] || roleId;
};


export const getUserRoleColor = (user) => {
  const role = typeof user === 'string' ? user : getUserSingleRole(user).id;
  
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'bg-red-100 text-red-800';
    case 'manager':
      return 'bg-purple-100 text-purple-800';
    case 'staff':
      return 'bg-blue-100 text-blue-800';
    case 'customer':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getUserStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'suspended':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};