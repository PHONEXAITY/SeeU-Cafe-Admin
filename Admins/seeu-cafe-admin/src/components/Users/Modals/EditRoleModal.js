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
import { useUpdateRole } from '@/hooks/rolesHooks';
import { FaSpinner } from 'react-icons/fa';

const EditRoleModal = ({ role, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    permissions: []
  });

  const [errors, setErrors] = useState({});
  
  // ใช้ hook useUpdateRole
  const updateRoleMutation = useUpdateRole();

  // Update form data when role changes
  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name || '',
        permissions: role.permissions || []
      });
    }
  }, [role]);

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
      // ใช้ updateRoleMutation จาก hook
      updateRoleMutation.mutate(
        { 
          id: role.id, 
          roleData: formData 
        },
        {
          onSuccess: () => {
            onClose();
            if (onSave) onSave();
          }
        }
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] font-['Phetsarath_OT']">
        <DialogHeader>
          <DialogTitle>ແກ້ໄຂຕຳແໜ່ງ</DialogTitle>
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
              onClick={onClose}
              disabled={updateRoleMutation.isLoading}
            >
              ຍົກເລີກ
            </Button>
            <Button 
              type="submit" 
              className="bg-brown-600 hover:bg-brown-700 text-white"
              disabled={updateRoleMutation.isLoading}
            >
              {updateRoleMutation.isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  ກຳລັງອັບເດດ...
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

export default EditRoleModal;