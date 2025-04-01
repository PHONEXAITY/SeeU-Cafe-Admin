// src/hooks/orderHooks.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/api';
import { toast } from 'react-hot-toast';

// Hook สำหรับดึงข้อมูลคำสั่งซื้อทั้งหมด
export const useOrders = (filters = {}) => {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.getAllOrders(filters).then(res => res.data),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 2, // 2 นาที
  });
};

// Hook สำหรับดึงข้อมูลคำสั่งซื้อเดียว
export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id).then(res => res.data),
    enabled: !!id, // ทำงานเมื่อมี ID เท่านั้น
  });
};

// Hook สำหรับสร้างคำสั่งซื้อใหม่
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderData) => orderService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('สร้างคำสั่งซื้อสำเร็จ');
    },
    onError: (error) => {
      console.error('Failed to create order:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ');
    },
  });
};

// Hook สำหรับอัพเดทสถานะคำสั่งซื้อ
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => orderService.updateOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['order', variables.id]);
      toast.success(`อัพเดทสถานะคำสั่งซื้อเป็น ${variables.status} สำเร็จ`);
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการอัพเดทสถานะคำสั่งซื้อ');
    },
  });
};

// Hook สำหรับลบคำสั่งซื้อ
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      toast.success('ลบคำสั่งซื้อสำเร็จ');
    },
    onError: (error) => {
      console.error('Failed to delete order:', error);
      toast.error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการลบคำสั่งซื้อ');
    },
  });
};

// Helper สำหรับจัดการสถานะคำสั่งซื้อ
export const orderStatusOptions = [
  { value: 'pending', label: 'รอดำเนินการ' },
  { value: 'processing', label: 'กำลังจัดทำ' },
  { value: 'ready', label: 'พร้อมส่งมอบ' },
  { value: 'delivered', label: 'ส่งมอบแล้ว' },
  { value: 'cancelled', label: 'ยกเลิก' }
];

// Helper สำหรับแปลงสกุลเงิน
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};