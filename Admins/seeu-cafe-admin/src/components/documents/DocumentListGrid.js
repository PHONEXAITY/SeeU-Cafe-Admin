// components/documents/DocumentListGrid.js
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Eye, Download, Trash2, Calendar, User, Users, FileQuestion, Grid3X3, List, LayoutList, LayoutGrid, FileText } from 'lucide-react';
import { format } from 'date-fns';
import DocumentList from './DocumentList';

const DOCUMENT_TYPES = [
  { value: "id_card", label: "ບັດປະຈຳຕົວ" },
  { value: "passport", label: "ໜັງສືຜ່ານແດນ" },
  { value: "driver_license", label: "ໃບຂັບຂີ່" },
  { value: "education", label: "ໃບຢັ້ງຢືນການສຶກສາ" },
  { value: "contract", label: "ສັນຍາການຈ້າງງານ" },
  { value: "medical", label: "ໃບຢັ້ງຢືນແພດ" },
  { value: "other", label: "ອື່ນໆ" },
];

// ฟังก์ชันสร้างสีสำหรับประเภทเอกสาร
const getTypeColor = (type) => {
  const colorMap = {
    id_card: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    passport: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    driver_license: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    education: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    contract: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
    medical: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    other: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
  };
  
  return colorMap[type] || colorMap.other;
};

export default function DocumentListGrid({
  documents,
  setPreviewDocument,
  setDeleteConfirm,
  setSelectedDocument,
  deleteDocument,
  downloadDocument
}) {
  const [viewType, setViewType] = useState('grid');

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getDocumentTypeLabel = (type) => {
    return DOCUMENT_TYPES.find(doc => doc.value === type)?.label || type;
  };

  const getFileExtension = (path) => {
    if (!path) return 'unknown';
    return path.split('.').pop().toLowerCase();
  };

  const getFileIcon = (path) => {
    const extension = getFileExtension(path);
    const iconMap = {
      pdf: <FileText className="h-full w-full text-red-500" />,
      doc: <FileText className="h-full w-full text-blue-500" />,
      docx: <FileText className="h-full w-full text-blue-500" />,
      xls: <FileText className="h-full w-full text-green-500" />,
      xlsx: <FileText className="h-full w-full text-green-500" />,
      jpg: <FileText className="h-full w-full text-amber-500" />,
      jpeg: <FileText className="h-full w-full text-amber-500" />,
      png: <FileText className="h-full w-full text-amber-500" />,
    };
    return iconMap[extension] || <FileText className="h-full w-full text-gray-500" />;
  };
  
  const getThumbnailUrl = (document) => {
    const extension = getFileExtension(document.file_path);
    if (['jpg', 'jpeg', 'png'].includes(extension)) {
      return document.file_path;
    }
    return null;
  };

  if (documents.length === 0) {
    return (
      <Card className="border-dashed font-['Phetsarath_OT']">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium mb-2">ບໍ່ພົບເອກະສານ</h3>
          <p className="text-muted-foreground text-center max-w-md">
            ບໍ່ພົບເອກະສານໃນລະບົບ ຫຼື ບໍ່ຕົງກັບເງື່ອນໄຂການຄົ້ນຫາ
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/20 shadow-sm font-['Phetsarath_OT']">
      <div className="border-b p-3 bg-muted/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1 font-normal">
            <FileText className="h-3 w-3" /> 
            {documents.length} ລາຍການ
          </Badge>
        </div>
        
        <Tabs value={viewType} onValueChange={setViewType} className="w-auto">
          <TabsList className="h-9 bg-background/70">
            <TabsTrigger value="list" className="px-3 gap-1">
              <LayoutList className="h-4 w-4" />
              <span className="hidden sm:inline-block">ລາຍການ</span>
            </TabsTrigger>
            <TabsTrigger value="grid" className="px-3 gap-1">
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline-block">ຕາຕະລາງ</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className={viewType === 'list' ? "p-4" : "p-4 md:p-6"}>
        {viewType === 'list' ? (
          <DocumentList
            documents={documents}
            setPreviewDocument={setPreviewDocument}
            setDeleteConfirm={setDeleteConfirm}
            setSelectedDocument={setSelectedDocument}
            deleteDocument={deleteDocument}
            downloadDocument={downloadDocument}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {documents.map((document) => {
              const typeColor = getTypeColor(document.document_type);
              return (
                <Card 
                  key={document.id} 
                  className="overflow-hidden transition-all duration-200 hover:shadow-md group border-primary/10"
                >
                  <div 
                    className="h-40 flex items-center justify-center bg-muted cursor-pointer relative group overflow-hidden"
                    onClick={() => setPreviewDocument(document)}
                  >
                    {getThumbnailUrl(document) ? (
                      <img 
                        src={getThumbnailUrl(document)} 
                        alt={getDocumentTypeLabel(document.document_type)}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-12 w-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        {getFileIcon(document.file_path)}
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewDocument(document);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        ເບິ່ງເອກະສານ
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className={`px-2 py-1 rounded-md text-xs ${typeColor.bg} ${typeColor.text} ${typeColor.border} border`}>
                        {getDocumentTypeLabel(document.document_type)}
                      </div>
                      {document.uploaded_at && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(document.uploaded_at)}
                        </div>
                      )}
                    </div>
                    
                    {document.user_id && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Avatar className="h-5 w-5">
                          <User className="h-3 w-3" />
                        </Avatar>
                        <span className="truncate text-xs">
                          {document.user?.first_name} {document.user?.last_name || `ID: ${document.user_id}`}
                        </span>
                      </div>
                    )}
                    
                    {document.employee_id && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Avatar className="h-5 w-5">
                          <Users className="h-3 w-3" />
                        </Avatar>
                        <span className="truncate text-xs">
                          {document.employee?.first_name} {document.employee?.last_name || `ID: ${document.employee_id}`}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex gap-1 mt-3 justify-between">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-8 px-2 flex-1 gap-1 text-xs"
                        onClick={() => downloadDocument(document.id)}
                      >
                        <Download className="h-3 w-3" />
                        ດາວໂຫລດ
                      </Button>
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setSelectedDocument(document);
                          setDeleteConfirm(true);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}