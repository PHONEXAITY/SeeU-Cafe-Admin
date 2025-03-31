'use client'
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useUpdateUser, useUserRoles } from '@/hooks/userHooks';
import { userService } from '@/services/api'; // Import เพื่อใช้งาน API โดยตรง
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const EditUserModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    role: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: updateUser } = useUpdateUser();
  const { data: rolesData, isLoading: isLoadingRoles } = useUserRoles();
  
  // อัพเดทข้อมูลฟอร์มเมื่อผู้ใช้เปลี่ยน
  useEffect(() => {
    if (user) {
      console.log('ข้อมูลผู้ใช้ที่ต้องการแก้ไข:', user);
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        role: Array.isArray(user.roles) && user.roles.length > 0 
          ? user.roles[0] 
          : (typeof user.role === 'object' ? user.role.id : user.role) || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // ตรวจสอบ ID ของผู้ใช้
      const userId = user.id;
      console.log('ID ผู้ใช้ที่ต้องการอัพเดท:', userId, '(ประเภท:', typeof userId, ')');
      
      // เตรียมข้อมูลสำหรับอัพเดทข้อมูลพื้นฐาน (ไม่รวมตำแหน่ง)
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address || null
        // ไม่รวม role เพราะจะอัพเดทแยกต่างหาก
      };
      
      console.log('อัพเดทข้อมูลพื้นฐานผู้ใช้ด้วยข้อมูล:', userData);
      
      // ขั้นตอนที่ 1: อัพเดทข้อมูลพื้นฐาน
      await updateUser({ 
        id: userId, 
        userData 
      });
      
      // ขั้นตอนที่ 2: ตรวจสอบว่าต้องอัพเดทตำแหน่งหรือไม่
      const originalRole = Array.isArray(user.roles) && user.roles.length > 0 
        ? user.roles[0] 
        : (typeof user.role === 'object' ? user.role.id : user.role) || '';
        
      console.log('ตำแหน่งเดิม:', originalRole, 'ตำแหน่งใหม่:', formData.role);
      
      if (formData.role && formData.role !== originalRole) {
        try {
          console.log('กำลังอัพเดทตำแหน่งผ่าน POST /roles/assign:', {
            userId: userId,
            roleId: formData.role
          });
          
          // เรียกใช้ changeUserRole ที่แก้ไขแล้ว
          const roleResponse = await userService.changeUserRole(userId, formData.role);
          
          console.log('อัพเดทตำแหน่งสำเร็จ:', roleResponse);
        } catch (roleError) {
          console.error('ไม่สามารถอัพเดทตำแหน่งได้:', roleError);
          
          // แสดงข้อมูลข้อผิดพลาดโดยละเอียด
          if (roleError.response) {
            console.error('สถานะข้อผิดพลาด:', roleError.response.status);
            console.error('ข้อความข้อผิดพลาด:', roleError.response.data);
            console.error('URL ที่เรียก:', roleError.config?.url);
            console.error('วิธีการ:', roleError.config?.method);
            console.error('ข้อมูลที่ส่ง:', roleError.config?.data);
          }
          
          toast.error('อัพเดทข้อมูลผู้ใช้สำเร็จ แต่ไม่สามารถอัพเดทตำแหน่งได้');
        }
      }
      
      // สำเร็จ!
      toast.success('อัพเดทผู้ใช้สำเร็จ');
      onClose();
      onSave({...userData, role: formData.role});
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัพเดทผู้ใช้:', error);
      
      // แสดงข้อมูลข้อผิดพลาดโดยละเอียด
      if (error.response) {
        console.error('รายละเอียดข้อผิดพลาด API:', {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url,
          method: error.config?.method
        });
      }
      
      // แสดงข้อความข้อผิดพลาดที่เหมาะสม
      let errorMessage = 'เกิดข้อผิดพลาดในการอัพเดทผู้ใช้';
      
      if (error.response?.status === 404) {
        errorMessage = 'ไม่พบข้อมูลผู้ใช้ที่ระบุ (404)';
      } else if (error.response?.status === 400) {
        // จัดรูปแบบข้อความข้อผิดพลาดการตรวจสอบความถูกต้อง
        if (Array.isArray(error.response.data.message)) {
          errorMessage = `ข้อมูลไม่ถูกต้อง: ${error.response.data.message.join(', ')}`;
        } else if (error.response.data.message) {
          errorMessage = `ข้อมูลไม่ถูกต้อง: ${error.response.data.message}`;
        }
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        errorMessage = 'คุณไม่มีสิทธิ์ในการอัพเดทผู้ใช้นี้';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ฟังก์ชันช่วยเหลือสำหรับการดึงตำแหน่งที่มีอยู่
  const getRoles = () => {
    if (rolesData && Array.isArray(rolesData)) {
      return rolesData;
    } else if (rolesData && rolesData.data && Array.isArray(rolesData.data)) {
      return rolesData.data;
    } else {
      return [
        { id: 1, name: 'ผู้ดูแลระบบ (Admin)' },
        { id: 2, name: 'พนักงานทั่วไป' },
        { id: 3, name: 'ลูกค้า' }
      ];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-['Phetsarath_OT']">แก้ไขผู้ใช้ระบบ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 font-['Phetsarath_OT']">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อ
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                นามสกุล
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              อีเมล
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ที่อยู่
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows="2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ตำแหน่ง
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={isLoadingRoles}
            >
              {isLoadingRoles ? (
                <option>กำลังโหลดข้อมูล...</option>
              ) : (
                getRoles().map((role) => (
                  <option key={role.id || role.value} value={role.id || role.value}>
                    {role.name || role.label}
                  </option>
                ))
              )}
            </select>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              ยกเลิก
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  กำลังบันทึก...
                </>
              ) : (
                'บันทึกการเปลี่ยนแปลง'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;