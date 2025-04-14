"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDelivery } from "@/hooks/useDelivery";
import { format } from "date-fns";
import { formatDate } from "@/utils/dateFormatter";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "../ui/labels";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "../ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ChevronLeft,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Clock,
  Package,
  CheckCircle,
  Edit,
  FileText,
  AlertTriangle,
  Calendar,
  Loader2,
  ExternalLink,
} from "lucide-react";

// คอมโพเนนต์แสดงสถานะ
const StatusBadge = ({ status }) => {
  const statusColors = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-200",
    },
    preparing: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-200",
    },
    out_for_delivery: {
      bg: "bg-purple-100",
      text: "text-purple-800",
      border: "border-purple-200",
    },
    delivered: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-200",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-200",
    },
  };

  const translations = {
    pending: "ລໍຖ້າ",
    preparing: "ກຳລັງກະກຽມ",
    out_for_delivery: "ອອກສົ່ງແລ້ວ",
    delivered: "ສົ່ງແລ້ວ",
    cancelled: "ຍົກເລີກ",
  };

  const statusConfig = statusColors[status] || statusColors.pending;

  return (
    <Badge
      variant="outline"
      className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
    >
      {translations[status] || status}
    </Badge>
  );
};

// คอมโพเนนต์แสดงข้อมูลการจัดส่ง
const DeliveryInfo = ({ delivery }) => {
  if (!delivery) return null;

  // ฟอร์แมตวันที่เวลา
  const formatDate = (dateStr) => {
    if (!dateStr) return "ບໍ່ມີຂໍ້ມູນ";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          ທີ່ຢູ່ຈັດສົ່ງ
        </h3>
        <div className="flex gap-2 items-start">
          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-gray-900">
            {delivery.delivery_address || "ບໍ່ມີຂໍ້ມູນທີ່ຢູ່"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          ຂໍ້ມູນການຕິດຕໍ່
        </h3>
        {delivery.phone_number ? (
          <div className="flex gap-2 mb-2 items-center">
            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-900">{delivery.phone_number}</p>
          </div>
        ) : delivery.order?.user?.phone ? (
          <div className="flex gap-2 mb-2 items-center">
            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-900">{delivery.order.user.phone}</p>
          </div>
        ) : (
          <div className="flex gap-2 mb-2 items-center text-gray-500">
            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <p>ບໍ່ມີຂໍ້ມູນເບີໂທ</p>
          </div>
        )}

        {delivery.order?.user?.email && (
          <div className="flex gap-2 items-center">
            <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-900">{delivery.order.user.email}</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">ເວລາຈັດສົ່ງ</h3>
        <div className="space-y-3">
          <div className="flex gap-2 items-center">
            <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">ວັນທີ່ສ້າງ:</p>
              <p className="text-gray-900">{formatDate(delivery.created_at)}</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">ເວລາຈັດສົ່ງໂດຍປະມານ:</p>
              <p className="text-gray-900">
                {delivery.estimated_delivery_time
                  ? formatDate(delivery.estimated_delivery_time)
                  : "ບໍ່ໄດ້ກຳນົດ"}
              </p>
            </div>
          </div>

          {delivery.pickup_from_kitchen_time && (
            <div className="flex gap-2 items-center">
              <Package className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">ຮັບຈາກຮ້ານ:</p>
                <p className="text-gray-900">
                  {formatDate(delivery.pickup_from_kitchen_time)}
                </p>
              </div>
            </div>
          )}

          {delivery.actual_delivery_time && (
            <div className="flex gap-2 items-center">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">ສົ່ງສຳເລັດ:</p>
                <p className="text-gray-900">
                  {formatDate(delivery.actual_delivery_time)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          ຄົນຂັບລົດສົ່ງ
        </h3>
        {delivery.employee ? (
          <div className="flex items-center gap-3">
            <Avatar>
              {delivery.employee.profile_photo ? (
                <AvatarImage
                  src={delivery.employee.profile_photo}
                  alt={`${delivery.employee.first_name} ${delivery.employee.last_name}`}
                />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {delivery.employee.first_name?.charAt(0)}
                {delivery.employee.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">
                {delivery.employee.first_name} {delivery.employee.last_name}
              </p>
              {delivery.employee.phone && (
                <p className="text-sm text-gray-500">
                  {delivery.employee.phone}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <User className="h-5 w-5 mr-2 text-gray-400" />
            <p>ບໍ່ໄດ້ມອບໝາຍຄົນຂັບລົດ</p>
          </div>
        )}
      </div>

      {delivery.customer_note && (
        <div className="md:col-span-2">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            ໝາຍເຫດຈາກລູກຄ້າ
          </h3>
          <div className="p-3 bg-gray-50 rounded-md text-gray-700">
            {delivery.customer_note}
          </div>
        </div>
      )}

      {delivery.delivery_fee !== null &&
        delivery.delivery_fee !== undefined && (
          <div className="md:col-span-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              ຄ່າຈັດສົ່ງ
            </h3>
            <p className="text-xl font-semibold text-primary">
              ₭{Number(delivery.delivery_fee).toLocaleString()}
            </p>
          </div>
        )}
    </div>
  );
};

// คอมโพเนนต์แสดงข้อมูลออเดอร์
const OrderDetails = ({ order }) => {
  if (!order) {
    return (
      <div className="text-center py-4">
        <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
        <p className="text-gray-600">ບໍ່ພົບຂໍ້ມູນອໍເດີ</p>
      </div>
    );
  }

  const subtotal =
    order.order_details?.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) || 0;

  return (
    <div>
      {order.order_details && order.order_details.length > 0 ? (
        <div className="divide-y">
          {order.order_details.map((item) => (
            <div key={item.id} className="py-3 flex justify-between">
              <div>
                <p className="font-medium">
                  {item.quantity} ×{" "}
                  {item.food_menu?.name ||
                    item.beverage_menu?.name ||
                    "ສິນຄ້າໄດ້ຖືກລຶບແລ້ວ"}
                </p>
                {item.notes && (
                  <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                )}
              </div>
              <p className="font-medium">
                ₭{Number(item.price).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-3">ບໍ່ມີລາຍການສິນຄ້າ</p>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between py-1">
          <p className="text-gray-600">ລວມລາຄາສິນຄ້າ</p>
          <p className="font-medium">₭{subtotal.toLocaleString()}</p>
        </div>
        <div className="flex justify-between py-1">
          <p className="text-gray-600">ຄ່າຈັດສົ່ງ</p>
          <p className="font-medium">
            ₭{Number(order.delivery_fee || 0).toLocaleString()}
          </p>
        </div>
        {order.discount_amount > 0 && (
          <div className="flex justify-between py-1">
            <p className="text-gray-600">ສ່ວນຫຼຸດ</p>
            <p className="font-medium text-green-600">
              -₭{Number(order.discount_amount).toLocaleString()}
            </p>
          </div>
        )}
        <div className="flex justify-between py-2 text-lg font-bold">
          <p>ລວມທັງໝົດ</p>
          <p>₭{Number(order.total_price).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => window.open(`/orders/${order.id}`, "_blank")}
        >
          <FileText className="mr-2 h-4 w-4" />
          ເບິ່ງລາຍລະອຽດອໍເດີເຕັມ
          <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// คอมโพเนนต์แสดงไทม์ไลน์สถานะ
const StatusTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        ບໍ່ມີຂໍ້ມູນການອັບເດດສະຖານະ
      </p>
    );
  }

  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-yellow-500" />,
    confirmed: <CheckCircle className="h-4 w-4 text-blue-500" />,
    preparing: <Package className="h-4 w-4 text-blue-500" />,
    ready: <Package className="h-4 w-4 text-green-500" />,
    out_for_delivery: <Truck className="h-4 w-4 text-purple-500" />,
    delivered: <CheckCircle className="h-4 w-4 text-green-500" />,
    cancelled: <AlertTriangle className="h-4 w-4 text-red-500" />,
  };

  const statusLabels = {
    pending: "ລໍຖ້າ",
    confirmed: "ຢືນຢັນແລ້ວ",
    preparing: "ກຳລັງກະກຽມ",
    ready: "ພ້ອມສົ່ງ",
    out_for_delivery: "ອອກສົ່ງແລ້ວ",
    delivered: "ສົ່ງແລ້ວ",
    cancelled: "ຍົກເລີກ",
  };
  // Format date function
  const formatDate = (dateStr) => {
    if (!dateStr) return "ບໍ່ມີຂໍ້ມູນ";
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return dateStr;
    }
  };

  // Sort timeline by latest first
  const sortedTimeline = [...timeline].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200" />
      {sortedTimeline.map((event, index) => (
        <div key={index} className="relative flex gap-4 pb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white z-10 border border-primary">
            {statusIcons[event.status] || (
              <Clock className="h-4 w-4 text-gray-500" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {statusLabels[event.status] || event.status}
            </span>
            <time className="text-xs text-gray-500">
              {formatDate(event.timestamp)}
            </time>
            {event.notes && (
              <p className="mt-1 text-sm text-gray-600">{event.notes}</p>
            )}
            {event.employee && (
              <p className="text-xs text-gray-500 mt-1">
                ໂດຍ: {event.employee.first_name} {event.employee.last_name}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// คอมโพเนนต์แสดงข้อมูลลูกค้า
const CustomerInfo = ({ user }) => {
  const router = useRouter();

  if (!user) {
    return <p className="text-gray-500 text-center py-4">ບໍ່ມີຂໍ້ມູນລູກຄ້າ</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user.first_name?.charAt(0) || ""}
            {user.last_name?.charAt(0) || ""}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="font-medium text-lg">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>
      </div>

      {user.phone && (
        <div className="flex items-center gap-2 text-gray-700">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{user.phone}</span>
        </div>
      )}

      {user.address && (
        <div className="flex items-start gap-2 text-gray-700">
          <MapPin className="h-4 w-4 text-gray-400 mt-1" />
          <span>{user.address}</span>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full mt-2"
        onClick={() => router.push(`/customers/${user.id}`)}
      >
        <User className="mr-2 h-4 w-4" />
        ເບິ່ງໂປຣໄຟລລູກຄ້າ
      </Button>
    </div>
  );
};

// DialogContent สำหรับอัพเดทสถานะ
const StatusUpdateDialog = ({ delivery, onUpdateStatus, open, setOpen }) => {
  const [newStatus, setNewStatus] = useState(delivery?.status || "");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!newStatus) return;

    setSubmitting(true);
    try {
      await onUpdateStatus(newStatus, notes);
      setNotes("");
      setOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ອັບເດດສະຖານະການຈັດສົ່ງ</DialogTitle>
          <DialogDescription>
            ປ່ຽນແປງສະຖານະການຈັດສົ່ງສຳລັບອໍເດີນີ້
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">ສະຖານະໃໝ່</Label>
            <Select
              defaultValue={delivery?.status}
              onValueChange={setNewStatus}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="ເລືອກສະຖານະ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">ລໍຖ້າ</SelectItem>
                <SelectItem value="preparing">ກຳລັງກະກຽມ</SelectItem>
                <SelectItem value="out_for_delivery">ອອກສົ່ງແລ້ວ</SelectItem>
                <SelectItem value="delivered">ສົ່ງແລ້ວ</SelectItem>
                <SelectItem value="cancelled">ຍົກເລີກ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">ໝາຍເຫດ (ຖ້າມີ)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ເພີ່ມໝາຍເຫດກ່ຽວກັບການປ່ຽນແປງສະຖານະ"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            ຍົກເລີກ
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ກຳລັງອັບເດດ...
              </>
            ) : (
              "ອັບເດດສະຖານະ"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// หน้าแสดงรายละเอียดการจัดส่ง
export default function DeliveryDetails() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const { delivery, loading, error, updateStatus, fetchDelivery } = useDelivery(
    params.id
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg text-gray-600">
            ກຳລັງໂຫຼດຂໍ້ມູນການຈັດສົ່ງ...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> ກັບຄືນ
        </Button>

        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>ຂໍ້ຜິດພາດ</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> ກັບຄືນ
        </Button>

        <Alert>
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>ບໍ່ພົບຂໍ້ມູນ</AlertTitle>
          <AlertDescription>ບໍ່ພົບຂໍ້ມູນການຈັດສົ່ງທີ່ຕ້ອງການ</AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleStatusUpdate = async (status, notes) => {
    await updateStatus(status, notes);
    await fetchDelivery();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mr-4"
            size="sm"
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> ກັບຄືນ
          </Button>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            ການຈັດສົ່ງ #{delivery.id}
            <StatusBadge status={delivery.status} />
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setStatusDialogOpen(true)}>
            <Clock className="mr-2 h-4 w-4" /> ອັບເດດສະຖານະ
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/deliveries/${delivery.id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" /> ແກ້ໄຂຂໍ້ມູນ
          </Button>

          <Button
            onClick={() => router.push(`/deliveries/${delivery.id}/track`)}
          >
            <Truck className="mr-2 h-4 w-4" /> ຕິດຕາມການຈັດສົ່ງ
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="info">ຂໍ້ມູນຈັດສົ່ງ</TabsTrigger>
              <TabsTrigger value="order">ລາຍລະອຽດອໍເດີ</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="border rounded-md mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">ຂໍ້ມູນການຈັດສົ່ງ</CardTitle>
                  <CardDescription>
                    ອໍເດີ #{delivery.order?.order_id} • ສ້າງວັນທີ:{" "}
                    {formatDate(delivery.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DeliveryInfo delivery={delivery} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="order" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">ລາຍລະອຽດອໍເດີ</CardTitle>
                  <CardDescription>
                    {delivery.order?.order_id &&
                      `ອໍເດີ #${delivery.order.order_id}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OrderDetails order={delivery.order} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">ສະຖານະການຈັດສົ່ງ</CardTitle>
            </CardHeader>
            <CardContent>
              <StatusTimeline timeline={delivery.order?.timeline} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">ຂໍ້ມູນລູກຄ້າ</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerInfo user={delivery.order?.user} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <StatusUpdateDialog
        delivery={delivery}
        onUpdateStatus={handleStatusUpdate}
        open={statusDialogOpen}
        setOpen={setStatusDialogOpen}
      />
    </div>
  );
}
