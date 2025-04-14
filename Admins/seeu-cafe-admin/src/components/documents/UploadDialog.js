import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { FilePlus, Upload, X, Eye, CheckCircle, AlertCircle, Search, User, Users } from 'lucide-react';
import { userService, employeeService } from '@/services/api';

const DOCUMENT_TYPES = [
  { value: "id_card", label: "ບັດປະຈຳຕົວ" },
  { value: "passport", label: "ໜັງສືຜ່ານແດນ" },
  { value: "driver_license", label: "ໃບຂັບຂີ່" },
  { value: "education", label: "ໃບຢັ້ງຢືນການສຶກສາ" },
  { value: "contract", label: "ສັນຍາການຈ້າງງານ" },
  { value: "medical", label: "ໃບຢັ້ງຢືນແພດ" },
  { value: "other", label: "ອື່ນໆ" },
];

export default function UploadDialog({ uploadDocument, showUploadDialog, setShowUploadDialog }) {
  const [documentData, setDocumentData] = useState({
    document_type: "",
    file: null,
    file_name: "",
    user_id: "",
    employee_id: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadType, setUploadType] = useState("employee");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (showUploadDialog) {
      fetchUsers();
      fetchEmployees();
      setDocumentData({ document_type: "", file: null, file_name: "", user_id: "", employee_id: "" });
      setUploadProgress(0);
      setUploadStatus(null);
      setErrorMessage("");
      setSearchTerm("");
      setPreviewUrl(null);
    }
  }, [showUploadDialog]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const response = await employeeService.getAllEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const filteredUsers = users.filter(user => 
    `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEmployees = employees.filter(emp => 
    `${emp.first_name || ''} ${emp.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDocumentTypeChange = (value) => {
    setDocumentData(prev => ({ ...prev, document_type: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("ຂະໜາດໄຟລ໌ຕ້ອງບໍ່ເກີນ 10MB");
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const url = file.type.startsWith('image/') ? URL.createObjectURL(file) : null;
      setPreviewUrl(url);
      setDocumentData(prev => ({ ...prev, file, file_name: file.name }));
      setErrorMessage("");
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleUserSelection = (userId) => {
    setDocumentData(prev => ({ ...prev, user_id: userId, employee_id: "" }));
  };

  const handleEmployeeSelection = (employeeId) => {
    setDocumentData(prev => ({ ...prev, employee_id: employeeId, user_id: "" }));
  };

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) clearInterval(interval);
      setUploadProgress(Math.min(progress, 95));
    }, 300);
    return () => clearInterval(interval);
  };

  const handleUploadDocument = async () => {
    if (!documentData.document_type || !documentData.file) {
      setErrorMessage("ກະລຸນາລະບຸປະເພດເອກະສານ ແລະ ເລືອກໄຟລ໌");
      return;
    }
    if (uploadType === "user" && !documentData.user_id) {
      setErrorMessage("ກະລຸນາເລືອກຜູ້ໃຊ້");
      return;
    }
    if (uploadType === "employee" && !documentData.employee_id) {
      setErrorMessage("ກະລຸນາເລືອກພະນັກງານ");
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);
    setErrorMessage("");

    const stopProgress = simulateProgress();
    const formData = new FormData();
    formData.append('file', documentData.file);
    formData.append('documentType', documentData.document_type);
    if (uploadType === "user" && documentData.user_id) formData.append('userId', documentData.user_id);
    else if (uploadType === "employee" && documentData.employee_id) formData.append('employeeId', documentData.employee_id);

    try {
      await uploadDocument(formData);
      stopProgress();
      setUploadProgress(100);
      setUploadStatus('success');
      setTimeout(() => {
        setShowUploadDialog(false);
        setDocumentData({ document_type: "", file: null, file_name: "", user_id: "", employee_id: "" });
        setUploadProgress(0);
        setUploadStatus(null);
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      }, 1500);
    } catch (error) {
      console.error("Error uploading document:", error);
      setUploadStatus('error');
      setErrorMessage(error.response?.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫລດ");
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setDocumentData(prev => ({ ...prev, file: null, file_name: "" }));
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const getSelectedName = () => {
    if (uploadType === "user" && documentData.user_id) {
      const user = users.find(u => u.id.toString() === documentData.user_id);
      return user ? `${user.first_name || ''} ${user.last_name || ''} (${user.email})` : "";
    } else if (uploadType === "employee" && documentData.employee_id) {
      const emp = employees.find(e => e.id.toString() === documentData.employee_id);
      return emp ? `${emp.first_name || ''} ${emp.last_name || ''} - ${emp.position || ''}` : "";
    }
    return "";
  };

  return (
    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
      <DialogContent className="max-w-[450px] font-['Phetsarath_OT'] p-0 gap-0">
        <div className="bg-primary/5 px-4 py-3 rounded-t-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <FilePlus className="h-5 w-5 text-primary" />
              ເພີ່ມເອກະສານໃໝ່
            </DialogTitle>
            <DialogDescription className="text-xs">
              ອັບໂຫລດເອກະສານ (PDF, Word, Excel, ຮູບພາບ) ສູງສຸດ 10MB
            </DialogDescription>
          </DialogHeader>
        </div>

        {uploadStatus === 'success' ? (
          <div className="p-6 flex flex-col items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-500 mb-4" />
            <h3 className="text-lg font-medium">ອັບໂຫລດສຳເລັດ</h3>
            <p className="text-sm text-muted-foreground">ເອກະສານຖືກອັບໂຫລດແລ້ວ</p>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="p-6 flex flex-col items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-red-600">ອັບໂຫລດລົ້ມເຫຼວ</h3>
            <p className="text-sm text-muted-foreground text-center">{errorMessage}</p>
            <Button variant="outline" onClick={() => setUploadStatus(null)} className="mt-4 text-xs h-8">ລອງໃໝ່</Button>
          </div>
        ) : (
          <>
            <div className="px-4 py-4 space-y-4">
              {/* Document Type */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">ປະເພດເອກະສານ</Label>
                <Select value={documentData.document_type} onValueChange={handleDocumentTypeChange}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="ເລືອກປະເພດເອກະສານ" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-sm">{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">ໄຟລ໌ເອກະສານ</Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                />
                {documentData.file ? (
                  <div className="space-y-2">
                    {previewUrl && (
                      <div className="relative border rounded-md overflow-hidden bg-muted/20">
                        <img src={previewUrl} alt="Preview" className="w-full h-40 object-contain" />
                        <div className="absolute top-2 right-2 flex gap-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-6 w-6 bg-white/80 hover:bg-white"
                                  onClick={() => window.open(previewUrl, '_blank')}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">ເບິ່ງຂະໜາດເຕັມ</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="secondary"
                                  size="icon"
                                  className="h-6 w-6 bg-white/80 hover:bg-white"
                                  onClick={removeSelectedFile}
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">ລຶບໄຟລ໌</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )}
                    {!previewUrl && (
                      <div className="flex items-center justify-between border rounded-md p-2 bg-muted/20">
                        <div className="flex items-center gap-2">
                          <span className="text-sm truncate flex-1">{documentData.file_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {(documentData.file.size / 1024 / 1024).toFixed(2)} MB
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeSelectedFile}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={triggerFileInput}
                    className="border border-dashed rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">ຄລິກເພື່ອເລືອກໄຟລ໌</p>
                  </div>
                )}
              </div>

              {/* Owner Selection */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">ເຈົ້າຂອງເອກະສານ</Label>
                <Tabs value={uploadType} onValueChange={setUploadType} className="w-full">
                  <TabsList className="grid grid-cols-2 h-8 mb-2">
                    <TabsTrigger value="employee" className="text-xs gap-1">
                      <Users className="h-3 w-3" /> ພະນັກງານ
                    </TabsTrigger>
                    <TabsTrigger value="user" className="text-xs gap-1">
                      <User className="h-3 w-3" /> ຜູ້ໃຊ້
                    </TabsTrigger>
                  </TabsList>
                  <div className="border rounded-md">
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <Input
                          placeholder={`ຄົ້ນຫາ${uploadType === "employee" ? "ພະນັກງານ" : "ຜູ້ໃຊ້"}...`}
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="pl-7 h-8 text-sm"
                        />
                      </div>
                    </div>
                    <ScrollArea className="h-[100px]">
                      {uploadType === "employee" ? (
                        loadingEmployees ? (
                          <div className="p-2 text-center text-xs text-muted-foreground">ກຳລັງໂຫລດ...</div>
                        ) : filteredEmployees.length > 0 ? (
                          filteredEmployees.map(emp => (
                            <div
                              key={emp.id}
                              className={`p-2 cursor-pointer hover:bg-muted ${documentData.employee_id === emp.id.toString() ? 'bg-primary/10' : ''}`}
                              onClick={() => handleEmployeeSelection(emp.id.toString())}
                            >
                              <p className="text-sm">{emp.first_name} {emp.last_name}</p>
                              <p className="text-xs text-muted-foreground">{emp.position || 'N/A'}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-2 text-center text-xs text-muted-foreground">ບໍ່ພົບຂໍ້ມູນ</div>
                        )
                      ) : loadingUsers ? (
                        <div className="p-2 text-center text-xs text-muted-foreground">ກຳລັງໂຫລດ...</div>
                      ) : filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                          <div
                            key={user.id}
                            className={`p-2 cursor-pointer hover:bg-muted ${documentData.user_id === user.id.toString() ? 'bg-primary/10' : ''}`}
                            onClick={() => handleUserSelection(user.id.toString())}
                          >
                            <p className="text-sm">{user.first_name} {user.last_name}</p>
                            <p className="text-xs text-muted-foreground">{user.email || 'N/A'}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-center text-xs text-muted-foreground">ບໍ່ພົບຂໍ້ມູນ</div>
                      )}
                    </ScrollArea>
                  </div>
                </Tabs>
                {getSelectedName() && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">{getSelectedName()}</p>
                )}
              </div>

              {errorMessage && (
                <div className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errorMessage}
                </div>
              )}

              {isUploading && <Progress value={uploadProgress} className="h-1" />}
            </div>

            <DialogFooter className="bg-muted/30 px-4 py-3 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={isUploading} className="h-8 text-xs">
                ຍົກເລີກ
              </Button>
              <Button
                onClick={handleUploadDocument}
                disabled={!documentData.document_type || !documentData.file || isUploading ||
                  (uploadType === "employee" && !documentData.employee_id) ||
                  (uploadType === "user" && !documentData.user_id)}
                className="h-8 text-xs bg-primary hover:bg-primary/90"
              >
                {isUploading ? 'ກຳລັງອັບໂຫລດ...' : <><Upload className="h-3 w-3 mr-1" /> ອັບໂຫລດ</>}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}