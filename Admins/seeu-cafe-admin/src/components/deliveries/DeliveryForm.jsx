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
  Clock,
  MapPin,
  Loader2,
  Save,
  Truck,
  Phone,
  ClipboardList,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DeliveryForm = ({
  isEditing = false,
  initialData = {
    order_id: "",
    employee_id: "",
    delivery_address: "",
    customer_note: "", // เปลี่ยนจาก delivery_notes เป็น customer_note ตาม schema
    phone_number: "",
    status: "pending",
    estimated_delivery_time: "",
    delivery_fee: "", // เพิ่มฟิลด์ใหม่ตาม schema
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

  // Status translations for Lao language
  const statusTranslations = {
    pending: "ລໍຖ້າ",
    preparing: "ກຳລັງກະກຽມ",
    out_for_delivery: "ອອກສົ່ງແລ້ວ",
    delivered: "ສົ່ງແລ້ວ",
    cancelled: "ຍົກເລີກ",
  };

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field) => (value) => {
    if (field === "order_id" && onOrderChange) {
      onOrderChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      preparing: "bg-blue-100 text-blue-800 border-blue-200",
      out_for_delivery: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!isEditing && !formData.order_id) {
      toast({
        title: "ຄຳເຕືອນ",
        description: "ກະລຸນາເລືອກອໍເດີ",
        variant: "destructive",
      });
      return;
    }

    if (!formData.delivery_address) {
      toast({
        title: "ຄຳເຕືອນ",
        description: "ກະລຸນາປ້ອນທີ່ຢູ່ຈັດສົ່ງ",
        variant: "destructive",
      });
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="md:col-span-1 shadow-md border-t-4 border-t-primary">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">
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
                    className="h-11"
                  >
                    <SelectValue
                      placeholder={
                        loadingOrders ? "ກຳລັງໂຫຼດອໍເດີ..." : "ເລືອກອໍເດີ"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
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
                              ${order.total_price?.toFixed(2) || "0.00"}
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
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm font-medium">ອໍເດີ #{orderId}</p>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="employee_id" className="font-medium">
                ມອບໝາຍຄົນສົ່ງ
              </Label>
              <Select
                value={formData.employee_id}
                onValueChange={handleSelectChange("employee_id")}
              >
                <SelectTrigger
                  id="employee_id"
                  disabled={loadingEmployees}
                  className="h-11"
                >
                  <SelectValue
                    placeholder={
                      loadingEmployees ? "ກຳລັງໂຫຼດ..." : "ເລືອກຄົນສົ່ງ"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="py-2.5">
                    ບໍ່ໄດ້ມອບໝາຍ (ຈັດສົ່ງເອງ)
                  </SelectItem>
                  {employeeOptions.length > 0 ? (
                    employeeOptions.map((employee) => (
                      <SelectItem
                        key={employee.id}
                        value={employee.id.toString()}
                        className="py-2.5"
                      >
                        {employee.first_name} {employee.last_name}
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

        <Card className="md:col-span-1 shadow-md border-t-4 border-t-indigo-500">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">
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
                <SelectTrigger id="status" className="h-11">
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
                <SelectContent>
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
              <Label htmlFor="estimated_delivery_time" className="font-medium">
                ເວລາຈັດສົ່ງໂດຍປະມານ
              </Label>
              <div className="flex items-center relative">
                <Clock className="absolute left-3 h-4 w-4 text-gray-400" />
                <Input
                  id="estimated_delivery_time"
                  type="datetime-local"
                  value={formData.estimated_delivery_time}
                  onChange={handleChange("estimated_delivery_time")}
                  className="pl-10 h-11"
                />
              </div>
            </div>

            {/* เพิ่มฟิลด์ delivery_fee ตามโมเดล Delivery */}
            <div className="grid gap-2">
              <Label htmlFor="delivery_fee" className="font-medium">
                ຄ່າຈັດສົ່ງ
              </Label>
              <div className="flex items-center relative">
                <DollarSign className="absolute left-3 h-4 w-4 text-gray-400" />
                <Input
                  id="delivery_fee"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.delivery_fee}
                  onChange={handleChange("delivery_fee")}
                  className="pl-10 h-11"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 shadow-md border-t-4 border-t-emerald-500">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">
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
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Textarea
                  id="delivery_address"
                  placeholder="ທີ່ຢູ່ຈັດສົ່ງຄົບຖ້ວນ"
                  value={formData.delivery_address}
                  onChange={handleChange("delivery_address")}
                  className="resize-none pl-10 pt-2"
                  rows={3}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="phone_number" className="font-medium">
                  ເບີໂທລູກຄ້າ
                </Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="ເບີໂທລູກຄ້າ"
                    value={formData.phone_number}
                    onChange={handleChange("phone_number")}
                    className="pl-10 h-11"
                  />
                </div>
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
                  className="mt-1.5"
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
                        : router.push("/deliveries")
                    }
                    className="w-full sm:w-auto"
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
