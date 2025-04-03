"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "@/services/api";
import { toast } from "react-hot-toast";

export const useRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      try {
        const { data } = await roleService.getAllRoles();
        console.log('Roles data from API:', data);
        
        // Handle different response formats
        if (data && Array.isArray(data)) {
          return data;
        } else if (data && data.data && Array.isArray(data.data)) {
          return data.data;
        } else {
          console.warn('Unknown roles data format:', data);
          return [];
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
      }
    },
    staleTime: 60000, // 1 minute
  });
};

export const useRole = (id) => {
  return useQuery({
    queryKey: ["role", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await roleService.getRoleById(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useUserRoles = (userId) => {
  return useQuery({
    queryKey: ["userRoles", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await roleService.getUserRoles(userId);
      return data || [];
    },
    enabled: !!userId,
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleData) => roleService.createRole(roleData),
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      toast.success("สร้างตำแหน่งใหม่สำเร็จ");
    },
    onError: (error) => {
      console.error("Failed to create role:", error);

      let errorMessage = "เกิดข้อผิดพลาดในการสร้างตำแหน่ง";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, roleData }) => roleService.updateRole(id, roleData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["roles"]);
      queryClient.invalidateQueries(["role", variables.id]);
      toast.success("อัพเดทตำแหน่งสำเร็จ");
    },
    onError: (error) => {
      console.error("Failed to update role:", error);

      let errorMessage = "เกิดข้อผิดพลาดในการอัพเดทตำแหน่ง";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => roleService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["roles"]);
      toast.success("ลบตำแหน่งสำเร็จ");
    },
    onError: (error) => {
      console.error("Failed to delete role:", error);

      let errorMessage = "เกิดข้อผิดพลาดในการลบตำแหน่ง";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
    },
  });
};

export const useAssignRoleToUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }) =>
      roleService.assignRoleToUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["userRoles", variables.userId]);
      queryClient.invalidateQueries(["users"]);
      toast.success("กำหนดตำแหน่งให้ผู้ใช้สำเร็จ");
    },
    onError: (error) => {
      console.error("Failed to assign role to user:", error);
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการกำหนดตำแหน่ง"
      );
    },
  });
};

export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, roleId }) =>
      roleService.removeRoleFromUser(userId, roleId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["userRoles", variables.userId]);
      queryClient.invalidateQueries(["users"]);
      toast.success("ลบตำแหน่งออกจากผู้ใช้สำเร็จ");
    },
    onError: (error) => {
      console.error("Failed to remove role from user:", error);
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการลบตำแหน่ง"
      );
    },
  });
};
