'use client'
import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import {AddRoleModal} from './Modals'

const UserRoles = () => {
  const [roles, setRoles] = useState([
    {
      id: '1',
      name: 'Admin',
      permissions: ['create_user', 'edit_user', 'delete_user', 'manage_roles']
    },
    {
      id: '2',
      name: 'Editor',
      permissions: ['edit_user', 'view_users']
    }
  ]);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const handleSaveRole = (newRole) => {
    setRoles([...roles, { id: String(roles.length + 1), ...newRole }]);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">ຕຳແໜ່ງຂອງຜູ້ໃຊ້</h1>
        <button className="flex items-center px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700"
         onClick={() => setAddModalOpen(true)}
         >
          <FaPlus className="mr-2" />
         ເພີ່ມຕຳແໜ່ງ
        </button>
        <AddRoleModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSave={handleSaveRole}
      />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <div key={role.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
              <div className="flex space-x-2">
                <button className="text-blue-600 hover:text-blue-800">
                  <FaEdit className="w-4 h-4" />
                </button>
                <button className="text-red-600 hover:text-red-800">
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">ສິດທິຈັດການ:</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRoles;