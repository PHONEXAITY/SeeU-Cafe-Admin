"use client";

import { useState, useEffect, useCallback } from "react";
import { deliveryService } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

/**
 * Hook สำหรับดึงข้อมูลรายการจัดส่งทั้งหมด
 * @param {Object} initialParams - พารามิเตอร์เริ่มต้นสำหรับการกรองข้อมูลการจัดส่ง
 * @returns {Object} ข้อมูลและฟังก์ชันสำหรับจัดการข้อมูลการจัดส่ง
 */
export const useDeliveries = (initialParams = {}) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const { toast } = useToast();

  /**
   * ดึงข้อมูลการจัดส่งด้วยพารามิเตอร์ที่กำหนด
   * @param {Object} queryParams - พารามิเตอร์เพิ่มเติมสำหรับการกรองข้อมูล
   * @returns {Promise<Array>} ข้อมูลการจัดส่งที่ได้รับ
   */
  const fetchDeliveries = useCallback(async (queryParams = {}) => {
    try {
      setLoading(true);
      // ใช้ params ปัจจุบันผสมกับ queryParams ที่ส่งมา
      const finalParams = { ...params, ...queryParams };
      const response = await deliveryService.getAllDeliveries(finalParams);
      
      // จัดการกับรูปแบบการตอบกลับที่แตกต่างกัน
      let responseData = [];
      let paginationData = {};
      
      if (Array.isArray(response.data)) {
        // กรณีข้อมูลเป็น array โดยตรง
        responseData = response.data;
        paginationData = {
          currentPage: 1,
          totalPages: 1,
          totalItems: response.data.length,
          itemsPerPage: response.data.length
        };
      } else if (response.data && Array.isArray(response.data.data)) {
        // กรณีข้อมูลอยู่ใน data property
        responseData = response.data.data;
        paginationData = {
          currentPage: response.data.current_page || 1,
          totalPages: response.data.last_page || 1,
          totalItems: response.data.total || response.data.data.length,
          itemsPerPage: response.data.per_page || 10
        };
      } else if (response.data && response.data.deliveries && Array.isArray(response.data.deliveries)) {
        // กรณีข้อมูลอยู่ใน deliveries property
        responseData = response.data.deliveries;
        paginationData = {
          currentPage: response.data.pagination?.current_page || 1,
          totalPages: response.data.pagination?.total_pages || 1,
          totalItems: response.data.pagination?.total_items || response.data.deliveries.length,
          itemsPerPage: response.data.pagination?.items_per_page || 10
        };
      } else if (response.data && typeof response.data === 'object') {
        // กรณีไม่ทราบรูปแบบที่แน่นอน แต่มีข้อมูลกลับมา
        console.warn('Unknown delivery data structure:', response.data);
        responseData = [];
      }
      
      const normalizedDeliveries = responseData.map(delivery => {
        // แปลงข้อมูลให้อยู่ในรูปแบบที่ใช้งานได้
        return {
          id: delivery.id,
          order_id: delivery.order_id,
          employee_id: delivery.employee_id,
          employee: delivery.employee,
          status: delivery.status || 'pending',
          delivery_address: delivery.delivery_address,
          customer_note: delivery.customer_note,
          phone_number: delivery.phone_number,
          delivery_fee: delivery.delivery_fee,
          estimated_delivery_time: delivery.estimated_delivery_time,
          actual_delivery_time: delivery.actual_delivery_time,
          pickup_from_kitchen_time: delivery.pickup_from_kitchen_time,
          created_at: delivery.created_at,
          updated_at: delivery.updated_at,
          order: delivery.order,
        };
      });
      
      setDeliveries(normalizedDeliveries);
      setPagination(paginationData);
      setError(null);
      
      return normalizedDeliveries;
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດໂຫຼດລາຍການຈັດສົ່ງໄດ້";
      setError(errorMessage);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [params, toast]);

  // โหลดข้อมูลเมื่อ params เปลี่ยน
  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  /**
   * อัปเดตพารามิเตอร์และโหลดข้อมูลใหม่
   * @param {Object} newParams - พารามิเตอร์ใหม่สำหรับการกรองข้อมูล
   */
  const updateFilters = useCallback((newParams) => {
    setParams(prev => {
      return { ...prev, ...newParams };
    });
  }, []);

  /**
   * ดึงข้อมูลจัดส่งที่กำลังดำเนินการอยู่
   * @returns {Promise<Array>} ข้อมูลการจัดส่งที่กำลังดำเนินการ
   */
  const fetchActiveDeliveries = useCallback(async () => {
    return fetchDeliveries({ status: 'out_for_delivery' });
  }, [fetchDeliveries]);

  /**
   * ดึงข้อมูลจัดส่งที่ล่าช้า
   * @returns {Promise<Array>} ข้อมูลการจัดส่งที่ล่าช้า
   */
  const fetchDelayedDeliveries = useCallback(async () => {
    return fetchDeliveries({ 
      status: ['pending', 'preparing', 'out_for_delivery'],
      delayed: true
    });
  }, [fetchDeliveries]);

  /**
   * กำหนดหน้าสำหรับการแบ่งหน้า
   * @param {number} page - หมายเลขหน้าที่ต้องการ
   */
  const setPage = useCallback((page) => {
    if (page < 1 || page > pagination.totalPages) return;
    updateFilters({ page });
  }, [pagination.totalPages, updateFilters]);

  /**
   * กำหนดจำนวนรายการต่อหน้า
   * @param {number} perPage - จำนวนรายการต่อหน้า
   */
  const setItemsPerPage = useCallback((perPage) => {
    updateFilters({ per_page: perPage, page: 1 });
  }, [updateFilters]);

  return {
    // ข้อมูลหลัก
    deliveries,
    loading,
    error,
    params,
    pagination,
    
    // ฟังก์ชันหลัก
    updateFilters,
    refetch: fetchDeliveries,
    setPage,
    setItemsPerPage,
    
    // ฟังก์ชันเฉพาะทาง
    fetchActiveDeliveries,
    fetchDelayedDeliveries,
  };
};

/**
 * Hook สำหรับดึงข้อมูลการจัดส่งรายการเดียวและการทำงานกับการจัดส่งนั้น
 * @param {string|number} id - ID ของรายการจัดส่ง
 * @returns {Object} ข้อมูลและฟังก์ชันสำหรับจัดการข้อมูลการจัดส่ง
 */
export const useDelivery = (id) => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  /**
   * ดึงข้อมูลการจัดส่งตาม ID
   */
  const fetchDelivery = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await deliveryService.getDeliveryById(id);
      
      // ทำความสะอาดและจัดรูปแบบข้อมูล
      let deliveryData = response.data;
      
      if (deliveryData) {
        // เพิ่มข้อมูลไทม์ไลน์ถ้ายังไม่มี
        if (!deliveryData.order?.timeline && deliveryData.order?.id) {
          try {
            const timelineResponse = await deliveryService.getDeliveryTimeline(id);
            if (timelineResponse.data && deliveryData.order) {
              deliveryData = {
                ...deliveryData,
                order: {
                  ...deliveryData.order,
                  timeline: timelineResponse.data
                }
              };
            }
          } catch (timelineError) {
            console.warn("Could not fetch timeline:", timelineError);
          }
        }
      }
      
      setDelivery(deliveryData);
      setError(null);
    } catch (err) {
      console.error("Error fetching delivery:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນການຈັດສົ່ງໄດ້";
      setError(errorMessage);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchDelivery();
  }, [fetchDelivery]);

  /**
   * อัปเดตสถานะการจัดส่ง
   * @param {string} status - สถานะใหม่
   * @param {string} notes - บันทึกเพิ่มเติม
   * @returns {Promise<boolean>} ผลลัพธ์การอัปเดต
   */
  const updateStatus = useCallback(async (status, notes = "") => {
    try {
      setLoading(true);
      await deliveryService.updateDeliveryStatus(id, status, notes);
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດສະຖານະການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error updating delivery status:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດອັບເດດສະຖານະການຈັດສົ່ງໄດ້";
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  /**
   * อัปเดตเวลาการจัดส่ง
   * @param {Object} timeUpdateDto - ข้อมูลเวลาที่อัปเดต
   * @returns {Promise<boolean>} ผลลัพธ์การอัปเดต
   */
  const updateTime = useCallback(async (timeUpdateDto) => {
    try {
      setLoading(true);
      await deliveryService.updateDeliveryTime(id, timeUpdateDto);
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດເວລາການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error updating delivery time:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດອັບເດດເວລາການຈັດສົ່ງໄດ້";
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  /**
   * มอบหมายคนขับรถ
   * @param {string|number} employeeId - ID ของพนักงานขับรถ
   * @returns {Promise<boolean>} ผลลัพธ์การมอบหมาย
   */
  const assignDriver = useCallback(async (employeeId) => {
    try {
      setLoading(true);
      await deliveryService.assignDriver(id, employeeId);
      toast({
        title: "ສຳເລັດ",
        description: "ມອບໝາຍຄົນຂັບລົດສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error assigning driver:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດມອບໝາຍຄົນຂັບລົດໄດ້";
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  /**
   * อัปเดตข้อมูลเต็มของการจัดส่ง
   * @param {Object} deliveryData - ข้อมูลการจัดส่งใหม่
   * @returns {Promise<boolean>} ผลลัพธ์การอัปเดต
   */
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
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດອັບເດດຂໍ້ມູນການຈັດສົ່ງໄດ້";
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  /**
   * ยกเลิกการจัดส่ง
   * @param {string} reason - เหตุผลในการยกเลิก
   * @returns {Promise<boolean>} ผลลัพธ์การยกเลิก
   */
  const cancelDelivery = useCallback(async (reason) => {
    try {
      setLoading(true);
      await deliveryService.updateDeliveryStatus(id, 'cancelled', reason);
      toast({
        title: "ສຳເລັດ",
        description: "ຍົກເລີກການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error cancelling delivery:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດຍົກເລີກການຈັດສົ່ງໄດ້";
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  /**
   * ลบการจัดส่ง
   * @returns {Promise<boolean>} ผลลัพธ์การลบ
   */
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
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດລຶບການຈັດສົ່ງໄດ້";
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  /**
   * อัพโหลดหลักฐานการจัดส่ง
   * @param {FormData} formData - ข้อมูลรูปภาพหลักฐาน
   * @returns {Promise<Object>} ผลลัพธ์การอัพโหลด
   */
  const uploadDeliveryProof = useCallback(async (formData) => {
    try {
      setLoading(true);
      const response = await deliveryService.uploadDeliveryProof(id, formData);
      toast({
        title: "ສຳເລັດ",
        description: "ອັບໂຫລດຫຼັກຖານການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return response.data;
    } catch (err) {
      console.error("Error uploading delivery proof:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດອັບໂຫລດຫຼັກຖານການຈັດສົ່ງໄດ້";
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

  /**
   * อัปเดตตำแหน่งปัจจุบันของการจัดส่ง
   * @param {number} latitude - ละติจูด
   * @param {number} longitude - ลองจิจูด
   * @returns {Promise<boolean>} ผลลัพธ์การอัปเดต
   */
  const updateLocation = useCallback(async (latitude, longitude) => {
    try {
      setLoading(true);
      await deliveryService.updateDeliveryLocation(id, latitude, longitude);
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error updating delivery location:", err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, fetchDelivery]);

  /**
   * ดึงประวัติตำแหน่งของการจัดส่ง
   * @returns {Promise<Array>} ประวัติตำแหน่ง
   */
  const fetchLocationHistory = useCallback(async () => {
    try {
      const response = await deliveryService.getDeliveryLocations(id);
      return response.data || [];
    } catch (err) {
      console.error("Error fetching delivery locations:", err);
      return [];
    }
  }, [id]);

  /**
   * แจ้งเตือนลูกค้าเกี่ยวกับการจัดส่ง
   * @param {string} notificationType - ประเภทการแจ้งเตือน
   * @param {string} message - ข้อความแจ้งเตือน
   * @returns {Promise<boolean>} ผลลัพธ์การแจ้งเตือน
   */
  const notifyCustomer = useCallback(async (notificationType, message) => {
    try {
      setLoading(true);
      await deliveryService.notifyCustomer(id, notificationType, message);
      toast({
        title: "ສຳເລັດ",
        description: "ສົ່ງການແຈ້ງເຕືອນຫາລູກຄ້າສຳເລັດແລ້ວ",
      });
      return true;
    } catch (err) {
      console.error("Error notifying customer:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດສົ່ງການແຈ້ງເຕືອນຫາລູກຄ້າໄດ້";
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  /**
   * ยืนยันการรับสินค้าจากลูกค้า
   * @param {string} signatureData - ข้อมูลลายเซ็น (ถ้ามี)
   * @param {string} notes - บันทึกเพิ่มเติม
   * @returns {Promise<boolean>} ผลลัพธ์การยืนยัน
   */
  const confirmReceipt = useCallback(async (signatureData, notes) => {
    try {
      setLoading(true);
      await deliveryService.confirmDeliveryReceipt(id, signatureData, notes);
      toast({
        title: "ສຳເລັດ",
        description: "ຢືນຢັນການຮັບສິນຄ້າສຳເລັດແລ້ວ",
      });
      await fetchDelivery();
      return true;
    } catch (err) {
      console.error("Error confirming receipt:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດຢືນຢັນການຮັບສິນຄ້າໄດ້";
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [id, toast, fetchDelivery]);

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
    uploadDeliveryProof,
    updateLocation,
    fetchLocationHistory,
    notifyCustomer,
    confirmReceipt
  };
};

/**
 * Hook สำหรับสร้างการจัดส่งใหม่
 * @returns {Object} ฟังก์ชันและสถานะสำหรับการสร้างการจัดส่ง
 */
export const useCreateDelivery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  /**
   * สร้างการจัดส่งใหม่
   * @param {Object} deliveryData - ข้อมูลการจัดส่ง
   * @returns {Promise<Object>} ข้อมูลการจัดส่งที่สร้าง
   */
  const createDelivery = useCallback(async (deliveryData) => {
    try {
      setLoading(true);
      setError(null);
      
      // ทำความสะอาดข้อมูลก่อนส่ง
      const cleanData = {
        order_id: parseInt(deliveryData.order_id, 10),
        status: deliveryData.status || 'pending',
        delivery_address: deliveryData.delivery_address,
        customer_note: deliveryData.customer_note || '',
        phone_number: deliveryData.phone_number || '',
      };
      
      // เพิ่มข้อมูลเพิ่มเติมถ้ามี
      if (deliveryData.employee_id) {
        cleanData.employee_id = parseInt(deliveryData.employee_id, 10);
      }
      
      if (deliveryData.delivery_fee) {
        cleanData.delivery_fee = parseFloat(deliveryData.delivery_fee);
      }
      
      if (deliveryData.estimated_delivery_time) {
        cleanData.estimated_delivery_time = new Date(deliveryData.estimated_delivery_time).toISOString();
      }
      
      const response = await deliveryService.createDelivery(cleanData);
      
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

/**
 * Hook สำหรับอัปเดตข้อมูลการจัดส่ง
 * @returns {Object} ฟังก์ชันและสถานะสำหรับการอัปเดตการจัดส่ง
 */
export const useUpdateDelivery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  /**
   * อัปเดตข้อมูลการจัดส่ง
   * @param {string|number} id - ID ของการจัดส่ง
   * @param {Object} deliveryData - ข้อมูลการจัดส่งที่อัปเดต
   * @returns {Promise<Object>} ข้อมูลการจัดส่งที่อัปเดต
   */
  const updateDelivery = useCallback(async (id, deliveryData) => {
    try {
      setLoading(true);
      setError(null);
      
      // ทำความสะอาดข้อมูลก่อนส่ง
      const cleanData = {};
      
      if (deliveryData.employee_id !== undefined) {
        cleanData.employee_id = deliveryData.employee_id ? parseInt(deliveryData.employee_id, 10) : null;
      }
      
      if (deliveryData.status !== undefined) {
        cleanData.status = deliveryData.status;
      }
      
      if (deliveryData.delivery_address !== undefined) {
        cleanData.delivery_address = deliveryData.delivery_address;
      }
      
      if (deliveryData.customer_note !== undefined) {
        cleanData.customer_note = deliveryData.customer_note;
      }
      
      if (deliveryData.phone_number !== undefined) {
        cleanData.phone_number = deliveryData.phone_number;
      }
      
      if (deliveryData.delivery_fee !== undefined) {
        cleanData.delivery_fee = deliveryData.delivery_fee ? parseFloat(deliveryData.delivery_fee) : 0;
      }
      
      if (deliveryData.estimated_delivery_time !== undefined) {
        cleanData.estimated_delivery_time = deliveryData.estimated_delivery_time ? 
          new Date(deliveryData.estimated_delivery_time).toISOString() : null;
      }
      
      const response = await deliveryService.updateDelivery(id, cleanData);
      
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      
      return response.data;
    } catch (err) {
      console.error("Error updating delivery:", err);
      const errorMessage = err.response?.data?.message || "ບໍ່ສາມາດອັບເດດການຈັດສົ່ງໄດ້";
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
    updateDelivery,
    loading,
    error,
  };
};

// ส่งออก hooks ทั้งหมด
export default {
  useDeliveries,
  useDelivery,
  useCreateDelivery,
  useUpdateDelivery,
};