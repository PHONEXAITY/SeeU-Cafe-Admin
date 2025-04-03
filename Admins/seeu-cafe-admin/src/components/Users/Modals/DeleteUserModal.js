'use client'
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FaSpinner } from 'react-icons/fa';

const DeleteUserModal = ({ user, isOpen, onClose, onDelete, isLoading }) => {
  // Format user name for display
  const formatName = () => {
    if (!user) return '';
    
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    } else if (user.first_name) {
      return user.first_name;
    } else if (user.name) {
      return user.name;
    } else if (user.email) {
      return user.email;
    } else {
      return 'ຜູ້ໃຊ້ລະບົບ';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-['Phetsarath_OT']">ລຶບຜູ້ໃຊ້ລະບົບ</DialogTitle>
        </DialogHeader>
        <div className="mt-4 font-['Phetsarath_OT']">
          <p className="text-gray-600">
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບຜູ້ໃຊ້ <span className="font-semibold">{formatName()}</span>? 
            ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບຄືນໄດ້.
          </p>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            onClick={onDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                ກຳລັງລຶບ...
              </>
            ) : (
              'ລຶບ'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;