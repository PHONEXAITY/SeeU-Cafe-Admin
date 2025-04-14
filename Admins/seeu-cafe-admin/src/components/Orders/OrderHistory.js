"use client";
import React, { useState, useEffect } from "react";
import {
  Download,
  Search,
  Filter,
  Eye,
  ChevronLeft,
  ChevronRight,
  Star,
  CalendarRange,
  RefreshCw,
  Bookmark,
  Coffee,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { useOrderHistory, formatCurrency } from "@/hooks/orderHooks";
import { orderService } from "@/services/api";
import { useRouter } from "next/navigation";

const StatusBadge = ({ status }) => {
  const normalizedStatus = status.toLowerCase();

  const statusConfig = {
    pending: {
      styles: "bg-amber-100 text-amber-800 border-amber-200",
      label: "ລໍຖ້າ",
    },
    processing: {
      styles: "bg-blue-100 text-blue-800 border-blue-200",
      label: "ກຳລັງຊົງ",
    },
    completed: {
      styles: "bg-green-100 text-green-800 border-green-200",
      label: "ສຳເລັດ",
    },
    delivered: {
      styles: "bg-purple-100 text-purple-800 border-purple-200",
      label: "ສົ່ງແລ້ວ",
    },
    cancelled: {
      styles: "bg-red-100 text-red-800 border-red-200",
      label: "ຍົກເລີກ",
    },
  };

  const config = statusConfig[normalizedStatus] || {
    styles: "bg-gray-100 text-gray-800 border-gray-200",
    label: status || "Unknown",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.styles}`}
    >
      {config.label}
    </span>
  );
};

const SkeletonLoader = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <Card key={index} className="w-full">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-20 rounded-full" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

const ViewOrderDialog = ({ isOpen, onClose, order, onToggleFavorite }) => {
  if (!order) return null;

  const handleExportPDF = () => {
    toast.success("ດາວໂຫລດໃບບິນສຳເລັດ");
    onClose();
  };

  const handleToggleFavorite = () => {
    onToggleFavorite(order.id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Coffee className="w-5 h-5 text-amber-600" />
            <span>ລາຍລະອຽດການສັ່ງຊື້ #{order.order_id}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-gray-700">ວັນທີສັ່ງ</Label>
            <p className="text-gray-700 font-medium">
              {new Date(order.order_date).toLocaleDateString()}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Label className="text-gray-700">ປະເພດການສັ່ງຊື້</Label>
            <p className="text-gray-700 font-medium">
              {order.order_type === "pickup"
                ? "ຮັບດ້ວຍຕົນເອງ"
                : order.order_type === "delivery"
                ? "ສົ່ງເຖິງບ້ານ"
                : "ຮັບປະທານໃນຮ້ານ"}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Label className="text-gray-700">ສະຖານະ</Label>
            <StatusBadge status={order.status} />
          </div>

          <Card className="p-0 shadow-none border">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm text-gray-700">
                ລາຍການສັ່ງຊື້
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 text-sm">
              {typeof order.items === "string"
                ? JSON.parse(order.items).map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-1 border-b last:border-0"
                    >
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))
                : order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-1 border-b last:border-0"
                    >
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
            </CardContent>
            <CardFooter className="p-3 pt-0 border-t mt-2">
              <div className="flex justify-between w-full">
                <Label className="text-gray-700 font-medium">ຍອດລວມ</Label>
                <p className="text-gray-900 font-bold">
                  {formatCurrency(order.total_amount)}
                </p>
              </div>
            </CardFooter>
          </Card>

          {order.payment_method && (
            <div className="flex justify-between items-center">
              <Label className="text-gray-700">ການຊຳລະ</Label>
              <p className="text-gray-700 font-medium">
                {order.payment_method}
              </p>
            </div>
          )}

          {order.delivery_address && (
            <div>
              <Label className="text-gray-700">ທີ່ຢູ່ຈັດສົ່ງ</Label>
              <p className="text-gray-700 mt-1 bg-gray-50 p-2 rounded-md">
                {order.delivery_address}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between mt-4">
          <Button
            variant="outline"
            onClick={handleToggleFavorite}
            className={order.is_favorite ? "text-amber-600 bg-amber-50" : ""}
          >
            {order.is_favorite ? (
              <Bookmark className="w-4 h-4 mr-2 fill-amber-600" />
            ) : (
              <Bookmark className="w-4 h-4 mr-2" />
            )}
            {order.is_favorite ? "ເອົາອອກຈາກລາຍການໂປດ" : "ເພີ່ມເປັນລາຍການໂປດ"}
          </Button>
          <Button onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            ດາວໂຫລດໃບບິນ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const OrderHistory = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(1);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const ordersPerPage = 10;

  const { orderHistory, loading, error, refetch, toggleFavorite } =
    useOrderHistory(userId);
  const getFilteredOrders = () => {
    let filtered = [...orderHistory];

    if (selectedTab === "favorites") {
      filtered = filtered.filter((order) => order.is_favorite);
    }

    if (selectedStatus && selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status.toLowerCase() === selectedStatus.toLowerCase());
    }

    if (dateRange.from) {
      filtered = filtered.filter(
        (order) => new Date(order.order_date) >= new Date(dateRange.from)
      );
    }
    if (dateRange.to) {
      filtered = filtered.filter(
        (order) => new Date(order.order_date) <= new Date(dateRange.to)
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (typeof order.items === "string" &&
            JSON.parse(order.items).some((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )) ||
          (Array.isArray(order.items) &&
            order.items.some((item) =>
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const handleReorder = async (order) => {
    try {
      const newOrder = {
        User_id: userId,
        order_type: order.order_type,
        total_price: order.total_amount,
        status: "pending",
        preparation_notes: "ทำซ้ำจากคำสั่งซื้อ #" + order.order_id,

        order_details:
          typeof order.items === "string"
            ? JSON.parse(order.items).map((item) => ({
                food_menu_id: item.food_id,
                beverage_menu_id: item.beverage_id,
                quantity: item.quantity,
                price: item.price,
                notes: item.notes || "",
              }))
            : order.items.map((item) => ({
                food_menu_id: item.food_id,
                beverage_menu_id: item.beverage_id,
                quantity: item.quantity,
                price: item.price,
                notes: item.notes || "",
              })),
      };

      const response = await orderService.createOrder(newOrder);

      await orderService.incrementReorderCount(order.id);

      toast.success("ສ້າງການສັ່ງຊື້ຊ້ຳສຳເລັດ!");

      router.push(`/orders/${response.data.id}`);
    } catch (error) {
      console.error("Failed to reorder:", error);
      toast.error("ການສັ່ງຊື້ຊ້ຳລົ້ມເຫຼວ");
    }
  };

  const handleExport = () => {
    toast.success("ດາວໂຫລດຂໍ້ມູນສຳເລັດ");
  };

  const handleToggleFavorite = async (id) => {
    try {
      await toggleFavorite(id);
      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({
          ...selectedOrder,
          is_favorite: !selectedOrder.is_favorite,
        });
      }
      toast.success("ອັບເດດລາຍການໂປດສຳເລັດ");
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      toast.error("ການອັບເດດລາຍການໂປດລົ້ມເຫຼວ");
    }
  };

  const resetFilters = () => {
    setSelectedStatus("");
    setDateRange({ from: "", to: "" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, selectedStatus, dateRange, searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-['Phetsarath_OT']">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Bookmark className="w-6 h-6 text-violet-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              ປະຫວັດການສັ່ງຊື້
            </h1>
          </div>
          <Button
            onClick={handleExport}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Download className="w-4 h-4 mr-2" />
            ດາວໂຫລດຂໍ້ມູນ
          </Button>
        </div>

        <Tabs
          defaultValue="all"
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-6"
        >
          <TabsList className="w-full md:w-auto grid grid-cols-2 mb-4">
            <TabsTrigger value="all" className="px-6">
              ທັງໝົດ
            </TabsTrigger>
            <TabsTrigger value="favorites" className="px-6">
              ລາຍການໂປດ
            </TabsTrigger>
          </TabsList>

          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="w-5 h-5 text-gray-400" />
                  </div>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="pl-10 w-full">
                      <SelectValue placeholder="ກະຕ່າຍຕາມສະຖານະ..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ທັງໝົດ</SelectItem>
                      <SelectItem value="completed">ສຳເລັດ</SelectItem>
                      <SelectItem value="cancelled">ຍົກເລີກ</SelectItem>
                      <SelectItem value="pending">ລໍຖ້າ</SelectItem>
                      <SelectItem value="processing">ກຳລັງຊົງ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarRange className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    type="date"
                    placeholder="ວັນທີເລີ່ມຕົ້ນ"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                    className="pl-10 w-full"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarRange className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    type="date"
                    placeholder="ວັນທີສິ້ນສຸດ"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                    className="pl-10 w-full"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <Input
                    type="text"
                    placeholder="ຄົ້ນຫາປະຫວັດການສັ່ງຊື້"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <TabsContent value="all" className="mt-4 space-y-4">
            {loading ? (
              <SkeletonLoader />
            ) : filteredOrders.length > 0 ? (
              <>
                {currentOrders.map((order) => (
                  <Card key={order.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="text-lg font-semibold">
                              #{order.order_id}
                            </h3>
                            {order.is_favorite && (
                              <Bookmark className="w-4 h-4 ml-2 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">
                            {new Date(order.order_date).toLocaleDateString()} -{" "}
                            {order.order_type === "pickup"
                              ? "ຮັບດ້ວຍຕົນເອງ"
                              : order.order_type === "delivery"
                              ? "ສົ່ງເຖິງບ້ານ"
                              : "ຮັບປະທານໃນຮ້ານ"}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="text-sm border-t border-b py-2 my-2 max-h-20 overflow-y-auto">
                        {typeof order.items === "string"
                          ? JSON.parse(order.items)
                              .slice(0, 3)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between py-1"
                                >
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))
                          : order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between py-1"
                              >
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                        {((typeof order.items === "string" &&
                          JSON.parse(order.items).length > 3) ||
                          (Array.isArray(order.items) &&
                            order.items.length > 3)) && (
                          <div className="text-center text-sm text-blue-600 mt-1">
                            +{" "}
                            {(typeof order.items === "string"
                              ? JSON.parse(order.items).length
                              : order.items.length) - 3}{" "}
                            ລາຍການເພີ່ມເຕີມ
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <p className="text-xl font-bold">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFavorite(order.id)}
                          >
                            {order.is_favorite ? (
                              <>
                                <Bookmark className="w-4 h-4 mr-1 fill-amber-500 text-amber-500" />
                                <span className="text-amber-600">
                                  ລາຍການໂປດ
                                </span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-4 h-4 mr-1" />
                                <span>ເພີ່ມລາຍການໂປດ</span>
                              </>
                            )}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleReorder(order)}
                            disabled={
                              order.status === "pending" ||
                              order.status === "processing"
                            }
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            ສັ່ງຊື້ຊ້ຳ
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            ລາຍລະອຽດ
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-1 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Coffee className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    ບໍ່ພົບຂໍ້ມູນປະຫວັດການສັ່ງຊື້
                  </h3>
                  {selectedStatus ||
                  dateRange.from ||
                  dateRange.to ||
                  searchTerm ? (
                    <>
                      <p className="mt-2 text-sm text-gray-500">
                        ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={resetFilters}
                      >
                        ລ້າງຕົວກອງ
                      </Button>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      ທ່ານຍັງບໍ່ມີປະຫວັດການສັ່ງຊື້ເທື່ອ
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-4 space-y-4">
            {loading ? (
              <SkeletonLoader />
            ) : filteredOrders.length > 0 ? (
              <>
                {currentOrders.map((order) => (
                  <Card key={order.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <h3 className="text-lg font-semibold">
                              #{order.order_id}
                            </h3>
                            <Bookmark className="w-4 h-4 ml-2 text-amber-500 fill-amber-500" />
                          </div>
                          <p className="text-gray-600 mb-2">
                            {new Date(order.order_date).toLocaleDateString()} -{" "}
                            {order.order_type === "pickup"
                              ? "ຮັບດ້ວຍຕົນເອງ"
                              : order.order_type === "delivery"
                              ? "ສົ່ງເຖິງບ້ານ"
                              : "ຮັບປະທານໃນຮ້ານ"}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="text-sm border-t border-b py-2 my-2 max-h-20 overflow-y-auto">
                        {typeof order.items === "string"
                          ? JSON.parse(order.items)
                              .slice(0, 3)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="flex justify-between py-1"
                                >
                                  <span>
                                    {item.quantity}x {item.name}
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))
                          : order.items.slice(0, 3).map((item, index) => (
                              <div
                                key={index}
                                className="flex justify-between py-1"
                              >
                                <span>
                                  {item.quantity}x {item.name}
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <p className="text-xl font-bold">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4 sm:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleFavorite(order.id)}
                          >
                            <Bookmark className="w-4 h-4 mr-1 fill-amber-500 text-amber-500" />
                            <span className="text-amber-600">
                              ເອົາອອກຈາກລາຍການໂປດ
                            </span>
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleReorder(order)}
                            disabled={
                              order.status === "pending" ||
                              order.status === "processing"
                            }
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            ສັ່ງຊື້ຊ້ຳ
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            ລາຍລະອຽດ
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-1 mt-6">{}</div>
                )}
              </>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Bookmark className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    ບໍ່ພົບລາຍການໂປດ
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    ທ່ານຍັງບໍ່ໄດ້ເພີ່ມລາຍການໂປດເທື່ອ
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {}
      <ViewOrderDialog
        isOpen={showOrderDialog}
        onClose={() => setShowOrderDialog(false)}
        order={selectedOrder}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
};

export default OrderHistory;
