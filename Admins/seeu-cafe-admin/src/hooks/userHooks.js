'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/api';
import { toast } from 'react-hot-toast';

// Hook to get all users with filters
export const useUsers = (filters = {}) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getAllUsers(filters).then(res => res.data),
    keepPreviousData: true,
    staleTime: 10000, // ลดเวลาให้สั้นลง (10 วินาที) เพื่อให้ข้อมูลรีเฟรชเร็วขึ้น
    refetchOnWindowFocus: true, // รีเฟรชเมื่อกลับมาที่หน้าต่าง
  });
};

// Hook to get a single user by ID
export const useUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id).then(res => res.data),
    enabled: !!id, // Only run if ID exists
  });
};

// Hook to create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData) => userService.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries(['users']);
      toast.success('User created successfully');
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
      
      // Log detailed error information for debugging
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
      
      toast.error(error.response?.data?.message || 'Failed to create user');
    },
  });
};

// Hook to update an existing user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }) => {
      console.log('Updating user:', id, userData);
      return userService.updateUser(id, userData);
    },
    onSuccess: (_, variables) => {
      // รีเฟรชข้อมูลทั้งหมดที่เกี่ยวข้องทันที
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', variables.id]);
      toast.success('User updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
      
      // Log detailed error information for debugging
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

// Hook to update user role
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

// Hook to delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    },
  });
};

// Hook to get user roles
export const useUserRoles = () => {
  return useQuery({
    queryKey: ['userRoles'], // Changed from string to array
    queryFn: () => userService.getUserRoles().then(res => res.data),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// Helper function to get user role badge color
export const getUserRoleColor = (role) => {
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

// Helper function to get user status badge color
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