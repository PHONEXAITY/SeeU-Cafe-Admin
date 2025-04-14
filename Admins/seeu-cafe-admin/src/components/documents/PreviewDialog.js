// components/documents/PreviewDialog.js
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Eye, Download, FileQuestion, Calendar, User, Users, Maximize, MinusCircle, PlusCircle, RotateCw, RotateCcw, ExternalLink, FileText, Copy, FileImage, Info } from 'lucide-react';
import { format } from 'date-fns';
import { documentService } from '@/services/api';

const DOCUMENT_TYPES = [
  { value: "id_card", label: "ບັດປະຈຳຕົວ" },
  { value: "passport", label: "ໜັງສືຜ່ານແດນ" },
  { value: "driver_license", label: "ໃບຂັບຂີ່" },
  { value: "education", label: "ໃບຢັ້ງຢືນການສຶກສາ" },
  { value: "contract", label: "ສັນຍາການຈ້າງງານ" },
  { value: "medical", label: "ໃບຢັ້ງຢືນແພດ" },
  { value: "other", label: "ອື່ນໆ" },
];

export default function PreviewDialog({ previewDocument, setPreviewDocument, downloadDocument }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [viewMode, setViewMode] = useState('preview');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState(null);
  
  const getDocumentTypeLabel = (type) => {
    return DOCUMENT_TYPES.find(doc => doc.value === type)?.label || type;
  };

  const getFileExtension = (path) => {
    if (!path) return 'unknown';
    return path.split('.').pop().toLowerCase();
  };
  
  const getFileName = (path) => {
    if (!path) return 'unknown';
    return path.split('/').pop();
  };

  const handleDownload = async () => {
    if (!previewDocument) return;
    
    try {
      setDownloading(true);
      setError(null);
      
      // Simulate download progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 95) {
          clearInterval(interval);
          progress = 95;
        }
        setDownloadProgress(Math.min(progress, 95));
      }, 200);
      
      // เรียกใช้ฟังก์ชัน downloadDocument ที่ส่งมาจาก props
      await downloadDocument(previewDocument.id);
      
      clearInterval(interval);
      setDownloadProgress(100);
      
      // Reset after a delay
      setTimeout(() => {
        setDownloading(false);
        setDownloadProgress(0);
      }, 1000);
    } catch (error) {
      setDownloading(false);
      setDownloadProgress(0);
      console.error('Error downloading document:', error);
      setError('ເກີດຂໍ້ຜິດພາດໃນການດາວໂຫລດເອກະສານ');
    }
  };
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };
  
  const handleRotateRight = () => {
    setRotation(prev => (prev + 90) % 360);
  };
  
  const handleRotateLeft = () => {
    setRotation(prev => (prev - 90 + 360) % 360);
  };
  
  const resetView = () => {
    setZoomLevel(100);
    setRotation(0);
  };
  
  const openInNewTab = () => {
    if (previewDocument) {
      window.open(previewDocument.file_path, '_blank', 'noopener,noreferrer');
    }
  };
  
  const copyLinkToClipboard = () => {
    if (previewDocument) {
      navigator.clipboard.writeText(previewDocument.file_path)
        .then(() => {
          // คุณอาจจะต้องการแสดง toast หรือข้อความว่าคัดลอกแล้ว
          console.log('URL copied to clipboard');
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };
  
  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'id_card':
      case 'passport':
      case 'driver_license':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'education':
      case 'contract':
        return <FileText className="h-4 w-4 text-amber-500" />;
      case 'medical':
        return <FileText className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const isImage = previewDocument && ['jpg', 'jpeg', 'png', 'gif'].includes(getFileExtension(previewDocument?.file_path));
  const isPdf = previewDocument && getFileExtension(previewDocument?.file_path) === 'pdf';
  
  // Format date if available
  const formattedDate = previewDocument?.uploaded_at 
    ? format(new Date(previewDocument.uploaded_at), 'dd MMM yyyy - HH:mm')
    : '';

  return (
    <Dialog open={!!previewDocument} onOpenChange={() => setPreviewDocument(null)}>
      <DialogContent className="max-w-[95vw] h-[90vh] p-0 overflow-hidden font-['Phetsarath_OT']">
        <div className="flex flex-col h-full">
          {/* Header with document info and tabs */}
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-4 py-2 border-b">
            <DialogHeader className="space-y-0.5">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Eye className="h-5 w-5 text-primary" />
                  ເບິ່ງເອກະສານ
                </DialogTitle>
                
                <Tabs value={viewMode} onValueChange={setViewMode} className="h-8">
                  <TabsList className="h-7">
                    <TabsTrigger value="preview" className="text-xs px-2 h-6">
                      <Eye className="h-3.5 w-3.5 mr-1.5" />
                      ເບິ່ງເອກະສານ
                    </TabsTrigger>
                    <TabsTrigger value="info" className="text-xs px-2 h-6">
                      <Info className="h-3.5 w-3.5 mr-1.5" />
                      ຂໍ້ມູນເອກະສານ
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <DialogDescription className="text-xs flex items-center gap-2 flex-wrap">
                {previewDocument?.document_type && (
                  <Badge variant="outline" className="h-5 gap-1 pl-1.5 bg-background">
                    {getDocumentTypeIcon(previewDocument.document_type)}
                    <span>{getDocumentTypeLabel(previewDocument.document_type)}</span>
                  </Badge>
                )}
                
                {previewDocument?.file_path && (
                  <Badge variant="outline" className="h-5 gap-1 pl-1.5 bg-background">
                    {isImage ? (
                      <FileImage className="h-3.5 w-3.5 text-amber-500" />
                    ) : isPdf ? (
                      <FileText className="h-3.5 w-3.5 text-red-500" />
                    ) : (
                      <FileText className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    <span>{getFileName(previewDocument.file_path)}</span>
                  </Badge>
                )}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            {viewMode === 'preview' ? (
              /* Preview content */
              <div className="relative flex-1 flex flex-col overflow-hidden">
                {/* Tools bar */}
                {(isImage || isPdf) && (
                  <div className="bg-muted/50 border-b p-1 flex justify-center">
                    <div className="flex items-center gap-1 bg-background rounded-md p-0.5 shadow-sm">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleZoomOut}>
                              <MinusCircle className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ຂະຫຍາຍລົງ</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <div className="text-xs font-medium px-1 min-w-[40px] text-center">
                        {zoomLevel}%
                      </div>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleZoomIn}>
                              <PlusCircle className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ຂະຫຍາຍຂຶ້ນ</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      {isImage && (
                        <>
                          <div className="h-4 w-px bg-border mx-1"></div>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleRotateLeft}>
                                  <RotateCcw className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>ໝູນຊ້າຍ</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={handleRotateRight}>
                                  <RotateCw className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>ໝູນຂວາ</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </>
                      )}
                      
                      <div className="h-4 w-px bg-border mx-1"></div>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={resetView}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>ຣີເຊັດມຸມມອງ</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )}
                
                {/* Document viewer */}
                <div className="flex-1 overflow-auto bg-black/5 p-4">
                  <div className="flex items-center justify-center min-h-full">
                    {previewDocument && (
                      getFileExtension(previewDocument.file_path) === 'pdf' ? (
                        <iframe
                          src={`${previewDocument.file_path}#view=FitH&zoom=${zoomLevel/100}`}
                          className="w-full h-full border-0 bg-white shadow-md rounded-lg"
                          title="Document Preview"
                          style={{ maxWidth: `${zoomLevel}%`, transition: 'max-width 0.2s ease' }}
                        />
                      ) : ['jpg', 'jpeg', 'png', 'gif'].includes(getFileExtension(previewDocument.file_path)) ? (
                        <div className="bg-white p-2 shadow-md rounded-lg">
                          <img
                            src={previewDocument.file_path}
                            alt="Document Preview"
                            className="max-h-full object-contain"
                            style={{ 
                              transform: `rotate(${rotation}deg) scale(${zoomLevel/100})`,
                              transition: 'transform 0.2s ease'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
                          <FileQuestion className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">ບໍ່ສາມາດເບິ່ງເອກະສານນີ້ໄດ້</h3>
                          <p className="text-muted-foreground mb-6">
                            ບໍ່ສາມາດເບິ່ງເອກະສານປະເພດນີ້ໄດ້ໂດຍກົງ ທ່ານສາມາດດາວໂຫລດເອກະສານນີ້ໄດ້
                          </p>
                          <div className="flex justify-center gap-2">
                            <Button
                              className="gap-1.5"
                              onClick={openInNewTab}
                            >
                              <ExternalLink className="h-4 w-4" />
                              ເປີດໃນແທັບໃໝ່
                            </Button>
                            <Button
                              variant="outline"
                              className="gap-1.5"
                              onClick={handleDownload}
                            >
                              <Download className="h-4 w-4" />
                              ດາວໂຫລດ
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Info view */
              <div className="flex-1 overflow-auto p-4 bg-muted/30">
                <div className="bg-background rounded-lg shadow-sm border p-4 max-w-xl mx-auto">
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    ຂໍ້ມູນເອກະສານ
                  </h3>
                  
                  <div className="space-y-4">
                    {previewDocument?.document_type && (
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="text-sm font-medium text-muted-foreground">ປະເພດເອກະສານ</div>
                        <div className="col-span-2 flex items-center gap-2">
                          {getDocumentTypeIcon(previewDocument.document_type)}
                          <span>{getDocumentTypeLabel(previewDocument.document_type)}</span>
                        </div>
                      </div>
                    )}
                    
                    {previewDocument?.file_path && (
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="text-sm font-medium text-muted-foreground">ຊື່ໄຟລ໌</div>
                        <div className="col-span-2 truncate">{getFileName(previewDocument.file_path)}</div>
                      </div>
                    )}
                    
                    {previewDocument?.file_path && (
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="text-sm font-medium text-muted-foreground">ປະເພດໄຟລ໌</div>
                        <div className="col-span-2 flex items-center gap-2">
                          {isImage ? (
                            <Badge className="font-normal bg-amber-100 text-amber-800 hover:bg-amber-100">
                              ຮູບພາບ ({getFileExtension(previewDocument.file_path).toUpperCase()})
                            </Badge>
                          ) : isPdf ? (
                            <Badge className="font-normal bg-red-100 text-red-800 hover:bg-red-100">
                              PDF
                            </Badge>
                          ) : (
                            <Badge className="font-normal bg-blue-100 text-blue-800 hover:bg-blue-100">
                              {getFileExtension(previewDocument.file_path).toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {previewDocument?.uploaded_at && (
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="text-sm font-medium text-muted-foreground">ວັນທີອັບໂຫລດ</div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{formattedDate}</span>
                        </div>
                      </div>
                    )}
                    
                    {(previewDocument?.user_id || previewDocument?.employee_id) && (
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <div className="text-sm font-medium text-muted-foreground">ເຈົ້າຂອງເອກະສານ</div>
                        <div className="col-span-2 flex items-center gap-2">
                          {previewDocument?.user_id ? (
                            <>
                              <User className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>ຜູ້ໃຊ້: {previewDocument.user?.first_name} {previewDocument.user?.last_name || `ID ${previewDocument.user_id}`}</span>
                            </>
                          ) : (
                            <>
                              <Users className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>ພະນັກງານ: {previewDocument.employee?.first_name} {previewDocument.employee?.last_name || `ID ${previewDocument.employee_id}`}</span>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {previewDocument?.file_path && (
                      <div className="grid grid-cols-3 gap-2 items-start">
                        <div className="text-sm font-medium text-muted-foreground">ລິ້ງເອກະສານ</div>
                        <div className="col-span-2 flex gap-2">
                          <div className="flex-1 text-xs bg-muted p-2 rounded truncate">
                            {previewDocument.file_path}
                          </div>
                          <Button
                            size="icon" 
                            variant="outline"
                            className="h-8 w-8 flex-shrink-0"
                            onClick={copyLinkToClipboard}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer with actions */}
          <DialogFooter className="bg-muted/30 p-3 border-t flex-row justify-between">
            <div className="flex-1">
              {downloading && (
                <div className="flex items-center gap-2 w-full max-w-[150px]">
                  <Progress value={downloadProgress} className="h-2 flex-1" />
                  <span className="text-xs text-muted-foreground">{Math.round(downloadProgress)}%</span>
                </div>
              )}
              {error && (
                <div className="text-xs text-red-600">
                  {error}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setPreviewDocument(null)}
                className="h-8 px-3 text-xs"
              >
                ປິດ
              </Button>
              
              <Button 
                onClick={handleDownload} 
                disabled={downloading}
                size="sm"
                className="gap-1.5 h-8 px-3 text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-sm"
              >
                {downloading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    ດາວໂຫລດ...
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5" />
                    ດາວໂຫລດເອກະສານ
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}