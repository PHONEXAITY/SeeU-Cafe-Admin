"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  format,
  isAfter,
  isBefore,
  isPast,
  parseISO,
  differenceInDays,
  isValid,
} from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { usePromotions } from "@/hooks/usePromotions";
import {
  Search,
  Pause,
  Play,
  Edit,
  Clock,
  Trash2,
  BarChart4,
  Filter,
  Download,
  AlertCircle,
  Plus,
  Calendar,
  ChevronRight,
  Tag,
  Percent,
  Package,
  RefreshCcw,
  SlidersHorizontal,
  XCircle,
  Users,
  TrendingUp,
  ArrowUpDown,
  CalendarCheck,
  ClipboardCheck,
  Gift,
  Info,
  Medal,
  ShoppingBag,
  ArrowLeft,
  Home,
} from "lucide-react";

// Helper functions (improved)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return format(date, "dd/MM/yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

const getRemainingDays = (endDate) => {
  if (!endDate) return 0;
  try {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return 0;

    const now = new Date();
    const diffDays = differenceInDays(end, now);
    return diffDays;
  } catch (error) {
    console.error("Error calculating remaining days:", error);
    return 0;
  }
};

const getPromotionStatusText = (status, startDate, endDate) => {
  try {
    const now = new Date();

    // Check for valid dates first
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (status !== "active") return "ຢຸດຊົ່ວຄາວ";
    if (end && !isNaN(end.getTime()) && isPast(end)) return "ໝົດອາຍຸແລ້ວ";
    if (start && !isNaN(start.getTime()) && isBefore(now, start))
      return "ຍັງບໍ່ເລີ່ມ";
    return "ກຳລັງໃຊ້ງານ";
  } catch (error) {
    console.error("Error getting promotion status:", error);
    return "ບໍ່ຮູ້ສະຖານະ";
  }
};

const getStatusColor = (status, startDate, endDate) => {
  const statusText = getPromotionStatusText(status, startDate, endDate);

  switch (statusText) {
    case "ກຳລັງໃຊ້ງານ":
      return "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200";
    case "ຢຸດຊົ່ວຄາວ":
      return "bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200";
    case "ໝົດອາຍຸແລ້ວ":
      return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300";
    case "ຍັງບໍ່ເລີ່ມ":
      return "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200";
    default:
      return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300";
  }
};

// PromotionStats component (improved)
const PromotionStats = ({ promotions }) => {
  // Ensure we have an array to work with
  const promotionsArray = Array.isArray(promotions) ? promotions : [];

  const totalPromotions = promotionsArray.length;

  const activePromotions = promotionsArray.filter((p) => {
    try {
      const endDate = new Date(p.end_date);
      const startDate = new Date(p.start_date);
      return (
        p.status === "active" &&
        isValid(endDate) &&
        isValid(startDate) &&
        !isPast(endDate) &&
        !isBefore(new Date(), startDate)
      );
    } catch (error) {
      return false;
    }
  }).length;

  const expiringPromotions = promotionsArray.filter((p) => {
    try {
      const days = getRemainingDays(p.end_date);
      return p.status === "active" && days >= 0 && days <= 7;
    } catch (error) {
      return false;
    }
  }).length;

  const mostUsedPromotion =
    promotionsArray.length > 0
      ? [...promotionsArray]
          .filter((p) => p && p.promotionUsages)
          .sort(
            (a, b) =>
              (b.promotionUsages?.length || 0) -
              (a.promotionUsages?.length || 0)
          )[0]
      : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">ທັງໝົດ</p>
              <p className="text-2xl font-bold text-blue-700">
                {totalPromotions}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Play className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-emerald-600 font-medium">
                ກຳລັງໃຊ້ງານ
              </p>
              <p className="text-2xl font-bold text-emerald-700">
                {activePromotions}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-600 font-medium">ໃກ້ໝົດອາຍຸ</p>
              <p className="text-2xl font-bold text-amber-700">
                {expiringPromotions}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-100">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600 font-medium">
                ໃຊ້ຫຼາຍທີ່ສຸດ
              </p>
              <p className="text-2xl font-bold text-purple-700">
                {mostUsedPromotion
                  ? mostUsedPromotion.promotionUsages?.length || 0
                  : 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// PromotionCard component (improved)
const PromotionCard = ({ promotion, onStatusToggle, onEdit, onDelete }) => {
  // Safety check
  if (!promotion) {
    return null;
  }

  const status = getPromotionStatusText(
    promotion.status,
    promotion.start_date,
    promotion.end_date
  );
  const statusColor = getStatusColor(
    promotion.status,
    promotion.start_date,
    promotion.end_date
  );

  const getProgressWidth = () => {
    try {
      const now = new Date();
      const startDate = new Date(promotion.start_date);
      const endDate = new Date(promotion.end_date);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return 0;
      }

      if (isPast(endDate)) return 100;
      if (isBefore(now, startDate)) return 0;

      const progress = ((now - startDate) / (endDate - startDate)) * 100;
      return Math.min(Math.max(progress, 0), 100);
    } catch (error) {
      console.error("Error calculating progress:", error);
      return 0;
    }
  };

  const progressPercentage = getProgressWidth();

  const getProgressColor = (percentage) => {
    if (percentage < 40) return "bg-sky-500";
    if (percentage < 75) return "bg-amber-500";
    return "bg-rose-500";
  };

  const progressColor = getProgressColor(progressPercentage);

  const remainingDays = getRemainingDays(promotion.end_date);

  const remainingTime = () => {
    if (remainingDays < 0) return "ໝົດອາຍຸແລ້ວ";
    if (remainingDays === 0) return "ໝົດອາຍຸມື້ນີ້";
    return `${remainingDays} ມື້ທີ່ເຫຼືອ`;
  };

  // Calculate usage stats with safety checks
  const usedCount = promotion.promotionUsages?.length || 0;
  const usageLimit =
    promotion.usage_limit !== null && promotion.usage_limit !== undefined
      ? promotion.usage_limit
      : "∞";

  const usagePercentage =
    usageLimit !== "∞" && typeof usageLimit === "number"
      ? (usedCount / usageLimit) * 100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <Card className="bg-white border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
        <CardContent className="p-6 font-['Phetsarath_OT']">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div className="flex items-center flex-wrap gap-2">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {promotion.name || "ບໍ່ມີຊື່"}
                  </h3>
                  <Badge className={`${statusColor} font-medium`}>
                    {status}
                  </Badge>
                  {remainingDays >= 0 &&
                    remainingDays <= 7 &&
                    promotion.status === "active" && (
                      <Badge
                        variant="outline"
                        className="bg-rose-50 text-rose-700 border-rose-200 font-medium"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        ໃກ້ໝົດອາຍຸ
                      </Badge>
                    )}
                  {usageLimit !== "∞" &&
                    usedCount >= usageLimit * 0.9 &&
                    usedCount < usageLimit && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 font-medium"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        ໃກ້ເຕັມຈຳນວນ
                      </Badge>
                    )}
                  {usageLimit !== "∞" && usedCount >= usageLimit && (
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-600 border-gray-200 font-medium"
                    >
                      <ClipboardCheck className="w-3 h-3 mr-1" />
                      ເຕັມຈຳນວນ
                    </Badge>
                  )}
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 cursor-help">
                        <Gift className="w-3 h-3 mr-1" />
                        ID: {promotion.id || "N/A"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Promotion ID ໃນລະບົບ</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <p className="text-gray-600">
                {promotion.description || "ບໍ່ມີລາຍລະອຽດ"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-700">ລະຫັດ:</span>
                    <code className="bg-gray-100 px-2 py-0.5 rounded text-blue-600 font-mono">
                      {promotion.code || "N/A"}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium text-gray-700">ສ່ວນຫຼຸດ:</span>
                    <span className="font-semibold text-indigo-600">
                      {promotion.discount_value !== undefined &&
                      promotion.discount_value !== null
                        ? promotion.discount_value
                        : "N/A"}
                      {promotion.discount_type === "percentage" ? "%" : " ກີບ"}
                    </span>
                  </div>
                  {promotion.product_categories && (
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-purple-500" />
                      <span className="font-medium text-gray-700">
                        ປະເພດສິນຄ້າ:
                      </span>
                      <span>{promotion.product_categories}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-gray-700">
                      ຈຳນວນທີ່ໃຊ້ໄດ້:
                    </span>
                    <span>{usageLimit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-gray-700">
                      ໃຊ້ໄປແລ້ວ:
                    </span>
                    <span>{usedCount}</span>
                  </div>
                  {usageLimit !== "∞" && (
                    <div className="mt-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-600">
                          ການໃຊ້ງານ
                        </span>
                        <span className="text-xs font-medium text-gray-600">
                          {Math.round(usagePercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`${
                            usagePercentage > 90 ? "bg-rose-500" : "bg-blue-500"
                          } h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${usagePercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {promotion.minimum_order !== undefined &&
                    promotion.minimum_order !== null && (
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-rose-500" />
                        <span className="font-medium text-gray-700">
                          ຍອດຊື້ຂັ້ນຕ່ຳ:
                        </span>
                        <span>
                          {typeof promotion.minimum_order === "number"
                            ? promotion.minimum_order.toLocaleString()
                            : promotion.minimum_order}{" "}
                          ກີບ
                        </span>
                      </div>
                    )}
                  {promotion.maximum_discount !== undefined &&
                    promotion.maximum_discount !== null && (
                      <div className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-teal-500" />
                        <span className="font-medium text-gray-700">
                          ສ່ວນຫຼຸດສູງສຸດ:
                        </span>
                        <span>
                          {typeof promotion.maximum_discount === "number"
                            ? promotion.maximum_discount.toLocaleString()
                            : promotion.maximum_discount}{" "}
                          ກີບ
                        </span>
                      </div>
                    )}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <span className="font-medium text-gray-700">
                      ຍອດການໃຊ້:
                    </span>
                    <span>{promotion.orders?.length || 0} ຄຳສັ່ງຊື້</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5 flex flex-col justify-between min-w-52">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(promotion)}
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-3.5 h-3.5 mr-2 text-blue-500" />
                  ແກ້ໄຂ
                </Button>

                {status !== "ໝົດອາຍຸແລ້ວ" && (
                  <Button
                    variant={
                      promotion.status === "active" ? "outline" : "default"
                    }
                    size="sm"
                    onClick={() => {
                      if (promotion.id !== undefined) {
                        onStatusToggle(promotion.id, promotion.status);
                      }
                    }}
                    className={
                      promotion.status === "active"
                        ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }
                  >
                    {promotion.status === "active" ? (
                      <>
                        <Pause className="w-3.5 h-3.5 mr-2" />
                        ຢຸດຊົ່ວຄາວ
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 mr-2" />
                        ເປີດໃຊ້ງານ
                      </>
                    )}
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(promotion)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  ລຶບ
                </Button>
              </div>

              <div className="text-sm space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span>
                    {formatDate(promotion.start_date)} -{" "}
                    {formatDate(promotion.end_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600">
                    {remainingTime()}
                  </span>
                  <span className="text-xs font-medium text-gray-600">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`${progressColor} h-2.5 rounded-full transition-all duration-300`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ปรับปรุง FilterSection component
const FilterSection = ({
  currentTab,
  setCurrentTab,
  setFilterOpen,
  sortBy,
  setSortBy,
  dateFilter,
  setDateFilter,
}) => {
  return (
    <Card className="md:hidden">
      <CardContent className="p-4 pt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium text-gray-700">ຕົວກຣອງ</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilterOpen(false)}
            className="text-gray-500"
          >
            <XCircle className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              ສະຖານະ
            </label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={currentTab === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentTab("all");
                  setFilterOpen(false);
                }}
                className={currentTab === "all" ? "bg-primary" : ""}
              >
                ທັງໝົດ
              </Button>
              <Button
                variant={currentTab === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentTab("active");
                  setFilterOpen(false);
                }}
                className={currentTab === "active" ? "bg-emerald-600" : ""}
              >
                ກຳລັງໃຊ້ງານ
              </Button>
              <Button
                variant={currentTab === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentTab("inactive");
                  setFilterOpen(false);
                }}
                className={currentTab === "inactive" ? "bg-amber-600" : ""}
              >
                ຢຸດຊົ່ວຄາວ
              </Button>
              <Button
                variant={currentTab === "expired" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCurrentTab("expired");
                  setFilterOpen(false);
                }}
                className={currentTab === "expired" ? "bg-gray-600" : ""}
              >
                ໝົດອາຍຸ
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              ຈັດລຽງຕາມ
            </label>
            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value);
                setFilterOpen(false);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="ຈັດລຽງຕາມ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">ວັນທີ່ສ້າງ (ໃໝ່ - ເກົ່າ)</SelectItem>
                <SelectItem value="oldest">ວັນທີ່ສ້າງ (ເກົ່າ - ໃໝ່)</SelectItem>
                <SelectItem value="expires-soon">
                  ວັນໝົດອາຍຸ (ໃກ້ - ໄກ)
                </SelectItem>
                <SelectItem value="expires-later">
                  ວັນໝົດອາຍຸ (ໄກ - ໃກ້)
                </SelectItem>
                <SelectItem value="most-used">
                  ການນຳໃຊ້ (ຫຼາຍ - ໜ້ອຍ)
                </SelectItem>
                <SelectItem value="least-used">
                  ການນຳໃຊ້ (ໜ້ອຍ - ຫຼາຍ)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              ໄລຍະເວລາ
            </label>
            <Select
              value={dateFilter}
              onValueChange={(value) => {
                setDateFilter(value);
                setFilterOpen(false);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="ເລືອກໄລຍະເວລາ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ທັງໝົດ</SelectItem>
                <SelectItem value="active-now">ໃຊ້ງານໄດ້ປັດຈຸບັນ</SelectItem>
                <SelectItem value="upcoming">ຈະເລີ່ມໃຊ້ໃນອະນາຄົດ</SelectItem>
                <SelectItem value="expiring-7days">ໝົດອາຍຸໃນ 7 ມື້</SelectItem>
                <SelectItem value="expired">ໝົດອາຍຸແລ້ວ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Improved ErrorBoundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="bg-rose-50 border-rose-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">ເກີດຂໍ້ຜິດພາດ</p>
                <p className="text-sm text-rose-500">
                  {this.state.error?.message || "ກະລຸນາລອງໃໝ່"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="border-rose-200 text-rose-600"
                onClick={() => window.location.reload()}
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                ລອງໃໝ່
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
              >
                <Home className="w-4 h-4 mr-2" />
                ກັບຄືນໜ້າຫຼັກ
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    return this.props.children;
  }
}

// ปรับปรุง DesktopFilterBar component
const DesktopFilterBar = ({
  currentTab,
  setCurrentTab,
  sortBy,
  setSortBy,
  dateFilter,
  setDateFilter,
}) => {
  return (
    <Card className="hidden md:block border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant={currentTab === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentTab("all")}
              className={currentTab === "all" ? "" : ""}
            >
              ທັງໝົດ
            </Button>
            <Button
              variant={currentTab === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentTab("active")}
              className={currentTab === "active" ? "bg-emerald-600" : ""}
            >
              <Play className="w-4 h-4 mr-1" />
              ກຳລັງໃຊ້ງານ
            </Button>
            <Button
              variant={currentTab === "inactive" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentTab("inactive")}
              className={currentTab === "inactive" ? "bg-amber-600" : ""}
            >
              <Pause className="w-4 h-4 mr-1" />
              ຢຸດຊົ່ວຄາວ
            </Button>
            <Button
              variant={currentTab === "expired" ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentTab("expired")}
              className={currentTab === "expired" ? "bg-gray-600" : ""}
            >
              <Clock className="w-4 h-4 mr-1" />
              ໝົດອາຍຸ
            </Button>
          </div>

          <div className="flex gap-3">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-52">
                <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="ເລືອກໄລຍະເວລາ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ທັງໝົດ</SelectItem>
                <SelectItem value="active-now">ໃຊ້ງານໄດ້ປັດຈຸບັນ</SelectItem>
                <SelectItem value="upcoming">ຈະເລີ່ມໃຊ້ໃນອະນາຄົດ</SelectItem>
                <SelectItem value="expiring-7days">ໝົດອາຍຸໃນ 7 ມື້</SelectItem>
                <SelectItem value="expired">ໝົດອາຍຸແລ້ວ</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-52">
                <ArrowUpDown className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="ຈັດລຽງຕາມ..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">ວັນທີ່ສ້າງ (ໃໝ່ - ເກົ່າ)</SelectItem>
                <SelectItem value="oldest">ວັນທີ່ສ້າງ (ເກົ່າ - ໃໝ່)</SelectItem>
                <SelectItem value="expires-soon">
                  ວັນໝົດອາຍຸ (ໃກ້ - ໄກ)
                </SelectItem>
                <SelectItem value="expires-later">
                  ວັນໝົດອາຍຸ (ໄກ - ໃກ້)
                </SelectItem>
                <SelectItem value="most-used">
                  ການນຳໃຊ້ (ຫຼາຍ - ໜ້ອຍ)
                </SelectItem>
                <SelectItem value="least-used">
                  ການນຳໃຊ້ (ໜ້ອຍ - ຫຼາຍ)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PromotionsPage = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [dateFilter, setDateFilter] = useState("all");
  const { toast } = useToast();

  const {
    promotions,
    loading,
    error,
    fetchPromotions,
    togglePromotionStatus,
    deletePromotion,
  } = usePromotions();

  // Fetch promotions on component mount and when tab changes
  useEffect(() => {
    console.log(
      "Fetching promotions with status:",
      currentTab !== "all" ? currentTab : ""
    );
    const params = currentTab !== "all" ? { status: currentTab } : {};
    fetchPromotions(params);
  }, [fetchPromotions, currentTab]);

  const handleStatusToggle = async (id, currentStatus) => {
    if (!id) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ບໍ່ພົບ ID ຂອງ promotion",
        variant: "destructive",
      });
      return;
    }

    try {
      await togglePromotionStatus(id, currentStatus);

      toast({
        title: "ສະຖານະອັບເດດແລ້ວ",
        description: `Promotion ${
          currentStatus === "active" ? "ຖືກຢຸດຊົ່ວຄາວແລ້ວ" : "ເປີດໃຊ້ງານແລ້ວ"
        }`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description:
          error?.response?.data?.message || "ບໍ່ສາມາດອັບເດດສະຖານະໄດ້",
        variant: "destructive",
      });
    }
  };

  // Improved: Only open delete dialog when explicitly triggered
  const handleDeleteClick = (promo) => {
    if (!promo) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ບໍ່ພົບຂໍ້ມູນ promotion ທີ່ຈະລຶບ",
        variant: "destructive",
      });
      return;
    }

    if (promo && typeof promo.id === "number") {
      setSelectedPromotion(promo);
      setShowDeleteDialog(true);
    } else {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ID ຂອງ promotion ບໍ່ຖືກຕ້ອງ",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (promo) => {
    if (!promo || typeof promo.id !== "number") {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ບໍ່ພົບຂໍ້ມູນ promotion ທີ່ຈະແກ້ໄຂ",
        variant: "destructive",
      });
      return;
    }

    // ใช้ router.push แทนการเปลี่ยน window.location
    router.push(`/promotions/edit/${promo.id}`);
  };

  const handleDelete = async () => {
    if (!selectedPromotion || typeof selectedPromotion.id !== "number") {
      setShowDeleteDialog(false);
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ບໍ່ພົບຂໍ້ມູນ promotion ທີ່ຈະລຶບ",
        variant: "destructive",
      });
      return;
    }

    try {
      await deletePromotion(selectedPromotion.id);
      toast({
        title: "ລຶບແລ້ວ",
        description: `Promotion "${
          selectedPromotion.name || "ທີ່ເລືອກ"
        }" ຖືກລຶບແລ້ວ`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description:
          error?.response?.data?.message || "ບໍ່ສາມາດລຶບ promotion ໄດ້",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedPromotion(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setSelectedPromotion(null);
  };

  // Improved filtering with better null/undefined checks
  const filterPromotions = useCallback(() => {
    // Make sure we're working with an array
    let filtered = Array.isArray(promotions) ? [...promotions] : [];

    // Filter out null/undefined entries
    filtered = filtered.filter((promo) => promo != null);

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (promo) =>
          (promo?.name || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (promo?.code || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (promo?.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    // Filter by date
    if (dateFilter !== "all") {
      const now = new Date();

      if (dateFilter === "active-now") {
        filtered = filtered.filter((promo) => {
          try {
            const endDate = promo.end_date ? new Date(promo.end_date) : null;
            const startDate = promo.start_date
              ? new Date(promo.start_date)
              : null;

            return (
              promo?.status === "active" &&
              (endDate && !isNaN(endDate.getTime())
                ? !isPast(endDate)
                : true) &&
              (startDate && !isNaN(startDate.getTime())
                ? !isBefore(now, startDate)
                : true)
            );
          } catch (error) {
            console.error("Error filtering active-now promotions:", error);
            return false;
          }
        });
      } else if (dateFilter === "upcoming") {
        filtered = filtered.filter((promo) => {
          try {
            const startDate = promo.start_date
              ? new Date(promo.start_date)
              : null;
            return (
              startDate &&
              !isNaN(startDate.getTime()) &&
              isBefore(now, startDate)
            );
          } catch (error) {
            console.error("Error filtering upcoming promotions:", error);
            return false;
          }
        });
      } else if (dateFilter === "expiring-7days") {
        filtered = filtered.filter((promo) => {
          try {
            const remainingDays = getRemainingDays(promo.end_date);
            return remainingDays >= 0 && remainingDays <= 7;
          } catch (error) {
            console.error("Error filtering expiring promotions:", error);
            return false;
          }
        });
      } else if (dateFilter === "expired") {
        filtered = filtered.filter((promo) => {
          try {
            const endDate = promo.end_date ? new Date(promo.end_date) : null;
            return endDate && !isNaN(endDate.getTime()) && isPast(endDate);
          } catch (error) {
            console.error("Error filtering expired promotions:", error);
            return false;
          }
        });
      }
    }

    // Improved sorting with safety checks
    try {
      if (sortBy === "newest") {
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateB - dateA;
        });
      } else if (sortBy === "oldest") {
        filtered.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
          return dateA - dateB;
        });
      } else if (sortBy === "expires-soon") {
        filtered.sort((a, b) => {
          const dateA = a.end_date
            ? new Date(a.end_date)
            : new Date(9999, 11, 31);
          const dateB = b.end_date
            ? new Date(b.end_date)
            : new Date(9999, 11, 31);
          return dateA - dateB;
        });
      } else if (sortBy === "expires-later") {
        filtered.sort((a, b) => {
          const dateA = a.end_date ? new Date(a.end_date) : new Date(0);
          const dateB = b.end_date ? new Date(b.end_date) : new Date(0);
          return dateB - dateA;
        });
      } else if (sortBy === "most-used") {
        filtered.sort(
          (a, b) =>
            (b.promotionUsages?.length || 0) - (a.promotionUsages?.length || 0)
        );
      } else if (sortBy === "least-used") {
        filtered.sort(
          (a, b) =>
            (a.promotionUsages?.length || 0) - (b.promotionUsages?.length || 0)
        );
      }
    } catch (error) {
      console.error("Error sorting promotions:", error);
    }

    return filtered;
  }, [promotions, searchQuery, dateFilter, sortBy]);

  const filteredPromotions = filterPromotions();

  return (
    <ErrorBoundary>
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto font-['Phetsarath_OT']">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between gap-4 bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg shadow-sm border"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              ຈັດການ Promotions
            </h1>
            <p className="text-gray-500">
              ສ້າງ, ແກ້ໄຂ ແລະ ຈັດການ promotions ທັງໝົດຂອງທ່ານ
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              <BarChart4 className="w-4 h-4 mr-2 text-blue-500" />
              ລາຍງານ
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={() => router.push("/promotions/create")}
            >
              <Plus className="w-4 h-4 mr-2" />
              ສ້າງ Promotion ໃໝ່
            </Button>
          </div>
        </motion.div>

        {!loading && !error && promotions && (
          <PromotionStats promotions={promotions} />
        )}

        <div className="grid gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                placeholder="ຄົ້ນຫາ promotions ຕາມຊື່, ລະຫັດ, ລາຍລະອຽດ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-gray-200 text-gray-700 hover:bg-gray-50 md:hidden"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <Filter className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="border-gray-200 text-gray-700 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 text-blue-500" />
              </Button>
            </div>
          </div>

          {filterOpen && (
            <FilterSection
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              setFilterOpen={setFilterOpen}
              sortBy={sortBy}
              setSortBy={setSortBy}
              dateFilter={dateFilter}
              setDateFilter={setDateFilter}
            />
          )}

          <DesktopFilterBar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            sortBy={sortBy}
            setSortBy={setSortBy}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />

          {loading ? (
            <div className="space-y-4">
              {Array(3)
                .fill()
                .map((_, i) => (
                  <Card key={i} className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6 justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-6 w-40 bg-gray-200" />
                            <Skeleton className="h-5 w-20 rounded-full bg-gray-200" />
                          </div>
                          <Skeleton className="h-4 w-full bg-gray-200" />
                          <Skeleton className="h-4 w-3/4 bg-gray-200" />
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <Skeleton className="h-12 w-full bg-gray-200" />
                            <Skeleton className="h-12 w-full bg-gray-200" />
                            <Skeleton className="h-12 w-full bg-gray-200" />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Skeleton className="h-9 w-20 bg-gray-200" />
                            <Skeleton className="h-9 w-28 bg-gray-200" />
                          </div>
                          <Skeleton className="h-4 w-40 bg-gray-200" />
                          <Skeleton className="h-2 w-full bg-gray-200" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : error ? (
            <Card className="bg-rose-50 border-rose-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 text-rose-600">
                  <AlertCircle className="h-5 w-5" />
                  <div>
                    <p className="font-medium">ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ</p>
                    <p className="text-sm text-rose-500">{error}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="mt-4 border-rose-200 text-rose-600 hover:bg-rose-50"
                  onClick={() => {
                    const params =
                      currentTab !== "all" ? { status: currentTab } : {};
                    fetchPromotions(params);
                  }}
                >
                  <RefreshCcw className="w-4 h-4 mr-2" />
                  ລອງໃໝ່ອີກຄັ້ງ
                </Button>
              </CardContent>
            </Card>
          ) : !promotions || filteredPromotions.length === 0 ? (
            <Card className="bg-gray-50">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <Search className="h-12 w-12 text-gray-300" />
                  <h3 className="font-medium text-lg text-gray-700">
                    ບໍ່ພົບ promotions ທີ່ຄົ້ນຫາ
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {searchQuery
                      ? `ບໍ່ພົບຜົນການຄົ້ນຫາສຳລັບ "${searchQuery}"`
                      : "ລອງເປີດຕົວກຣອງອື່ນ ຫຼື ສ້າງ promotion ໃໝ່"}
                  </p>
                  {searchQuery && (
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => setSearchQuery("")}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      ລ້າງການຄົ້ນຫາ
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <AnimatePresence>
              <div className="grid gap-4">
                {filteredPromotions.map((promotion) => (
                  <PromotionCard
                    key={promotion.id}
                    promotion={promotion}
                    onStatusToggle={handleStatusToggle}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>

        {/* Controlled Dialog - Only show when explicitly triggered */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ຢືນຢັນການລຶບ</AlertDialogTitle>
              <AlertDialogDescription>
                ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ{" "}
                <span className="font-medium text-gray-900">
                  "{selectedPromotion?.name || "Promotion"}"
                </span>
                ?
                <br />
                ການກະທຳນີ້ບໍ່ສາມາດຖືກເລີກຄືນໄດ້.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDelete}>
                ຍົກເລີກ
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-rose-600 hover:bg-rose-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                ລຶບ
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </ErrorBoundary>
  );
};

export default PromotionsPage;
