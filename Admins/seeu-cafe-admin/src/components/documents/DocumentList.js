import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FileText,
  Eye,
  Download,
  Trash2,
  Calendar,
  User,
  Users,
  FileQuestion,
} from "lucide-react";
import { format } from "date-fns";

const DOCUMENT_TYPES = [
  { value: "id_card", label: "ບັດປະຈຳຕົວ" },
  { value: "passport", label: "ໜັງສືຜ່ານແດນ" },
  { value: "driver_license", label: "ໃບຂັບຂີ່" },
  { value: "education", label: "ໃບຢັ້ງຢືນການສຶກສາ" },
  { value: "contract", label: "ສັນຍາການຈ້າງງານ" },
  { value: "medical", label: "ໃບຢັ້ງຢືນແພດ" },
  { value: "other", label: "ອື່ນໆ" },
];

export default function DocumentList({
  documents,
  downloadDocument,
  setPreviewDocument,
  setDeleteConfirm,
  setSelectedDocument,
}) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getDocumentTypeLabel = (type) => {
    return DOCUMENT_TYPES.find((doc) => doc.value === type)?.label || type;
  };

  const getFileExtension = (path) => {
    if (!path) return "unknown";
    return path.split(".").pop().toLowerCase();
  };

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
    return (
      iconMap[extension] || <FileText className="h-10 w-10 text-gray-500" />
    );
  };

  return (
    <div className="space-y-4 font-['Phetsarath_OT']">
      {documents.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto bg-muted h-12 w-12 rounded-full flex items-center justify-center mb-3">
            <FileQuestion className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">ບໍ່ມີເອກະສານ</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            ຍັງບໍ່ມີເອກະສານໃນລະບົບ ຫຼື ບໍ່ພົບເອກະສານທີ່ຕົງກັບການຄົ້ນຫາ
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {documents.map((document) => (
            <div
              key={document.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className="hidden md:block">
                  {getFileIcon(document.file_path)}
                </div>
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="md:hidden">
                      {getFileIcon(document.file_path)}
                    </span>
                    {getDocumentTypeLabel(document.document_type)}
                  </h4>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(document.uploaded_at)}</span>
                    </div>
                    {document.user_id && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>User ID: {document.user_id}</span>
                      </div>
                    )}
                    {document.employee_id && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Employee ID: {document.employee_id}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
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
                        variant="outline"
                        size="icon"
                        onClick={() => downloadDocument(document.id)}
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
                        variant="outline"
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
    </div>
  );
}
