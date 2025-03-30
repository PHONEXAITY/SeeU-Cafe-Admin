'use client'
import React, { useState, useEffect } from 'react';
import { FaUserEdit, FaTrash, FaSearch, FaUserPlus, FaFilter, FaSpinner } from 'react-icons/fa';
import { useUsers, useDeleteUser, getUserRoleColor, getUserStatusColor } from '@/hooks/userHooks';
import { EditUserModal, DeleteUserModal } from './Modals';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import Link from 'next/link';

const UserList = () => {
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Build filter object for API
  const filters = {
    search: searchTerm,
    role,
    page,
    limit,
    sortBy: 'createdAt',
    sortDir: 'desc'
  };

  // Fetch users with filters
  const { 
    data: usersData, 
    isLoading: isLoadingUsers,
    isError: isUsersError,
    error: usersError
  } = useUsers(filters);

  // Delete user mutation
  const { mutate: deleteUser, isLoading: isDeleting } = useDeleteUser();

  // Handle search input changes with debounce
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  // Handle role filter changes
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  // Handle edit user
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  // Handle delete user
  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };

  // Handle save edit
  const handleSaveEdit = async (updatedUser) => {
    try {
      // API handling is done within the modal using our hooks
      setEditModalOpen(false);
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id, {
        onSuccess: () => {
          setDeleteModalOpen(false);
          setSelectedUser(null);
        }
      });
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page on limit change
  };

  if (isUsersError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-red-600 mb-2">Error loading users</h2>
        <p className="text-gray-600">{usersError?.message || 'Please try again later'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">ການຈັດການຜູ້ໃຊ້ລະບົບ</h1>
        <Link href="/users/create">
          <Button className="flex items-center gap-2">
            <FaUserPlus className="w-4 h-4" />
            ສ້າງຜູ້ໃຊ້ໃໝ່
          </Button>
        </Link>
      </div>
      
      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="ຄົ້ນຫາຜູ້ໃຊ້ລະບົບ"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Role Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brown-500 focus:border-brown-500"
            value={role}
            onChange={handleRoleChange}
          >
            <option value="">ທຸກຕຳແໜ່ງ</option>
            <option value="admin">ຜູ້ດູແລລະບົບ</option>
            <option value="manager">ຜູ້ຈັດການ</option>
            <option value="staff">ພະນັກງານ</option>
            <option value="user">ຜູ້ໃຊ້ທົ່ວໄປ</option>
          </select>
        </div>

        {/* Items per page */}
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">ສະແດງ:</span>
          <select
            className="border border-gray-300 rounded-md focus:outline-none focus:ring-brown-500 focus:border-brown-500 p-2"
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-gray-600 ml-2">ຕໍ່ໜ້າ</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">ຊື່</th>
              <th className="px-4 py-2 text-left hidden sm:table-cell">ອີເມວ</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">ຕຳແໜ່ງ</th>
              <th className="px-4 py-2 text-left hidden lg:table-cell">ສະຖານະ</th>
              <th className="px-4 py-2 text-left hidden lg:table-cell">ສ້າງວັນທີ</th>
              <th className="px-4 py-2 text-right">ການຈັດການ</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingUsers ? (
              // Loading state
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <FaSpinner className="w-6 h-6 mr-2 animate-spin text-brown-600" />
                    <span>ກຳລັງໂຫລດຂໍ້ມູນຜູ້ໃຊ້...</span>
                  </div>
                </td>
              </tr>
            ) : usersData?.users?.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  <p className="text-gray-500">ບໍ່ພົບຂໍ້ມູນຜູ້ໃຊ້</p>
                  <Link href="/users/create">
                    <Button className="mt-2">ສ້າງຜູ້ໃຊ້ລາຍແລກ</Button>
                  </Link>
                </td>
              </tr>
            ) : (
              // Users list
              usersData?.users?.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500 sm:hidden">{user.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUserRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUserStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('lo-LA')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEdit(user)}
                      disabled={isDeleting}
                    >
                      <FaUserEdit className="w-5 h-5" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(user)}
                      disabled={isDeleting}
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {usersData?.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            ສະແດງ {(page - 1) * limit + 1} ຫາ {Math.min(page * limit, usersData?.totalItems)} ຈາກທັງໝົດ {usersData?.totalItems} ຄົນ
          </div>
          <div className="flex space-x-1">
            <Button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              variant="outline"
              size="sm"
            >
              «
            </Button>
            <Button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              variant="outline"
              size="sm"
            >
              ‹
            </Button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, usersData?.totalPages) }, (_, i) => {
              let pageNum;
              if (usersData?.totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= usersData?.totalPages - 2) {
                pageNum = usersData?.totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === usersData?.totalPages}
              variant="outline"
              size="sm"
            >
              ›
            </Button>
            <Button
              onClick={() => handlePageChange(usersData?.totalPages)}
              disabled={page === usersData?.totalPages}
              variant="outline"
              size="sm"
            >
              »
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <EditUserModal 
        user={selectedUser}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
      />

      <DeleteUserModal
        user={selectedUser}
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onDelete={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default UserList;