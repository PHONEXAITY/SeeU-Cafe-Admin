"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useEmployees from "@/hooks/useEmployees";
import { format } from "date-fns";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

import {
  Search,
  PlusCircle,
  MoreHorizontal,
  Calendar,
  Phone,
  Mail,
  UserCircle,
  FileText,
  Briefcase,
  Trash2,
  Edit,
  InfoIcon,
  AlertCircle,
  AlertTriangle,
  X,
  CheckCircle2,
  ClipboardList,
  Filter,
  User,
  BadgeCheck,
  FileBarChart2,
  ExternalLink,
  ShieldCheck,
  Download,
  Share2,
  Filter as FilterIcon,
  Mail as MailIcon,
  MoreVertical,
  ChevronDown,
  LogOut,
  Users,
  Bell,
  MessageSquare,
  Sparkles,
  CreditCard,
  MapPin,
} from "lucide-react";

// รายชื่อตำแหน่งพนักงานตามที่ API กำหนด
const POSITION_LABELS = {
  manager: "ຜູ້ຈັດການ",
  staff: "ພະນັກງານ",
  delivery: "ພະນັກງານສົ່ງ",
  cashier: "ພະນັກງານເກັບເງິນ",
  waiter: "ພະນັກງານເສີບ",
  chef: "ພ່ໍຄົວ",
};

const EmployeesList = () => {
  const router = useRouter();
  const {
    employees,
    loading,
    error,
    filters,
    setFilters,
    deleteEmployee,
    refreshEmployees,
    updateEmployeeStatus,
  } = useEmployees();

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [positions, setPositions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    // ดึงข้อมูลตำแหน่งจาก API
    const fetchPositions = async () => {
      try {
        // ถ้ามี API สำหรับดึงตำแหน่ง สามารถเรียกใช้ได้ที่นี่
        // const response = await fetch('/api/employees/positions');
        // const data = await response.json();
        // setPositions(data);

        // ใช้ค่าจาก constant ไปก่อน
        setPositions(
          Object.entries(POSITION_LABELS).map(([value, label]) => ({
            value,
            label,
          }))
        );
      } catch (error) {
        console.error("Error fetching positions:", error);
      }
    };

    // ดึงข้อมูลสถานะจาก API
    const fetchStatusOptions = async () => {
      try {
        // ถ้ามี API สำหรับดึงสถานะ สามารถเรียกใช้ได้ที่นี่
        // const response = await fetch('/api/employees/status-options');
        // const data = await response.json();
        // setStatusOptions(data);

        // ใช้ค่าคงที่ไปก่อน
        setStatusOptions([
          { value: "active", label: "ເຮັດວຽກຢູ່" },
          { value: "leave", label: "ລາພັກ" },
          { value: "inactive", label: "ພັກວຽກ" },
        ]);
      } catch (error) {
        console.error("Error fetching status options:", error);
      }
    };

    fetchPositions();
    fetchStatusOptions();
  }, []);
  const formatDate = (dateString) => {
    if (!dateString) return "ບໍ່ມີຂໍ້ມູນ";
    try {
      return format(new Date(dateString), "dd MMM yyyy");
    } catch (error) {
      return "ວັນທີບໍ່ຖືກຕ້ອງ";
    }
  };

  const getTimeSinceHire = (dateString) => {
    if (!dateString) return "ບໍ່ມີຂໍ້ມູນ";
    try {
      const hireDate = new Date(dateString);
      const now = new Date();
      const diffInMonths =
        (now.getFullYear() - hireDate.getFullYear()) * 12 +
        now.getMonth() -
        hireDate.getMonth();

      if (diffInMonths < 1) return "ບໍ່ເທົ່າໃດມື້";
      if (diffInMonths < 12) return `${diffInMonths} ເດືອນ`;

      const years = Math.floor(diffInMonths / 12);
      const months = diffInMonths % 12;

      if (months === 0) return `${years} ປີ`;
      return `${years} ປີ ${months} ເດືອນ`;
    } catch (error) {
      return "N/A";
    }
  };

  const handleSearch = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handlePositionFilter = (value) => {
    setFilters((prev) => ({ ...prev, position: value === "all" ? "" : value }));
  };

  const handleStatusFilter = (value) => {
    setFilters((prev) => ({ ...prev, status: value === "all" ? "" : value }));
  };

  const clearFilters = () => {
    setFilters({ search: "", position: "", status: "" });
    setActiveTab("all");
  };

  const getStatusBadge = (status) => {
    const styles = {
      active:
        "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200",
      leave: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
      inactive: "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200",
    };

    const icons = {
      active: <CheckCircle2 className="w-3 h-3 mr-1" />,
      leave: <Calendar className="w-3 h-3 mr-1" />,
      inactive: <X className="w-3 h-3 mr-1" />,
    };

    const labels = {
      active: "ເຮັດວຽກຢູ່",
      leave: "ລາພັກ",
      inactive: "ພັກວຽກ",
    };

    return (
      <Badge
        variant="outline"
        className={`${
          styles[status] || "bg-gray-100"
        } flex items-center border`}
      >
        {icons[status] || <InfoIcon className="w-3 h-3 mr-1" />}
        {labels[status] || status || "ບໍ່ມີຂໍ້ມູນ"}
      </Badge>
    );
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const handleDelete = async (id) => {
    try {
      await deleteEmployee(id);
      setDeleteConfirm(false);
      refreshEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (value === "all") {
      setFilters((prev) => ({ ...prev, status: "" }));
    } else {
      setFilters((prev) => ({ ...prev, status: value }));
    }
  };

  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  const handleUpdateStatus = async (employeeId, newStatus) => {
    try {
      await updateEmployeeStatus(employeeId, newStatus);
      // หลังจากอัปเดตสถานะสำเร็จ ให้รีเฟรชรายการพนักงาน
      refreshEmployees();
      // ถ้ากำลังดูรายละเอียดพนักงานคนนี้อยู่ ให้อัปเดตข้อมูลในหน้าต่างรายละเอียดด้วย
      if (selectedEmployee && selectedEmployee.id === employeeId) {
        setSelectedEmployee({
          ...selectedEmployee,
          status: newStatus,
        });
      }
    } catch (error) {
      console.error("Error updating employee status:", error);
    }
  };

  const EmployeeDetailsDialog = ({ employee, isOpen, onClose }) => {
    if (!employee) return null;

    const calculateProgress = () => {
      try {
        const hireDate = new Date(employee.created_at);
        const now = new Date();
        const employmentLength = now - hireDate;

        const progressPercentage = Math.min(
          Math.round((employmentLength / (1825 * 24 * 60 * 60 * 1000)) * 100),
          100
        );

        return progressPercentage;
      } catch (error) {
        return 0;
      }
    };

    const getPositionLabel = (positionValue) => {
      return POSITION_LABELS[positionValue] || positionValue || "ບໍ່ມີຂໍ້ມູນ";
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden font-['Phetsarath_OT']">
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/80 to-primary" />

            <DialogHeader className="relative z-10 pt-6 px-6">
              <div className="flex justify-between items-start text-white">
                <DialogTitle className="text-xl font-bold">
                  ລາຍລະອຽດພະນັກງານ
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogDescription className="text-white/90">
                ເບິ່ງຂໍ້ມູນລະອຽດຂອງພະນັກງານ
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 pt-16 relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage
                    src={employee.profile_photo || ""}
                    alt={`${employee.first_name} ${employee.last_name}`}
                  />
                  <AvatarFallback className="text-xl bg-primary/10">
                    {getInitials(employee.first_name, employee.last_name)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                    <h3 className="font-bold text-2xl">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    {getStatusBadge(employee.status)}
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span className="font-medium">
                      {getPositionLabel(employee.position)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center text-sm mt-2">
                    <div className="flex items-center gap-1">
                      <Badge
                        variant="outline"
                        className="bg-primary/5 font-normal"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        ເຮັດວຽກມາ {getTimeSinceHire(employee.created_at)}
                      </Badge>
                    </div>

                    <div className="text-muted-foreground">
                      ID: #
                      {employee.Employee_id
                        ? employee.Employee_id.toString().padStart(4, "0")
                        : employee.id.toString().padStart(4, "0")}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">ໄລຍະເວລາເຮັດວຽກ</span>
                  <span className="font-medium">{calculateProgress()}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    ຂໍ້ມູນສ່ວນຕົວ
                  </h4>

                  <Card className="border border-muted/60">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          ອີເມວ
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>{employee.email}</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          ເບີໂທ
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-primary" />
                          <span>{employee.phone || "-"}</span>
                        </div>
                      </div>

                      {employee.date_of_birth && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">
                            ວັນເດືອນປີເກີດ
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>{formatDate(employee.date_of_birth)}</span>
                          </div>
                        </div>
                      )}

                      {employee.gender && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">
                            ເພດ
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <User className="h-4 w-4 text-primary" />
                            <span>
                              {employee.gender === "male"
                                ? "ຊາຍ"
                                : employee.gender === "female"
                                ? "ຍິງ"
                                : employee.gender === "other"
                                ? "ອື່ນໆ"
                                : employee.gender}
                            </span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    ຂໍ້ມູນການເຮັດວຽກ
                  </h4>

                  <Card className="border border-muted/60">
                    <CardContent className="p-4 space-y-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          ຕຳແໜ່ງ
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className="bg-primary/5 font-normal"
                          >
                            {getPositionLabel(employee.position)}
                          </Badge>
                        </div>
                      </div>

                      {employee.salary && (
                        <div className="flex flex-col">
                          <span className="text-muted-foreground text-sm">
                            ເງິນເດືອນ
                          </span>
                          <div className="flex items-center gap-2 mt-1">
                            <CreditCard className="h-4 w-4 text-primary" />
                            <span>
                              {parseInt(employee.salary).toLocaleString()} LAK
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          ວັນທີເລີ່ມເຮັດວຽກ
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(employee.created_at)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">
                          ສະຖານະປັດຈຸບັນ
                        </span>
                        <div className="flex items-center mt-2 gap-2">
                          <Select
                            defaultValue={employee.status || "active"}
                            onValueChange={(value) =>
                              handleUpdateStatus(employee.id, value)
                            }
                          >
                            <SelectTrigger className="h-8 w-full">
                              <SelectValue placeholder="ເລືອກສະຖານະ" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  <div className="flex items-center gap-2">
                                    {option.value === "active" && (
                                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                    )}
                                    {option.value === "leave" && (
                                      <Calendar className="h-3.5 w-3.5 text-amber-500" />
                                    )}
                                    {option.value === "inactive" && (
                                      <X className="h-3.5 w-3.5 text-rose-500" />
                                    )}
                                    <span>{option.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {employee.address && (
                <div className="mt-8 space-y-4">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    ທີ່ຢູ່
                  </h4>

                  <Card className="border border-muted/60">
                    <CardContent className="p-4">
                      <p className="text-foreground">{employee.address}</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {employee.documents && employee.documents.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h4 className="font-semibold text-primary flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    ເອກະສານທີ່ກ່ຽວຂ້ອງ
                  </h4>

                  <Card className="border border-muted/60">
                    <CardContent className="p-4">
                      <div className="grid gap-3">
                        {employee.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-2 rounded-md border border-muted bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <span className="font-medium">
                                  {doc.document_type}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  Added on{" "}
                                  {formatDate(doc.created_at || new Date())}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-4 bg-muted/30 border-t gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/employees/edit/${employee.id}`)}
              className="gap-1"
            >
              <Edit className="w-4 h-4" />
              ແກ້ໄຂຂໍ້ມູນ
            </Button>
            <Button
              variant="outline"
              className="gap-1"
              onClick={() =>
                window.navigator.clipboard?.writeText(employee.email)
              }
            >
              <Mail className="w-4 h-4" />
              ສົ່ງອີເມວ
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setSelectedEmployee(employee);
                setDeleteConfirm(true);
                onClose();
              }}
              className="gap-1"
            >
              <Trash2 className="w-4 h-4" />
              ລຶບ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  const DeleteConfirmDialog = ({ employee, isOpen, onClose }) => {
    if (!employee) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              ຢືນຢັນການລຶບ
            </DialogTitle>
            <DialogDescription>ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້</DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-muted/50 border">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={employee.profile_photo || ""}
                  alt={`${employee.first_name} ${employee.last_name}`}
                />
                <AvatarFallback>
                  {getInitials(employee.first_name, employee.last_name)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h4 className="font-medium">
                  {employee.first_name} {employee.last_name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {POSITION_LABELS[employee.position] || employee.position}
                </p>
              </div>
            </div>

            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>ຄຳເຕືອນ</AlertTitle>
              <AlertDescription>
                ການລຶບຈະເຮັດໃຫ້ຂໍ້ມູນທັງໝົດຂອງພະນັກງານຖືກລຶບອອກຈາກລະບົບ
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              ຍົກເລີກ
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDelete(employee.id)}
              className="flex-1 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              ຢືນຢັນການລຶບ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>

        <Card>
          <CardHeader className="pb-0">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-4 border-b last:border-0"
                >
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-9 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              ເກີດຂໍ້ຜິດພາດ
            </CardTitle>
            <CardDescription>ບໍ່ສາມາດໂຫຼດຂໍ້ມູນພະນັກງານໄດ້</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={refreshEmployees} className="w-full gap-2">
              <AlertCircle className="h-4 w-4" />
              ລອງໃໝ່ອີກຄັ້ງ
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // กรองพนักงานตามสถานะก่อนการแสดงผล
  const activeCount = employees.filter((emp) => emp.status === "active").length;
  const leaveCount = employees.filter((emp) => emp.status === "leave").length;
  const inactiveCount = employees.filter(
    (emp) => emp.status === "inactive"
  ).length;

  const statsCards = [
    {
      title: "ພະນັກງານທັງໝົດ",
      count: employees.length,
      icon: <Users className="h-5 w-5 text-primary" />,
      bgClass: "bg-primary/10",
      textClass: "text-primary",
    },
    {
      title: "ເຮັດວຽກຢູ່",
      count: activeCount,
      icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      bgClass: "bg-emerald-50",
      textClass: "text-emerald-600",
    },
    {
      title: "ລາພັກ",
      count: leaveCount,
      icon: <Calendar className="h-5 w-5 text-amber-500" />,
      bgClass: "bg-amber-50",
      textClass: "text-amber-600",
    },
    {
      title: "ພັກວຽກ",
      count: inactiveCount,
      icon: <LogOut className="h-5 w-5 text-rose-500" />,
      bgClass: "bg-rose-50",
      textClass: "text-rose-600",
    },
  ];

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-20 h-20 rounded-full bg-muted/70 flex items-center justify-center mb-6">
        <User className="h-10 w-10 text-muted-foreground/70" />
      </div>
      <h3 className="text-xl font-medium">ບໍ່ພົບຂໍ້ມູນພະນັກງານ</h3>
      <p className="text-muted-foreground text-center mt-2 mb-6 max-w-md">
        ບໍ່ພົບຂໍ້ມູນພະນັກງານຕາມເງື່ອນໄຂທີ່ເລືອກ, ກະລຸນາປັບປ່ຽນເງື່ອນໄຂການຄົ້ນຫາ
      </p>
      <Button variant="outline" onClick={clearFilters} className="gap-2">
        <FilterIcon className="h-4 w-4" />
        ລ້າງຕົວກອງ
      </Button>
    </div>
  );

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      {}
      <div className="flex flex-col md:flex-row justify-between gap-4 animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            <div className="bg-amber-100 p-3 rounded-xl">
              <UserCircle className="h-8 w-8 text-amber-600" />
            </div>
            ລາຍຊື່ພະນັກງານ
          </h1>
          <p className="text-muted-foreground mt-1">
            ຈັດການຂໍ້ມູນພະນັກງານ ({employees.length} ຄົນ)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={toggleFilters}
          >
            <FilterIcon className="h-4 w-4" />
          </Button>

          <Button
            onClick={() => router.push("/employees/create")}
            className="gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
          >
            <PlusCircle className="w-4 h-4" />
            ເພີ່ມພະນັກງານໃໝ່
          </Button>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in-50 slide-in-from-bottom-5 duration-700">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className="border border-muted/60 hover:border-primary/30 transition-all duration-300 hover:shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className={`text-2xl font-bold mt-1 ${stat.textClass}`}>
                    {stat.count}
                  </h3>
                </div>
                <div className={`${stat.bgClass} p-3 rounded-full`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full animate-in fade-in-50 slide-in-from-bottom-5 duration-900"
      >
        <TabsList className="grid w-full sm:w-auto grid-cols-4 p-1 bg-muted/70">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm flex items-center gap-1"
          >
            <BadgeCheck className="h-4 w-4" />
            <span className="hidden sm:inline">ທັງໝົດ</span>
            <Badge
              variant="outline"
              className="ml-1 bg-primary/5 hidden sm:flex"
            >
              {employees.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm flex items-center gap-1"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span className="hidden sm:inline">ເຮັດວຽກຢູ່</span>
            <Badge
              variant="outline"
              className="ml-1 bg-emerald-50 text-emerald-600 hidden sm:flex"
            >
              {activeCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="leave"
            className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm flex items-center gap-1"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">ລາພັກ</span>
            <Badge
              variant="outline"
              className="ml-1 bg-amber-50 text-amber-600 hidden sm:flex"
            >
              {leaveCount}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-sm flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">ພັກວຽກ</span>
            <Badge
              variant="outline"
              className="ml-1 bg-rose-50 text-rose-600 hidden sm:flex"
            >
              {inactiveCount}
            </Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {}
      <div
        className={`flex flex-col md:flex-row gap-4 animate-in fade-in-50 slide-in-from-bottom-5 duration-1000 ${
          isFiltersVisible || window.innerWidth >= 768
            ? "block"
            : "hidden md:block"
        }`}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="pl-10 border-primary/20 focus-visible:ring-primary/30"
            placeholder="ຄົ້ນຫາພະນັກງານ..."
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        <Select
          value={filters.position || "all"}
          onValueChange={handlePositionFilter}
        >
          <SelectTrigger className="w-full md:w-48 border-primary/20">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <SelectValue placeholder="ທຸກຕຳແໜ່ງ" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>ກອງຕາມຕຳແໜ່ງ</SelectLabel>
              <SelectItem value="all">ທຸກຕຳແໜ່ງ</SelectItem>
              {positions.map((position) => (
                <SelectItem key={position.value} value={position.value}>
                  {position.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={clearFilters}
          className="text-muted-foreground md:w-auto w-full"
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          ລ້າງຕົວກອງ
        </Button>
      </div>

      {}
      <Card className="shadow-sm border-slate-200 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-5 duration-1000">
        <CardHeader className="p-4 pb-0 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex justify-between items-center">
            <CardTitle className="text-md flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-primary" />
              ລາຍຊື່ພະນັກງານ
            </CardTitle>

            {employees.length > 0 && (
              <Badge variant="outline" className="bg-primary/5">
                {employees.length} ລາຍການ
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {employees.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      ພະນັກງານ
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                      ຕຳແໜ່ງ
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      ສະຖານະ
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">
                      ເບີໂທ
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      ດຳເນີນການ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {employees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-primary/10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                            <AvatarImage
                              src={employee.profile_photo || ""}
                              alt={employee.first_name}
                            />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(
                                employee.first_name,
                                employee.last_name
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {employee.first_name} {employee.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground hidden sm:block">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary font-normal"
                        >
                          {POSITION_LABELS[employee.position] ||
                            employee.position}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(employee.status)}
                      </td>
                      <td className="px-4 py-4 text-muted-foreground hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {employee.phone || "-"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedEmployee(employee);
                                    setShowDetailsDialog(true);
                                  }}
                                  className="h-8 w-8 p-0 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary"
                                >
                                  <InfoIcon className="h-4 w-4" />
                                  <span className="sr-only">View Details</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>ເບິ່ງລາຍລະອຽດ</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    router.push(
                                      `/employees/edit/${employee.id}`
                                    )
                                  }
                                  className="h-8 w-8 p-0 rounded-full border-primary/20 hover:bg-primary/5 hover:text-primary hidden sm:flex"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>ແກ້ໄຂ</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-muted"
                              >
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuLabel>ຕົວເລືອກ</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setShowDetailsDialog(true);
                                }}
                                className="gap-2 cursor-pointer"
                              >
                                <InfoIcon className="h-4 w-4" />
                                <span>ລາຍລະອຽດ</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/employees/edit/${employee.id}`)
                                }
                                className="gap-2 cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                                <span>ແກ້ໄຂຂໍ້ມູນ</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  window.navigator.clipboard?.writeText(
                                    employee.email
                                  )
                                }
                                className="gap-2 cursor-pointer"
                              >
                                <Mail className="h-4 w-4" />
                                <span>ສົ່ງອີເມວ</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  window.navigator.clipboard?.writeText(
                                    employee.phone || ""
                                  )
                                }
                                className="gap-2 cursor-pointer"
                              >
                                <Phone className="h-4 w-4" />
                                <span>ໂທຫາ</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setDeleteConfirm(true);
                                }}
                                className="text-destructive gap-2 cursor-pointer focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>ລຶບ</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>

        {employees.length > 0 && (
          <CardFooter className="flex justify-between p-4 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground">
              ສະແດງ <span className="font-medium">{employees.length}</span>{" "}
              ລາຍການ
            </p>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-primary/5">
                ໜ້າ 1 ຈາກ 1
              </Badge>
            </div>
          </CardFooter>
        )}
      </Card>

      {}
      <EmployeeDetailsDialog
        employee={selectedEmployee}
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
      />

      <DeleteConfirmDialog
        employee={selectedEmployee}
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
      />
    </div>
  );
};

export default EmployeesList;
