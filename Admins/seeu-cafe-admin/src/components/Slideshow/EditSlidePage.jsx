"use client";
import React, { useState, useRef, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Separator } from "@/components/ui/separator";
import {
  Save,
  X as Times,
  Image,
  Link,
  Upload,
  ExternalLink,
  Calendar,
  Clock,
  AlertCircle,
  ArrowLeft,
  Eye,
  Loader2,
  Trash2,
  Check,
  EyeOff,
  Info
} from "lucide-react";
import { useSlideshowService } from "@/hooks/useSlideshowService";

const EditSlidePage = ({ params }) => {
  const slideId = params?.id;
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("basic");
  const { getSlideById, updateSlide, updateSlideImage, deleteSlide } =
    useSlideshowService();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: null,
    link: "",
    status: "active",
    startDate: "",
    endDate: "",
    buttonText: "",
    buttonLink: "",
    buttonTarget: "_self",
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    const loadSlide = async () => {
        if (!slideId) {
            toast({
              variant: "destructive",
              title: "ຜິດພາດ",
              description: "ບໍ່ພົບ Slide ID",
            });
            router.push("/slideshow/list");
            return;
          }
      try {
        setInitialLoading(true);
        console.log("Fetching slide with ID:", Number(slideId));
        
        const slide = await getSlideById(Number(slideId));
        console.log("Fetched slide:", slide);

        if (slide) {
          // Format dates for datetime-local input
          let startDate = slide.startDate ? new Date(slide.startDate) : "";
          let endDate = slide.endDate ? new Date(slide.endDate) : "";

          if (startDate) {
            startDate = formatDateForInput(startDate);
          }

          if (endDate) {
            endDate = formatDateForInput(endDate);
          }

          setFormData({
            title: slide.title || "",
            subtitle: slide.subtitle || "",
            image: null, // We don't load the actual file, just the preview
            imageUrl: slide.image || "",
            link: slide.link || "",
            status: slide.status || "active",
            startDate: startDate,
            endDate: endDate,
            buttonText: slide.buttonText || "",
            buttonLink: slide.buttonLink || "",
            buttonTarget: slide.buttonTarget || "_self",
            isActive: slide.status === "active",
            order: slide.order || 0,
          });

          setImagePreview(slide.image);
        } else {
          toast({
            variant: "destructive",
            title: "ຜິດພາດ",
            description: "ບໍ່ພົບ Slide ທີ່ຕ້ອງການແກ້ໄຂ",
          });
          router.push("/slideshow/list");
        }
      } catch (error) {
        console.error("Error loading slide:", error);
        toast({
          variant: "destructive",
          title: "ຜິດພາດ",
          description: `ບໍ່ສາມາດໂຫລດຂໍ້ມູນ Slide ໄດ້: ${error.message}`,
        });
      } finally {
        setInitialLoading(false);
        setFormChanged(false);
      }
    };

    loadSlide();
  }, [slideId, getSlideById, router, toast]);

  // Helper function to format date for datetime-local input
  const formatDateForInput = (date) => {
    const d = new Date(date);
    // Format to YYYY-MM-DDTHH:MM
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    // Mark form as changed if any field is modified
    if (!initialLoading) {
      setFormChanged(true);
    }
  }, [formData, initialLoading]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "ກະລຸນາໃສ່ຫົວຂໍ້";
    }

    if (formData.status === "scheduled") {
      if (!formData.startDate) {
        newErrors.startDate = "ກະລຸນາໃສ່ວັນທີເລີ່ມຕົ້ນ";
      }
      if (!formData.endDate) {
        newErrors.endDate = "ກະລຸນາໃສ່ວັນທີສິ້ນສຸດ";
      }
      if (
        formData.startDate &&
        formData.endDate &&
        new Date(formData.startDate) >= new Date(formData.endDate)
      ) {
        newErrors.dateRange = "ວັນທີສິ້ນສຸດຕ້ອງຫຼັງຈາກວັນທີເລີ່ມຕົ້ນ";
      }
    }

    if (formData.buttonText && !formData.buttonLink) {
      newErrors.buttonLink = "ກະລຸນາໃສ່ລິ້ງເຊື່ອມຕໍ່ສຳລັບປຸ່ມ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description: "ກະລຸນາເລືອກໄຟລ໌ຮູບພາບເທົ່ານັ້ນ",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description: "ຂະໜາດຮູບພາບຕ້ອງບໍ່ເກີນ 5MB",
      });
      return;
    }

    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleExitPage = () => {
    if (formChanged) {
      setExitConfirmOpen(true);
    } else {
      router.push("/slideshow/list");
    }
  };

  const getStatusColorClass = (status) => {
    const styles = {
      active: "bg-emerald-100 text-emerald-800 border-emerald-200",
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return styles[status] || styles.inactive;
  };

  const confirmExit = () => {
    setExitConfirmOpen(false);
    router.push("/slideshow/list");
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      const success = await deleteSlide(Number(slideId));

      if (success) {
        toast({
          title: "ສຳເລັດ",
          description: "ລຶບ Slide ສຳເລັດແລ້ວ",
        });

        router.push("/slideshow/list");
      }
    } catch (error) {
      console.error("Error deleting slide:", error);
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description: `ບໍ່ສາມາດລຶບ Slide ໄດ້: ${error.message}`,
      });
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // If there are errors, show toast and switch to the tab with errors
      const errorTab = Object.keys(errors).some((key) =>
        ["title", "image", "subtitle"].includes(key)
      )
        ? "basic"
        : "settings";

      setActiveTab(errorTab);

      toast({
        variant: "destructive",
        title: "ກະລຸນາກວດສອບຂໍ້ມູນ",
        description: "ມີຂໍ້ມູນບາງສ່ວນທີ່ບໍ່ຖືກຕ້ອງ",
      });

      return;
    }

    try {
      setLoading(true);

      // If there's a new image to upload
      if (formData.image) {
        // Create FormData for API submission
        const imageFormData = new FormData();
        imageFormData.append("file", formData.image);

        // Add other fields
        if (formData.title) imageFormData.append("title", formData.title);
        if (formData.subtitle)
          imageFormData.append("subtitle", formData.subtitle);
        if (formData.link) imageFormData.append("link", formData.link);
        if (formData.status) imageFormData.append("status", formData.status);
        if (formData.order) imageFormData.append("order", formData.order);
        if (formData.buttonText)
          imageFormData.append("buttonText", formData.buttonText);
        if (formData.buttonLink)
          imageFormData.append("buttonLink", formData.buttonLink);
        if (formData.buttonTarget)
          imageFormData.append("buttonTarget", formData.buttonTarget);

        if (formData.status === "scheduled") {
          if (formData.startDate)
            imageFormData.append("startDate", formData.startDate);
          if (formData.endDate)
            imageFormData.append("endDate", formData.endDate);
        }

        // Update slide with new image
        await updateSlideImage(Number(slideId), imageFormData);
      } else {
        // Just update slide data without image
        const slideData = {
          title: formData.title,
          subtitle: formData.subtitle,
          link: formData.link,
          status: formData.status,
          order: formData.order,
          buttonText: formData.buttonText,
          buttonLink: formData.buttonLink,
          buttonTarget: formData.buttonTarget,
        };

        if (formData.status === "scheduled") {
          slideData.startDate = formData.startDate;
          slideData.endDate = formData.endDate;
        }

        await updateSlide(Number(slideId), slideData);
      }

      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດ Slide ສຳເລັດແລ້ວ",
        action: (
          <ToastAction
            altText="ເບິ່ງລາຍການ"
            onClick={() => router.push("/slideshow/list")}
          >
            ເບິ່ງລາຍການ
          </ToastAction>
        ),
      });

      // Reset form changed status since we saved successfully
      setFormChanged(false);
    } catch (error) {
      console.error("Error updating slide:", error);
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description:
          error.response?.data?.message || "ເກີດຂໍ້ຜິດພາດໃນການອັບເດດ Slide",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getButtonPreviewText = () => {
    return formData.buttonText || "ເບິ່ງເພີ່ມເຕີມ";
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6 font-['Phetsarath_OT']">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600" />
          <h3 className="text-xl font-medium">ກຳລັງໂຫລດຂໍ້ມູນ...</h3>
          <p className="text-gray-500">ກະລຸນາລໍຖ້າຈັກໜ້ອຍ</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 md:p-8 font-['Phetsarath_OT']">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleExitPage}
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ແກ້ໄຂ Slide
            </h1>
            <p className="text-gray-500 mt-1">
              ແກ້ໄຂຂໍ້ມູນ Slide ສຳລັບໜ້າຫຼັກຂອງທ່ານ
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button
            variant="outline"
            onClick={handleExitPage}
            className="w-full sm:w-auto"
          >
            <Times className="w-4 h-4 mr-2" />
            ຍົກເລີກ
          </Button>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-red-200 text-red-600 hover:text-white hover:bg-red-600 hover:border-red-600"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            ລຶບ
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ກຳລັງບັນທຶກ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                ບັນທຶກ
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

      <div className="grid gap-8 lg:grid-cols-9">
        <div className="lg:col-span-6 space-y-8">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="basic" className="text-base">
                ຂໍ້ມູນພື້ນຖານ
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-base">
                ຕັ້ງຄ່າການສະແດງ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>ຂໍ້ມູນພື້ນຖານ</CardTitle>
                  <CardDescription>
                    ຂໍ້ມູນຫຼັກທີ່ຈະປະກົດໃນ Slide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-base">
                        ຫົວຂໍ້ <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          handleFieldChange("title", e.target.value)
                        }
                        placeholder="ໃສ່ຫົວຂໍ້ສຳລັບ slide..."
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.title}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="subtitle" className="text-base">
                        ຫົວຂໍ້ຍ່ອຍ
                      </Label>
                      <Input
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) =>
                          handleFieldChange("subtitle", e.target.value)
                        }
                        placeholder="ໃສ່ຫົວຂໍ້ຍ່ອຍ (ຖ້າມີ)..."
                      />
                    </div>
                    <div>
                      <Label className="text-base mb-3 block">
                        ຮູບພາບ <span className="text-red-500">*</span>
                      </Label>
                      <div
                        className="border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:bg-gray-50"
                        onClick={triggerImageUpload}
                      >
                        {imagePreview ? (
                          <div className="space-y-4">
                            <div className="relative aspect-video mx-auto overflow-hidden rounded-md">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerImageUpload();
                              }}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              ປ່ຽນຮູບພາບ
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="bg-gray-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="mt-4 text-base text-gray-600 font-medium">
                              ລາກຮູບໃສ່ນີ້ ຫຼື ກົດເພື່ອເລືອກຮູບ
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                              ແນະນຳຂະໜາດ: 1920x1080px (16:9) ຂະໜາດສູງສຸດ: 5MB
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="link" className="text-base">
                        ລິ້ງເຊື່ອມຕໍ່
                      </Label>
                      <div className="flex gap-2 mt-1.5">
                        <div className="relative flex-1">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="link"
                            className="pl-10"
                            value={formData.link}
                            onChange={(e) =>
                              handleFieldChange("link", e.target.value)
                            }
                            placeholder="ໃສ່ URL ທີ່ຕ້ອງການເຊື່ອມຕໍ່..."
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1.5">
                        ເຊື່ອມຕໍ່ຜູ້ໃຊ້ໄປຫາລິ້ງນີ້ເມື່ອຄລິກທີ່ Slide
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>ຕັ້ງຄ່າການສະແດງ</CardTitle>
                  <CardDescription>
                    ກຳນົດວິທີ ແລະ ເວລາສະແດງ Slide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="status" className="text-base">
                      ສະຖານະ
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleFieldChange("status", value)
                      }
                    >
                      <SelectTrigger id="status" className="mt-1.5">
                        <SelectValue placeholder="ເລືອກສະຖານະ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">ກຳລັງສະແດງ</SelectItem>
                        <SelectItem value="scheduled">ກຳນົດເວລາ</SelectItem>
                        <SelectItem value="inactive">ປິດໃຊ້ງານ</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1.5">
                      {formData.status === "active" &&
                        "Slide ຈະສະແດງໃນໜ້າເວັບທັນທີ"}
                      {formData.status === "scheduled" &&
                        "Slide ຈະສະແດງຕາມວັນທີ ແລະ ເວລາທີ່ກຳນົດ"}
                      {formData.status === "inactive" &&
                        "Slide ຈະຖືກເກັບໄວ້ແຕ່ບໍ່ສະແດງໃນໜ້າເວັບ"}
                    </p>
                  </div>

                  {formData.status === "scheduled" && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="startDate" className="text-base">
                          ວັນທີເລີ່ມຕົ້ນ <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative mt-1.5">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="startDate"
                            type="datetime-local"
                            className="pl-10"
                            value={formData.startDate}
                            onChange={(e) =>
                              handleFieldChange("startDate", e.target.value)
                            }
                          />
                        </div>
                        {errors.startDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.startDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="endDate" className="text-base">
                          ວັນທີສິ້ນສຸດ <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative mt-1.5">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="endDate"
                            type="datetime-local"
                            className="pl-10"
                            value={formData.endDate}
                            onChange={(e) =>
                              handleFieldChange("endDate", e.target.value)
                            }
                          />
                        </div>
                        {errors.endDate && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.endDate}
                          </p>
                        )}
                      </div>
                      {errors.dateRange && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>ຂໍ້ຜິດພາດ</AlertTitle>
                          <AlertDescription>
                            {errors.dateRange}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">
                      ຕັ້ງຄ່າປຸ່ມເພີ່ມເຕີມ
                    </h3>
                    <div>
                      <Label htmlFor="buttonText" className="text-base">
                        ຂໍ້ຄວາມປຸ່ມ
                      </Label>
                      <Input
                        id="buttonText"
                        value={formData.buttonText}
                        onChange={(e) =>
                          handleFieldChange("buttonText", e.target.value)
                        }
                        placeholder="ເຊັ່ນ: ເບິ່ງເພີ່ມເຕີມ, ຊື້ເລີຍ, ສົ່ງຂໍ້ຄວາມ"
                        className="mt-1.5"
                      />
                      <p className="text-sm text-gray-500 mt-1.5">
                        ປະໄວ້ວ່າງຖ້າບໍ່ຕ້ອງການສະແດງປຸ່ມ
                      </p>
                    </div>

                    {formData.buttonText && (
                      <>
                        <div>
                          <Label htmlFor="buttonLink" className="text-base">
                            ລິ້ງສຳລັບປຸ່ມ
                            {formData.buttonText && (
                              <span className="text-red-500"> *</span>
                            )}
                          </Label>
                          <div className="relative mt-1.5">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="buttonLink"
                              className="pl-10"
                              value={formData.buttonLink}
                              onChange={(e) =>
                                handleFieldChange("buttonLink", e.target.value)
                              }
                              placeholder="ໃສ່ URL ທີ່ຕ້ອງການເຊື່ອມຕໍ່..."
                            />
                          </div>
                          {errors.buttonLink && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.buttonLink}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label className="text-base mb-3 block">
                            ການເປີດລິ້ງ
                          </Label>
                          <RadioGroup
                            value={formData.buttonTarget}
                            onValueChange={(value) =>
                              handleFieldChange("buttonTarget", value)
                            }
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="_self" id="target-self" />
                              <Label
                                htmlFor="target-self"
                                className="cursor-pointer"
                              >
                                ເປີດໃນໜ້າດຽວກັນ
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="_blank"
                                id="target-blank"
                              />
                              <Label
                                htmlFor="target-blank"
                                className="cursor-pointer flex items-center"
                              >
                                ເປີດໃນແທັບໃໝ່
                                <ExternalLink className="ml-1 h-3 w-3 text-gray-500" />
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <Label htmlFor="order" className="text-base">
                      ລຳດັບທີ່ສະແດງ
                    </Label>
                    <Input
                      id="order"
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) =>
                        handleFieldChange(
                          "order",
                          parseInt(e.target.value) || 0
                        )
                      }
                      placeholder="ໃສ່ຕົວເລກລຳດັບ (0 ສະແດງລຳດັບຕາມເວລາສ້າງ)"
                      className="mt-1.5"
                    />
                    <p className="text-sm text-gray-500 mt-1.5">
                      ຖ້າຄ່າແມ່ນ 0 ຫຼື ບໍ່ລະບຸ, ລະບົບຈະຈັດລຳດັບຕາມເວລາທີ່ສ້າງ
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ຕົວຢ່າງ</CardTitle>
                <Badge className={getStatusColorClass(formData.status)}>
                  {formData.status === "active"
                    ? "ກຳລັງສະແດງ"
                    : formData.status === "scheduled"
                    ? "ກຳນົດເວລາ"
                    : "ປິດໃຊ້ງານ"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm border border-gray-200">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image className="w-12 h-12 text-gray-300" />
                  </div>
                )}

                {(formData.title ||
                  formData.subtitle ||
                  formData.buttonText) && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    {formData.title && (
                      <h3 className="text-white text-xl font-bold">
                        {formData.title}
                      </h3>
                    )}
                    {formData.subtitle && (
                      <p className="text-white/90 mt-2 text-sm">
                        {formData.subtitle}
                      </p>
                    )}
                    {formData.buttonText && (
                      <Button
                        size="sm"
                        className="mt-4 bg-white text-black hover:bg-white/90 hover:text-black"
                      >
                        {getButtonPreviewText()}
                      </Button>
                    )}
                  </div>
                )}

                {formData.status === "inactive" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="bg-black/80 rounded-full p-3">
                      <EyeOff className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3">
                {formData.status === "scheduled" &&
                  formData.startDate &&
                  formData.endDate && (
                    <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
                      <div className="flex items-center gap-2 text-blue-700 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">ກຳນົດເວລາສະແດງ</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">ເລີ່ມຕົ້ນ:</p>
                          <p className="font-medium">
                            {new Date(formData.startDate).toLocaleString(
                              "lo-LA"
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">ສິ້ນສຸດ:</p>
                          <p className="font-medium">
                            {new Date(formData.endDate).toLocaleString("lo-LA")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                {formData.link && (
                  <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-500">ລິ້ງເຊື່ອມຕໍ່:</span>
                    <span
                      className="font-medium text-blue-600 truncate max-w-[180px]"
                      title={formData.link}
                    >
                      {formData.link}
                    </span>
                  </div>
                )}

                {formData.buttonText && formData.buttonLink && (
                  <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-md">
                    <span className="text-gray-500">ປຸ່ມ:</span>
                    <div className="flex items-center gap-1 text-sm">
                      <Badge variant="outline" className="font-normal">
                        {formData.buttonText}
                      </Badge>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-500">ລຳດັບທີ່ສະແດງ:</span>
                  <span className="font-medium">
                    {formData.order > 0 ? formData.order : "ອັດຕະໂນມັດ"}
                  </span>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-700">ຄຳແນະນຳ</AlertTitle>
                  <AlertDescription className="text-blue-600 text-sm">
                    ສາມາດປັບແຕ່ງການສະແດງຜົນລວມ ເຊັ່ນ ຮູບແບບການປ່ຽນ slide ແລະ
                    ເອເຟກໄດ້ທີ່ໜ້າຕັ້ງຄ່າ Slideshow
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={exitConfirmOpen} onOpenChange={setExitConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ຢືນຢັນການອອກຈາກໜ້ານີ້</AlertDialogTitle>
            <AlertDialogDescription>
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອອກຈາກໜ້ານີ້?
              ຂໍ້ມູນທີ່ປ່ຽນແປງຈະບໍ່ຖືກບັນທຶກ.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ຍົກເລີກ</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmExit}
              className="bg-red-600 hover:bg-red-700"
            >
              ອອກໂດຍບໍ່ບັນທຶກ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ຢືນຢັນການລຶບ Slide</AlertDialogTitle>
            <AlertDialogDescription>
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ Slide ນີ້?
              ຂໍ້ມູນທັງໝົດຈະຖືກລຶບອອກຈາກລະບົບ ແລະ ບໍ່ສາມາດກູ້ຄືນໄດ້.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ຍົກເລີກ</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ກຳລັງລຶບ...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  ລຶບ Slide
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EditSlidePage;
