'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/services/api';
import { toast } from 'react-hot-toast';

/**
 * Hook สำหรับดึงข้อมูลตำแหน่งทั้งหมด
 */
export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      try {
        const response = await roleService.getAll();
        return response.data;
      } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 นาที
  });
};

/**
 * Hook สำหรับดึงข้อมูลตำแหน่งเดียว
 */
export const useRole = (id) => {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => roleService.getById(id).then(res => res.data),
    enabled: !!id, // ทำงานเมื่อมี ID เท่านั้น
  });
};

/**
 * Hook สำหรับดึงตำแหน่งของผู้ใช้คนใดคนหนึ่ง
 */
export const useUserRoles = (userId) => {
  return useQuery({
    queryKey: ['userRoles', userId],
    queryFn: () => roleService.getUserRoles(userId).then(res => res.data),
    enabled: !!userId, // ทำงานเมื่อมี userId เท่านั้น
  });
};

/**
 * Hook สำหรับสร้างตำแหน่งใหม่
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (roleData) => roleService.create(roleData),
    onSuccess: () => {
      // รีเฟรชข้อมูล
      queryClient.invalidateQueries(['roles']);
      toast.success('สร้างตำแหน่งใหม่สำเร็จ');
    },
    onError: (error) => {
      console.error('Failed to create role:', error);
      
      let errorMessage = 'เกิดข้อผิดพลาดในการสร้างตำแหน่ง';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook สำหรับอัพเดทตำแหน่ง
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, roleData }) => roleService.update(id, roleData),
    onSuccess: (_, variables) => {
      // รีเฟรชข้อมูล
      queryClient.invalidateQueries(['roles']);
      queryClient.invalidateQueries(['role', variables.id]);
      toast.success('อัพเดทตำแหน่งสำเร็จ');
    },
    onError: (error) => {
      console.error('Failed to update role:', error);
      
      let errorMessage = 'เกิดข้อผิดพลาดในการอัพเดทตำแหน่ง';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook สำหรับลบตำแหน่ง
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => roleService.delete(id),
    onSuccess: () => {
      // รีเฟรชข้อมูล
      queryClient.invalidateQueries(['roles']);
      toast.success('ลบตำแหน่งสำเร็จ');
    },
    onError: (error) => {
      console.error('Failed to delete role:', error);
      
      let errorMessage = 'เกิดข้อผิดพลาดในการลบตำแหน่ง';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    },
  });
};

/**
 * Hook สำหรับกำหนดตำแหน่งให้กับผู้ใช้
 */
export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, roleId }) => roleService.assignToUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['userRoles', variables.userId]);
      queryClient.invalidateQueries(['users']);
      toast.success('กำหนดตำแหน่งให้ผู้ใช้สำเร็จ');
    },
    onError: (error) => {
      console.error('Failed to assign role to user:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการกำหนดตำแหน่ง');
    },
  });
};

/**
 * Hook สำหรับลบตำแหน่งออกจากผู้ใช้
 */
export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, roleId }) => roleService.removeFromUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['userRoles', variables.userId]);
      queryClient.invalidateQueries(['users']);
      toast.success('ลบตำแหน่งออกจากผู้ใช้สำเร็จ');
    },
    onError: (error) => {
      console.error('Failed to remove role from user:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบตำแหน่ง');
    },
  });
};