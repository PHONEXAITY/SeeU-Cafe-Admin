import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, AlertCircle, Trash2 } from 'lucide-react';

const DOCUMENT_TYPES = [
  { value: "id_card", label: "ບັດປະຈຳຕົວ" },
  { value: "passport", label: "ໜັງສືຜ່ານແດນ" },
  { value: "driver_license", label: "ໃບຂັບຂີ່" },
  { value: "education", label: "ໃບຢັ້ງຢືນການສຶກສາ" },
  { value: "contract", label: "ສັນຍາການຈ້າງງານ" },
  { value: "medical", label: "ໃບຢັ້ງຢືນແພດ" },
  { value: "other", label: "ອື່ນໆ" },
];

export default function DeleteDialog({ deleteDocument, deleteConfirm, setDeleteConfirm, selectedDocument }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;
    
    try {
      setIsDeleting(true);
      await deleteDocument(selectedDocument.id);
      setDeleteConfirm(false);
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDocumentTypeLabel = (type) => {
    return DOCUMENT_TYPES.find(doc => doc.value === type)?.label || type;
  };

  return (
    <Dialog open={deleteConfirm} onOpenChange={setDeleteConfirm}>
      <DialogContent className="sm:max-w-[400px] font-['Phetsarath_OT']">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            ຢືນຢັນການລຶບ
          </DialogTitle>
          <DialogDescription>
            ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>ຄຳເຕືອນ</AlertTitle>
            <AlertDescription>
              ທ່ານແນ່ໃຈທີ່ຈະລຶບເອກະສານ{' '}
              <span className="font-medium">
                {selectedDocument ? getDocumentTypeLabel(selectedDocument.document_type) : ''}
              </span>{' '}
              ບໍ່?
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setDeleteConfirm(false)}
            disabled={isDeleting}
          >
            ຍົກເລີກ
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDeleteDocument}
            className="gap-2"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="animate-spin">⏳</span>
                ກຳລັງລຶບ...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                ຢືນຢັນການລຶບ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}