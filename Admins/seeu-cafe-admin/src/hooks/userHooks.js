'use client'

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { userService } from '@/services/api';
import { toast } from 'react-hot-toast';

// Get all users with filters
export const useUsers = (filters = {}) => {
  return useQuery(
    ['users', filters],
    () => userService.getAllUsers(filters).then(res => res.data),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

// Get a single user by ID
export const useUser = (id) => {
  return useQuery(
    ['user', id],
    () => userService.getUserById(id).then(res => res.data),
    {
      enabled: !!id, // Only run if ID exists
    }
  );
};

// Create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (userData) => userService.createUser(userData),
    {
      onSuccess: () => {
        // Invalidate and refetch users list
        queryClient.invalidateQueries('users');
        toast.success('User created successfully');
      },
      onError: (error) => {
        console.error('Failed to create user:', error);
        toast.error(error.response?.data?.message || 'Failed to create user');
      },
    }
  );
};

// Update an existing user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, userData }) => userService.updateUser(id, userData),
    {
      onSuccess: (_, variables) => {
        // Invalidate and refetch users list and the individual user
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries(['user', variables.id]);
        toast.success('User updated successfully');
      },
      onError: (error) => {
        console.error('Failed to update user:', error);
        toast.error(error.response?.data?.message || 'Failed to update user');
      },
    }
  );
};

// Delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => userService.deleteUser(id),
    {
      onSuccess: () => {
        // Invalidate and refetch users list
        queryClient.invalidateQueries('users');
        toast.success('User deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete user:', error);
        toast.error(error.response?.data?.message || 'Failed to delete user');
      },
    }
  );
};

// Get user roles
export const useUserRoles = () => {
  return useQuery(
    'userRoles',
    () => userService.getUserRoles().then(res => res.data),
    {
      staleTime: 1000 * 60 * 30, // 30 minutes
    }
  );
};

// Helper function to get user role badge color
export const getUserRoleColor = (role) => {
  switch (role.toLowerCase()) {
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

// User role options for dropdown
export const userRoleOptions = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff' },
  { value: 'customer', label: 'Customer' },
];

// User status options for dropdown
export const userStatusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
];

// Helper function to get user status badge color
export const getUserStatusColor = (status) => {
  switch (status.toLowerCase()) {
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