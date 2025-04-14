"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useOrder,
  useUpdateOrderStatus,
  useUpdateOrderTime,
  formatCurrency,
} from "@/hooks/orderHooks";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  CreditCard,
  ArrowLeft,
  Printer,
  Loader2,
  Edit2,
  CheckCircle2,
  Clock,
  Coffee,
  Package,
  Check,
  X,
  Calendar,
  MessageSquare,
  RefreshCw,
  Home,
  Utensils,
} from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const OrderDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded"></div>
        <div className="h-10 w-full bg-gray-200 rounded"></div>
      </div>

      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="overflow-hidden bg-gray-100 rounded-lg">
          <div className="h-10 w-full bg-gray-200"></div>
          <div className="space-y-4 p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="flex space-x-3">
                  <div className="h-12 w-12 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
        <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
              <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-6 w-28 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatusBadge Component
const StatusBadge = ({ status }) => {
  const normalizedStatus = status.toLowerCase();

  const statusConfig = {
    pending: {
      icon: Clock,
      styles: "bg-amber-100 text-amber-800 border-amber-200",
      label: "ລໍຖ້າ",
    },
    processing: {
      icon: Coffee,
      styles: "bg-blue-100 text-blue-800 border-blue-200",
      label: "ກຳລັງຊົງ",
    },
    ready: {
      icon: Package,
      styles: "bg-green-100 text-green-800 border-green-200",
      label: "ພ້ອມສົ່ງ",
    },
    delivered: {
      icon: Check,
      styles: "bg-purple-100 text-purple-800 border-purple-200",
      label: "ສົ່ງແລ້ວ",
    },
    cancelled: {
      icon: X,
      styles: "bg-red-100 text-red-800 border-red-200",
      label: "ຍົກເລີກ",
    },
  };

  const config = statusConfig[normalizedStatus] || {
    icon: Coffee,
    styles: "bg-gray-100 text-gray-800 border-gray-200",
    label: status || "Unknown",
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.styles}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </span>
  );
};

// TimelineItem Component
const TimelineItem = ({ timestamp, status, notes, isLast }) => {
  const normalizedStatus = status.toLowerCase();

  // Status icon mapping
  const iconMap = {
    created: Clock,
    pending: Clock,
    processing: Coffee,
    ready: Package,
    delivered: Check,
    cancelled: X,
    completed: CheckCircle2,
  };

  const Icon = iconMap[normalizedStatus] || Coffee;

  return (
    <div className="relative">
      <div className="flex items-center">
        <div
          className={`absolute left-0 rounded-full w-8 h-8 flex items-center justify-center
          ${
            normalizedStatus === "cancelled"
              ? "bg-red-100 text-red-600"
              : normalizedStatus === "delivered" ||
                normalizedStatus === "completed"
              ? "bg-green-100 text-green-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>
        {!isLast && (
          <div className="absolute top-8 bottom-0 left-4 w-0.5 bg-gray-200"></div>
        )}
        <div className="ml-12">
          <h4 className="font-medium text-gray-900">
            {normalizedStatus === "created"
              ? "ສ້າງອໍເດີ້"
              : normalizedStatus === "pending"
              ? "ລໍຖ້າ"
              : normalizedStatus === "processing"
              ? "ກຳລັງຊົງ"
              : normalizedStatus === "ready"
              ? "ພ້ອມສົ່ງ"
              : normalizedStatus === "delivered"
              ? "ສົ່ງແລ້ວ"
              : normalizedStatus === "cancelled"
              ? "ຍົກເລີກ"
              : "ສຳເລັດ"}
          </h4>
          <time className="block text-sm text-gray-500">
            {new Date(timestamp).toLocaleString()}
          </time>
          {notes && (
            <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
              {notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main OrderDetail Component
const OrderDetail = ({ orderId }) => {
  const router = useRouter();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [timeUpdate, setTimeUpdate] = useState({
    timeType: "",
    newTime: "",
    reason: "",
    notifyCustomer: true,
    notificationMessage: "",
  });

  // Fetch order details
  const { order, loading, error, timeline, timeUpdates, refetch } =
    useOrder(orderId);

  // Update order status
  const { updateStatus, loading: updatingStatus } = useUpdateOrderStatus();

  // Update order time
  const { updateTime, loading: updatingTime } = useUpdateOrderTime();

  // Handle back button click
  const handleBackClick = () => {
    router.push("/orders");
  };

  // Handle edit status click
  const handleEditStatusClick = () => {
    if (order) {
      setNewStatus(order.status);
      setStatusNote("");
      setIsEditingStatus(true);
    }
  };

  // Handle edit time click
  const handleEditTimeClick = () => {
    if (order) {
      setTimeUpdate({
        timeType: "estimated_ready_time",
        newTime: order.estimated_ready_time
          ? new Date(order.estimated_ready_time).toISOString().slice(0, 16)
          : new Date(Date.now() + 30 * 60 * 1000).toISOString().slice(0, 16),
        reason: "",
        notifyCustomer: true,
        notificationMessage: `ເວລາເຕຣິ່ມຂອງທ່ານໄດ້ຖືກປັບປຸງ. ກະລຸນາກວດສອບລາຍລະອຽດ.`,
      });
      setIsEditingTime(true);
    }
  };

  // Handle status change
  const handleStatusChange = (value) => {
    setNewStatus(value);
  };

  // Handle status save
  const handleSaveStatus = async () => {
    try {
      await updateStatus(orderId, newStatus, null, statusNote || undefined);
      setIsEditingStatus(false);
      refetch();
      toast.success(`ອັບເດດສະຖານະເປັນ ${newStatus} ສຳເລັດ`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("ການອັບເດດສະຖານະລົ້ມເຫຼວ");
    }
  };

  // Handle time save
  const handleSaveTime = async () => {
    try {
      await updateTime(orderId, {
        timeType: timeUpdate.timeType,
        newTime: new Date(timeUpdate.newTime),
        reason: timeUpdate.reason,
        notifyCustomer: timeUpdate.notifyCustomer,
        notificationMessage: timeUpdate.notificationMessage,
      });
      setIsEditingTime(false);
      refetch();
      toast.success("ອັບເດດເວລາສຳເລັດ");
    } catch (error) {
      console.error("Failed to update time:", error);
      toast.error("ການອັບເດດເວລາລົ້ມເຫຼວ");
    }
  };

  // Handle print
  const handlePrint = () => {
    toast.success("ກຳລັງພິມໃບບິນ...", { duration: 2000 });
    setTimeout(() => {
      window.print();
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-['Phetsarath_OT']">
        <div className="max-w-6xl mx-auto">
          <OrderDetailSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-['Phetsarath_OT']">
        <div className="max-w-6xl mx-auto text-center py-10">
          <Card>
            <CardContent className="pt-10 pb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl text-red-600 mb-2">
                ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ
              </h2>
              <p className="text-gray-600 mb-6">
                {error?.message || "ກະລຸນາລອງໃໝ່ອີກຄັ້ງ"}
              </p>
              <Button onClick={handleBackClick} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                ກັບໄປໜ້າລາຍການສັ່ງຊື້
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-['Phetsarath_OT']">
        <div className="max-w-6xl mx-auto text-center py-10">
          <Card>
            <CardContent className="pt-10 pb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Coffee className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-xl text-gray-800 mb-2">
                ບໍ່ພົບຂໍ້ມູນການສັ່ງຊື້
              </h2>
              <p className="text-gray-600 mb-6">
                ຂໍ້ມູນການສັ່ງຊື້ທີ່ທ່ານຄົ້ນຫາບໍ່ມີໃນລະບົບ
              </p>
              <Button onClick={handleBackClick} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                ກັບໄປໜ້າລາຍການສັ່ງຊື້
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-['Phetsarath_OT']">
      <div className="max-w-6xl mx-auto">
        {/* Order Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">
              ອໍເດີ້ #{order.order_id}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="print:hidden"
            >
              <Printer className="w-4 h-4 mr-2" />
              ພິມໃບບິນ
            </Button>
            {!isEditingStatus && (
              <Button
                variant="default"
                onClick={handleEditStatusClick}
                className="bg-blue-600 hover:bg-blue-700 print:hidden"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                ແກ້ໄຂສະຖານະ
              </Button>
            )}
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800">
                ຂໍ້ມູນອໍເດີ້
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">ເວລາສັ່ງຊື້</div>
                <div className="font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                  {new Date(order.create_at).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">ປະເພດການສັ່ງຊື້</div>
                <div className="font-medium flex items-center">
                  {order.order_type === "pickup" ? (
                    <>
                      <Home className="w-4 h-4 mr-1 text-gray-400" />
                      ຮັບດ້ວຍຕົນເອງ
                    </>
                  ) : order.order_type === "delivery" ? (
                    <>
                      <Truck className="w-4 h-4 mr-1 text-gray-400" />
                      ສົ່ງເຖິງບ້ານ
                    </>
                  ) : (
                    <>
                      <Utensils className="w-4 h-4 mr-1 text-gray-400" />
                      ຮັບປະທານໃນຮ້ານ
                    </>
                  )}
                </div>
              </div>
              {order.pickup_code && (
                <div>
                  <div className="text-sm text-gray-500">ລະຫັດຮັບສິນຄ້າ</div>
                  <div className="font-bold text-xl tracking-wide text-blue-600">
                    {order.pickup_code}
                  </div>
                </div>
              )}
              {order.pickup_time && (
                <div>
                  <div className="text-sm text-gray-500">ເວລານັດຮັບສິນຄ້າ</div>
                  <div className="font-medium">
                    {new Date(order.pickup_time).toLocaleString()}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800">
                ຂໍ້ມູນລູກຄ້າ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.user && (
                <>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">ຊື່</div>
                    <div className="font-medium flex items-center">
                      <User className="w-4 h-4 mr-1 text-gray-400" />
                      {order.user.first_name} {order.user.last_name}
                    </div>
                  </div>
                  {order.user.email && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">ອີເມວ</div>
                      <div className="font-medium flex items-center">
                        <Mail className="w-4 h-4 mr-1 text-gray-400" />
                        {order.user.email}
                      </div>
                    </div>
                  )}
                  {order.user.phone && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">ເບີໂທ</div>
                      <div className="font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-1 text-gray-400" />
                        {order.user.phone}
                      </div>
                    </div>
                  )}
                </>
              )}
              {!order.user && (
                <div className="text-gray-500 italic">ບໍ່ມີຂໍ້ມູນລູກຄ້າ</div>
              )}
            </CardContent>
          </Card>

          {order.order_type === "delivery" && order.delivery && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">
                  ຂໍ້ມູນການຈັດສົ່ງ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.delivery.delivery_address && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">ທີ່ຢູ່ຈັດສົ່ງ</div>
                    <div className="font-medium flex items-start">
                      <MapPin className="w-4 h-4 mr-1 mt-1 flex-shrink-0 text-gray-400" />
                      <span>{order.delivery.delivery_address}</span>
                    </div>
                  </div>
                )}
                {order.delivery.customer_note && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">ໝາຍເຫດຈາກລູກຄ້າ</div>
                    <div className="font-medium flex items-start">
                      <MessageSquare className="w-4 h-4 mr-1 mt-1 flex-shrink-0 text-gray-400" />
                      <span>{order.delivery.customer_note}</span>
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">
                    ເວລາທີ່ຄາດວ່າຈະສົ່ງຮອດ
                  </div>
                  <div className="font-medium">
                    {order.delivery.estimated_delivery_time
                      ? new Date(
                          order.delivery.estimated_delivery_time
                        ).toLocaleString()
                      : "ບໍ່ກຳນົດ"}
                  </div>
                </div>
                {order.delivery.delivery_fee !== null && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">ຄ່າຈັດສົ່ງ</div>
                    <div className="font-medium">
                      {formatCurrency(order.delivery.delivery_fee)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {order.order_type === "table" && order.table && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">
                  ຂໍ້ມູນໂຕະ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">ໂຕະເບີ</div>
                  <div className="font-medium text-xl">
                    {order.table.number}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-500">ຄວາມຈຸ</div>
                  <div className="font-medium">{order.table.capacity} ຄົນ</div>
                </div>
                {order.table.current_session_start && (
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">ເວລາເລີ່ມໃຊ້ໂຕະ</div>
                    <div className="font-medium">
                      {new Date(
                        order.table.current_session_start
                      ).toLocaleString()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Status & Time Section */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-800">
              ສະຖານະແລະເວລາ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-2">ສະຖານະປັດຈຸບັນ</div>
                <div className="flex items-center">
                  <StatusBadge status={order.status} />
                  {!isEditingStatus && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditStatusClick}
                      className="ml-2 text-blue-600 hover:text-blue-700 print:hidden"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-2">
                  ເວລາທີ່ຄາດວ່າຈະເສັດ
                </div>
                <div className="flex items-center">
                  <div className="font-medium">
                    {order.estimated_ready_time
                      ? new Date(order.estimated_ready_time).toLocaleString()
                      : "ບໍ່ມີກຳນົດ"}
                  </div>
                  {!isEditingTime && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleEditTimeClick}
                      className="ml-2 text-blue-600 hover:text-blue-700 print:hidden"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {order.actual_ready_time && (
                  <div className="mt-2">
                    <div className="text-sm text-gray-500">ເວລາເສັດຈິງ</div>
                    <div className="font-medium">
                      {new Date(order.actual_ready_time).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isEditingStatus && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-700 mb-3">ແກ້ໄຂສະຖານະ</h3>
                <div className="space-y-4">
                  <div>
                    <Label>ເລືອກສະຖານະໃໝ່</Label>
                    <Select
                      value={newStatus}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">ລໍຖ້າ</SelectItem>
                        <SelectItem value="processing">ກຳລັງຊົງ</SelectItem>
                        <SelectItem value="ready">ພ້ອມສົ່ງ</SelectItem>
                        <SelectItem value="delivered">ສົ່ງແລ້ວ</SelectItem>
                        <SelectItem value="cancelled">ຍົກເລີກ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>ໝາຍເຫດ</Label>
                    <Textarea
                      value={statusNote}
                      onChange={(e) => setStatusNote(e.target.value)}
                      placeholder="ເຫດຜົນໃນການປ່ຽນສະຖານະ..."
                      className="mt-1"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleSaveStatus}
                      disabled={updatingStatus}
                    >
                      {updatingStatus ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ກຳລັງບັນທຶກ...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          ບັນທຶກ
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {isEditingTime && (
              <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium text-gray-700 mb-3">ແກ້ໄຂເວລາ</h3>
                <div className="space-y-4">
                  <div>
                    <Label>ເລືອກປະເພດເວລາ</Label>
                    <Select
                      value={timeUpdate.timeType}
                      onValueChange={(value) =>
                        setTimeUpdate({ ...timeUpdate, timeType: value })
                      }
                    >
                      <SelectTrigger className="mt-1 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estimated_ready_time">
                          ເວລາທີ່ຄາດວ່າຈະເສັດ
                        </SelectItem>
                        {order.order_type === "pickup" && (
                          <SelectItem value="pickup_time">
                            ເວລານັດຮັບສິນຄ້າ
                          </SelectItem>
                        )}
                        {order.order_type === "delivery" && order.delivery && (
                          <SelectItem value="estimated_delivery_time">
                            ເວລາທີ່ຄາດວ່າຈະສົ່ງຮອດ
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>ເວລາໃໝ່</Label>
                    <Input
                      type="datetime-local"
                      value={timeUpdate.newTime}
                      onChange={(e) =>
                        setTimeUpdate({
                          ...timeUpdate,
                          newTime: e.target.value,
                        })
                      }
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>ເຫດຜົນໃນການປ່ຽນເວລາ</Label>
                    <Textarea
                      value={timeUpdate.reason}
                      onChange={(e) =>
                        setTimeUpdate({ ...timeUpdate, reason: e.target.value })
                      }
                      placeholder="ເຫດຜົນໃນການປ່ຽນເວລາ..."
                      className="mt-1"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id="notifyCustomer"
                      checked={timeUpdate.notifyCustomer}
                      onChange={(e) =>
                        setTimeUpdate({
                          ...timeUpdate,
                          notifyCustomer: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <Label htmlFor="notifyCustomer" className="cursor-pointer">
                      ແຈ້ງເຕືອນລູກຄ້າ
                    </Label>
                  </div>

                  {timeUpdate.notifyCustomer && (
                    <div>
                      <Label>ຂໍ້ຄວາມແຈ້ງເຕືອນ</Label>
                      <Textarea
                        value={timeUpdate.notificationMessage}
                        onChange={(e) =>
                          setTimeUpdate({
                            ...timeUpdate,
                            notificationMessage: e.target.value,
                          })
                        }
                        placeholder="ຂໍ້ຄວາມທີ່ຈະສົ່ງຫາລູກຄ້າ..."
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingTime(false)}
                    >
                      ຍົກເລີກ
                    </Button>
                    <Button onClick={handleSaveTime} disabled={updatingTime}>
                      {updatingTime ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ກຳລັງບັນທຶກ...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          ບັນທຶກ
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card className="mb-6 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-800">
              ລາຍການສິນຄ້າ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left border-b">
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                      ລາຍການ
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                      ຈຳນວນ
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                      ລາຄາ
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                      ລວມ
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                      ສະຖານະ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_details &&
                    order.order_details.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="font-medium">
                            {item.food_menu?.name ||
                              item.beverage_menu?.name ||
                              "Unknown Item"}
                          </div>
                          {item.notes && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.is_ready ? (
                            <Badge
                              variant="success"
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              ພ້ອມແລ້ວ
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-amber-50 text-amber-800 border-amber-200"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              ຍັງບໍ່ເສັດ
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">ລວມຍອດ</span>
                  <span className="font-medium">
                    {formatCurrency(order.total_price)}
                  </span>
                </div>
                {order.order_type === "delivery" &&
                  order.delivery?.delivery_fee && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ຄ່າຈັດສົ່ງ</span>
                      <span className="font-medium">
                        {formatCurrency(order.delivery.delivery_fee)}
                      </span>
                    </div>
                  )}
                {order.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">ສ່ວນຫຼຸດ</span>
                    <span className="font-medium text-green-600">
                      -{formatCurrency(order.discount_amount)}
                    </span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-gray-900 font-semibold">ລວມທັງໝົດ</span>
                  <span className="text-gray-900 font-bold text-lg">
                    {formatCurrency(
                      order.total_price +
                        (order.delivery?.delivery_fee || 0) -
                        (order.discount_amount || 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Information if available */}
        {order.payments && order.payments.length > 0 && (
          <Card className="mb-6 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800">
                ຂໍ້ມູນການຊຳລະເງິນ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left border-b">
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                        ວິທີການຊຳລະ
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                        ວັນທີ
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">
                        ຈຳນວນເງິນ
                      </th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-center">
                        ສະຖານະ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.payments.map((payment) => (
                      <tr key={payment.id} className="border-b">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                            <span>{payment.method}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {new Date(payment.payment_date).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right font-medium">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <Badge
                            className={
                              payment.status === "completed"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : payment.status === "pending"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {payment.status === "completed"
                              ? "ສຳເລັດ"
                              : payment.status === "pending"
                              ? "ລໍຖ້າ"
                              : "ຍົກເລີກ"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Notes */}
        {order.preparation_notes && (
          <Card className="mb-6 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-800">
                ໝາຍເຫດ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{order.preparation_notes}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Timeline */}
        <Tabs defaultValue="timeline" className="mb-6">
          <TabsList>
            <TabsTrigger value="timeline">ໄທມ໌ໄລນ໌</TabsTrigger>
            <TabsTrigger value="timeUpdates">ການປັບປຸງເວລາ</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">
                  ປະຫວັດສະຖານະ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 ml-4 mt-4">
                  {timeline && timeline.length > 0 ? (
                    timeline.map((entry, index) => (
                      <TimelineItem
                        key={entry.id}
                        timestamp={entry.timestamp}
                        status={entry.status}
                        notes={entry.notes}
                        isLast={index === timeline.length - 1}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500 italic">ບໍ່ມີຂໍ້ມູນໄທມ໌ໄລນ໌</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="timeUpdates">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium text-gray-800">
                  ປະຫວັດການປັບປຸງເວລາ
                </CardTitle>
              </CardHeader>
              <CardContent>
                {timeUpdates && timeUpdates.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-left border-b">
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                            ວັນທີປັບປຸງ
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                            ປະເພດເວລາ
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                            ເວລາເກົ່າ
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                            ເວລາໃໝ່
                          </th>
                          <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">
                            ເຫດຜົນ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {timeUpdates.map((update) => (
                          <tr key={update.id} className="border-b">
                            <td className="px-4 py-3">
                              {new Date(update.created_at).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              {update.previous_time_type ===
                              "estimated_ready_time"
                                ? "ເວລາທີ່ຄາດວ່າຈະເສັດ"
                                : update.previous_time_type === "pickup_time"
                                ? "ເວລານັດຮັບສິນຄ້າ"
                                : "ເວລາທີ່ຄາດວ່າຈະສົ່ງຮອດ"}
                            </td>
                            <td className="px-4 py-3">
                              {update.previous_time
                                ? new Date(
                                    update.previous_time
                                  ).toLocaleString()
                                : "ບໍ່ມີກຳນົດ"}
                            </td>
                            <td className="px-4 py-3">
                              {new Date(update.new_time).toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              {update.reason || "ບໍ່ມີເຫດຜົນ"}
                              {update.notified_customer && (
                                <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                                  ແຈ້ງລູກຄ້າແລ້ວ
                                </Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">ບໍ່ມີການປັບປຸງເວລາ</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderDetail;
