"use client";

import { useRouter } from 'next/navigation';
import { 
  Edit, 
  Trash2, 
  Clock, 
  Play, 
  Square, 
  CheckCircle, 
  Calendar, 
  X 
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import TimeUpdateModal from './TimeUpdateModal';
import { useTableManagement } from '@/hooks/useTableManagement';

const TableActionMenu = ({ 
  table, 
  onClose, 
  onStatusChange,
  onStartSession,
  onEndSession 
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const router = useRouter();
  const { deleteTable } = useTableManagement();

  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await deleteTable(table.id);
        router.refresh();
      } catch (error) {
      }
    } else {
      setConfirmDelete(true);
    }
  };

  const getAvailableStatusChanges = (currentStatus) => {
    switch (currentStatus) {
      case 'available':
        return [
          { value: 'reserved', label: 'ຈອງແລ້ວ', icon: Calendar },
        ];
      case 'reserved':
        return [
          { value: 'available', label: 'ພ້ອມໃຊ້ງານ', icon: CheckCircle },
          { value: 'occupied', label: 'ກຳລັງໃຊ້ງານ', icon: Play },
        ];
      case 'occupied':
        return [
          { value: 'available', label: 'ພ້ອມໃຊ້ງານ', icon: CheckCircle },
        ];
      default:
        return [];
    }
  };

  const statusOptions = getAvailableStatusChanges(table.status);

  return (
    <>
      <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="py-1" role="menu">
          <button
            onClick={() => {
              router.push(`/tables/${table.id}`);
              onClose();
            }}
            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Edit size={16} className="mr-2" />
            ແກ້ໄຂຂໍ້ມູນ
          </button>

          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onStatusChange(table.id, option.value);
                onClose();
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <option.icon size={16} className="mr-2" />
              ປ່ຽນເປັນ{option.label}
            </button>
          ))}

          {table.status === 'available' && (
            <button
              onClick={() => {
                onStartSession(table.id);
                onClose();
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Play size={16} className="mr-2" />
              ເລີ່ມໃຊ້ງານໂຕະ
            </button>
          )}

          {table.status === 'occupied' && (
            <>
              <button
                onClick={() => {
                  setShowTimeModal(true);
                  onClose();
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Clock size={16} className="mr-2" />
                ອັບເດດເວລາ
              </button>

              <button
                onClick={() => {
                  onEndSession(table.id);
                  onClose();
                }}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Square size={16} className="mr-2" />
                ສິ້ນສຸດການໃຊ້ງານ
              </button>
            </>
          )}

          <div className="my-1 h-px bg-gray-200"></div>

          <button
            onClick={handleDelete}
            className={`flex w-full items-center px-4 py-2 text-sm ${
              confirmDelete ? 'text-red-600 font-medium' : 'text-gray-700'
            } hover:bg-gray-100`}
          >
            {confirmDelete ? (
              <>
                <X size={16} className="mr-2" />
                ຢືນຢັນການລຶບ?
              </>
            ) : (
              <>
                <Trash2 size={16} className="mr-2" />
                ລຶບໂຕະ
              </>
            )}
          </button>
        </div>
      </div>

      {showTimeModal && (
        <TimeUpdateModal 
          tableId={table.id}
          currentEndTime={table.expected_end_time}
          onClose={() => setShowTimeModal(false)}
        />
      )}
    </>
  );
};

export default TableActionMenu;