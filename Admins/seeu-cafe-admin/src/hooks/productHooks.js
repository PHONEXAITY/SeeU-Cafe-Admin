'use client'

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productService } from '@/services/api';
import { toast } from 'react-hot-toast';

// Get all products with filters
export const useProducts = (filters = {}) => {
  return useQuery(
    ['products', filters],
    () => productService.getAllProducts(filters).then(res => res.data),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );
};

// Get a single product by ID
export const useProduct = (id) => {
  return useQuery(
    ['product', id],
    () => productService.getProductById(id).then(res => res.data),
    {
      enabled: !!id, // Only run if ID exists
    }
  );
};

// Create a new product
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (productData) => productService.createProduct(productData),
    {
      onSuccess: () => {
        // Invalidate and refetch products list
        queryClient.invalidateQueries('products');
        toast.success('Product created successfully');
      },
      onError: (error) => {
        console.error('Failed to create product:', error);
        toast.error(error.response?.data?.message || 'Failed to create product');
      },
    }
  );
};

// Update an existing product
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, productData }) => productService.updateProduct(id, productData),
    {
      onSuccess: (_, variables) => {
        // Invalidate and refetch products list and the individual product
        queryClient.invalidateQueries('products');
        queryClient.invalidateQueries(['product', variables.id]);
        toast.success('Product updated successfully');
      },
      onError: (error) => {
        console.error('Failed to update product:', error);
        toast.error(error.response?.data?.message || 'Failed to update product');
      },
    }
  );
};

// Delete a product
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => productService.deleteProduct(id),
    {
      onSuccess: () => {
        // Invalidate and refetch products list
        queryClient.invalidateQueries('products');
        toast.success('Product deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete product:', error);
        toast.error(error.response?.data?.message || 'Failed to delete product');
      },
    }
  );
};

// Get all product categories
export const useCategories = () => {
  return useQuery(
    'categories',
    () => productService.getCategories().then(res => res.data),
    {
      staleTime: 1000 * 60 * 30, // 30 minutes
    }
  );
};

// Upload product image
export const useUploadImage = () => {
  return useMutation(
    (formData) => productService.uploadImage(formData),
    {
      onError: (error) => {
        console.error('Failed to upload image:', error);
        toast.error(error.response?.data?.message || 'Failed to upload image');
      },
    }
  );
};