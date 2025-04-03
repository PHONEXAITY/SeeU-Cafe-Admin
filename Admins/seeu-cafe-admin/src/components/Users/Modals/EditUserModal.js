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
import { userService } from '@/services/api';
import { toast } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();
  
  
  useEffect(() => {
    if (user) {
      console.log('ข้อมูลผู้ใช้ที่ต้องการแก้ไข:', user);
      
      
      let currentRole = '';
      
      
      if (Array.isArray(user.roles) && user.roles.length > 0) {
        currentRole = typeof user.roles[0] === 'object' ? user.roles[0].id : user.roles[0];
      } 
      
      else if (user.role && typeof user.role === 'object') {
        currentRole = user.role.id;
      } 
      
      else if (user.role) {
        currentRole = user.role;
      }
      
      console.log('บทบาทปัจจุบันที่พบ:', currentRole);
      
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        role: currentRole
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Get user ID
      const userId = user.id;
      console.log('ກຳລັງອັບເດດຜູ້ໃຊ້ ID:', userId);
      
      // Prepare user data
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone || null,
        address: formData.address || null
      };
      
      console.log('ຂໍ້ມູນທີ່ຈະອັບເດດ:', userData);
      
      // Update user basic information
      await updateUser({ 
        id: userId, 
        userData 
      });
      
      // Check if role has changed
      let roleChanged = false;
      let currentRole = '';
      
      if (Array.isArray(user.roles) && user.roles.length > 0) {
        currentRole = typeof user.roles[0] === 'object' ? user.roles[0].id : user.roles[0];
      } else if (user.role && typeof user.role === 'object') {
        currentRole = user.role.id;
      } else if (user.role) {
        currentRole = user.role;
      }
      
      // Only update role if it has changed
      if (formData.role && formData.role !== currentRole) {
        roleChanged = true;
        try {
          console.log('ກຳລັງອັບເດດຕຳແໜ່ງເປັນ:', formData.role);
          
          // Use the role service to update user role
          await userService.changeUserRole(userId, formData.role);
          
          // Invalidate queries to refresh data
          queryClient.invalidateQueries(['users']);
          queryClient.invalidateQueries(['user', userId]);
          queryClient.invalidateQueries(['userRoles']);
          
          console.log('ອັບເດດຕຳແໜ່ງສຳເລັດ');
        } catch (roleError) {
          console.error('ບໍ່ສາມາດອັບເດດຕຳແໜ່ງ:', roleError);
          toast.error('ອັບເດດຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດ ແຕ່ບໍ່ສາມາດອັບເດດຕຳແໜ່ງໄດ້');
        }
      }
      
      // Show success message
      toast.success(roleChanged 
        ? 'ອັບເດດຂໍ້ມູນຜູ້ໃຊ້ ແລະ ຕຳແໜ່ງສຳເລັດແລ້ວ' 
        : 'ອັບເດດຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດແລ້ວ'
      );
      
      onClose();
      
      // Call onSave callback with updated user data
      if (onSave) {
        onSave({
          ...user,
          ...userData,
          role: formData.role,
          roles: [formData.role]  
        });
      }
    } catch (error) {
      console.error('ເກີດຂໍ້ຜິດພາດໃນການອັບເດດຜູ້ໃຊ້:', error);
      let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດຜູ້ໃຊ້';
      
      if (error.response?.status === 400 && Array.isArray(error.response.data.message)) {
        errorMessage = error.response.data.message.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  const getRoles = () => {
    if (rolesData && Array.isArray(rolesData)) {
      return rolesData;
    } else if (rolesData && rolesData.data && Array.isArray(rolesData.data)) {
      return rolesData.data;
    } else {
      return [
        { id: 'admin', name: 'ผู้ดูแลระบบ (Admin)' },
        { id: 'staff', name: 'พนักงานทั่วไป' },
        { id: 'customer', name: 'ลูกค้า' }
      ];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-['Phetsarath_OT']">ແກ້ໄຂຜູ້ໃຊ້ລະບົບ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 font-['Phetsarath_OT']">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ຊື່
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
                ນາມສະກຸນ
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
              ອີເມວ
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
              ເບີໂທລະສັບ
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
              ທີ່ຢູ່
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
              ຕຳແໜ່ງ
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              disabled={isLoadingRoles}
            >
              {isLoadingRoles ? (
                <option>ກຳລັງໂຫລດຂໍ້ມູນ...</option>
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
              ຍົກເລີກ
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  ກຳລັງບັນທຶກ...
                </>
              ) : (
                'ບັນທຶກການປ່ຽນແປງ'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;