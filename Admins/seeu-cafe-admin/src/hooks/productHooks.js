// src/hooks/productHooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/api';
import { toast } from 'react-hot-toast';

export const useFoodProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['foodProducts', filters],
    queryFn: async () => {
      const data = await productService.getAllFoodProducts(filters);
      return data || { products: [], totalItems: 0, totalPages: 0 }; // ป้องกัน undefined
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBeverageProducts = (filters = {}) => {
  return useQuery({
    queryKey: ['beverageProducts', filters],
    queryFn: async () => {
      const data = await productService.getAllBeverageProducts(filters);
      return data || { products: [], totalItems: 0, totalPages: 0 }; // ป้องกัน undefined
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const data = await productService.getCategories();
      return data || []; // ป้องกัน undefined
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};

// ฟังก์ชันอื่นๆ คงเดิม
export const useDeleteFoodProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteFoodProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['foodProducts']);
      toast.success('Food product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete food product');
    },
  });
};

export const useDeleteBeverageProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteBeverageProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['beverageProducts']);
      toast.success('Beverage product deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete beverage product');
    },
  });
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const getProductStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'out_of_stock':
      return 'bg-red-100 text-red-800';
    case 'low_stock':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};