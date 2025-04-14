"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useEmployees from "@/hooks/useEmployees";
import { useToast } from "@/components/ui/use-toast";
import { DateOfBirthPicker } from "@/components/ui/DateOfBirthPicker";
import axios from "axios";
import Cookies from "js-cookie";
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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Save,
  X,
  User,
  Mail,
  Phone,
  Briefcase,
  Calendar as CalendarIcon,
  Clock,
  Upload,
  AlertCircle,
  MapPin,
  ArrowLeft,
  UserCircle,
  CreditCard,
  UserCog,
  UserPlus,
  Badge,
} from "lucide-react";
import { format } from "date-fns";

const POSITIONS = [
  { value: "manager", label: "ຜູ້ຈັດການ" },
  { value: "staff", label: "ພະນັກງານ" },
  { value: "delivery", label: "ພະນັກງານສົ່ງ" },
  { value: "cashier", label: "ພະນັກງານເກັບເງິນ" },
  { value: "waiter", label: "ພະນັກງານເສີບ" },
  { value: "chef", label: "ພ່ໍຄົວ" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "ເຮັດວຽກຢູ່" },
  { value: "leave", label: "ລາພັກ" },
  { value: "inactive", label: "ພັກວຽກ" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "ຊາຍ" },
  { value: "female", label: "ຍິງ" },
  { value: "other", label: "ອື່ນໆ" },
];

const EmployeeForm = ({ employeeId }) => {
  const router = useRouter();
  const isEditMode = !!employeeId;
  const { toast } = useToast();

  const {
    selectedEmployee,
    loading,
    error,
    fetchEmployeeById,
    createEmployee,
    updateEmployee,
    uploadProfilePhoto,
  } = useEmployees();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    position: "",
    status: "active",
    gender: "",
    address: "",
    date_of_birth: "",
    salary: "",
    profile_photo: "",
  });

  const [photoPreview, setPhotoPreview] = useState("");

  useEffect(() => {
    let isMounted = true;

    if (isEditMode && employeeId) {
      const fetchData = async () => {
        try {
          await fetchEmployeeById(parseInt(employeeId));
        } catch (err) {
          if (isMounted) {
            console.error("Failed to fetch employee:", err);
          }
        }
      };
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [employeeId, fetchEmployeeById, isEditMode]);

  useEffect(() => {
    if (isEditMode && selectedEmployee) {
      setFormData({
        first_name: selectedEmployee.first_name || "",
        last_name: selectedEmployee.last_name || "",
        email: selectedEmployee.email || "",
        phone: selectedEmployee.phone || "",
        position: selectedEmployee.position || "",
        status: selectedEmployee.status || "active",
        gender: selectedEmployee.gender || "",
        address: selectedEmployee.address || "",
        date_of_birth: selectedEmployee.date_of_birth
          ? new Date(selectedEmployee.date_of_birth)
          : "",
        salary: selectedEmployee.salary?.toString() || "",
        profile_photo: selectedEmployee.profile_photo || "",
      });
      if (selectedEmployee.profile_photo) {
        setPhotoPreview(selectedEmployee.profile_photo);
      }
    }
  }, [isEditMode, selectedEmployee]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "ຮູບໃຫຍ່ເກີນໄປ",
        description: "ກະລຸນາເລືອກຮູບທີ່ມີຂະໜາດບໍ່ເກີນ 5MB",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "ປະເພດໄຟລ໌ບໍ່ຖືກຕ້ອງ",
        description: "ກະລຸນາເລືອກໄຟລ໌ຮູບພາບເທົ່ານັ້ນ",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);

    setUploadingPhoto(true);

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      if (isEditMode) {
        const response = await uploadProfilePhoto(employeeId, uploadFormData);
        if (response && response.profile_photo) {
          setFormData((prev) => ({
            ...prev,
            profile_photo: response.profile_photo,
          }));
          toast({
            title: "ອັບໂຫລດສຳເລັດ",
            description: "Profile photo updated successfully",
          });
        }
      } else {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
        const cloudinaryResponse = await axios.post(
          `${apiUrl}/cloudinary/upload`,
          uploadFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${Cookies.get("auth_token")}`,
            },
          }
        );

        if (cloudinaryResponse?.data?.secure_url) {
          const profilePhotoUrl = cloudinaryResponse.data.secure_url;
          setFormData((prev) => ({
            ...prev,
            profile_photo: profilePhotoUrl,
          }));
          toast({
            title: "ອັບໂຫລດສຳເລັດ",
            description: "Cloudinary upload successful",
          });
        } else {
          throw new Error("No secure_url received from Cloudinary");
        }
      }
    } catch (error) {
      console.error("Failed to upload photo:", error);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description:
          error.response?.data?.message || error.message || "Upload failed",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.position) {
      toast({
        variant: "destructive",
        title: "ຂໍ້ມູນບໍ່ຄົບຖ້ວນ",
        description: "ກະລຸນາຕື່ມຂໍ້ມູນທີ່ຈຳເປັນໃຫ້ຄົບຖ້ວນ",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        variant: "destructive",
        title: "ອີເມວບໍ່ຖືກຕ້ອງ",
        description: "ກະລຸນາກວດສອບຮູບແບບອີເມວ",
      });
      return;
    }

    const phoneRegex = /^[0-9]{10,12}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s+/g, ""))) {
      toast({
        variant: "destructive",
        title: "ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ",
        description: "ກະລຸນາປ້ອນເບີໂທລະສັບໃຫ້ຖືກຕ້ອງ (10-12 ຫຼັກ)",
      });
      return;
    }

    const formattedData = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone ? formData.phone.replace(/\s+/g, "") : null,
      position: formData.position,
      status: formData.status || "active",
      gender: formData.gender || null,
      address: formData.address || null,
      date_of_birth: formData.date_of_birth
        ? new Date(formData.date_of_birth).toISOString()
        : null,
      salary: formData.salary ? parseFloat(formData.salary) : null,
      profile_photo: formData.profile_photo || null,
    };

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await updateEmployee(employeeId, formattedData);
        toast({
          title: "ອັບເດດສຳເລັດ",
          description: "Employee updated successfully",
        });
      } else {
        await createEmployee(formattedData);
        toast({
          title: "ສ້າງພະນັກງານສຳເລັດ",
          description: "Employee created successfully",
        });
        router.push("/employees/list");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description:
          error.response?.data?.message || error.message || "Submission failed",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  const formatDate = (date) => (date ? format(new Date(date), "dd/MM/yyyy") : "");

  const pageTitle = isEditMode ? "ແກ້ໄຂຂໍ້ມູນພະນັກງານ" : "ເພີ່ມພະນັກງານໃໝ່";

  const handleBackToList = () => router.push("/employees/list");

  if (loading && isEditMode) {
    return (
      <div className="space-y-6 font-['Phetsarath_OT']">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (error && isEditMode) {
    return (
      <div className="space-y-6 font-['Phetsarath_OT']">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>ເກີດຂໍ້ຜິດພາດ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleBackToList} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          ກັບຄືນໄປຍັງລາຍການພະນັກງານ
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
        <div className="flex items-center gap-2">
          {isEditMode ? (
            <UserCog className="h-6 w-6 text-amber-600" />
          ) : (
            <UserPlus className="h-6 w-6 text-amber-600" />
          )}
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBackToList}>
            <X className="mr-2 h-4 w-4" />
            ຍົກເລີກ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-amber-500 hover:bg-amber-600"
          >
            {isSubmitting ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                ກຳລັງບັນທຶກ...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "ອັບເດດ" : "ບັນທຶກ"}
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">
            <User className="mr-2 h-4 w-4" />
            ຂໍ້ມູນພື້ນຖານ
          </TabsTrigger>
          <TabsTrigger value="additional">
            <Briefcase className="mr-2 h-4 w-4" />
            ຂໍ້ມູນເພີ່ມເຕີມ
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="basic" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>ຂໍ້ມູນພື້ນຖານ</CardTitle>
                <CardDescription>ຂໍ້ມູນສ່ວນຕົວຂອງພະນັກງານ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={photoPreview} />
                    <AvatarFallback>
                      {getInitials(formData.first_name, formData.last_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <label
                      htmlFor="photo-upload"
                      className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-amber-500 text-white hover:bg-amber-600 ${
                        uploadingPhoto ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {uploadingPhoto ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      disabled={uploadingPhoto}
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      ອັບໂຫລດຮູບພາບ (ສູງສຸດ 5MB)
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">
                      ຊື່ <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleChange("first_name", e.target.value)}
                      placeholder="ປ້ອນຊື່"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">
                      ນາມສະກຸນ <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleChange("last_name", e.target.value)}
                      placeholder="ປ້ອນນາມສະກຸນ"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      ອີເມວ <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="user@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">ເບີໂທລະສັບ</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        placeholder="020XXXXXXXX"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">
                      ຕຳແໜ່ງ <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => handleChange("position", value)}
                      required
                    >
                      <SelectTrigger id="position">
                        <SelectValue placeholder="ເລືອກຕຳແໜ່ງ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>ຕຳແໜ່ງພະນັກງານ</SelectLabel>
                          {POSITIONS.map((position) => (
                            <SelectItem key={position.value} value={position.value}>
                              {position.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">ສະຖານະ</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="ເລືອກສະຖານະ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>ສະຖານະພະນັກງານ</SelectLabel>
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>ເພດ</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => handleChange("gender", value)}
                      className="flex gap-4"
                    >
                      {GENDER_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
                          <Label htmlFor={`gender-${option.value}`}>{option.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">ວັນເດືອນປີເກີດ</Label>
                    <DateOfBirthPicker
                      date={formData.date_of_birth}
                      onDateChange={(date) => handleChange("date_of_birth", date)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>ຂໍ້ມູນເພີ່ມເຕີມ</CardTitle>
                <CardDescription>ຂໍ້ມູນເພີ່ມເຕີມແລະລາຍລະອຽດການເຮັດວຽກ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salary">ເງິນເດືອນ (LAK)</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="salary"
                        type="number"
                        value={formData.salary}
                        onChange={(e) => handleChange("salary", e.target.value)}
                        placeholder="0"
                        className="pl-10"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">ທີ່ຢູ່</Label>
                  <div className="relative">
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="ທີ່ຢູ່ປັດຈຸບັນຂອງພະນັກງານ"
                      className="min-h-24"
                    />
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                {isEditMode && selectedEmployee && (
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <UserCircle className="h-5 w-5 text-muted-foreground" />
                      <h4 className="font-medium">ລະຫັດພະນັກງານ</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      ລະຫັດພະນັກງານແມ່ນຖືກສ້າງຂຶ້ນໂດຍອັດຕະໂນມັດ ແລະ ບໍ່ສາມາດແກ້ໄຂໄດ້
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{selectedEmployee.Employee_id}</Badge>
                      <span className="text-sm text-muted-foreground">
                        ສ້າງເມື່ອ {formatDate(selectedEmployee.created_at)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2 border-t pt-6">
                <Button variant="outline" onClick={handleBackToList}>
                  ຍົກເລີກ
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  {isSubmitting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      ກຳລັງບັນທຶກ...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditMode ? "ອັບເດດ" : "ບັນທຶກ"}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
};

export default EmployeeForm;