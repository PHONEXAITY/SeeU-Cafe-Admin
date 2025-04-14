"use client";
import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import {
  CalendarIcon,
  Save,
  X,
  Info,
  Tag,
  Percent,
  Settings,
  Users,
  AlertTriangle,
  Clock,
  PlusCircle,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Gift,
  Activity,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { usePromotions } from "@/hooks/usePromotions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const EditPromotionPage = ({ params }) => {
  const promotionId = params?.id ? parseInt(params.id) : null;
  const router = useRouter();
  const { toast } = useToast();
  const { getPromotionById, updatePromotion, loading, error, promotion } =
    usePromotions();

  const [activeTab, setActiveTab] = useState("details");
  const [completionStatus, setCompletionStatus] = useState({
    details: false,
    discount: false,
    restrictions: false,
    targeting: false,
  });
  const [completionPercentage, setCompletionPercentage] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    minimum_order: "",
    usage_limit: "",
    start_date: new Date(),
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    status: "active",
    product_categories: [],
    restrictions: {
      newCustomersOnly: false,
      membersOnly: false,
      oneTimeUse: false,
    },
    maximum_discount: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [autoGenCode, setAutoGenCode] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // แยกสถานะส่วนของ restrictions ที่อาจอยู่ใน description
  const extractRestrictionsFromDescription = (description) => {
    if (!description)
      return {
        description: "",
        restrictions: {
          newCustomersOnly: false,
          membersOnly: false,
          oneTimeUse: false,
        },
      };

    const restrictions = {
      newCustomersOnly: description.includes("ສຳລັບລູກຄ້າໃໝ່ເທົ່ານັ້ນ"),
      membersOnly: description.includes("ສຳລັບສະມາຊິກເທົ່ານັ້ນ"),
      oneTimeUse: description.includes("ໃຊ້ໄດ້ພຽງຄັ້ງດຽວຕໍ່ຄົນ"),
    };

    // ลบข้อความ restrictions ออกจาก description
    let cleanDescription = description;

    if (restrictions.newCustomersOnly) {
      cleanDescription = cleanDescription.replace(
        "ສຳລັບລູກຄ້າໃໝ່ເທົ່ານັ້ນ",
        ""
      );
    }
    if (restrictions.membersOnly) {
      cleanDescription = cleanDescription.replace("ສຳລັບສະມາຊິກເທົ່ານັ້ນ", "");
    }
    if (restrictions.oneTimeUse) {
      cleanDescription = cleanDescription.replace("ໃຊ້ໄດ້ພຽງຄັ້ງດຽວຕໍ່ຄົນ", "");
    }

    // ลบวงเล็บที่อาจเหลือและช่องว่างเกิน
    cleanDescription = cleanDescription
      .replace(/\(\s*\)/g, "") // ลบวงเล็บเปล่า ()
      .replace(/\(\s*,\s*\)/g, "") // ลบวงเล็บที่มีแค่คอมม่า (, )
      .replace(/,\s*,/g, ",") // ลบคอมม่าซ้ำ
      .replace(/^\s*,\s*/g, "") // ลบคอมม่าที่ขึ้นต้น
      .replace(/\s*,\s*$/g, "") // ลบคอมม่าที่ลงท้าย
      .trim();

    return { description: cleanDescription, restrictions };
  };

  // โหลดข้อมูล promotion เมื่อเริ่มต้น
  useEffect(() => {
    if (promotionId) {
      const fetchPromotion = async () => {
        setInitialLoading(true);
        try {
          const data = await getPromotionById(promotionId);
          if (!data) {
            setNotFound(true);
            setInitialLoading(false);
            return;
          }

          // แยก restrictions ออกจาก description
          const { description, restrictions } =
            extractRestrictionsFromDescription(data.description);

          // แปลงรูปแบบข้อมูลให้เหมาะสมกับฟอร์ม
          const productCategories = data.product_categories
            ? data.product_categories.split(",").map((cat) => cat.trim())
            : [];

          setFormData({
            name: data.name || "",
            code: data.code || "",
            description: description || "",
            discount_type: data.discount_type || "percentage",
            discount_value: data.discount_value?.toString() || "",
            minimum_order: data.minimum_order?.toString() || "",
            usage_limit: data.usage_limit?.toString() || "",
            start_date: data.start_date
              ? new Date(data.start_date)
              : new Date(),
            end_date: data.end_date
              ? new Date(data.end_date)
              : new Date(new Date().setMonth(new Date().getMonth() + 1)),
            status: data.status || "active",
            product_categories: productCategories,
            restrictions: restrictions,
            maximum_discount: data.maximum_discount?.toString() || "",
          });
        } catch (error) {
          console.error("Error fetching promotion:", error);
          toast({
            title: "ເກີດຂໍ້ຜິດພາດ",
            description: "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນ promotion ໄດ້",
            variant: "destructive",
          });
        } finally {
          setInitialLoading(false);
        }
      };

      fetchPromotion();
    } else {
      setNotFound(true);
      setInitialLoading(false);
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ບໍ່ພົບ ID ຂອງ promotion",
        variant: "destructive",
      });
    }
  }, [promotionId, getPromotionById, toast]);

  // Update completion status when form data changes
  useEffect(() => {
    const newCompletionStatus = {
      details: Boolean(formData.name && formData.code),
      discount: Boolean(formData.discount_value),
      restrictions: true, // Optional section, so always true
      targeting: true, // Optional section, so always true
    };

    setCompletionStatus(newCompletionStatus);

    // Calculate completion percentage
    const completedSections = Object.values(newCompletionStatus).filter(
      (value) => value
    ).length;
    const totalSections = Object.keys(newCompletionStatus).length;
    setCompletionPercentage((completedSections / totalSections) * 100);
  }, [formData]);

  // Auto-generate code when name changes if autoGenCode is enabled
  useEffect(() => {
    if (autoGenCode && formData.name) {
      const generatedCode = formData.name
        .replace(/[^a-zA-Z0-9]/g, "")
        .toUpperCase()
        .substring(0, 8);

      setFormData((prev) => ({
        ...prev,
        code: generatedCode,
      }));
    }
  }, [formData.name, autoGenCode]);

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "ກະລຸນາໃສ່ຊື່ promotion";
    if (!formData.code.trim()) errors.code = "ກະລຸນາໃສ່ລະຫັດ promotion";

    // Code format validation - alphanumeric only
    if (formData.code && !/^[A-Z0-9]+$/.test(formData.code)) {
      errors.code =
        "ລະຫັດຕ້ອງປະກອບດ້ວຍຕົວອັກສອນພາສາອັງກິດຕົວໃຫຍ່ ແລະ ຕົວເລກເທົ່ານັ້ນ";
    }

    if (!formData.discount_value || parseFloat(formData.discount_value) <= 0)
      errors.discount_value = "ກະລຸນາໃສ່ມູນຄ່າສ່ວນຫຼຸດທີ່ຖືກຕ້ອງ";

    if (
      formData.discount_type === "percentage" &&
      parseFloat(formData.discount_value) > 100
    )
      errors.discount_value = "ສ່ວນຫຼຸດເປີເຊັນຕ້ອງບໍ່ເກີນ 100%";

    // Validate dates
    try {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (isValid(startDate) && isValid(endDate) && endDate <= startDate) {
        errors.end_date = "ວັນທີສິ້ນສຸດຕ້ອງຫຼັງຈາກວັນທີເລີ່ມຕົ້ນ";
      }
    } catch (error) {
      errors.end_date = "ວັນທີບໍ່ຖືກຕ້ອງ";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "ກວດສອບຂໍ້ມູນ",
        description: "ກະລຸນາແກ້ໄຂຂໍ້ມູນທີ່ບໍ່ຖືກຕ້ອງ",
        variant: "destructive",
      });
      return;
    }

    if (!promotionId) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ບໍ່ພົບ ID ຂອງ promotion",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // รวม restrictions เข้ากับ description
      let finalDescription = formData.description || "";

      const restrictionTexts = [];
      if (formData.restrictions.newCustomersOnly) {
        restrictionTexts.push("ສຳລັບລູກຄ້າໃໝ່ເທົ່ານັ້ນ");
      }
      if (formData.restrictions.membersOnly) {
        restrictionTexts.push("ສຳລັບສະມາຊິກເທົ່ານັ້ນ");
      }
      if (formData.restrictions.oneTimeUse) {
        restrictionTexts.push("ໃຊ້ໄດ້ພຽງຄັ້ງດຽວຕໍ່ຄົນ");
      }

      if (restrictionTexts.length > 0) {
        finalDescription = finalDescription.trim();
        if (finalDescription) {
          finalDescription += ` (${restrictionTexts.join(", ")})`;
        } else {
          finalDescription = restrictionTexts.join(", ");
        }
      }

      // Format data for API
      const promotionData = {
        name: formData.name,
        code: formData.code,
        description: finalDescription,
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        start_date:
          formData.start_date instanceof Date && isValid(formData.start_date)
            ? formData.start_date.toISOString()
            : new Date().toISOString(),
        end_date:
          formData.end_date instanceof Date && isValid(formData.end_date)
            ? formData.end_date.toISOString()
            : new Date(
                new Date().setMonth(new Date().getMonth() + 1)
              ).toISOString(),
        minimum_order: formData.minimum_order
          ? parseFloat(formData.minimum_order)
          : null,
        maximum_discount: formData.maximum_discount
          ? parseFloat(formData.maximum_discount)
          : null,
        status: formData.status,
        usage_limit: formData.usage_limit
          ? parseInt(formData.usage_limit)
          : null,
        product_categories:
          formData.product_categories.length > 0
            ? formData.product_categories.join(",")
            : null,
      };

      const success = await updatePromotion(promotionId, promotionData);

      if (success) {
        toast({
          title: "ສຳເລັດ",
          description: "ອັບເດດ promotion ສຳເລັດແລ້ວ",
        });
        router.push("/promotions");
      }
    } catch (err) {
      console.error("Error updating promotion:", err);
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description:
          err?.response?.data?.message || "ບໍ່ສາມາດອັບເດດ promotion ໄດ້",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/promotions");
  };

  const handleDateSelect = (field, date) => {
    setFormData({ ...formData, [field]: date });
  };

  const toggleCategory = (category) => {
    const newCategories = formData.product_categories.includes(category)
      ? formData.product_categories.filter((c) => c !== category)
      : [...formData.product_categories, category];
    setFormData({ ...formData, product_categories: newCategories });
  };

  const handleRestrictionChange = (key, value) => {
    setFormData({
      ...formData,
      restrictions: {
        ...formData.restrictions,
        [key]: value,
      },
    });
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({
      ...formData,
      code: result,
    });
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("lo-LA").format(amount);
  };

  // Calculate effective discount amount for preview
  const calculateEffectiveDiscount = (orderAmount) => {
    if (!formData.discount_value) return 0;

    const minimumOrder = parseFloat(formData.minimum_order) || 0;
    if (orderAmount < minimumOrder) return 0;

    let discount = 0;
    if (formData.discount_type === "percentage") {
      discount = (orderAmount * parseFloat(formData.discount_value)) / 100;

      // Apply maximum discount if set
      if (
        formData.maximum_discount &&
        parseFloat(formData.maximum_discount) > 0
      ) {
        discount = Math.min(discount, parseFloat(formData.maximum_discount));
      }
    } else {
      discount = parseFloat(formData.discount_value);
    }

    return discount;
  };

  // แสดงหน้า loading
  if (initialLoading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-56 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full rounded-md" />
        </div>

        <div className="flex justify-end mt-6">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  // แสดงหน้า not found
  if (notFound) {
    return (
      <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
        <Card className="border-rose-200 bg-rose-50">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="w-12 h-12 text-rose-500" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-rose-700">
                  ບໍ່ພົບຂໍ້ມູນ Promotion
                </h2>
                <p className="text-rose-600">
                  ບໍ່ພົບຂໍ້ມູນ Promotion ທີ່ຕ້ອງການແກ້ໄຂ ຫຼື ID ບໍ່ຖືກຕ້ອງ
                </p>
              </div>
              <Button
                onClick={() => router.push("/promotions")}
                className="mt-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                ກັບຄືນໜ້າ Promotions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/promotions")}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              ກັບຄືນ
            </Button>
          </div>

          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            ແກ້ໄຂ Promotion
          </h1>
          <p className="text-muted-foreground mt-1">
            ແກ້ໄຂຂໍ້ມູນ promotion ຂອງທ່ານ
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 md:mt-0 w-full md:w-auto">
          <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="grow md:grow-0">
                <Gift className="w-4 h-4 mr-2" />
                ເບິ່ງຕົວຢ່າງ
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  ຕົວຢ່າງ Promotion
                </DialogTitle>
                <DialogDescription>
                  ການສະແດງຕົວຢ່າງຂອງ promotion ນີ້ຕໍ່ລູກຄ້າ
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-primary/10 p-3 flex justify-between items-center border-b">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary">
                        {formData.code || "CODE"}
                      </Badge>
                      <h3 className="font-medium">
                        {formData.name || "ຊື່ໂປຣໂມຊັ່ນ"}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        formData.status === "active" ? "default" : "secondary"
                      }
                      className={
                        formData.status === "active" ? "bg-green-500" : ""
                      }
                    >
                      {formData.status === "active"
                        ? "ເປີດໃຊ້ງານ"
                        : "ປິດໃຊ້ງານ"}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <p className="text-sm mb-3">
                      {formData.description || "ລາຍລະອຽດໂປຣໂມຊັ່ນ"}
                    </p>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          ສ່ວນຫຼຸດ:
                        </span>
                        <span className="font-medium">
                          {formData.discount_value
                            ? `${formData.discount_value}${
                                formData.discount_type === "percentage"
                                  ? "%"
                                  : "₭"
                              }`
                            : "-"}
                        </span>
                      </div>

                      {formData.minimum_order && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            ຍອດສັ່ງຊື້ຂັ້ນຕໍ່າ:
                          </span>
                          <span className="font-medium">
                            {formData.minimum_order}₭
                          </span>
                        </div>
                      )}

                      {formData.discount_type === "percentage" &&
                        formData.maximum_discount && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              ສ່ວນຫຼຸດສູງສຸດ:
                            </span>
                            <span className="font-medium">
                              {formData.maximum_discount}₭
                            </span>
                          </div>
                        )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          ໄລຍະເວລາ:
                        </span>
                        <span className="font-medium">
                          {formData.start_date && isValid(formData.start_date)
                            ? format(formData.start_date, "dd/MM/yyyy")
                            : "N/A"}{" "}
                          -{" "}
                          {formData.end_date && isValid(formData.end_date)
                            ? format(formData.end_date, "dd/MM/yyyy")
                            : "N/A"}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-2 bg-muted/20 p-3 rounded-lg">
                      <h4 className="font-medium mb-2">ຕົວຢ່າງການຄຳນວນ:</h4>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 bg-white rounded border">
                          <p className="text-xs text-muted-foreground mb-1">
                            ຍອດຊື້ 50,000₭
                          </p>
                          <p className="font-medium">
                            {formatCurrency(calculateEffectiveDiscount(50000))}₭
                          </p>
                        </div>

                        <div className="p-2 bg-white rounded border">
                          <p className="text-xs text-muted-foreground mb-1">
                            ຍອດຊື້ 100,000₭
                          </p>
                          <p className="font-medium">
                            {formatCurrency(calculateEffectiveDiscount(100000))}
                            ₭
                          </p>
                        </div>

                        <div className="p-2 bg-white rounded border">
                          <p className="text-xs text-muted-foreground mb-1">
                            ຍອດຊື້ 200,000₭
                          </p>
                          <p className="font-medium">
                            {formatCurrency(calculateEffectiveDiscount(200000))}
                            ₭
                          </p>
                        </div>

                        <div className="p-2 bg-white rounded border">
                          <p className="text-xs text-muted-foreground mb-1">
                            ຍອດຊື້ 500,000₭
                          </p>
                          <p className="font-medium">
                            {formatCurrency(calculateEffectiveDiscount(500000))}
                            ₭
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={() => setPreviewOpen(false)}
                  className="w-full sm:w-auto"
                >
                  ປິດ
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            onClick={handleCancel}
            className="grow md:grow-0"
          >
            <X className="w-4 h-4 mr-2" />
            ຍົກເລີກ
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={loading || isSaving}
            className="grow md:grow-0 bg-primary hover:bg-primary/90"
          >
            {loading || isSaving ? (
              <div className="animate-spin w-4 h-4 mr-2 border-2 border-t-transparent rounded-full" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            ບັນທຶກການປ່ຽນແປງ
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 pb-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
            <h3 className="text-sm font-medium">
              ຄວາມຄືບໜ້າ - {Math.round(completionPercentage)}% ສຳເລັດ
            </h3>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    completionStatus.details ? "bg-green-500" : "bg-gray-200"
                  )}
                />
                <span>ຂໍ້ມູນພື້ນຖານ</span>
              </div>
              <span>→</span>

              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    completionStatus.discount ? "bg-green-500" : "bg-gray-200"
                  )}
                />
                <span>ສ່ວນຫຼຸດ</span>
              </div>
              <span>→</span>

              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    completionStatus.restrictions
                      ? "bg-green-500"
                      : "bg-gray-200"
                  )}
                />
                <span>ຂໍ້ຈຳກັດ</span>
              </div>
              <span>→</span>

              <div className="flex items-center gap-1">
                <div
                  className={cn(
                    "w-3 h-3 rounded-full",
                    completionStatus.targeting ? "bg-green-500" : "bg-gray-200"
                  )}
                />
                <span>ກຸ່ມເປົ້າໝາຍ</span>
              </div>
            </div>
          </div>

          <Progress value={completionPercentage} className="h-2" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full rounded-none border-t">
            <TabsTrigger
              value="details"
              className="flex gap-2 items-center data-[state=active]:bg-muted"
            >
              {completionStatus.details ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <Tag size={14} />
              )}
              <span className="hidden sm:inline">ຂໍ້ມູນພື້ນຖານ</span>
            </TabsTrigger>
            <TabsTrigger
              value="discount"
              className="flex gap-2 items-center data-[state=active]:bg-muted"
            >
              {completionStatus.discount ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <Percent size={14} />
              )}
              <span className="hidden sm:inline">ສ່ວນຫຼຸດ & ເງື່ອນໄຂ</span>
            </TabsTrigger>
            <TabsTrigger
              value="restrictions"
              className="flex gap-2 items-center data-[state=active]:bg-muted"
            >
              {completionStatus.restrictions ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <Settings size={14} />
              )}
              <span className="hidden sm:inline">ຂໍ້ຈຳກັດ</span>
            </TabsTrigger>
            <TabsTrigger
              value="targeting"
              className="flex gap-2 items-center data-[state=active]:bg-muted"
            >
              {completionStatus.targeting ? (
                <CheckCircle2 size={14} className="text-green-500" />
              ) : (
                <Users size={14} />
              )}
              <span className="hidden sm:inline">ກຸ່ມເປົ້າໝາຍ</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsContent value="details" className="space-y-6">
              <Card className="shadow-sm border-t-4 border-t-primary">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Tag className="h-5 w-5 text-primary" />
                    ຂໍ້ມູນພື້ນຖານ
                  </CardTitle>
                  <CardDescription>ຂໍ້ມູນທົ່ວໄປຂອງ Promotion</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className={cn(
                        "text-sm font-medium",
                        formErrors.name ? "text-destructive" : ""
                      )}
                    >
                      ຊື່ Promotion{" "}
                      {formErrors.name && (
                        <span className="text-destructive">*</span>
                      )}
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="ໃສ່ຊື່ promotion..."
                      className={cn(
                        "transition-all duration-200",
                        formErrors.name
                          ? "border-destructive ring-destructive"
                          : "focus:ring-2 focus:ring-primary/20"
                      )}
                    />
                    {formErrors.name && (
                      <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                        <AlertTriangle size={12} />
                        {formErrors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label
                        htmlFor="code"
                        className={cn(
                          "text-sm font-medium",
                          formErrors.code ? "text-destructive" : ""
                        )}
                      >
                        ລະຫັດ Promotion{" "}
                        {formErrors.code && (
                          <span className="text-destructive">*</span>
                        )}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                size="xs"
                                className="h-5 text-xs px-2"
                                onClick={generateRandomCode}
                              >
                                <PlusCircle className="h-3 w-3 mr-1" />
                                ສ້າງລະຫັດ
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>ສ້າງລະຫັດແບບສຸ່ມ</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <div className="flex items-center space-x-1">
                          <Checkbox
                            id="autoGenCode"
                            checked={autoGenCode}
                            onCheckedChange={setAutoGenCode}
                            className="h-3.5 w-3.5"
                          />
                          <Label
                            htmlFor="autoGenCode"
                            className="text-xs text-muted-foreground cursor-pointer"
                          >
                            ສ້າງອັດຕະໂນມັດ
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="relative">
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            code: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="SUMMER2024"
                        className={cn(
                          "uppercase font-medium tracking-wider transition-all duration-200",
                          formErrors.code
                            ? "border-destructive"
                            : "focus:ring-2 focus:ring-primary/20"
                        )}
                      />
                      <div className="absolute right-3 top-2.5 text-muted-foreground">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info
                                size={16}
                                className="hover:text-primary cursor-help"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>ລະຫັດນີ້ຈະໃຊ້ສຳລັບລູກຄ້າໃນການຮັບສ່ວນຫຼຸດ</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {formErrors.code ? (
                      <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                        <AlertTriangle size={12} />
                        {formErrors.code}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        ລະຫັດທີ່ລູກຄ້າຈະໃຊ້ເພື່ອຮັບສ່ວນຫຼຸດ (ຕົວອັກສອນພາສາອັງກິດ
                        ແລະ ຕົວເລກເທົ່ານັ້ນ)
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      ຄຳອະທິບາຍ
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="ອະທິບາຍກ່ຽວກັບ promotion ແລະ ເງື່ອນໄຂການນຳໃຊ້..."
                      rows={4}
                      className="transition-all duration-200 resize-y focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground">
                      ລາຍລະອຽດເພີ່ມເຕີມກ່ຽວກັບ promotion ນີ້
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="status" className="font-medium">
                        ສະຖານະ
                      </Label>
                      <Badge
                        variant={
                          formData.status === "active" ? "default" : "secondary"
                        }
                        className={cn(
                          "ml-2 transition-all",
                          formData.status === "active"
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                        )}
                      >
                        {formData.status === "active"
                          ? "ເປີດໃຊ້ງານ"
                          : "ປິດໃຊ້ງານ"}
                      </Badge>
                    </div>
                    <Switch
                      id="status"
                      checked={formData.status === "active"}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          status: checked ? "active" : "inactive",
                        })
                      }
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t py-3 px-6 bg-muted/10">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setActiveTab("discount")}
                    className="bg-primary/90 hover:bg-primary"
                  >
                    ຂັ້ນຕອນຕໍ່ໄປ
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="discount" className="space-y-6">
              <Card className="shadow-sm border-t-4 border-t-primary">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Percent className="h-5 w-5 text-primary" />
                    ສ່ວນຫຼຸດ & ເງື່ອນໄຂ
                  </CardTitle>
                  <CardDescription>ຕັ້ງຄ່າລາຍລະອຽດສ່ວນຫຼຸດ</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="discountType"
                        className="text-sm font-medium"
                      >
                        ປະເພດສ່ວນຫຼຸດ
                      </Label>
                      <Select
                        value={formData.discount_type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, discount_type: value })
                        }
                      >
                        <SelectTrigger className="w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="ເລືອກປະເພດສ່ວນຫຼຸດ" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">
                            ເປີເຊັນ (%)
                          </SelectItem>
                          <SelectItem value="fixed">ຈຳນວນເງິນ (₭)</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        ເລືອກວ່າສ່ວນຫຼຸດຈະເປັນແບບເປີເຊັນ ຫຼື ຈຳນວນເງິນຕາຍຕົວ
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="discountValue"
                        className={cn(
                          "text-sm font-medium",
                          formErrors.discount_value ? "text-destructive" : ""
                        )}
                      >
                        ມູນຄ່າສ່ວນຫຼຸດ{" "}
                        {formErrors.discount_value && (
                          <span className="text-destructive">*</span>
                        )}
                      </Label>
                      <div className="relative">
                        <Input
                          id="discountValue"
                          type="number"
                          value={formData.discount_value}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              discount_value: e.target.value,
                            })
                          }
                          placeholder={
                            formData.discount_type === "percentage"
                              ? "15"
                              : "50000"
                          }
                          className={cn(
                            "transition-all duration-200 pr-8",
                            formErrors.discount_value
                              ? "border-destructive"
                              : "focus:ring-2 focus:ring-primary/20"
                          )}
                        />
                        <div className="absolute right-3 top-2.5 text-muted-foreground font-medium">
                          {formData.discount_type === "percentage" ? "%" : "₭"}
                        </div>
                      </div>
                      {formErrors.discount_value ? (
                        <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                          <AlertTriangle size={12} />
                          {formErrors.discount_value}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {formData.discount_type === "percentage"
                            ? "ກຳນົດເປີເຊັນສ່ວນຫຼຸດ (1-100)"
                            : "ກຳນົດຈຳນວນເງິນສ່ວນຫຼຸດເປັນກີບ"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="minimumOrder"
                        className="text-sm font-medium"
                      >
                        ຍອດຊື້ຂັ້ນຕ່ຳ (₭)
                      </Label>
                      <div className="relative">
                        <Input
                          id="minimumOrder"
                          type="number"
                          value={formData.minimum_order}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              minimum_order: e.target.value,
                            })
                          }
                          placeholder="ໃສ່ 0 ຖ້າບໍ່ມີຂັ້ນຕ່ຳ"
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                        <div className="absolute right-3 top-2.5 text-muted-foreground font-medium">
                          ₭
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ຍອດເງິນຂັ້ນຕ່ຳທີ່ລູກຄ້າຕ້ອງຊື້ເພື່ອໃຊ້ promotion ນີ້
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="maximumDiscount"
                        className="text-sm font-medium"
                      >
                        ຈຳກັດສ່ວນຫຼຸດສູງສຸດ (₭)
                        {formData.discount_type === "percentage" && (
                          <span className="text-xs ml-2 text-muted-foreground">
                            (ສຳລັບສ່ວນຫຼຸດແບບເປີເຊັນ)
                          </span>
                        )}
                      </Label>
                      <div className="relative">
                        <Input
                          id="maximumDiscount"
                          type="number"
                          value={formData.maximum_discount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              maximum_discount: e.target.value,
                            })
                          }
                          placeholder="ໃສ່ 0 ຖ້າບໍ່ມີຂີດຈຳກັດ"
                          className={cn(
                            "transition-all duration-200 focus:ring-2 focus:ring-primary/20",
                            formData.discount_type !== "percentage" &&
                              "opacity-50"
                          )}
                          disabled={formData.discount_type !== "percentage"}
                        />
                        <div className="absolute right-3 top-2.5 text-muted-foreground font-medium">
                          ₭
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formData.discount_type === "percentage"
                          ? "ຈຳກັດຈຳນວນເງິນສ່ວນຫຼຸດສູງສຸດທີ່ສາມາດໄດ້ຮັບ"
                          : "ໃຊ້ໄດ້ສະເພາະກັບສ່ວນຫຼຸດແບບເປີເຊັນ"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t py-3 px-6 bg-muted/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("details")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ຍ້ອນກັບ
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setActiveTab("restrictions")}
                    className="bg-primary/90 hover:bg-primary"
                  >
                    ຂັ້ນຕອນຕໍ່ໄປ
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Alert variant="outline" className="bg-blue-50 border-blue-200">
                <Activity className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700 text-sm">
                  ທິບ: ການໃຊ້ <strong>ຈຳກັດສ່ວນຫຼຸດສູງສຸດ</strong>{" "}
                  ຊ່ວຍປ້ອງກັນບໍ່ໃຫ້ສ່ວນຫຼຸດສູງເກີນໄປສຳລັບການສັ່ງຊື້ຂະໜາດໃຫຍ່
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="restrictions" className="space-y-6">
              <Card className="shadow-sm border-t-4 border-t-primary">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Settings className="h-5 w-5 text-primary" />
                    ຂໍ້ຈຳກັດການໃຊ້
                  </CardTitle>
                  <CardDescription>
                    ກຳນົດໄລຍະເວລາ ແລະ ຂອບເຂດການນຳໃຊ້
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="startDate"
                        className="text-sm font-medium"
                      >
                        ວັນທີເລີ່ມຕົ້ນ
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.start_date &&
                            isValid(formData.start_date) ? (
                              format(formData.start_date, "PPP")
                            ) : (
                              <span>ເລືອກວັນທີ</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.start_date}
                            onSelect={(date) =>
                              handleDateSelect("start_date", date)
                            }
                            initialFocus
                            className="rounded-md border shadow"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="endDate"
                        className={cn(
                          "text-sm font-medium",
                          formErrors.end_date ? "text-destructive" : ""
                        )}
                      >
                        ວັນທີສິ້ນສຸດ{" "}
                        {formErrors.end_date && (
                          <span className="text-destructive">*</span>
                        )}
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal transition-all duration-200",
                              formErrors.end_date
                                ? "border-destructive text-destructive"
                                : "focus:ring-2 focus:ring-primary/20"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.end_date && isValid(formData.end_date) ? (
                              format(formData.end_date, "PPP")
                            ) : (
                              <span>ເລືອກວັນທີ</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.end_date}
                            onSelect={(date) =>
                              handleDateSelect("end_date", date)
                            }
                            initialFocus
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            className="rounded-md border shadow"
                          />
                        </PopoverContent>
                      </Popover>
                      {formErrors.end_date && (
                        <p className="text-destructive text-sm flex items-center gap-1 mt-1">
                          <AlertTriangle size={12} />
                          {formErrors.end_date}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxUses" className="text-sm font-medium">
                      ຈຳນວນການໃຊ້ສູງສຸດ
                    </Label>
                    <Input
                      id="maxUses"
                      type="number"
                      value={formData.usage_limit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usage_limit: e.target.value,
                        })
                      }
                      placeholder="ໃສ່ 0 ສຳລັບບໍ່ຈຳກັດ"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground">
                      ຈຳນວນຄັ້ງສູງສຸດທີ່ promotion ນີ້ສາມາດຖືກໃຊ້ໄດ້ທັງໝົດ
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      ໝວດໝູ່ສິນຄ້າທີ່ໃຊ້ໄດ້
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: "coffee", label: "ກາເຟ" },
                        { id: "tea", label: "ຊາ" },
                        { id: "bakery", label: "ເຂົ້າໜົມ" },
                        { id: "equipment", label: "ອຸປະກອນ" },
                      ].map((category) => (
                        <Button
                          key={category.id}
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-12 justify-center transition-all duration-200",
                            formData.product_categories.includes(category.id)
                              ? "border-primary bg-primary/10 text-primary font-medium"
                              : ""
                          )}
                          onClick={() => toggleCategory(category.id)}
                        >
                          {category.label}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground pt-1">
                      {formData.product_categories.length === 0
                        ? "ເລືອກໝວດໝູ່ສິນຄ້າທີ່ promotion ນີ້ສາມາດໃຊ້ໄດ້ (ບໍ່ເລືອກ = ທຸກໝວດໝູ່)"
                        : `ສາມາດໃຊ້ໄດ້ກັບສິນຄ້າ ${formData.product_categories.length} ໝວດໝູ່`}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t py-3 px-6 bg-muted/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("discount")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ຍ້ອນກັບ
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setActiveTab("targeting")}
                    className="bg-primary/90 hover:bg-primary"
                  >
                    ຂັ້ນຕອນຕໍ່ໄປ
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-6">
              <Card className="shadow-sm border-t-4 border-t-primary">
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Users className="h-5 w-5 text-primary" />
                    ກຸ່ມເປົ້າໝາຍ
                  </CardTitle>
                  <CardDescription>
                    ຕັ້ງຄ່າເງື່ອນໄຂສຳລັບກຸ່ມລູກຄ້າເປົ້າໝາຍ
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 bg-muted/20 rounded-lg border hover:bg-muted/30 transition-colors">
                      <Checkbox
                        id="newCustomersOnly"
                        checked={formData.restrictions.newCustomersOnly}
                        onCheckedChange={(checked) =>
                          handleRestrictionChange("newCustomersOnly", checked)
                        }
                        className="mt-1"
                      />
                      <div className="space-y-1 leading-none">
                        <Label
                          htmlFor="newCustomersOnly"
                          className="text-base font-medium cursor-pointer"
                        >
                          ສະເພາະລູກຄ້າໃໝ່
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          ນຳໃຊ້ສະເພາະລູກຄ້າທີ່ສັ່ງຊື້ຄັ້ງທຳອິດເທົ່ານັ້ນ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-muted/20 rounded-lg border hover:bg-muted/30 transition-colors">
                      <Checkbox
                        id="membersOnly"
                        checked={formData.restrictions.membersOnly}
                        onCheckedChange={(checked) =>
                          handleRestrictionChange("membersOnly", checked)
                        }
                        className="mt-1"
                      />
                      <div className="space-y-1 leading-none">
                        <Label
                          htmlFor="membersOnly"
                          className="text-base font-medium cursor-pointer"
                        >
                          ສະເພາະສະມາຊິກ
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          ອະນຸຍາດໃຫ້ສະເພາະລູກຄ້າທີ່ເປັນສະມາຊິກເທົ່ານັ້ນ
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-4 bg-muted/20 rounded-lg border hover:bg-muted/30 transition-colors">
                      <Checkbox
                        id="oneTimeUse"
                        checked={formData.restrictions.oneTimeUse}
                        onCheckedChange={(checked) =>
                          handleRestrictionChange("oneTimeUse", checked)
                        }
                        className="mt-1"
                      />
                      <div className="space-y-1 leading-none">
                        <Label
                          htmlFor="oneTimeUse"
                          className="text-base font-medium cursor-pointer"
                        >
                          ໃຊ້ໄດ້ພຽງຄັ້ງດຽວຕໍ່ລູກຄ້າ
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          ລູກຄ້າແຕ່ລະຄົນສາມາດໃຊ້ promotion
                          ນີ້ໄດ້ພຽງຄັ້ງດຽວເທົ່ານັ້ນ
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                    <div className="flex items-start gap-3">
                      <Info className="text-amber-500 mt-0.5 h-5 w-5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">
                          ຄຳແນະນຳ
                        </h4>
                        <p className="text-sm text-amber-700">
                          ການຈຳກັດກຸ່ມເປົ້າໝາຍສາມາດຊ່ວຍເພີ່ມປະສິດທິພາບຂອງ
                          promotion ແຕ່ອາດເຮັດໃຫ້ຈຳນວນການໃຊ້ຫຼຸດລົງ
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t py-3 px-6 bg-muted/10">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("restrictions")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    ຍ້ອນກັບ
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSaving ? (
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-t-transparent rounded-full" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    ບັນທຶກການປ່ຽນແປງ
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                ຂໍ້ມູນສັງລວມ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="rounded-lg border bg-primary/5 p-3">
                  <h3 className="font-medium mb-2 text-primary">
                    {formData.name || "ຊື່ໂປຣໂມຊັ່ນ"}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary/90 text-xs">
                      {formData.code || "CODE"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {formData.status === "active"
                        ? "ເປີດໃຊ້ງານ"
                        : "ປິດໃຊ້ງານ"}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {formData.description || "ຍັງບໍ່ມີຄຳອະທິບາຍ"}
                  </p>

                  <div className="text-sm space-y-1 pt-2 border-t border-dashed">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ສ່ວນຫຼຸດ:</span>
                      <span className="font-medium">
                        {formData.discount_value
                          ? formData.discount_type === "percentage"
                            ? `${formData.discount_value}%`
                            : `${formData.discount_value}₭`
                          : "-"}
                      </span>
                    </div>

                    {formData.minimum_order && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          ຍອດຊື້ຂັ້ນຕ່ຳ:
                        </span>
                        <span className="font-medium">
                          {formData.minimum_order}₭
                        </span>
                      </div>
                    )}

                    {formData.discount_type === "percentage" &&
                      formData.maximum_discount && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">ສູງສຸດ:</span>
                          <span className="font-medium">
                            {formData.maximum_discount}₭
                          </span>
                        </div>
                      )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">ໄລຍະເວລາໃຊ້ງານ</h4>
                  <div className="flex items-center justify-between text-sm p-2 bg-muted/20 rounded-md">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {formData.start_date && isValid(formData.start_date)
                          ? format(formData.start_date, "dd/MM/yyyy")
                          : "N/A"}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                      <span>
                        {formData.end_date && isValid(formData.end_date)
                          ? format(formData.end_date, "dd/MM/yyyy")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {formData.product_categories.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">ໝວດໝູ່ທີ່ໃຊ້ໄດ້</h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.product_categories.map((category) => (
                        <Badge
                          key={category}
                          variant="outline"
                          className="bg-muted/30"
                        >
                          {category === "coffee" && "ກາເຟ"}
                          {category === "tea" && "ຊາ"}
                          {category === "bakery" && "ເຂົ້າໜົມ"}
                          {category === "equipment" && "ອຸປະກອນ"}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(formData.restrictions.newCustomersOnly ||
                  formData.restrictions.membersOnly ||
                  formData.restrictions.oneTimeUse) && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">ຂໍ້ຈຳກັດການໃຊ້</h4>
                    <div className="space-y-1 text-sm">
                      {formData.restrictions.newCustomersOnly && (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>ສະເພາະລູກຄ້າໃໝ່</span>
                        </div>
                      )}
                      {formData.restrictions.membersOnly && (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>ສະເພາະສະມາຊິກ</span>
                        </div>
                      )}
                      {formData.restrictions.oneTimeUse && (
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>ໃຊ້ໄດ້ພຽງຄັ້ງດຽວຕໍ່ຄົນ</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/20 pt-4 border-t flex flex-col">
              <Button
                onClick={() => setPreviewOpen(true)}
                variant="outline"
                className="w-full mb-2"
              >
                <Gift className="w-4 h-4 mr-2" />
                ເບິ່ງຕົວຢ່າງໂປຣໂມຊັ່ນ
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={loading || isSaving}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {loading || isSaving ? (
                  <div className="animate-spin w-4 h-4 mr-2 border-2 border-t-transparent rounded-full" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                ບັນທຶກການປ່ຽນແປງ
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                ຄຳແນະນຳ
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm space-y-3 text-muted-foreground">
                <p>• ຊື່ແລະລະຫັດໂປຣໂມຊັ່ນຄວນເຂົ້າໃຈງ່າຍແລະຈົດຈຳໄດ້</p>
                <p>
                  •
                  ຕັ້ງຄ່າວັນທີສິ້ນສຸດຢ່າງຊັດເຈນເພື່ອຫຼີກລ້ຽງການໃຊ້ໂດຍບໍ່ໄດ້ຕັ້ງໃຈ
                </p>
                <p>
                  • ເພີ່ມຂໍ້ຈຳກັດຍອດຊື້ຂັ້ນຕໍ່າເພື່ອເພີ່ມມູນຄ່າການສັ່ງຊື້ສະເລ່ຍ
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-2 sticky bottom-0 p-4 bg-background border-t shadow-sm z-10">
        <Button variant="outline" onClick={handleCancel} className="min-w-28">
          <X className="w-4 h-4 mr-2" />
          ຍົກເລີກ
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || isSaving}
          className="min-w-40 bg-primary hover:bg-primary/90"
        >
          {loading || isSaving ? (
            <div className="animate-spin w-4 h-4 mr-2 border-2 border-t-transparent rounded-full" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          ບັນທຶກການປ່ຽນແປງ
        </Button>
      </div>
    </div>
  );
};

export default EditPromotionPage;
