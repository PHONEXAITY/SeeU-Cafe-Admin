'use client'
import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSpinner } from 'react-icons/fa';
import { AddRoleModal, EditRoleModal } from './Modals';
import { toast } from 'react-hot-toast';
import { useRoles, useCreateRole, useDeleteRole } from '@/hooks/rolesHooks';

const UserRoles = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // ใช้ hooks ที่สร้างขึ้นมาใหม่
  const { data: roles, isLoading, error } = useRoles();
  const createRoleMutation = useCreateRole();
  const deleteRoleMutation = useDeleteRole();

  const handleSaveRole = (newRole) => {
    createRoleMutation.mutate(newRole);
    setAddModalOpen(false);
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຕຳແໜ່ງນີ້?')) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  // Format permissions for display
  const formatPermission = (permission) => {
    return permission
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-brown-600 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 text-center">
        <h2 className="text-xl text-red-600 mb-2">ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູລຕຳແໜ່ງ</h2>
        <p className="text-gray-600">{error.message || 'ກະລຸນາລອງໃໝ່ອີກຄັ້ງ'}</p>
      </div>
    );
  }

  // ตรวจสอบว่า roles มีค่าหรือไม่
  const rolesList = roles || [];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">ຕຳແໜ່ງຂອງຜູ້ໃຊ້</h1>
        <button 
          className="flex items-center px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700"
          onClick={() => setAddModalOpen(true)}
        >
          <FaPlus className="mr-2" />
          ເພີ່ມຕຳແໜ່ງ
        </button>
      </div>

      {rolesList.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">ບໍ່ມີຕຳແໜ່ງໃນລະບົບເທື່ອ</p>
          <button 
            className="inline-flex items-center px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700"
            onClick={() => setAddModalOpen(true)}
          >
            <FaPlus className="mr-2" />
            ເພີ່ມຕຳແໜ່ງທຳອິດ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rolesList.map((role) => (
            <div key={role.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                <div className="flex space-x-2">
                  <button 
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEditRole(role)}
                    disabled={deleteRoleMutation.isLoading}
                  >
                    <FaEdit className="w-4 h-4" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteRole(role.id)}
                    disabled={deleteRoleMutation.isLoading}
                  >
                    {deleteRoleMutation.isLoading && deleteRoleMutation.variables === role.id ? (
                      <FaSpinner className="w-4 h-4 animate-spin" />
                    ) : (
                      <FaTrash className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">ສິດທິຈັດການ:</h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions && role.permissions.length > 0 ? (
                    role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                      >
                        {formatPermission(permission)}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">ບໍ່ມີສິດທິທີ່ກຳນົດໄວ້</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Role Modal */}
      <AddRoleModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveRole}
      />

      {/* Edit Role Modal */}
      {selectedRole && (
        <EditRoleModal
          role={selectedRole}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedRole(null);
          }}
          onSave={() => {
            setEditModalOpen(false);
            setSelectedRole(null);
          }}
        />
      )}
    </div>
  );
};

export default UserRoles;