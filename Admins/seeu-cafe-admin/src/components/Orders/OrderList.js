"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Coffee,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  Package,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Calendar,
  PlusCircle,
  User,
  Phone,
  CreditCard,
  Printer,
  ArrowUpDown,
  MoreHorizontal,
  Home,
  Store,
  MapPin,
  ShoppingBag,
  Info,
  BellRing,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useOrders,
  useUpdateOrderStatus,
  useDeleteOrder,
  orderStatusOptions,
  formatCurrency,
} from "@/hooks/orderHooks";
import { orderService } from "@/services/api";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

// Component for displaying the current time
const TimeDisplay = () => {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString("lo-LA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("lo-LA", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return <span>{time}</span>;
};

// Component for displaying order status badge
const StatusBadge = ({ status }) => {
  const normalizedStatus = status.toLowerCase();

  const statusConfig = {
    pending: {
      icon: Clock,
      styles: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200",
      label: "ລໍຖ້າ",
    },
    processing: {
      icon: Coffee,
      styles: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      label: "ກຳລັງດຳເນີນ",
    },
    ready: {
      icon: Package,
      styles: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      label: "ພ້ອມສົ່ງ",
    },
    delivered: {
      icon: Check,
      styles:
        "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
      label: "ສົ່ງແລ້ວ",
    },
    cancelled: {
      icon: X,
      styles: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
      label: "ຍົກເລີກ",
    },
  };

  const config = statusConfig[normalizedStatus] || {
    icon: Info,
    styles: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
    label: status || "Unknown",
  };

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors duration-200 ${config.styles}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </span>
  );
};

// Component for displaying order type icon
const OrderTypeIcon = ({ type }) => {
  if (type === "pickup") {
    return <ShoppingBag className="w-4 h-4 text-amber-600" />;
  } else if (type === "delivery") {
    return <Home className="w-4 h-4 text-blue-600" />;
  } else {
    return <Store className="w-4 h-4 text-purple-600" />;
  }
};

// Component for displaying skeleton when loading
const OrderSkeleton = ({ count = 3 }) => {
  return Array(count)
    .fill(0)
    .map((_, index) => (
      <Card key={index} className="overflow-hidden animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="pt-2 border-t">
              <Skeleton className="h-4 w-full" />
              <div className="mt-2">
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ));
};

// Printable Receipt Component
const PrintableReceipt = ({ order }) => {
  if (!order) return null;

  return (
    <div className="p-8 max-w-md mx-auto bg-white font-['Phetsarath_OT']">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">ໃບບິນສັ່ງຊື້</h1>
        <p className="text-gray-500">ເລກທີ: #{order.order_id}</p>
        <p className="text-gray-500">
          {new Date(order.create_at).toLocaleDateString()} -{" "}
          {new Date(order.create_at).toLocaleTimeString()}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold border-b pb-2 mb-2">
          ຂໍ້ມູນລູກຄ້າ
        </h2>
        <p>
          <strong>ຊື່-ນາມສະກຸນ:</strong> {order.user?.first_name}{" "}
          {order.user?.last_name}
        </p>
        {order.user?.phone && (
          <p>
            <strong>ເບີໂທ:</strong> {order.user.phone}
          </p>
        )}
        <p>
          <strong>ປະເພດການສັ່ງຊື້:</strong>{" "}
          {order.order_type === "pickup"
            ? "ຮັບດ້ວຍຕົນເອງ"
            : order.order_type === "delivery"
            ? "ສົ່ງເຖິງບ້ານ"
            : "ຮັບປະທານໃນຮ້ານ"}
        </p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold border-b pb-2 mb-2">
          ລາຍການສັ່ງຊື້
        </h2>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">ລາຍການ</th>
              <th className="text-center py-2">ຈຳນວນ</th>
              <th className="text-right py-2">ລາຄາ</th>
            </tr>
          </thead>
          <tbody>
            {order.order_details?.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="py-2">
                  {item.food_menu?.name ||
                    item.beverage_menu?.name ||
                    "Unknown"}
                </td>
                <td className="text-center py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  {formatCurrency(item.price)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-800">
              <td colSpan="2" className="py-2 font-bold">
                ລວມທັງໝົດ
              </td>
              <td className="text-right py-2 font-bold">
                {formatCurrency(order.total_price)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {order.preparation_notes && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold border-b pb-2 mb-2">ໝາຍເຫດ</h2>
          <p>{order.preparation_notes}</p>
        </div>
      )}

      <div className="text-center mt-8 pt-4 border-t">
        <p className="text-gray-600">ຂອບໃຈສຳລັບການສັ່ງຊື້</p>
        <p className="text-gray-600">ກະລຸນາເກັບໃບບິນໄວ້ເປັນຫຼັກຖານ</p>
      </div>
    </div>
  );
};

const OrderList = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("");
  const [selectedOrderType, setSelectedOrderType] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const ordersPerPage = 10;
  const router = useRouter();
  const printRef = useRef();

  const [dialogState, setDialogState] = useState({
    view: { isOpen: false, order: null },
    edit: { isOpen: false, order: null },
    delete: { isOpen: false, orderId: null, order: null },
    create: { isOpen: false },
    print: { isOpen: false, order: null },
  });

  const { orders, loading, error, refetch, stats } = useOrders({
    status:
      selectedStatus && selectedStatus !== "all" ? selectedStatus : undefined,
    orderType:
      selectedOrderType && selectedOrderType !== "all"
        ? selectedOrderType
        : undefined,
    date: dateFilter || undefined,
    page: currentPage,
    limit: ordersPerPage,
  });
  const { updateStatus, loading: updatingStatus } = useUpdateOrderStatus();
  const { deleteOrder, loading: deletingOrder } = useDeleteOrder();

  const filteredOrdersByTab = orders.filter((order) => {
    if (selectedTab === "all") return true;
    return order.status === selectedTab;
  });

  const filteredOrders = filteredOrdersByTab.filter(
    (order) =>
      searchTerm === "" ||
      order.order_id
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.user?.first_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.phone && order.user.phone.includes(searchTerm))
  );

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.create_at) - new Date(a.create_at);
    } else if (sortOrder === "oldest") {
      return new Date(a.create_at) - new Date(b.create_at);
    } else if (sortOrder === "highest") {
      return b.total_price - a.total_price;
    } else if (sortOrder === "lowest") {
      return a.total_price - b.total_price;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  const handleAction = (type, order = null) => {
    setDialogState({
      ...dialogState,
      [type]: {
        isOpen: true,
        order: order,
        orderId: order?.id,
      },
    });
  };

  const closeDialog = (type) => {
    setDialogState((prev) => ({
      ...prev,
      [type]: {
        isOpen: false,
        order: null,
        orderId: null,
      },
    }));
  };

  const handleUpdateStatus = async (orderId, newStatus, note) => {
    try {
      await updateStatus(orderId, newStatus, null, note);
      closeDialog("edit");
      refetch();
      toast.success(`ອັບເດດສະຖານະຂອງ #${orderId} ເປັນ ${newStatus} ສຳເລັດ`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("ການອັບເດດສະຖານະລົ້ມເຫຼວ");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      closeDialog("delete");
      refetch();
      toast.success(`ລຶບອໍເດີ້ #${orderId} ສຳເລັດ`);
    } catch (error) {
      console.error("Failed to delete order:", error);

      if (error.response && error.response.status === 403) {
        toast.error("ທ່ານບໍ່ມີສິດໃນການລຶບອໍເດີ້ນີ້");
        closeDialog("delete");
      } else {
        toast.error(
          "ການລຶບອໍເດີ້ລົ້ມເຫຼວ: " +
            (error.response?.data?.message || "ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ສາເຫດ")
        );
      }
    }
  };

  const handleSoftDeleteOrder = async (orderId) => {
    try {
      await updateStatus(orderId, "cancelled", null, "ຍົກເລີກໂດຍຜູ້ໃຊ້");
      closeDialog("delete");
      refetch();
      toast.success(`ຍົກເລີກອໍເດີ້ #${orderId} ສຳເລັດ`);
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error("ການຍົກເລີກອໍເດີ້ລົ້ມເຫຼວ");
    }
  };

  const refreshOrders = () => {
    toast.success("ກຳລັງໂຫຼດຂໍ້ມູນໃໝ່...", {
      id: "refreshing",
      duration: 1000,
    });
    refetch();
  };

  const handlePrint = () => {
    // Open print dialog when showing receipt
    if (dialogState.print.isOpen && dialogState.print.order) {
      window.print();
      toast.success("ກຳລັງພິມໃບບິນ...");
    }
  };

  useEffect(() => {
    // Add print event handler
    if (dialogState.print.isOpen) {
      window.addEventListener("afterprint", () => {
        toast.success("ພິມໃບບິນສຳເລັດ");
        closeDialog("print");
      });

      // Call print
      setTimeout(() => {
        handlePrint();
      }, 500);
    }

    return () => {
      window.removeEventListener("afterprint", () => {});
    };
  }, [dialogState.print.isOpen]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedOrderType, searchTerm, dateFilter, selectedTab]);

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-['Phetsarath_OT']">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6 shadow-md border-0 overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-md">
                  <Coffee className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    ລາຍການສັ່ງຊື້
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    ຈັດການອໍເດີ້ແລະການສົ່ງອາຫານ
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        onClick={() => router.push("/Orders/create")}
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span className="hidden md:inline-block">
                          ສ້າງອໍເດີ້ໃໝ່
                        </span>
                        <span className="md:hidden">+ ໃໝ່</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>ສ້າງອໍເດີ້ໃໝ່</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg px-4 py-2 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                        onClick={refreshOrders}
                        disabled={loading}
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        <span className="hidden sm:inline-block">
                          ໂຫຼດຄືນໃໝ່
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>ໂຫຼດຂໍ້ມູນຄືນໃໝ່</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Card className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-gray-500 font-medium">ທັງໝົດ</div>
                      <div className="text-2xl font-bold mt-1 text-gray-800">
                        {stats.total || 0}
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-gray-100">
                      <Coffee className="w-6 h-6 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-amber-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-amber-600 font-medium">ລໍຖ້າ</div>
                      <div className="text-2xl font-bold mt-1 text-amber-700">
                        {stats.pending || 0}
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-amber-100">
                      <Clock className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-blue-600 font-medium">
                        ກຳລັງດຳເນີນ
                      </div>
                      <div className="text-2xl font-bold mt-1 text-blue-700">
                        {stats.processing || 0}
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-blue-100">
                      <Coffee className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-green-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-green-600 font-medium">ພ້ອມສົ່ງ</div>
                      <div className="text-2xl font-bold mt-1 text-green-700">
                        {stats.ready || 0}
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-green-100">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-purple-600 font-medium">
                        ສົ່ງແລ້ວ
                      </div>
                      <div className="text-2xl font-bold mt-1 text-purple-700">
                        {stats.delivered || 0}
                      </div>
                    </div>
                    <div className="p-3 rounded-full bg-purple-100">
                      <Check className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Filter Tabs */}
        <div className="mb-6">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-6 md:w-auto w-full bg-white rounded-lg p-1 shadow-sm">
              <TabsTrigger
                value="all"
                className="rounded-md data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
              >
                ທັງໝົດ
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-md data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900"
              >
                <Clock className="w-4 h-4 mr-1 hidden sm:inline" />
                ລໍຖ້າ
              </TabsTrigger>
              <TabsTrigger
                value="processing"
                className="rounded-md data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900"
              >
                <Coffee className="w-4 h-4 mr-1 hidden sm:inline" />
                ກຳລັງດຳເນີນ
              </TabsTrigger>
              <TabsTrigger
                value="ready"
                className="rounded-md data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
              >
                <Package className="w-4 h-4 mr-1 hidden sm:inline" />
                ພ້ອມສົ່ງ
              </TabsTrigger>
              <TabsTrigger
                value="delivered"
                className="rounded-md data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900"
              >
                <Check className="w-4 h-4 mr-1 hidden sm:inline" />
                ສົ່ງແລ້ວ
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="rounded-md data-[state=active]:bg-red-100 data-[state=active]:text-red-900"
              >
                <X className="w-4 h-4 mr-1 hidden sm:inline" />
                ຍົກເລີກ
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6 shadow-sm border border-gray-100">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="relative md:col-span-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="ຄົ້ນຫາດ້ວຍລະຫັດ, ຊື່ລູກຄ້າ ຫຼື ເບີໂທ"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                />
              </div>

              <div className="relative md:col-span-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="w-5 h-5 text-gray-400" />
                </div>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="pl-10 w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg">
                    <SelectValue placeholder="ສະຖານະການສິ່ງຊື້..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ທັງໝົດ</SelectItem>
                    <SelectItem value="pending">ລໍຖ້າ</SelectItem>
                    <SelectItem value="processing">ກຳລັງດຳເນີນ</SelectItem>
                    <SelectItem value="ready">ພ້ອມສົ່ງ</SelectItem>
                    <SelectItem value="delivered">ສົ່ງແລ້ວ</SelectItem>
                    <SelectItem value="cancelled">ຍົກເລີກ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative md:col-span-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <Select
                  value={selectedOrderType}
                  onValueChange={setSelectedOrderType}
                >
                  <SelectTrigger className="pl-10 w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg">
                    <SelectValue placeholder="ປະເພດການສັ່ງຊື້..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ທັງໝົດ</SelectItem>
                    <SelectItem value="pickup">ຮັບດ້ວຍຕົນເອງ</SelectItem>
                    <SelectItem value="delivery">ສົ່ງເຖິງບ້ານ</SelectItem>
                    <SelectItem value="table">ຮັບປະທານໃນຮ້ານ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative md:col-span-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="pl-10 w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg"
                />
              </div>

              <div className="relative md:col-span-2">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full border-gray-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg">
                    <div className="flex items-center">
                      <ArrowUpDown className="w-4 h-4 mr-2 text-gray-500" />
                      <SelectValue placeholder="ຮຽງຕາມ..." />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">ໃໝ່ຫາເກົ່າ</SelectItem>
                    <SelectItem value="oldest">ເກົ່າຫາໃໝ່</SelectItem>
                    <SelectItem value="highest">ລາຄາສູງສຸດ</SelectItem>
                    <SelectItem value="lowest">ລາຄາຕໍ່າສຸດ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {error && (
            <Card className="border-red-300 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center text-red-700">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  <span>{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <OrderSkeleton count={5} />
          ) : sortedOrders.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Card className="shadow-sm border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ລະຫັດ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ລູກຄ້າ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ເວລາ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ປະເພດ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ຍອດລວມ
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ສະຖານະ
                            </th>
                            <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ຈັດການ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {sortedOrders.map((order) => (
                            <tr
                              key={order.id}
                              className="hover:bg-gray-50 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-semibold text-gray-900">
                                  #{order.order_id}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                                    <User className="h-4 w-4" />
                                  </div>
                                  <div className="ml-3">
                                    <div className="font-medium text-gray-900">
                                      {order.user?.first_name}{" "}
                                      {order.user?.last_name}
                                    </div>
                                    {order.user?.phone && (
                                      <div className="text-sm text-gray-500 flex items-center">
                                        <Phone className="h-3 w-3 mr-1" />
                                        {order.user.phone}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {new Date(
                                    order.create_at
                                  ).toLocaleTimeString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {new Date(
                                    order.create_at
                                  ).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <OrderTypeIcon type={order.order_type} />
                                  <span className="ml-1 text-sm text-gray-900">
                                    {order.order_type === "pickup"
                                      ? "ຮັບດ້ວຍຕົນເອງ"
                                      : order.order_type === "delivery"
                                      ? "ສົ່ງເຖິງບ້ານ"
                                      : "ຮັບປະທານໃນຮ້ານ"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                {formatCurrency(order.total_price)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={order.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex justify-center space-x-1">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="hover:bg-amber-50 text-amber-600 h-8 w-8 p-0"
                                          onClick={() =>
                                            handleAction("view", order)
                                          }
                                        >
                                          <Eye className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>ເບິ່ງລາຍລະອຽດ</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="hover:bg-blue-50 text-blue-600 h-8 w-8 p-0"
                                          onClick={() =>
                                            handleAction("edit", order)
                                          }
                                        >
                                          <Edit className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>ແກ້ໄຂ</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="hover:bg-red-50 text-red-600 h-8 w-8 p-0"
                                          onClick={() =>
                                            handleAction("delete", order)
                                          }
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>ລຶບ</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="hover:bg-green-50 text-green-600 h-8 w-8 p-0"
                                          onClick={() =>
                                            handleAction("print", order)
                                          }
                                        >
                                          <Printer className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>ພິມໃບບິນ</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mobile Card View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {sortedOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-l-4"
                    style={{
                      borderLeftColor:
                        order.status === "pending"
                          ? "#FCD34D"
                          : order.status === "processing"
                          ? "#93C5FD"
                          : order.status === "ready"
                          ? "#86EFAC"
                          : order.status === "delivered"
                          ? "#C4B5FD"
                          : "#FCA5A5",
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="bg-amber-100 p-1.5 rounded-full">
                            <Coffee className="w-4 h-4 text-amber-600" />
                          </div>
                          <span className="font-semibold text-gray-900">
                            #{order.order_id}
                          </span>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-1" />
                            <span>ລູກຄ້າ:</span>
                          </div>
                          <div className="text-right">
                            <span className="font-medium text-gray-900">
                              {order.user?.first_name} {order.user?.last_name}
                            </span>
                            {order.user?.phone && (
                              <div className="text-sm text-gray-500 flex items-center justify-end mt-0.5">
                                <Phone className="w-3 h-3 mr-1" />
                                {order.user.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>ເວລາ:</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {new Date(order.create_at).toLocaleTimeString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(order.create_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>ປະເພດ:</span>
                          </div>
                          <div className="flex items-center text-gray-900 font-medium">
                            <OrderTypeIcon type={order.order_type} />
                            <span className="ml-1">
                              {order.order_type === "pickup"
                                ? "ຮັບດ້ວຍຕົນເອງ"
                                : order.order_type === "delivery"
                                ? "ສົ່ງເຖິງບ້ານ"
                                : "ຮັບປະທານໃນຮ້ານ"}
                            </span>
                          </div>
                        </div>
                        <div className="border-t pt-2 border-gray-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 flex items-center">
                              <ShoppingBag className="w-4 h-4 mr-1" />
                              ລາຍການ:
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                              {order.order_details?.length || 0} ລາຍການ
                            </span>
                          </div>
                          {order.order_details &&
                            order.order_details
                              .slice(0, 2)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between text-sm pl-4 py-1 border-b border-dashed border-gray-100 last:border-0"
                                >
                                  <span className="text-gray-800">
                                    {item.quantity}x{" "}
                                    {item.food_menu?.name ||
                                      item.beverage_menu?.name ||
                                      "Unknown"}
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(item.price)}
                                  </span>
                                </div>
                              ))}
                          {order.order_details?.length > 2 && (
                            <div className="text-sm text-center text-blue-600 mt-2 py-1 bg-blue-50 rounded-md">
                              + {order.order_details.length - 2} ລາຍການເພີ່ມເຕີມ
                            </div>
                          )}
                        </div>
                        <div className="border-t pt-2 border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 flex items-center">
                              <CreditCard className="w-4 h-4 mr-1" />
                              ລວມ:
                            </span>
                            <span className="text-lg font-bold text-gray-900">
                              {formatCurrency(order.total_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between pt-3 border-t mt-3 border-gray-100">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-amber-600 border-amber-200 hover:bg-amber-50"
                          onClick={() => handleAction("view", order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span>ເບິ່ງ</span>
                        </Button>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-auto"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">ເພີ່ມເຕີມ</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>ຈັດການອໍເດີ້</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleAction("edit", order)}
                            >
                              <Edit className="w-4 h-4 mr-2 text-blue-600" />
                              <span>ແກ້ໄຂ</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleAction("print", order)}
                            >
                              <Printer className="w-4 h-4 mr-2 text-green-600" />
                              <span>ພິມໃບບິນ</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleAction("delete", order)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              <span>ລຶບອໍເດີ້</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 bg-white p-3 rounded-lg shadow-sm">
                  <div className="text-sm text-gray-500">
                    ໜ້າ {currentPage} ຈາກ {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      ກ່ອນໜ້າ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className="border-gray-200 hover:bg-gray-50"
                    >
                      ຕໍ່ໄປ
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <Card className="shadow-sm border-0">
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 mb-4">
                    <Coffee className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    ບໍ່ພົບຂໍ້ມູນ
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                    ບໍ່ພົບຂໍ້ມູນການສັ່ງຊື້ທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ
                  </p>
                  {searchTerm ||
                  selectedStatus ||
                  selectedOrderType ||
                  dateFilter ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedStatus("");
                        setSelectedOrderType("");
                        setDateFilter("");
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      ລ້າງການຄົ້ນຫາ
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-amber-200 text-amber-700 hover:bg-amber-50"
                      onClick={refreshOrders}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      ລອງໂຫຼດຄືນໃໝ່
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Footer Stats */}
          <Card className="shadow-sm border-0 bg-gradient-to-r from-gray-50 to-gray-100">
            <CardContent className="py-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 gap-2">
                <span className="flex items-center">
                  <Filter className="w-4 h-4 mr-1 text-gray-400" />
                  ສະແດງ {sortedOrders.length} ຈາກທັງໝົດ {orders.length} ລາຍການ
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-gray-400" />
                  ອັບເດດຄັ້ງສຸດທ້າຍ: <TimeDisplay />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order View Dialog */}
        <Dialog
          open={dialogState.view.isOpen}
          onOpenChange={() => closeDialog("view")}
        >
          <DialogContent className="sm:max-w-md max-w-[95vw] p-0 md:p-6">
            {" "}
            {/* ปรับขนาดและ padding */}
            <DialogHeader className="p-4 md:p-0">
              <DialogTitle className="flex items-center space-x-2 text-base md:text-lg">
                {" "}
                {/* ปรับขนาดข้อความ */}
                <div className="p-2 bg-amber-100 rounded-full">
                  <Coffee className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                </div>
                <span>
                  ລາຍລະອຽດການສັ່ງຊື້ #{dialogState.view.order?.order_id}
                </span>
              </DialogTitle>
              <DialogDescription>
                <StatusBadge status={dialogState.view.order?.status || ""} />
              </DialogDescription>
            </DialogHeader>
            {dialogState.view.order && (
              <div className="space-y-3 px-4 md:px-0">
                {" "}
                {/* ปรับ spacing */}
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="pt-4 md:pt-6 space-y-3 md:space-y-4 text-sm md:text-base">
                    {" "}
                    {/* ปรับขนาดข้อความและ spacing */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <Label className="text-xs md:text-sm text-gray-500 block mb-1 md:mb-2">
                        ຂໍ້ມູນລູກຄ້າ
                      </Label>
                      <div className="flex items-center">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-amber-100 flex items-center justify-center mr-2 md:mr-3">
                          <User className="h-4 w-4 md:h-5 md:w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-base md:text-lg font-medium">
                            {dialogState.view.order.user?.first_name}{" "}
                            {dialogState.view.order.user?.last_name}
                          </p>
                          {dialogState.view.order.user?.phone && (
                            <p className="text-xs md:text-sm text-gray-600 flex items-center mt-0.5 md:mt-1">
                              <Phone className="w-3 h-3 mr-1" />{" "}
                              {dialogState.view.order.user.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:gap-4">
                      <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                        <Label className="text-xs md:text-sm text-gray-500 block mb-0.5 md:mb-1">
                          ວັນທີ
                        </Label>
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-gray-500" />
                          <p className="text-xs md:text-sm font-medium">
                            {new Date(
                              dialogState.view.order.create_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                        <Label className="text-xs md:text-sm text-gray-500 block mb-0.5 md:mb-1">
                          ເວລາ
                        </Label>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-gray-500" />
                          <p className="text-xs md:text-sm font-medium">
                            {new Date(
                              dialogState.view.order.create_at
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                      <Label className="text-xs md:text-sm text-gray-500 block mb-0.5 md:mb-1">
                        ປະເພດການສັ່ງຊື້
                      </Label>
                      <div className="flex items-center">
                        <OrderTypeIcon
                          type={dialogState.view.order.order_type}
                        />
                        <p className="text-xs md:text-sm font-medium ml-1 md:ml-2">
                          {dialogState.view.order.order_type === "pickup"
                            ? "ຮັບດ້ວຍຕົນເອງ"
                            : dialogState.view.order.order_type === "delivery"
                            ? "ສົ່ງເຖິງບ້ານ"
                            : "ຮັບປະທານໃນຮ້ານ"}
                        </p>
                      </div>
                    </div>
                    <Card className="border rounded-lg shadow-sm overflow-hidden">
                      <CardHeader className="p-2 md:p-4 pb-1 md:pb-2 bg-gray-50 flex flex-row items-center justify-between">
                        <div className="flex items-center">
                          <ShoppingBag className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-amber-600" />
                          <CardTitle className="text-sm md:text-base">
                            ລາຍການອາຫານ
                          </CardTitle>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-white text-xs md:text-sm"
                        >
                          {dialogState.view.order.order_details?.length || 0}{" "}
                          ລາຍການ
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="max-h-32 md:max-h-48">
                          {" "}
                          {/* ปรับความสูง */}
                          <div className="p-2 md:p-4 space-y-1 md:space-y-2">
                            {dialogState.view.order.order_details?.map(
                              (item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between items-center text-xs md:text-sm py-1 md:py-2 border-b border-dashed last:border-0"
                                >
                                  <div className="flex items-center space-x-1 md:space-x-2">
                                    <Badge
                                      variant="outline"
                                      className="bg-gray-50 font-normal text-xs"
                                    >
                                      {item.quantity}x
                                    </Badge>
                                    <span>
                                      {item.food_menu?.name ||
                                        item.beverage_menu?.name ||
                                        "Unknown"}
                                    </span>
                                  </div>
                                  <span className="font-medium">
                                    {formatCurrency(item.price)}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </ScrollArea>
                        <div className="p-2 md:p-4 pt-1 md:pt-2 bg-gray-50 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-xs md:text-sm text-gray-600">
                              ລວມທັງໝົດ
                            </span>
                            <span className="text-base md:text-lg font-bold">
                              {formatCurrency(
                                dialogState.view.order.total_price
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {dialogState.view.order.preparation_notes && (
                      <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                        <Label className="text-xs md:text-sm text-gray-500 block mb-0.5 md:mb-1">
                          ໝາຍເຫດ
                        </Label>
                        <div className="border border-gray-200 bg-white p-2 md:p-3 rounded-md text-xs md:text-sm">
                          {dialogState.view.order.preparation_notes}
                        </div>
                      </div>
                    )}
                    {dialogState.view.order.estimated_ready_time && (
                      <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                        <Label className="text-xs md:text-sm text-gray-500 block mb-0.5 md:mb-1">
                          ເວລາທີ່ຄາດວ່າຈະເສັດ
                        </Label>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-gray-500" />
                          <p className="text-xs md:text-sm font-medium">
                            {new Date(
                              dialogState.view.order.estimated_ready_time
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                    {dialogState.view.order.actual_ready_time && (
                      <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                        <Label className="text-xs md:text-sm text-gray-500 block mb-0.5 md:mb-1">
                          ເວລາເສັດຈິງ
                        </Label>
                        <div className="flex items-center">
                          <Check className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2 text-green-600" />
                          <p className="text-xs md:text-sm font-medium">
                            {new Date(
                              dialogState.view.order.actual_ready_time
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
            <div className="mt-2 md:mt-4 flex flex-col sm:flex-row gap-2 p-4 md:p-0">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-sm md:text-base"
                onClick={() => closeDialog("view")}
              >
                ປິດ
              </Button>
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm md:text-base"
                onClick={() => handleAction("print", dialogState.view.order)}
              >
                <Printer className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                ພິມໃບບິນ
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={dialogState.edit.isOpen}
          onOpenChange={() => closeDialog("edit")}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Edit className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-lg">
                  ແກ້ໄຂການສັ່ງຊື້ #{dialogState.edit.order?.order_id}
                </span>
              </DialogTitle>
              <DialogDescription>
                ແກ້ໄຂສະຖານະ ແລະ ໝາຍເຫດຂອງອໍເດີ້
              </DialogDescription>
            </DialogHeader>
            {dialogState.edit.order && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const newStatus = e.target.status.value;
                  const note = e.target.note.value;
                  handleUpdateStatus(
                    dialogState.edit.order.id,
                    newStatus,
                    note
                  );
                }}
              >
                <Card className="border-gray-100 shadow-sm">
                  <CardContent className="pt-6 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <Label className="text-sm text-gray-500 block mb-2">
                        ສະຖານະປັດຈຸບັນ
                      </Label>
                      <div>
                        <StatusBadge status={dialogState.edit.order.status} />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        ອັບເດດສະຖານະ
                      </Label>
                      <Select
                        name="status"
                        defaultValue={dialogState.edit.order.status}
                      >
                        <SelectTrigger className="mt-2 w-full border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg">
                          <SelectValue placeholder="ເລືອກສະຖານະ" />
                        </SelectTrigger>
                        <SelectContent>
                          {orderStatusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        ໝາຍເຫດ
                      </Label>
                      <Textarea
                        name="note"
                        defaultValue={
                          dialogState.edit.order.preparation_notes || ""
                        }
                        placeholder="ເພີ່ມໝາຍເຫດ (ຖ້າມີ)"
                        className="mt-2 resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => closeDialog("edit")}
                    className="w-full sm:w-auto"
                  >
                    ຍົກເລີກ
                  </Button>
                  <Button
                    type="submit"
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                    disabled={updatingStatus}
                  >
                    {updatingStatus ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    ບັນທຶກການປ່ຽນແປງ
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={dialogState.delete.isOpen}
          onOpenChange={() => closeDialog("delete")}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-red-600">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 className="w-5 h-5" />
                </div>
                <span className="text-lg">ຢືນຢັນການລຶບ</span>
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                ທ່ານກຳລັງຈະລຶບອໍເດີ້ #{dialogState.delete.order?.order_id}
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 bg-red-50 rounded-lg border border-red-100">
              <div className="flex items-start">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800 mb-2">
                    ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບອໍເດີ້ນີ້?
                  </h3>
                  <p className="text-gray-700 text-sm">
                    ການກະທຳນີ້ບໍ່ສາມາດກັບຄືນໄດ້ ແລະ
                    ຂໍ້ມູນທັງໝົດທີ່ກ່ຽວຂ້ອງຈະຖືກລຶບ.
                  </p>
                  <p className="text-gray-700 text-sm mt-2">
                    <strong>ໝາຍເຫດ:</strong> ຖ້າທ່ານບໍ່ຕ້ອງການລຶບຂໍ້ມູນ,
                    ທ່ານສາມາດຍົກເລີກອໍເດີ້ແທນ.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => closeDialog("delete")}
                className="w-full sm:w-auto"
              >
                ຍົກເລີກການດຳເນີນການ
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  handleSoftDeleteOrder(dialogState.delete.order?.id)
                }
                disabled={deletingOrder || updatingStatus}
                className="w-full sm:w-auto border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              >
                {updatingStatus ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                ຍົກເລີກອໍເດີ້
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteOrder(dialogState.delete.order?.id)}
                disabled={deletingOrder}
                className="w-full sm:w-auto"
              >
                {deletingOrder ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                ລຶບຂໍ້ມູນ
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Print Dialog */}
        <Dialog
          open={dialogState.print.isOpen}
          onOpenChange={() => closeDialog("print")}
        >
          <DialogContent
            className="max-w-md print:shadow-none print:border-none"
            id="printable-content"
          >
            <DialogHeader className="print:hidden">
              <DialogTitle className="flex items-center space-x-2">
                <div className="p-2 bg-green-100 rounded-full">
                  <Printer className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-lg">ພິມໃບບິນ</span>
              </DialogTitle>
              <DialogDescription>
                ກະລຸນາກົດປຸ່ມພິມເພື່ອພິມໃບບິນ
              </DialogDescription>
            </DialogHeader>

            {/* Printable content */}
            {dialogState.print.order && (
              <div ref={printRef}>
                <PrintableReceipt order={dialogState.print.order} />
              </div>
            )}

            <div className="mt-4 flex flex-col sm:flex-row gap-2 print:hidden">
              <Button
                variant="outline"
                onClick={() => closeDialog("print")}
                className="w-full sm:w-auto"
              >
                ຍົກເລີກ
              </Button>
              <Button
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                onClick={handlePrint}
              >
                <Printer className="w-4 h-4 mr-2" />
                ພິມໃບບິນ
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OrderList;
