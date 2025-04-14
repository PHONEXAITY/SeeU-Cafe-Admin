'use client'
import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import useEmployees from '@/hooks/useEmployees';

// UI Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

// Icons
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Eye,
  Calendar,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  X,
  FileIcon,
  FilePlus,
  FileQuestion,
  PlusCircle,
  Search,
  Clock,
  FileText2,
  FileType2,
  Shield,
} from 'lucide-react';

// Document types definition for dropdown options
const DOCUMENT_TYPES = [
  { value: "id_card", label: "ບັດປະຈຳຕົວ" },
  { value: "passport", label: "ໜັງສືຜ່ານແດນ" },
  { value: "driver_license", label: "ໃບຂັບຂີ່" },
  { value: "education", label: "ໃບຢັ້ງຢືນການສຶກສາ" },
  { value: "contract", label: "ສັນຍາການຈ້າງງານ" },
  { value: "medical", label: "ໃບຢັ້ງຢືນແພດ" },
  { value: "other", label: "ອື່ນໆ" },
];

const EmployeeDocuments = ({ employeeId }) => {
  const fileInputRef = useRef(null);
  const {
    selectedEmployee,
    loading,
    error,
    fetchEmployeeById,
    addEmployeeDocument,
    removeEmployeeDocument,
  } = useEmployees();
  
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentToAdd, setDocumentToAdd] = useState({
    document_type: "",
    file: null,
    file_name: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [previewDocument, setPreviewDocument] = useState(null);

  // Fetch employee details if not already loaded
  React.useEffect(() => {
    if (employeeId && (!selectedEmployee || selectedEmployee.id !== parseInt(employeeId))) {
      fetchEmployeeById(parseInt(employeeId));
    }
  }, [employeeId, selectedEmployee, fetchEmployeeById]);

  // Handle document type selection
  const handleDocumentTypeChange = (value) => {
    setDocumentToAdd(prev => ({
      ...prev,
      document_type: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDocumentToAdd(prev => ({
        ...prev,
        file: file,
        file_name: file.name
      }));
    }
  };

  // Open file picker
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handle document upload
  const handleUploadDocument = async () => {
    if (!documentToAdd.document_type) {
      return;
    }

    try {
      setIsUploading(true);
      await addEmployeeDocument(employeeId, documentToAdd);
      setShowUploadDialog(false);
      setDocumentToAdd({
        document_type: "",
        file: null,
        file_name: "",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async () => {
    if (!selectedDocument) return;

    try {
      await removeEmployeeDocument(employeeId, selectedDocument.id);
      setDeleteConfirm(false);
      setSelectedDocument(null);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Filter documents based on search term
  const filteredDocuments = selectedEmployee?.documents?.filter(doc => 
    DOCUMENT_TYPES.find(type => type.value === doc.document_type)?.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.document_type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Get document type label
  const getDocumentTypeLabel = (type) => {
    return DOCUMENT_TYPES.find(doc => doc.value === type)?.label || type;
  };

  // Helper to get file extension from path
  const getFileExtension = (path) => {
    if (!path) return 'unknown';
    const extension = path.split('.').pop().toLowerCase();
    return extension;
  };

  // Get appropriate icon based on file extension
  const getFileIcon = (path) => {
    const extension = getFileExtension(path);
    
    const iconMap = {
      pdf: <FileText className="h-10 w-10 text-red-500" />,
      doc: <FileText className="h-10 w-10 text-blue-500" />,
      docx: <FileText className="h-10 w-10 text-blue-500" />,
      xls: <FileText className="h-10 w-10 text-green-500" />,
      xlsx: <FileText className="h-10 w-10 text-green-500" />,
      jpg: <FileText className="h-10 w-10 text-amber-500" />,
      jpeg: <FileText className="h-10 w-10 text-amber-500" />,
      png: <FileText className="h-10 w-10 text-amber-500" />,
    };
    
    return iconMap[extension] || <FileText className="h-10 w-10 text-gray-500" />;
  };

  // Add Document Dialog
  const UploadDialog = () => (
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
      <DialogContent className="sm:max-w-[500px] font-['Phetsarath_OT']">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePlus className="h-5 w-5 text-primary" />
            ເພີ່ມເອກະສານໃໝ່
          </DialogTitle>
          <DialogDescription>
            ອັບໂຫລດເອກະສານໃໝ່ສຳລັບພະນັກງານ
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="document-type">ປະເພດເອກະສານ</Label>
            <Select
              value={documentToAdd.document_type}
              onValueChange={handleDocumentTypeChange}
            >
              <SelectTrigger id="document-type">
                <SelectValue placeholder="ເລືອກປະເພດເອກະສານ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>ປະເພດເອກະສານ</SelectLabel>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label>ໄຟລ໌ເອກະສານ</Label>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            />
            
            {documentToAdd.file ? (
              <div className="flex items-center justify-between p-3 border rounded-md bg-muted/50">
                <div className="flex items-center gap-3">
                  {getFileIcon(documentToAdd.file_name)}
                  <div className="overflow-hidden">
                    <p className="font-medium truncate">{documentToAdd.file_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(documentToAdd.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                
                <Button
                  variant="ghost" 
                  size="icon"
                  onClick={() => setDocumentToAdd(prev => ({ ...prev, file: null, file_name: "" }))}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                onClick={triggerFileInput}
                className="border-2 border-dashed rounded-md p-6 flex flex-col items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="font-medium text-muted-foreground">
                    ຄລິກເພື່ອເລືອກໄຟລ໌
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PDF, Word, Excel, ຫຼື ຮູບພາບ (ຂະໜາດສູງສຸດ 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={handleUploadDocument} 
            disabled={!documentToAdd.document_type || !documentToAdd.file || isUploading}
            className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
          >
            {isUploading ? (
              <>
                <span className="animate-spin">
                  <Clock className="h-4 w-4" />
                </span>
                ກຳລັງອັບໂຫລດ...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                ອັບໂຫລດເອກະສານ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Delete Confirmation Dialog
  const DeleteDialog = () => (
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
          <Button variant="outline" onClick={() => setDeleteConfirm(false)}>
            ຍົກເລີກ
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDeleteDocument}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            ຢືນຢັນການລຶບ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // Document Preview Dialog
  const PreviewDialog = () => (
    <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
      <DialogContent className="sm:max-w-[700px] font-['Phetsarath_OT']">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            ເບິ່ງເອກະສານ
          </DialogTitle>
          <DialogDescription>
            {previewDocument ? getDocumentTypeLabel(previewDocument.document_type) : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-muted rounded-md p-4 flex flex-col items-center justify-center min-h-[300px]">
            {previewDocument && (
              getFileExtension(previewDocument.file_path) === 'pdf' ? (
                <iframe 
                  src={previewDocument.file_path} 
                  className="w-full h-[400px] border-0"
                  title="Document Preview"
                />
              ) : ['jpg', 'jpeg', 'png'].includes(getFileExtension(previewDocument.file_path)) ? (
                <img 
                  src={previewDocument.file_path} 
                  alt="Document Preview" 
                  className="max-h-[400px] object-contain"
                />
              ) : (
                <div className="text-center">
                  <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    ບໍ່ສາມາດເບິ່ງເອກະສານປະເພດນີ້ໄດ້ໂດຍກົງ
                  </p>
                  <Button 
                    variant="secondary" 
                    className="mt-4 gap-2"
                    onClick={() => window.open(previewDocument.file_path, '_blank')}
                  >
                    <Download className="h-4 w-4" />
                    ດາວໂຫລດເອກະສານ
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => setPreviewDocument(null)}>
            ປິດ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  // When loading
  if (loading && !selectedEmployee) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div>
                    <Skeleton className="h-5 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <Skeleton className="h-9 w-9 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // When error occurred
  if (error) {
    return (
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            ເອກະສານພະນັກງານ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>ເກີດຂໍ້ຜິດພາດ</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm font-['Phetsarath_OT']">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileText className="h-5 w-5 text-primary" />
          ເອກະສານພະນັກງານ
        </CardTitle>
        <CardDescription>
          ຈັດການເອກະສານສຳຄັນຂອງພະນັກງານ
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="ຄົ້ນຫາເອກະສານ..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={() => setShowUploadDialog(true)}
            variant="default"
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            ເພີ່ມເອກະສານ
          </Button>
        </div>
        
        {selectedEmployee?.documents?.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto bg-muted h-12 w-12 rounded-full flex items-center justify-center mb-3">
              <FileQuestion className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">ບໍ່ມີເອກະສານ</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              ຍັງບໍ່ມີເອກະສານໃດໆສຳລັບພະນັກງານນີ້
            </p>
            <Button 
              variant="outline" 
              onClick={() => setShowUploadDialog(true)}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              ເພີ່ມເອກະສານໃໝ່
            </Button>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            <div className="mx-auto bg-muted h-12 w-12 rounded-full flex items-center justify-center mb-3">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">ບໍ່ພົບເອກະສານ</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              ບໍ່ພົບເອກະສານທີ່ຕົງກັບການຄົ້ນຫາ "{searchTerm}"
            </p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              ລ້າງການຄົ້ນຫາ
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredDocuments.map((document) => (
              <div key={document.id} className="flex justify-between items-center p-3 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  {getFileIcon(document.file_path)}
                  <div>
                    <h4 className="font-medium">
                      {getDocumentTypeLabel(document.document_type)}
                    </h4>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(document.uploaded_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => setPreviewDocument(document)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ເບິ່ງເອກະສານ</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => window.open(document.file_path, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ດາວໂຫລດ</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedDocument(document);
                            setDeleteConfirm(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ລຶບເອກະສານ</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {selectedEmployee?.documents?.length > 0 && (
        <CardFooter className="border-t pt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            ມີເອກະສານທັງໝົດ {selectedEmployee.documents.length} ລາຍການ
          </p>
        </CardFooter>
      )}

      {/* Dialogs */}
      <UploadDialog />
      <DeleteDialog />
      <PreviewDialog />
    </Card>
  );
};

export default EmployeeDocuments;