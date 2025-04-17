"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDelivery } from "@/hooks/useDelivery";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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
import { Skeleton } from "@/components/ui/skeleton";
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
  ArrowUpRight,
  X,
  RefreshCw,
  Clipboard,
  MessageSquare,
  ShoppingBag,
  Ban,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Status color configurations
const statusConfigs = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-800",
    border: "border-yellow-200",
    icon: <Clock className="h-4 w-4 text-yellow-600" />,
    iconLarge: <Clock className="h-5 w-5 text-yellow-600" />,
  },
  preparing: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
    icon: <Package className="h-4 w-4 text-blue-600" />,
    iconLarge: <Package className="h-5 w-5 text-blue-600" />,
  },
  out_for_delivery: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
    icon: <Truck className="h-4 w-4 text-purple-600" />,
    iconLarge: <Truck className="h-5 w-5 text-purple-600" />,
  },
  delivered: {
    bg: "bg-green-100",
    text: "text-green-800",
    border: "border-green-200",
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    iconLarge: <CheckCircle className="h-5 w-5 text-green-600" />,
  },
  cancelled: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
    icon: <X className="h-4 w-4 text-red-600" />,
    iconLarge: <Ban className="h-5 w-5 text-red-600" />,
  },
};

// Status translations 
const translateStatus = (status) => {
  const translations = {
    pending: "ລໍຖ້າ",
    preparing: "ກຳລັງກະກຽມ",
    out_for_delivery: "ອອກສົ່ງແລ້ວ",
    delivered: "ສົ່ງແລ້ວ",
    cancelled: "ຍົກເລີກ",
  };
  return translations[status] || status;
};

// Status badge component
const StatusBadge = ({ status, size = "md" }) => {
  const statusConfig = statusConfigs[status] || statusConfigs.pending;
  
  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} ${
        size === "lg" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs"
      }`}
    >
      {size === "lg" ? statusConfig.iconLarge : statusConfig.icon}
      <span>{translateStatus(status)}</span>
    </Badge>
  );
};

// Format date with contextual display
const formatDateDisplay = (dateString) => {
  if (!dateString) return "ບໍ່ມີຂໍ້ມູນ";
  
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return `ມື້ນີ້ ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `ມື້ວານນີ້ ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'dd/MM/yyyy HH:mm');
  }
};

// Delivery info section
const DeliveryInfo = ({ delivery }) => {
  if (!delivery) return null;
  
  const { toast } = useToast();

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description: message,
        duration: 2000,
      });
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          ທີ່ຢູ່ຈັດສົ່ງ
        </h3>
        <div className="flex gap-2 items-start group">
          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-gray-900">{delivery.delivery_address || "ບໍ່ມີຂໍ້ມູນທີ່ຢູ່"}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary hover:text-primary/80 p-0 h-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => copyToClipboard(delivery.delivery_address, "ສຳເນົາທີ່ຢູ່ແລ້ວ")}
            >
              <Clipboard className="h-3 w-3 mr-1" /> ສຳເນົາທີ່ຢູ່
            </Button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          ຂໍ້ມູນການຕິດຕໍ່
        </h3>
        {delivery.phone_number ? (
          <div className="flex gap-2 mb-2 items-center group">
            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-gray-900">{delivery.phone_number}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
                  onClick={() => copyToClipboard(delivery.phone_number, "ສຳເນົາເບີໂທແລ້ວ")}
                >
                  <Clipboard className="h-3 w-3 mr-1" /> ສຳເນົາ
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-green-600 hover:text-green-700 p-0 h-auto"
                  onClick={() => window.location.href = `tel:${delivery.phone_number}`}
                >
                  <Phone className="h-3 w-3 mr-1" /> ໂທຫາ
                </Button>
              </div>
            </div>
          </div>
        ) : delivery.order?.user?.phone ? (
          <div className="flex gap-2 mb-2 items-center group">
            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-gray-900">{delivery.order.user.phone}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
                  onClick={() => copyToClipboard(delivery.order.user.phone, "ສຳເນົາເບີໂທແລ້ວ")}
                >
                  <Clipboard className="h-3 w-3 mr-1" /> ສຳເນົາ
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-green-600 hover:text-green-700 p-0 h-auto"
                  onClick={() => window.location.href = `tel:${delivery.order.user.phone}`}
                >
                  <Phone className="h-3 w-3 mr-1" /> ໂທຫາ
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-2 mb-2 items-center text-gray-500">
            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <p>ບໍ່ມີຂໍ້ມູນເບີໂທ</p>
          </div>
        )}

        {delivery.order?.user?.email && (
          <div className="flex gap-2 items-center group">
            <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-gray-900">{delivery.order.user.email}</p>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-primary hover:text-primary/80 p-0 h-auto"
                  onClick={() => copyToClipboard(delivery.order.user.email, "ສຳເນົາອີເມລແລ້ວ")}
                >
                  <Clipboard className="h-3 w-3 mr-1" /> ສຳເນົາ
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                  onClick={() => window.location.href = `mailto:${delivery.order.user.email}`}
                >
                  <Mail className="h-3 w-3 mr-1" /> ສົ່ງອີເມລ
                </Button>
              </div>
            </div>
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
              <p className="text-gray-900">{formatDateDisplay(delivery.created_at)}</p>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">ເວລາຈັດສົ່ງໂດຍປະມານ:</p>
              <p className="text-gray-900">
                {delivery.estimated_delivery_time
                  ? formatDateDisplay(delivery.estimated_delivery_time)
                  : <span className="text-gray-500 italic">ບໍ່ໄດ້ກຳນົດ</span>}
              </p>
            </div>
          </div>

          {delivery.pickup_from_kitchen_time && (
            <div className="flex gap-2 items-center">
              <Package className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-500">ຮັບຈາກຮ້ານ:</p>
                <p className="text-gray-900">
                  {formatDateDisplay(delivery.pickup_from_kitchen_time)}
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
                  {formatDateDisplay(delivery.actual_delivery_time)}
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
            <Avatar className="border border-primary/20">
              {delivery.employee.profile_photo ? (
                <AvatarImage
                  src={delivery.employee.profile_photo}
                  alt={`${delivery.employee.first_name} ${delivery.employee.last_name}`}
                />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary">
                {delivery.employee.first_name?.charAt(0)}
                {delivery.employee.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium text-gray-900">
                {delivery.employee.first_name} {delivery.employee.last_name}
              </p>
              {delivery.employee.phone && (
                <div className="flex gap-2 items-center mt-1">
                  <p className="text-sm text-gray-500">
                    {delivery.employee.phone}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full bg-green-50 hover:bg-green-100 text-green-600"
                    title="ໂທຫາຄົນຂັບລົດ"
                    onClick={() => window.location.href = `tel:${delivery.employee.phone}`}
                  >
                    <Phone className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center text-gray-500 p-2 bg-gray-50 rounded-md">
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
          <div className="p-3 bg-gray-50 rounded-md text-gray-700 border border-gray-100">
            <div className="flex items-start">
              <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <p>{delivery.customer_note}</p>
            </div>
          </div>
        </div>
      )}

      {delivery.delivery_fee !== null && delivery.delivery_fee !== undefined && (
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

// Order details component
const OrderDetails = ({ order }) => {
  if (!order) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
        <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
        <p className="text-gray-600 font-medium">ບໍ່ພົບຂໍ້ມູນອໍເດີ</p>
        <p className="text-gray-500 text-sm mt-1">ອໍເດີນີ້ອາດຈະຖືກລຶບອອກຈາກລະບົບແລ້ວ</p>
      </div>
    );
  }

  const subtotal =
    order.order_details?.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0
    ) || 0;

  return (
    <div>
      {order.order_details && order.order_details.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {order.order_details.map((item) => (
            <div key={item.id} className="py-3 flex justify-between">
              <div>
                <p className="font-medium text-gray-900 flex items-start">
                  <span className="bg-primary/10 text-primary rounded-md px-1.5 py-0.5 text-xs font-semibold mr-2">
                    {item.quantity}×
                  </span>
                  <span>
                    {item.food_menu?.name ||
                      item.beverage_menu?.name ||
                      "ສິນຄ້າໄດ້ຖືກລຶບແລ້ວ"}
                  </span>
                </p>
                {item.notes && (
                  <p className="text-sm text-gray-500 mt-1 ml-8">{item.notes}</p>
                )}
              </div>
              <p className="font-medium text-gray-900">
                ₭{Number(item.price).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500">ບໍ່ມີລາຍການສິນຄ້າ</p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between py-1 text-gray-600">
          <p>ລວມລາຄາສິນຄ້າ</p>
          <p className="font-medium text-gray-800">₭{subtotal.toLocaleString()}</p>
        </div>
        <div className="flex justify-between py-1 text-gray-600">
          <p>ຄ່າຈັດສົ່ງ</p>
          <p className="font-medium text-gray-800">
            ₭{Number(order.delivery_fee || 0).toLocaleString()}
          </p>
        </div>
        {order.discount_amount > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <p>ສ່ວນຫຼຸດ</p>
            <p className="font-medium text-green-600">
              -₭{Number(order.discount_amount).toLocaleString()}
            </p>
          </div>
        )}
        <div className="flex justify-between py-2 text-lg font-bold border-t border-gray-200 mt-2 pt-2">
          <p>ລວມທັງໝົດ</p>
          <p className="text-primary">₭{Number(order.total_price).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full group hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-colors"
          onClick={() => window.open(`/orders/${order.id}`, "_blank")}
        >
          <FileText className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700" />
          <span className="text-gray-700 group-hover:text-gray-900">ເບິ່ງລາຍລະອຽດອໍເດີເຕັມ</span>
          <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
        </Button>
      </div>
    </div>
  );
};

// Status timeline component
const StatusTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">
          ບໍ່ມີຂໍ້ມູນການອັບເດດສະຖານະ
        </p>
      </div>
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

  // Sort timeline by latest first
  const sortedTimeline = [...timeline].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="relative pl-4">
      <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200" />
      {sortedTimeline.map((event, index) => (
        <div key={index} className="relative flex gap-4 pb-6">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-white z-10 border ${
            event.status === 'delivered' 
              ? 'border-green-300 text-green-600'
              : event.status === 'cancelled'
              ? 'border-red-300 text-red-600'
              : 'border-primary/30 text-primary'
          }`}>
            {statusIcons[event.status] || (
              <Clock className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col pt-0.5">
            <span className="font-medium text-gray-900">
              {statusLabels[event.status] || event.status}
            </span>
            <time className="text-xs text-gray-500">
              {formatDateDisplay(event.timestamp)}
            </time>
            {event.notes && (
              <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100">
                {event.notes}
              </p>
            )}
            {event.employee && (
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <User className="h-3 w-3 mr-1 text-gray-400" />
                ໂດຍ: {event.employee.first_name} {event.employee.last_name}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Customer info component
const CustomerInfo = ({ user }) => {
  const router = useRouter();
  const { toast } = useToast();

  if (!user) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-100">
        <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 font-medium">ບໍ່ມີຂໍ້ມູນລູກຄ້າ</p>
      </div>
    );
  }

  const copyToClipboard = (text, message) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        description: message,
        duration: 2000,
      });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14 border-2 border-primary/10 shadow-sm">
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
            {user.first_name?.charAt(0) || ""}
            {user.last_name?.charAt(0) || ""}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="font-medium text-lg text-gray-900">
            {user.first_name} {user.last_name}
          </p>
          {user.email && (
            <div className="flex items-center gap-1 group">
              <p className="text-gray-500 text-sm">{user.email}</p>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity rounded-full bg-gray-50 hover:bg-gray-100"
                onClick={() => copyToClipboard(user.email, "ສຳເນົາອີເມລແລ້ວ")}
              >
                <Clipboard className="h-3 w-3 text-gray-500" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {user.phone && (
        <div className="flex items-center gap-2 text-gray-900 group">
          <Phone className="h-4 w-4 text-gray-400" />
          <span>{user.phone}</span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full bg-gray-50 hover:bg-gray-100"
              onClick={() => copyToClipboard(user.phone, "ສຳເນົາເບີໂທແລ້ວ")}
            >
              <Clipboard className="h-3 w-3 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 rounded-full bg-green-50 hover:bg-green-100 text-green-600"
              onClick={() => window.location.href = `tel:${user.phone}`}
            >
              <Phone className="h-3 w-3" />
            </Button>
          </div>
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
        className="w-full mt-2 hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors"
        onClick={() => router.push(`/customers/${user.id}`)}
      >
        <User className="mr-2 h-4 w-4" />
        ເບິ່ງໂປຣໄຟລລູກຄ້າ
      </Button>
      
      <Button
        variant="ghost"
        className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
        onClick={() => router.push(`/orders?customer_id=${user.id}`)}
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        ເບິ່ງປະຫວັດການສັ່ງຊື້
      </Button>
    </div>
  );
};

// Dialog for status update
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
      <DialogContent className="sm:max-w-md">
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
              <SelectTrigger id="status" className="h-10 border-gray-300 focus:border-primary focus:ring-primary">
                <SelectValue placeholder="ເລືອກສະຖານະ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" /> ລໍຖ້າ
                </SelectItem>
                <SelectItem value="preparing" className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" /> ກຳລັງກະກຽມ
                </SelectItem>
                <SelectItem value="out_for_delivery" className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-purple-500" /> ອອກສົ່ງແລ້ວ
                </SelectItem>
                <SelectItem value="delivered" className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" /> ສົ່ງແລ້ວ
                </SelectItem>
                <SelectItem value="cancelled" className="flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500" /> ຍົກເລີກ
                </SelectItem>
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
              className="border-gray-300 focus:border-primary focus:ring-primary min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2 justify-end">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="bg-primary hover:bg-primary/90"
          >
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

// Main Details Component
export default function DeliveryDetails() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const { toast } = useToast();

  const { delivery, loading, error, updateStatus, fetchDelivery } = useDelivery(params.id);

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
    try {
      await updateStatus(status, notes);
      await fetchDelivery();
      
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດສະຖານະການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດອັບເດດສະຖານະການຈັດສົ່ງໄດ້",
      });
      
      return false;
    }
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
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
              ການຈັດສົ່ງ #{delivery.id}
            </h1>
            <div className="flex items-center mt-1 gap-1 text-sm text-gray-500">
              <span>ອໍເດີ:</span>
              <span className="font-medium text-primary">#{delivery.order?.order_id || delivery.order_id}</span>
              <ArrowUpRight className="h-3 w-3" />
              <StatusBadge status={delivery.status} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={() => setStatusDialogOpen(true)}
            className="bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700"
          >
            <Clock className="mr-2 h-4 w-4" /> ອັບເດດສະຖານະ
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push(`/deliveries/${delivery.id}/edit`)}
            className="bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700"
          >
            <Edit className="mr-2 h-4 w-4" /> ແກ້ໄຂຂໍ້ມູນ
          </Button>

          <Button
            onClick={() => router.push(`/deliveries/${delivery.id}/track`)}
            className="bg-primary hover:bg-primary/90"
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
            <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 p-1 rounded-lg">
              <TabsTrigger 
                value="info" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                ຂໍ້ມູນຈັດສົ່ງ
              </TabsTrigger>
              <TabsTrigger 
                value="order"
                className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                ລາຍລະອຽດອໍເດີ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2 border-b border-gray-100">
                  <CardTitle className="text-xl text-gray-900">ຂໍ້ມູນການຈັດສົ່ງ</CardTitle>
                  <CardDescription>
                    ອໍເດີ #{delivery.order?.order_id || delivery.order_id} • ສ້າງວັນທີ:{" "}
                    {formatDateDisplay(delivery.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <DeliveryInfo delivery={delivery} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="order" className="mt-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-2 border-b border-gray-100">
                  <CardTitle className="text-xl text-gray-900">ລາຍລະອຽດອໍເດີ</CardTitle>
                  <CardDescription>
                    {delivery.order?.order_id && `ອໍເດີ #${delivery.order.order_id}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <OrderDetails order={delivery.order} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6 border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="text-lg text-gray-900">ສະຖານະການຈັດສົ່ງ</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <StatusTimeline timeline={delivery.order?.timeline} />
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="text-lg text-gray-900">ຂໍ້ມູນລູກຄ້າ</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <CustomerInfo user={delivery.order?.user} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Status Update Dialog */}
      <StatusUpdateDialog
        delivery={delivery}
        onUpdateStatus={handleStatusUpdate}
        open={statusDialogOpen}
        setOpen={setStatusDialogOpen}
      />
    </div>
  );
}