"use client";

import { useState, useEffect, useCallback } from "react";
import { deliveryService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

// Hook สำหรับดึงข้อมูลรายการจัดส่งทั้งหมด
export const useDeliveries = (initialParams = {}) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const { toast } = useToast();

  const fetchDeliveries = useCallback(async (queryParams = {}) => {
    try {
      setLoading(true);
      // ใช้ params ปัจจุบันผสมกับ queryParams ที่ส่งมา
      const finalParams = { ...params, ...queryParams };
      const response = await deliveryService.getAllDeliveries(finalParams);
      setDeliveries(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError(
        err.response?.data?.message || "ບໍ່ສາມາດໂຫຼດລາຍການຈັດສົ່ງໄດ້"
      );
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດໂຫຼດລາຍການຈັດສົ່ງໄດ້",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [params, toast]);

  // โหลดข้อมูลเมื่อ params เปลี่ยน
  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  // อัปเดตพารามิเตอร์และโหลดข้อมูลใหม่
  const updateFilters = useCallback((newParams) => {
    setParams(prev => {
      const updatedParams = { ...prev, ...newParams };
      return updatedParams;
    });
  }, []);

  // ดึงข้อมูลจัดส่งที่กำลังดำเนินการอยู่
  const fetchActiveDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      // ใช้ API endpoint ที่ถูกต้องจาก DeliveriesController
      const response = await deliveryService.getAllDeliveries({ status: 'out_for_delivery' });
      setDeliveries(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching active deliveries:", err);
      setError(
        err.response?.data?.message || "ບໍ່ສາມາດໂຫຼດລາຍການຈັດສົ່ງທີ່ກຳລັງດຳເນີນການໄດ້"
      );
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດໂຫຼດລາຍການຈັດສົ່ງທີ່ກຳລັງດຳເນີນການໄດ້",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // ดึงข้อมูลจัดส่งที่ล่าช้า
  const fetchDelayedDeliveries = useCallback(async () => {
    try {
      setLoading(true);
      // ปรับให้ใช้ API endpoint ที่ถูกต้อง
      // สมมติว่าการจัดส่งที่ล่าช้าคือการจัดส่งที่มีเวลาส่งประมาณที่น้อยกว่าเวลาปัจจุบัน
      // และยังไม่ถูกส่ง (สถานะไม่ใช่ delivered)
      const now = new Date().toISOString();
      const response = await deliveryService.getAllDeliveries({ 
        status: ['pending', 'preparing', 'out_for_delivery'],
        delayed: true
      });
      setDeliveries(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching delayed deliveries:", err);
      setError(
        err.response?.data?.message || "ບໍ່ສາມາດໂຫຼດລາຍການຈັດສົ່ງທີ່ລ່າຊ້າໄດ້"
      );
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດໂຫຼດລາຍການຈັດສົ່ງທີ່ລ່າຊ້າໄດ້",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    // ข้อมูลหลัก
    deliveries,
    loading,
    error,
    params,
    
    // ฟังก์ชันหลัก
    updateFilters,
    refetch: fetchDeliveries,
    
    // ฟังก์ชันเฉพาะทาง
    fetchActiveDeliveries,
    fetchDelayedDeliveries,
  };
};

// Hook สำหรับดึงข้อมูลการจัดส่งรายการเดียวและการทำงานกับการจัดส่งนั้น
export const useDelivery = (id) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchDelivery = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await deliveryService.getDeliveryById(id);
      setDelivery(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching delivery:", err);
      setError(
        err.response?.data?.message || "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການຈັດສົ່ງໄດ້"
      );
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການຈັດສົ່ງໄດ້",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchDelivery();
  }, [fetchDelivery]);

  // อัปเดตสถานะการจัดส่ง
  const updateStatus = useCallback(async (status, notes = "") => {
    try {
      setLoading(true);
      // ใช้ API endpoint ที่ถูกต้องตาม DeliveriesController
      await deliveryService.updateDeliveryStatus(id, status, notes);
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດສະຖານະການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error updating delivery status:", err);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description:
          err.response?.data?.message || "ບໍ່ສາມາດອັບເດດສະຖານະການຈັດສົ່ງໄດ້",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  // อัปเดตเวลาการจัดส่ง
  const updateTime = useCallback(async (timeUpdateDto) => {
    try {
      setLoading(true);
      // ปรับให้ใช้DTO ที่สอดคล้องกับ backend
      await deliveryService.updateDeliveryTime(id, timeUpdateDto);
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດເວລາການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error updating delivery time:", err);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description:
          err.response?.data?.message || "ບໍ່ສາມາດອັບເດດເວລາການຈັດສົ່ງໄດ້",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  // มอบหมายคนขับรถ
  const assignDriver = useCallback(async (employeeId) => {
    try {
      setLoading(true);
      // ปรับเป็น updateDelivery แทนเพื่อใช้ endpoint ที่มีอยู่
      await deliveryService.updateDelivery(id, { employee_id: employeeId });
      toast({
        title: "ສຳເລັດ",
        description: "ມອບໝາຍຄົນຂັບລົດສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error assigning driver:", err);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description:
          err.response?.data?.message || "ບໍ່ສາມາດມອບໝາຍຄົນຂັບລົດໄດ້",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  // อัปเดตข้อมูลเต็มของการจัดส่ง
  const updateDelivery = useCallback(async (deliveryData) => {
    try {
      setLoading(true);
      await deliveryService.updateDelivery(id, deliveryData);
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດຂໍ້ມູນການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error updating delivery:", err);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description:
          err.response?.data?.message || "ບໍ່ສາມາດອັບເດດຂໍ້ມູນການຈັດສົ່ງໄດ້",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  // ยกเลิกการจัดส่ง
  const cancelDelivery = useCallback(async (reason) => {
    try {
      setLoading(true);
      // ใช้ endpoint อัปเดตสถานะแทน
      await deliveryService.updateDeliveryStatus(id, 'cancelled', reason);
      toast({
        title: "ສຳເລັດ",
        description: "ຍົກເລີກການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error cancelling delivery:", err);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description:
          err.response?.data?.message || "ບໍ່ສາມາດຍົກເລີກການຈັດສົ່ງໄດ້",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  // ลบการจัดส่ง
  const deleteDelivery = useCallback(async () => {
    try {
      setLoading(true);
      await deliveryService.deleteDelivery(id);
      toast({
        title: "ສຳເລັດ",
        description: "ລຶບການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      return true;
    } catch (err) {
      console.error("Error deleting delivery:", err);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description:
          err.response?.data?.message || "ບໍ່ສາມາດລຶບການຈັດສົ່ງໄດ້",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  return {
    delivery,
    loading,
    error,
    fetchDelivery,
    updateStatus,
    updateTime,
    assignDriver,
    updateDelivery,
    cancelDelivery,
    deleteDelivery,
  };
};

// Hook สำหรับสร้างการจัดส่งใหม่
export const useCreateDelivery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const createDelivery = useCallback(async (deliveryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await deliveryService.createDelivery(deliveryData);
      toast({
        title: "ສຳເລັດ",
        description: "ສ້າງການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      return response.data;
    } catch (err) {
      console.error("Error creating delivery:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດສ້າງການຈັດສົ່ງໄດ້";
      setError(errorMessage);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    createDelivery,
    loading,
    error,
  };
};

export default {
  useDeliveries,
  useDelivery,
  useCreateDelivery,
};