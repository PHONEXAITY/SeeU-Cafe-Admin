"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { orderService } from '@/services/api'; // ปรับเส้นทางการนำเข้าตามโครงสร้างไฟล์

// ตัวเลือกสถานะคำสั่งซื้อ
export const orderStatusOptions = [
  { value: 'pending', label: 'ລໍຖ້າ', icon: 'Clock' },
  { value: 'processing', label: 'ກຳລັງປະມວນຜົນ', icon: 'Coffee' },
  { value: 'ready', label: 'ພ້ອມສົ່ງ', icon: 'Package' },
  { value: 'delivered', label: 'ສົ່ງແລ້ວ', icon: 'Check' },
  { value: 'cancelled', label: 'ຍົກເລີກ', icon: 'X' }
];

// ฟังก์ชันช่วยจัดรูปแบบสกุลเงิน
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('lo-LA', {
    style: 'currency',
    currency: 'LAK',
    minimumFractionDigits: 0
  }).format(amount);
};

// Hook สำหรับดึงข้อมูลคำสั่งซื้อทั้งหมด
export const useOrders = (initialParams = {}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    ready: 0,
    delivered: 0,
    cancelled: 0,
    total: 0
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await orderService.getAllOrders(params);
      setOrders(response.data);
      
      // คำนวณสถิติ
      const newStats = {
        pending: 0,
        processing: 0,
        ready: 0,
        delivered: 0,
        cancelled: 0,
        total: response.data.length
      };
      
      response.data.forEach(order => {
        const status = order.status.toLowerCase();
        if (newStats[status] !== undefined) {
          newStats[status] += 1;
        }
      });
      
      setStats(newStats);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ');
      toast.error('ບໍ່ສາມາດດຶງຂໍ້ມູນໄດ້');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const refetch = () => {
    fetchOrders();
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  // ดึงสถิติ dashboard จาก API โดยตรง
  const fetchDashboardStats = async () => {
    try {
      const response = await orderService.getDashboardStats();
      return response.data;
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      toast.error('ບໍ່ສາມາດດຶງຂໍ້ມູນສະຖິຕິໄດ້');
      return null;
    }
  };

  return { 
    orders, 
    loading, 
    error, 
    refetch, 
    stats, 
    updateParams,
    fetchDashboardStats
  };
};

// Hook สำหรับดึงข้อมูลคำสั่งซื้อเดียว
export const useOrder = (orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [timeUpdates, setTimeUpdates] = useState([]);

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await orderService.getOrderById(orderId);
      setOrder(response.data);
      
      // ดึงข้อมูลเพิ่มเติม
      try {
        const timelineResponse = await orderService.getOrderTimeline(orderId);
        setTimeline(timelineResponse.data);
      } catch (e) {
        console.error("Error fetching timeline:", e);
      }
      
      try {
        const timeUpdatesResponse = await orderService.getTimeUpdates(orderId);
        setTimeUpdates(timeUpdatesResponse.data);
      } catch (e) {
        console.error("Error fetching time updates:", e);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນ');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const refetch = () => {
    fetchOrder();
  };

  return { 
    order, 
    loading, 
    error, 
    refetch,
    timeline,
    timeUpdates
  };
};

// Hook สำหรับอัพเดทสถานะคำสั่งซื้อ
export const useUpdateOrderStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateStatus = async (orderId, status, employeeId, notes, callback) => {
    setLoading(true);
    try {
      const response = await orderService.updateOrderStatus(orderId, status, employeeId, notes);
      setError(null);
      toast.success(`ອັບເດດສະຖານະສຳເລັດ: ${orderStatusOptions.find(opt => opt.value === status)?.label || status}`);
      if (callback) callback(response.data);
      return response.data;
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະ');
      toast.error('ບໍ່ສາມາດອັບເດດສະຖານະໄດ້');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
};

// Hook สำหรับอัพเดทเวลาของคำสั่งซื้อ
export const useUpdateOrderTime = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTime = async (orderId, updateTimeData, callback) => {
    setLoading(true);
    try {
      const response = await orderService.updateOrderTime(orderId, updateTimeData);
      setError(null);
      toast.success(`ອັບເດດເວລາສຳເລັດ`);
      if (callback) callback(response.data);
      return response.data;
    } catch (err) {
      console.error("Error updating order time:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດເວລາ');
      toast.error('ບໍ່ສາມາດອັບເດດເວລາໄດ້');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateTime, loading, error };
};

// Hook สำหรับสร้างคำสั่งซื้อใหม่
export const useCreateOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData, callback) => {
    setLoading(true);
    try {
      const response = await orderService.createOrder(orderData);
      setError(null);
      toast.success('ສ້າງອໍເດີ້ໃໝ່ສຳເລັດ');
      if (callback) callback(response.data);
      return response.data;
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງອໍເດີ້');
      toast.error('ບໍ່ສາມາດສ້າງອໍເດີ້ໄດ້');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
};

// Hook สำหรับลบคำสั่งซื้อ
export const useDeleteOrder = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteOrder = async (orderId, callback) => {
    setLoading(true);
    try {
      await orderService.deleteOrder(orderId);
      setError(null);
      toast.success('ລຶບອໍເດີ້ສຳເລັດ');
      if (callback) callback();
      return true;
    } catch (err) {
      console.error("Error deleting order:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການລຶບອໍເດີ້');
      toast.error('ບໍ່ສາມາດລຶບອໍເດີ້ໄດ້');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteOrder, loading, error };
};

// Hook สำหรับจัดการรายการสินค้าในคำสั่งซื้อ
export const useOrderDetails = (orderId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateOrderDetail = async (orderDetailData, callback) => {
    setLoading(true);
    try {
      const response = await orderService.updateOrderDetail(orderId, orderDetailData);
      setError(null);
      toast.success(orderDetailData.id ? 'ອັບເດດລາຍການສຳເລັດ' : 'ເພີ່ມລາຍການສຳເລັດ');
      if (callback) callback(response.data);
      return response.data;
    } catch (err) {
      console.error("Error updating order detail:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດລາຍການ');
      toast.error('ບໍ່ສາມາດອັບເດດລາຍການໄດ້');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markDetailReady = async (orderDetailId, callback) => {
    setLoading(true);
    try {
      const response = await orderService.markOrderDetailReady(orderDetailId);
      setError(null);
      toast.success('ອັບເດດສະຖານະລາຍການສຳເລັດ');
      if (callback) callback(response.data);
      return response.data;
    } catch (err) {
      console.error("Error marking detail ready:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດສະຖານະລາຍການ');
      toast.error('ບໍ່ສາມາດອັບເດດສະຖານະລາຍການໄດ້');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOrderDetail = async (orderDetailId, callback) => {
    setLoading(true);
    try {
      await orderService.deleteOrderDetail(orderDetailId);
      setError(null);
      toast.success('ລຶບລາຍການສຳເລັດ');
      if (callback) callback();
      return true;
    } catch (err) {
      console.error("Error deleting order detail:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການລຶບລາຍການ');
      toast.error('ບໍ່ສາມາດລຶບລາຍການໄດ້');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    updateOrderDetail, 
    markDetailReady, 
    deleteOrderDetail, 
    loading, 
    error 
  };
};

// Hook สำหรับจัดการประวัติการสั่งซื้อ
export const useOrderHistory = (userId) => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrderHistory = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await orderService.getUserOrderHistory(userId);
      setOrderHistory(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching order history:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນປະຫວັດ');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  const toggleFavorite = async (historyId) => {
    try {
      const response = await orderService.toggleFavoriteOrderHistory(historyId);
      
      // อัพเดทข้อมูลในสถานะ
      setOrderHistory(prev => 
        prev.map(item => 
          item.id === historyId 
            ? { ...item, is_favorite: !item.is_favorite } 
            : item
        )
      );
      
      return response.data;
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error('ບໍ່ສາມາດອັບເດດລາຍການໂປດໄດ້');
      throw err;
    }
  };

  const refetch = () => {
    fetchOrderHistory();
  };

  return { 
    orderHistory, 
    loading, 
    error, 
    refetch,
    toggleFavorite
  };
};

// Hook สำหรับจัดการไทม์ไลน์ของคำสั่งซื้อ
export const useOrderTimeline = (orderId) => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTimeline = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await orderService.getOrderTimeline(orderId);
      setTimeline(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching timeline:", err);
      setError(err.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນໄທມ໌ໄລນ໌');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  const addTimelineEntry = async (timelineData) => {
    try {
      const response = await orderService.createOrderTimeline({
        ...timelineData,
        order_id: orderId
      });
      
      // อัพเดทข้อมูลไทม์ไลน์ในสถานะ
      setTimeline(prev => [response.data, ...prev]);
      
      return response.data;
    } catch (err) {
      console.error("Error adding timeline entry:", err);
      toast.error('ບໍ່ສາມາດເພີ່ມຂໍ້ມູນໄທມ໌ໄລນ໌ໄດ້');
      throw err;
    }
  };

  const refetch = () => {
    fetchTimeline();
  };

  return { 
    timeline, 
    loading, 
    error, 
    refetch,
    addTimelineEntry
  };
};