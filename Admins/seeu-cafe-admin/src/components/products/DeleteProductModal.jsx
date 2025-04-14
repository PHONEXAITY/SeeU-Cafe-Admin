// DeleteProductModal.jsx
import React, { useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const DeleteProductModal = ({
  isOpen,
  onClose,
  productToDelete,
  isDeleting,
  deleteFoodProduct,
  deleteBeverageProduct
}) => {
  // Reference to element that will receive focus when dialog closes
  const previousFocusRef = useRef(null);

  // Save the currently focused element when dialog opens
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Ensure focus is restored before the parent component's onClose is called
  const handleSafeClose = (open) => {
    // ปิด modal เฉพาะเมื่อมีการเปลี่ยนสถานะเป็น false
    if (open === false) {
      if (previousFocusRef.current) {
        setTimeout(() => {
          previousFocusRef.current.focus();
        }, 0);
      }
      onClose();
    }
  };

  // Only render if we have a product to delete
  if (!productToDelete) return null;

  const handleDeleteConfirmed = () => {
    const deleteFn =
      productToDelete.type === "food"
        ? deleteFoodProduct
        : deleteBeverageProduct;
    
    deleteFn(productToDelete.id, {
      onSuccess: () => {
        handleSafeClose();
        toast.success(
          productToDelete.type === "food"
            ? "ລຶບສິນຄ້າອາຫານສຳເລັດ"
            : "ລຶບສິນຄ້າເຄື່ອງດື່ມສຳເລັດ"
        );
      },
      onError: (error) => {
        // More detailed error handling
        const statusCode = error.response?.status;
        let errorMsg = `ລຶບສິນຄ້າລົ້ມເຫລວ: ${error.message}`;
        
        if (statusCode === 404) {
          errorMsg = "ບໍ່ພົບສິນຄ້ານີ້ໃນລະບົບ, ອາດຖືກລຶບໄປແລ້ວ";
          // Close the modal anyway since the item doesn't exist
          handleSafeClose();
        }
        
        toast.error(errorMsg);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          // Only handle closing, not opening
          if (previousFocusRef.current) {
            setTimeout(() => {
              previousFocusRef.current.focus();
            }, 0);
          }
          onClose();
        }
      }}>
      <DialogContent 
        className="sm:max-w-[450px] font-['Phetsarath_OT']"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">ຢືນຢັນການລຶບ</DialogTitle>
          <DialogDescription>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບສິນຄ້ານີ້?{" "}
            <span className="font-medium">"{productToDelete.name}"</span>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-red-600">
            ການກະທຳນີ້ບໍ່ສາມາດຍົກເລີກໄດ້ ແລະ
            ຂໍ້ມູນທັງໝົດຂອງສິນຄ້ານີ້ຈະຖືກລຶບຖາວອນ.
          </p>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleSafeClose}
          >
            ຍົກເລີກ
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteConfirmed}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> ກຳລັງລຶບ...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" /> ລຶບສິນຄ້າ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};