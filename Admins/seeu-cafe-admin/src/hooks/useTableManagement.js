"use client";

import { useState, useEffect, useCallback } from "react";
import { tableService } from "@/services/api";
import { toast } from "react-hot-toast";

export const useTableManagement = (initialFilter = null) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(initialFilter);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshTables = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        setLoading(true);
        setError(null);
        let response;

        if (filter && filter.status && filter.status !== 'all') {
          response = await tableService.getAllTables(filter.status);
        } else if (filter && filter.capacity) {
          response = await tableService.getAvailableTables(filter.capacity);
        } else {
          response = await tableService.getAllTables();
        }

        // ตรวจสอบโครงสร้างข้อมูลที่ได้รับจาก API
        console.log("API Response:", response);
        
        // ตรวจสอบว่าข้อมูลอยู่ใน property ใด หรือเป็น Array โดยตรง
        let tableData = response;
        
        // ถ้า response เป็น Object และมี data property
        if (response && typeof response === 'object' && !Array.isArray(response) && response.data) {
          tableData = response.data;
        }
        
        // ตรวจสอบว่าข้อมูลเป็น Array
        if (!Array.isArray(tableData)) {
          console.error("Table data is not an array:", tableData);
          setError("ข้อมูลโต๊ะไม่อยู่ในรูปแบบที่ถูกต้อง");
          setTables([]);
          return;
        }

        // Normalize data format - ensure property names are consistent
        const normalizedTables = tableData.map(table => ({
          id: table.id,
          number: table.number,
          capacity: table.capacity,
          status: table.status,
          table_id: table.table_id || '',
          created_at: table.created_at || table.createdAt || '',
          updated_at: table.updated_at || table.updatedAt || '',
          current_session_start: table.current_session_start || null,
          expected_end_time: table.expected_end_time || null,
        }));

        console.log("Normalized Tables:", normalizedTables);
        setTables(normalizedTables);
      } catch (err) {
        console.error("Error fetching tables:", err);
        setError(err.message || "ไม่สามารถโหลดข้อมูลโต๊ะได้");
        toast.error("ไม่สามารถโหลดข้อมูลโต๊ะได้");
        setTables([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [filter, refreshTrigger]);

  const getTableById = async (id) => {
    try {
      setLoading(true);
      const response = await tableService.getTableById(id);
      // ตรวจสอบว่าข้อมูลอยู่ใน property ใด
      const tableData = response?.data || response;
      return tableData;
    } catch (err) {
      console.error(`Error fetching table ${id}:`, err);
      toast.error(`ไม่สามารถโหลดข้อมูลโต๊ะ #${id} ได้`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTable = async (tableData) => {
    try {
      setLoading(true);
      
      // Ensure we only send fields that are in the schema
      const sanitizedData = {
        number: tableData.number,
        capacity: tableData.capacity,
        status: tableData.status || 'available'
      };
      
      const response = await tableService.createTable(sanitizedData);
      toast.success("สร้างโต๊ะใหม่สำเร็จ");
      refreshTables();
      return response?.data || response;
    } catch (err) {
      console.error("Error creating table:", err);
      toast.error(err.message || "ไม่สามารถสร้างโต๊ะใหม่ได้");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTable = async (id, tableData) => {
    try {
      setLoading(true);
      
      // Ensure we only send fields that are in the schema
      const sanitizedData = {
        ...(tableData.number !== undefined && { number: tableData.number }),
        ...(tableData.capacity !== undefined && { capacity: tableData.capacity }),
        ...(tableData.status !== undefined && { status: tableData.status })
      };
      
      const response = await tableService.updateTable(id, sanitizedData);
      toast.success("อัปเดตข้อมูลโต๊ะสำเร็จ");
      refreshTables();
      return response?.data || response;
    } catch (err) {
      console.error(`Error updating table ${id}:`, err);
      toast.error(err.message || "ไม่สามารถอัปเดตข้อมูลโต๊ะได้");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTableStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await tableService.updateTableStatus(id, status);
      toast.success(`อัปเดตสถานะโต๊ะเป็น "${status}" สำเร็จ`);
      refreshTables();
      return response?.data || response;
    } catch (err) {
      console.error(`Error updating table ${id} status:`, err);
      toast.error(err.message || "ไม่สามารถอัปเดตสถานะโต๊ะได้");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTableTime = async (id, timeData) => {
    try {
      setLoading(true);
      
      // Ensure the data matches the DTO format expected by the backend
      const sanitizedTimeData = {
        expectedEndTime: timeData.expectedEndTime,
        notifyCustomers: timeData.notifyCustomers,
        notificationMessage: timeData.notificationMessage
      };
      
      const response = await tableService.updateTableTime(id, sanitizedTimeData);
      toast.success("อัปเดตเวลาโต๊ะสำเร็จ");
      refreshTables();
      return response?.data || response;
    } catch (err) {
      console.error(`Error updating table ${id} time:`, err);
      toast.error(err.message || "ไม่สามารถอัปเดตเวลาโต๊ะได้");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const startTableSession = async (id) => {
    try {
      setLoading(true);
      const response = await tableService.startTableSession(id);
      toast.success("เริ่มการใช้งานโต๊ะสำเร็จ");
      refreshTables();
      return response?.data || response;
    } catch (err) {
      console.error(`Error starting session for table ${id}:`, err);
      toast.error(err.message || "ไม่สามารถเริ่มการใช้งานโต๊ะได้");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const endTableSession = async (id) => {
    try {
      setLoading(true);
      const response = await tableService.endTableSession(id);
      toast.success("สิ้นสุดการใช้งานโต๊ะสำเร็จ");
      refreshTables();
      return response?.data || response;
    } catch (err) {
      console.error(`Error ending session for table ${id}:`, err);
      toast.error(err.message || "ไม่สามารถสิ้นสุดการใช้งานโต๊ะได้");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTable = async (id) => {
    try {
      setLoading(true);
      await tableService.deleteTable(id);
      toast.success("ลบโต๊ะสำเร็จ");
      refreshTables();
    } catch (err) {
      console.error(`Error deleting table ${id}:`, err);
      toast.error(err.message || "ไม่สามารถลบโต๊ะได้");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tables,
    loading,
    error,
    setFilter,
    getTableById,
    createTable,
    updateTable,
    updateTableStatus,
    updateTableTime,
    startTableSession,
    endTableSession,
    deleteTable,
    refreshTables,
  };
};