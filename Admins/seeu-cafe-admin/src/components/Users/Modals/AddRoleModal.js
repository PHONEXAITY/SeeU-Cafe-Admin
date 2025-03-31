'use client'
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCreateRole } from '@/hooks/rolesHooks';
import { FaSpinner } from 'react-icons/fa';

const AddRoleModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });

  const [errors, setErrors] = useState({});
  
  // ใช้ hook useCreateRole
  const createRoleMutation = useCreateRole();

  const availablePermissions = [
    'create_user',
    'edit_user',
    'delete_user',
    'manage_roles',
    'view_users',
    'manage_products',
    'view_orders',
    'manage_orders',
    'view_reports',
    'manage_settings'
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'ຊື່ຂອງຕຳແໜ່ງຈຳເປັນຕ້ອງລະບຸ';
    }
    if (formData.permissions.length === 0) {
      newErrors.permissions = 'ຕ້ອງເລືອກຢ່າງໜ້ອຍໜຶ່ງສິດທິ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
    if (errors.permissions) {
      setErrors(prev => ({ ...prev, permissions: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // ใช้ createRoleMutation จาก hook
      createRoleMutation.mutate(formData, {
        onSuccess: () => {
          onClose();
          if (onSave) onSave(formData);
          // รีเซ็ตฟอร์ม
          setFormData({
            name: '',
            permissions: []
          });
          setErrors({});
        }
      });
    }
  };

  const handleClose = () => {
    onClose();
    // รีเซ็ตฟอร์มเมื่อปิด
    setFormData({
      name: '',
      permissions: []
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] font-['Phetsarath_OT']">
        <DialogHeader>
          <DialogTitle>ເພີ່ມຕຳແໜ່ງໃໝ່</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ຊື່ຂອງຕຳແໜ່ງ
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-brown-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ສິດທິຈັດການ
            </label>
            <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-md p-3">
              {availablePermissions.map(permission => (
                <label key={permission} className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionChange(permission)}
                    className="rounded border-gray-300 text-brown-600 focus:ring-brown-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
            {errors.permissions && (
              <p className="mt-1 text-sm text-red-500">{errors.permissions}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={createRoleMutation.isLoading}
            >
              ຍົກເລີກ
            </Button>
            <Button 
              type="submit" 
              className="bg-brown-600 hover:bg-brown-700 text-white"
              disabled={createRoleMutation.isLoading}
            >
              {createRoleMutation.isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  ກຳລັງສ້າງ...
                </>
              ) : (
                'ສ້າງຕຳແໜ່ງ'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRoleModal;