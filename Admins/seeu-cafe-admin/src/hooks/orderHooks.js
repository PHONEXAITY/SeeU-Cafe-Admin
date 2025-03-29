'use client'

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { orderService } from '@/services/api';
import { toast } from 'react-hot-toast';

// Get all orders with filters
export const useOrders = (filters = {}) => {
  return useQuery(
    ['orders', filters],
    () => orderService.getAllOrders(filters).then(res => res.data),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60 * 2, // 2 minutes (shorter stale time for orders)
    }
  );
};

// Get a single order by ID
export const useOrder = (id) => {
  return useQuery(
    ['order', id],
    () => orderService.getOrderById(id).then(res => res.data),
    {
      enabled: !!id, // Only run if ID exists
    }
  );
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ id, status }) => orderService.updateOrderStatus(id, status),
    {
      onSuccess: (_, variables) => {
        // Invalidate and refetch orders list and the individual order
        queryClient.invalidateQueries('orders');
        queryClient.invalidateQueries(['order', variables.id]);
        toast.success(`Order status updated to ${variables.status}`);
      },
      onError: (error) => {
        console.error('Failed to update order status:', error);
        toast.error(error.response?.data?.message || 'Failed to update order status');
      },
    }
  );
};

// Create a new order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (orderData) => orderService.createOrder(orderData),
    {
      onSuccess: () => {
        // Invalidate and refetch orders list
        queryClient.invalidateQueries('orders');
        toast.success('Order created successfully');
      },
      onError: (error) => {
        console.error('Failed to create order:', error);
        toast.error(error.response?.data?.message || 'Failed to create order');
      },
    }
  );
};

// Delete an order
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (id) => orderService.deleteOrder(id),
    {
      onSuccess: () => {
        // Invalidate and refetch orders list
        queryClient.invalidateQueries('orders');
        toast.success('Order deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete order:', error);
        toast.error(error.response?.data?.message || 'Failed to delete order');
      },
    }
  );
};

// Helper function to get order status color
export const getOrderStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to get payment status color
export const getPaymentStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Order status options for dropdown
export const orderStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

// Payment status options for dropdown
export const paymentStatusOptions = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

// Payment method options for dropdown
export const paymentMethodOptions = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'qr_code', label: 'QR Code' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery' },
  { value: 'promptpay', label: 'PromptPay' },
];

// Format currency with Thai Baht
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(amount);
};