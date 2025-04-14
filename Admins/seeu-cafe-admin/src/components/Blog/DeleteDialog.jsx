'use client';

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { FaTrash, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

export default function DeleteDialog({ isOpen, title, onClose, onConfirm, loading }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-['Phetsarath_OT'] dark:bg-gray-900 dark:text-white">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <FaExclamationTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold dark:text-white">
            ຢືນຢັນການລຶບ
          </DialogTitle>
          <DialogDescription className="text-center dark:text-gray-300 text-base">
            ທ່ານແນ່ໃຈບໍ່ທີ່ຈະລຶບບົດຄວາມນີ້? ການກະທຳນີ້ບໍ່ສາມາດກັບຄືນໄດ້.
          </DialogDescription>
        </DialogHeader>
        
        <AnimatePresence>
          {title && (
            <motion.div 
              className="my-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-center font-medium text-gray-900 dark:text-white break-words text-lg">
                {title}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-3 sm:gap-0 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={loading}
            className="mt-3 sm:mt-0 text-base hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label="ຍົກເລີກການລຶບ"
          >
            <FaTimes className="mr-2 h-4 w-4" />
            ຍົກເລີກ
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={loading}
            className="flex items-center justify-center gap-2 text-base font-medium bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 shadow-sm transition-colors duration-200"
            aria-label="ຢືນຢັນການລຶບ"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                ກຳລັງລຶບ...
              </>
            ) : (
              <>
                <FaTrash className="h-5 w-5" />
                ລຶບຖາວອນ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}