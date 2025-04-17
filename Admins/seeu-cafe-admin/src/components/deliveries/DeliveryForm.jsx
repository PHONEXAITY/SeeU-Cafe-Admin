"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Clock,
  MapPin,
  Loader2,
  Save,
  Truck,
  Phone,
  ClipboardList,
  DollarSign,
  Calendar as CalendarIcon,
  User,
  Ban,
  CheckCircle,
  Package,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

// Status configurations for consistent styling
const statusConfigs = {
  pending: {
    bg: "bg-yellow-100", 
    text: "text-yellow-800", 
    border: "border-yellow-200",
    icon: <Clock className="h-4 w-4 text-yellow-600" />
  },
  preparing: {
    bg: "bg-blue-100", 
    text: "text-blue-800", 
    border: "border-blue-200",
    icon: <Package className="h-4 w-4 text-blue-600" />
  },
  out_for_delivery: {
    bg: "bg-purple-100", 
    text: "text-purple-800", 
    border: "border-purple-200",
    icon: <Truck className="h-4 w-4 text-purple-600" />
  },
  delivered: {
    bg: "bg-green-100", 
    text: "text-green-800", 
    border: "border-green-200",
    icon: <CheckCircle className="h-4 w-4 text-green-600" />
  },
  cancelled: {
    bg: "bg-red-100", 
    text: "text-red-800", 
    border: "border-red-200",
    icon: <Ban className="h-4 w-4 text-red-600" />
  }
};

// Status translations for Lao language
const statusTranslations = {
  pending: "ລໍຖ້າ",
  preparing: "ກຳລັງກະກຽມ",
  out_for_delivery: "ອອກສົ່ງແລ້ວ",
  delivered: "ສົ່ງແລ້ວ",
  cancelled: "ຍົກເລີກ",
};

const DeliveryForm = ({
  isEditing = false,
  initialData = {
    order_id: "",
    employee_id: "",
    delivery_address: "",
    customer_note: "",
    phone_number: "",
    status: "pending",
    estimated_delivery_time: "",
    delivery_fee: "",
  },
  orderId = null,
  deliveryId = null,
  orderOptions = [],
  employeeOptions = [],
  loadingOrders = false,
  loadingEmployees = false,
  orderError = null,
  employeeError = null,
  onSubmit,
  onOrderChange,
  isSubmitting = false,
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialData);
  const [datePopover, setDatePopover] = useState(false);
  const [date, setDate] = useState(initialData.estimated_delivery_time ? new Date(initialData.estimated_delivery_time) : null);
  const [time, setTime] = useState(initialData.estimated_delivery_time ? 
    format(new Date(initialData.estimated_delivery_time), "HH:mm") : 
    ""
  );
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Update form data when initialData changes
  useEffect(() => {
    setFormData(initialData);
    if (initialData.estimated_delivery_time) {
      setDate(new Date(initialData.estimated_delivery_time));
      setTime(format(new Date(initialData.estimated_delivery_time), "HH:mm"));
    }
  }, [initialData]);

  // Update delivery time in formData when date or time changes
  useEffect(() => {
    if (date && time) {
      const [hours, minutes] = time.split(':');
      const deliveryDate = new Date(date);
      deliveryDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      setFormData(prev => ({
        ...prev,
        estimated_delivery_time: deliveryDate.toISOString()
      }));
    }
  }, [date, time]);

  // Handle input changes
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  // Handle select changes
  const handleSelectChange = (field) => (value) => {
    if (field === "order_id" && onOrderChange) {
      onOrderChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  // Field validation
  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'order_id':
        if (!isEditing && !value) {
          newErrors[field] = 'ກະລຸນາເລືອກອໍເດີ';
        } else {
          delete newErrors[field];
        }
        break;
      case 'delivery_address':
        if (!value.trim()) {
          newErrors[field] = 'ກະລຸນາປ້ອນທີ່ຢູ່ຈັດສົ່ງ';
        } else if (value.trim().length < 10) {
          newErrors[field] = 'ທີ່ຢູ່ຈັດສົ່ງຕ້ອງມີຢ່າງໜ້ອຍ 10 ຕົວອັກສອນ';
        } else {
          delete newErrors[field];
        }
        break;
      case 'phone_number':
        if (value && !/^[0-9+\s\-()]{8,15}$/.test(value)) {
          newErrors[field] = 'ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ';
        } else {
          delete newErrors[field];
        }
        break;
      case 'delivery_fee':
        if (value && (isNaN(value) || parseFloat(value) < 0)) {
          newErrors[field] = 'ຄ່າຈັດສົ່ງຕ້ອງເປັນຕົວເລກທີ່ບວກ';
        } else {
          delete newErrors[field];
        }
        break;
    }
    
    setErrors(newErrors);
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
    
    if (!isEditing && !formData.order_id) {
      newErrors.order_id = 'ກະລຸນາເລືອກອໍເດີ';
      isValid = false;
    }
    
    if (!formData.delivery_address || formData.delivery_address.trim().length < 10) {
      newErrors.delivery_address = 'ກະລຸນາປ້ອນທີ່ຢູ່ຈັດສົ່ງ (ຢ່າງໜ້ອຍ 10 ຕົວອັກສອນ)';
      isValid = false;
    }
    
    if (formData.phone_number && !/^[0-9+\s\-()]{8,15}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ';
      isValid = false;
    }
    
    if (formData.delivery_fee && (isNaN(formData.delivery_fee) || parseFloat(formData.delivery_fee) < 0)) {
      newErrors.delivery_fee = 'ຄ່າຈັດສົ່ງຕ້ອງເປັນຕົວເລກທີ່ບວກ';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    if (!validateForm()) {
      toast({
        title: "ຄຳເຕືອນ",
        description: "ກະລຸນາກວດສອບຂໍ້ມູນທີ່ປ້ອນ",
        variant: "destructive",
      });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="md:col-span-1 shadow-sm border-t-4 border-t-primary">
          <CardHeader className="bg-slate-50 rounded-t-md">
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <ClipboardList className="h-5 w-5 text-primary" />
              ຂໍ້ມູນອໍເດີ
            </CardTitle>
            <CardDescription>
              {isEditing ? `ອໍເດີ #${orderId}` : "ເລືອກອໍເດີສຳລັບການຈັດສົ່ງ"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {!isEditing ? (
              <div className="grid gap-2">
                <Label htmlFor="order_id" className="font-medium">
                  ອໍເດີ <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.order_id}
                  onValueChange={handleSelectChange("order_id")}
                  disabled={isEditing}
                >
                  <SelectTrigger
                    id="order_id"
                    disabled={loadingOrders}
                    className={`h-11 border-gray-300 ${errors.order_id && touched.order_id ? 'border-red-500 ring-red-100' : ''}`}
                  >
                    <SelectValue
                      placeholder={
                        loadingOrders ? "ກຳລັງໂຫຼດອໍເດີ..." : "ເລືອກອໍເດີ"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-64 overflow-y-auto">
                    {orderOptions.length > 0 ? (
                      orderOptions.map((order) => (
                        <SelectItem
                          key={order.id}
                          value={order.id.toString()}
                          className="py-2.5"
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>ອໍເດີ #{order.order_id}</span>
                            <Badge className="ml-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                              ₭{Number(order.total_price || 0).toLocaleString()}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="all" disabled>
                        {orderError || "ບໍ່ມີອໍເດີຮອງຮັບສຳລັບຈັດສົ່ງ"}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.order_id && touched.order_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.order_id}</p>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm font-medium">ອໍເດີ #{orderId}</p>
              </div>
            )}

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="employee_id" className="font-medium">
                  ມອບໝາຍຄົນສົ່ງ
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                        <Info className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">ເລືອກຄົນຂັບລົດທີ່ຈະຮັບຜິດຊອບໃນການຈັດສົ່ງນີ້</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select
                value={formData.employee_id}
                onValueChange={handleSelectChange("employee_id")}
              >
                <SelectTrigger
                  id="employee_id"
                  disabled={loadingEmployees}
                  className="h-11 border-gray-300"
                >
                  <SelectValue
                    placeholder={
                      loadingEmployees ? "ກຳລັງໂຫຼດ..." : "ເລືອກຄົນສົ່ງ"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="popper" className="max-h-64 overflow-y-auto">
                  <SelectItem value="all" className="py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="bg-gray-100 rounded-full p-1">
                        <Ban className="h-3 w-3 text-gray-500" />
                      </span>
                      ບໍ່ໄດ້ມອບໝາຍ (ຈັດສົ່ງເອງ)
                    </div>
                  </SelectItem>
                  {employeeOptions.length > 0 ? (
                    employeeOptions.map((employee) => (
                      <SelectItem
                        key={employee.id}
                        value={employee.id.toString()}
                        className="py-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="bg-primary/10 rounded-full p-1">
                            <User className="h-3 w-3 text-primary" />
                          </span>
                          {employee.first_name} {employee.last_name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="all" disabled>
                      {employeeError || "ບໍ່ມີຄົນຂັບລົດສົ່ງ"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1 shadow-sm border-t-4 border-t-indigo-500">
          <CardHeader className="bg-slate-50 rounded-t-md">
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <Truck className="h-5 w-5 text-indigo-500" />
              ລາຍລະອຽດການສົ່ງ
            </CardTitle>
            <CardDescription>ສະຖານະ ແລະ ເວລາຈັດສົ່ງ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-2">
              <Label htmlFor="status" className="font-medium">
                ສະຖານະ
              </Label>
              <Select
                value={formData.status}
                onValueChange={handleSelectChange("status")}
              >
                <SelectTrigger id="status" className="h-11 border-gray-300">
                  <SelectValue placeholder="ເລືອກສະຖານະ">
                    {formData.status && (
                      <div className="flex items-center">
                        <div
                          className={`h-2 w-2 rounded-full mr-2 ${
                            formData.status === "pending"
                              ? "bg-yellow-500"
                              : formData.status === "preparing"
                              ? "bg-blue-500"
                              : formData.status === "out_for_delivery"
                              ? "bg-purple-500"
                              : formData.status === "delivered"
                              ? "bg-green-500"
                              : formData.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-gray-500"
                          }`}
                        ></div>
                        {statusTranslations[formData.status] || formData.status}
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="pending" className="py-2.5">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full mr-2 bg-yellow-500"></div>
                      {statusTranslations.pending}
                    </div>
                  </SelectItem>
                  <SelectItem value="preparing" className="py-2.5">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full mr-2 bg-blue-500"></div>
                      {statusTranslations.preparing}
                    </div>
                  </SelectItem>
                  <SelectItem value="out_for_delivery" className="py-2.5">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full mr-2 bg-purple-500"></div>
                      {statusTranslations.out_for_delivery}
                    </div>
                  </SelectItem>
                  {isEditing && (
                    <>
                      <SelectItem value="delivered" className="py-2.5">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full mr-2 bg-green-500"></div>
                          {statusTranslations.delivered}
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelled" className="py-2.5">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full mr-2 bg-red-500"></div>
                          {statusTranslations.cancelled}
                        </div>
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="estimated_delivery_time" className="font-medium">
                  ເວລາຈັດສົ່ງໂດຍປະມານ
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                        <Info className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">ເວລາທີ່ຄາດວ່າການຈັດສົ່ງຈະໄປຮອດລູກຄ້າ</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Popover open={datePopover} onOpenChange={setDatePopover}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`h-11 justify-start border-gray-300 font-normal text-left`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                      {date ? format(date, "dd/MM/yyyy") : "ເລືອກວັນທີ"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => {
                        setDate(date);
                        if (date) setDatePopover(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10 h-11 border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="delivery_fee" className="font-medium">
                  ຄ່າຈັດສົ່ງ
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                        <Info className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-xs">ຄ່າຈັດສົ່ງສຳລັບການຈັດສົ່ງນີ້</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                <Input
                  id="delivery_fee"
                  type="number"
                  step="1000"
                  placeholder="0"
                  value={formData.delivery_fee}
                  onChange={handleChange("delivery_fee")}
                  className={`pl-10 h-11 border-gray-300 ${errors.delivery_fee && touched.delivery_fee ? 'border-red-500 ring-red-100' : ''}`}
                />
              </div>
              {errors.delivery_fee && touched.delivery_fee && (
                <p className="text-red-500 text-xs mt-1">{errors.delivery_fee}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-sm border-t-4 border-t-emerald-500">
          <CardHeader className="bg-slate-50 rounded-t-md">
            <CardTitle className="text-xl flex items-center gap-2 text-gray-900">
              <MapPin className="h-5 w-5 text-emerald-500" />
              ສະຖານທີ່ຈັດສົ່ງ
            </CardTitle>
            <CardDescription>
              ທີ່ຢູ່ ແລະ ຂໍ້ມູນຕິດຕໍ່ສຳລັບການຈັດສົ່ງ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="grid gap-2">
              <Label htmlFor="delivery_address" className="font-medium">
                ທີ່ຢູ່ຈັດສົ່ງ <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Textarea
                  id="delivery_address"
                  placeholder="ທີ່ຢູ່ຈັດສົ່ງຄົບຖ້ວນ"
                  value={formData.delivery_address}
                  onChange={handleChange("delivery_address")}
                  className={`resize-none pl-10 pt-2 min-h-[100px] border-gray-300 ${errors.delivery_address && touched.delivery_address ? 'border-red-500 ring-red-100' : ''}`}
                  rows={3}
                />
              </div>
              {errors.delivery_address && touched.delivery_address && (
                <p className="text-red-500 text-xs mt-1">{errors.delivery_address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="phone_number" className="font-medium">
                  ເບີໂທລູກຄ້າ
                </Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="ເບີໂທລູກຄ້າ"
                    value={formData.phone_number}
                    onChange={handleChange("phone_number")}
                    className={`pl-10 h-11 border-gray-300 ${errors.phone_number && touched.phone_number ? 'border-red-500 ring-red-100' : ''}`}
                  />
                </div>
                {errors.phone_number && touched.phone_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="customer_note" className="font-medium">
                  ໝາຍເຫດການຈັດສົ່ງ
                </Label>
                <Textarea
                  id="customer_note"
                  placeholder="ຄຳແນະນຳພິເສດສຳລັບການຈັດສົ່ງ"
                  value={formData.customer_note}
                  onChange={handleChange("customer_note")}
                  rows={3}
                  className="mt-1.5 border-gray-300 min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t bg-slate-50 rounded-b-lg">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      isEditing
                        ? router.push(`/deliveries/${deliveryId}`)
                        : router.push("/deliveries/list")
                    }
                    className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    ຍົກເລີກ
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ກັບຄືນໂດຍບໍ່ບັນທຶກຂໍ້ມູນ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-w-[140px] bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "ກຳລັງບັນທຶກ..." : "ກຳລັງສ້າງ..."}
                </>
              ) : (
                <>
                  {isEditing && <Save className="mr-2 h-4 w-4" />}
                  {isEditing ? "ບັນທຶກການປ່ຽນແປງ" : "ສ້າງການຈັດສົ່ງ"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default DeliveryForm;