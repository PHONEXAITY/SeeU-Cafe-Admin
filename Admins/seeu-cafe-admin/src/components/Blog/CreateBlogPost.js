"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSave,
  FaImage,
  FaQuestionCircle,
  FaTimes,
  FaCheck,
  FaArrowLeft,
  FaEye,
  FaTag,
  FaCog,
  FaSearch,
  FaBolt,
  FaClock,
  FaCalendarAlt,
  FaGlobe,
  FaLock,
  FaRegEye,
  FaRegEyeSlash,
  FaExclamationTriangle,
  FaInfoCircle,
  FaImages,
  FaTrash,
  FaCloudUploadAlt,
  FaPlus,
  FaPenNib
} from "react-icons/fa";
import Link from "next/link";
import { useBlogCategories } from "@/hooks/useBlogHooks";
import { useBlogActions } from "@/hooks/useBlogActions";

// Status Badge Component with improved styling
const StatusBadge = ({ status, size = "default" }) => {
  const statusConfig = {
    draft: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-800 dark:text-yellow-300",
      icon: <FaPenNib className={`${size === "small" ? "h-3 w-3" : "h-4 w-4"} mr-1.5`} />,
      label: "ຮ່າງ"
    },
    published: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-300",
      icon: <FaGlobe className={`${size === "small" ? "h-3 w-3" : "h-4 w-4"} mr-1.5`} />,
      label: "ເຜີຍແຜ່"
    },
    archived: {
      bg: "bg-gray-100 dark:bg-gray-700",
      text: "text-gray-800 dark:text-gray-300",
      icon: <FaLock className={`${size === "small" ? "h-3 w-3" : "h-4 w-4"} mr-1.5`} />,
      label: "ເກັບຖາວອນ"
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center ${size === "small" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"} rounded-full font-medium ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

const CreateBlogPost = () => {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [unsavedChangesDialog, setUnsavedChangesDialog] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("content"); // content, seo, settings
  const [validationErrors, setValidationErrors] = useState({});
  const [slugTouched, setSlugTouched] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft",
    slug: "",
    image: "",
    categoryIds: [],
    meta_title: "",
    meta_description: "",
    tags: [],
    visibility: "public",
    publish_date: new Date().toISOString().split('T')[0],
  });

  const { categories, loading: categoriesLoading, error: categoriesError } = useBlogCategories();
  const { createPost, loading: submitLoading, error: submitError, uploadPostImage } = useBlogActions();

  // Handle browser back/close with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formChanged) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formChanged]);

  // For tracking mock upload progress
  useEffect(() => {
    let interval;
    if (isUploading) {
      interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 300);
    } else {
      setUploadProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isUploading]);

  // Validate form data when it changes
  useEffect(() => {
    const currentErrors = validateForm(false);
    setValidationErrors(currentErrors);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormChanged(true);

    // Auto-generate slug from title if slug hasn't been manually edited
    if (name === "title" && !slugTouched) {
      setFormData((prev) => ({ ...prev, slug: slugify(value) }));
    }
    
    // If slug is being edited, mark it as touched
    if (name === "slug") {
      setSlugTouched(true);
    }
    
    // Auto-generate meta title if empty
    if (name === "title" && !formData.meta_title) {
      setFormData((prev) => ({ ...prev, meta_title: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormChanged(true);
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, categoryIds: value ? [parseInt(value)] : [] }));
    setFormChanged(true);
  };

  const handleTagAdd = (tag) => {
    if (!tag || formData.tags.includes(tag)) return;
    setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setFormChanged(true);
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({ 
      ...prev, 
      tags: prev.tags.filter(tag => tag !== tagToRemove) 
    }));
    setFormChanged(true);
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "ຮູບພາບໃຫຍ່ເກີນໄປ",
        description: "ກະລຸນາເລືອກຮູບພາບທີ່ມີຂະໜາດນ້ອຍກວ່າ 10MB",
      });
      return;
    }

    // Preview image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await uploadPostImage(formData);

      if (response?.secure_url) {
        setFormData((prev) => ({ ...prev, image: response.secure_url }));
        setFormChanged(true);
        toast({
          title: "ອັບໂຫຼດຮູບພາບສຳເລັດ",
          description: "ຮູບພາບຖືກອັບໂຫຼດແລ້ວ",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດອັບໂຫຼດຮູບພາບໄດ້",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: "" }));
    setImagePreview(null);
    setFormChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateForm = (showToast = true) => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = "ກະລຸນາໃສ່ຫົວຂໍ້ບົດຄວາມ";
    if (!formData.content.trim()) errors.content = "ກະລຸນາໃສ່ເນື້ອໃນບົດຄວາມ";
    if (!formData.slug.trim()) errors.slug = "ກະລຸນາໃສ່ slug ສຳລັບບົດຄວາມ";
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = "Slug ຕ້ອງເປັນຕົວອັກສອນພາສາອັງກິດຕົວພິມນ້ອຍ, ຕົວເລກ ແລະ - ເທົ່ານັ້ນ";
    }
    if (formData.categoryIds.length === 0) errors.category = "ກະລຸນາເລືອກໝວດໝູ່ຢ່າງໜ້ອຍ 1 ໝວດ";
    
    if (formData.meta_title && formData.meta_title.length > 60) {
      errors.meta_title = "Meta Title ຄວນມີຄວາມຍາວບໍ່ເກີນ 60 ຕົວອັກສອນ";
    }
    
    if (formData.meta_description && formData.meta_description.length > 160) {
      errors.meta_description = "Meta Description ຄວນມີຄວາມຍາວບໍ່ເກີນ 160 ຕົວອັກສອນ";
    }

    if (showToast && Object.keys(errors).length > 0) {
      toast({
        variant: "destructive",
        title: "ກະລຸນາແກ້ໄຂຂໍ້ມູນ",
        description: (
          <ul className="list-disc pl-4">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        ),
      });
    }
    
    return errors;
  };

  const handleSubmit = async (publishStatus = null) => {
    const errors = validateForm(true);
    if (Object.keys(errors).length > 0) {
      // Switch to the tab containing the first error
      if (errors.title || errors.content || errors.slug) {
        setActiveTab("content");
      } else if (errors.meta_title || errors.meta_description) {
        setActiveTab("seo");
      } else if (errors.category) {
        setActiveTab("settings");
      }
      return;
    }

    const finalFormData = {
      ...formData,
      status: publishStatus || formData.status,
    };

    try {
      await createPost(finalFormData);
      toast({
        variant: "success",
        title: "ສ້າງບົດຄວາມສຳເລັດ",
        description: `ບົດຄວາມຖືກ${finalFormData.status === "published" ? "ເຜີຍແຜ່" : "ບັນທຶກເປັນຮ່າງ"}ແລ້ວ`,
      });
      setFormChanged(false);
      router.push("/blog/posts");
    } catch (error) {
      const errorMessage = error.message || submitError || "ບໍ່ສາມາດສ້າງບົດຄວາມໄດ້";
      
      // Check for specific API errors
      if (errorMessage.includes("slug") && errorMessage.includes("already exists")) {
        setValidationErrors(prev => ({...prev, slug: "Slug ນີ້ມີຜູ້ໃຊ້ແລ້ວ, ກະລຸນາໃຊ້ slug ອື່ນ"}));
        setActiveTab("content");
      }
      
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: errorMessage
      });
    }
  };

  const handleCancel = () => {
    if (formChanged) {
      setUnsavedChangesDialog(true);
    } else {
      router.push("/blog/posts");
    }
  };

  // Character counter with colored bar indicator
  const CharacterCounter = ({ current, max, label }) => {
    const percentage = (current / max) * 100;
    const getColor = () => {
      if (percentage < 70) return "bg-green-500";
      if (percentage < 90) return "bg-yellow-500";
      return "bg-red-500";
    };
    
    return (
      <div className="mt-1">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>{label}</span>
          <span className={percentage > 100 ? "text-red-500 font-bold" : ""}>
            {current}/{max}
          </span>
        </div>
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getColor()} transition-all duration-300 ease-in-out`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Phetsarath_OT']">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCancel} 
                className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                aria-label="Back"
              >
                <FaArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">ສ້າງບົດຄວາມໃໝ່</h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <StatusBadge status={formData.status} size="small" />
                  {formData.slug && (
                    <span className="text-gray-500 dark:text-gray-400 hidden sm:inline-block truncate max-w-xs">
                      /{formData.slug}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      onClick={() => setPreviewDialog(true)} 
                      disabled={submitLoading}
                      className="text-sm border-gray-300 dark:border-gray-600 dark:text-gray-300"
                      aria-label="Preview"
                    >
                      <FaEye className="w-3.5 h-3.5 mr-2" />
                      <span className="hidden sm:inline">ເບິ່ງຕົວຢ່າງ</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ເບິ່ງຕົວຢ່າງກ່ອນເຜີຍແຜ່</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                variant="outline" 
                onClick={handleCancel} 
                disabled={submitLoading}
                className="text-sm border-gray-300 dark:border-gray-600 dark:text-gray-300"
                aria-label="Cancel"
              >
                <FaTimes className="w-3.5 h-3.5 mr-2" />
                <span className="hidden sm:inline">ຍົກເລີກ</span>
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary"
                      onClick={() => handleSubmit("draft")}
                      disabled={submitLoading}
                      className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                      aria-label="Save Draft"
                    >
                      <FaSave className="w-3.5 h-3.5 mr-2" />
                      <span className="hidden sm:inline">
                        {submitLoading && formData.status === "draft" ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກຮ່າງ"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>ບັນທຶກເປັນສະບັບຮ່າງ</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Button 
                onClick={() => handleSubmit("published")} 
                disabled={submitLoading}
                className="text-sm bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                aria-label="Publish"
              >
                <FaCheck className="w-3.5 h-3.5 mr-2" />
                <span className="hidden sm:inline">
                  {submitLoading && formData.status === "published" ? "ກຳລັງເຜີຍແຜ່..." : "ເຜີຍແຜ່"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 max-w-md mb-0">
              <TabsTrigger 
                value="content" 
                className={`flex items-center gap-1 ${activeTab === "content" ? "text-blue-600 dark:text-blue-400" : ""}`}
              >
                <FaPenNib className="h-3.5 w-3.5 sm:mr-1" />
                <span className="hidden sm:inline">ບົດຄວາມ</span>
                {(validationErrors.title || validationErrors.content || validationErrors.slug) && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    !
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="seo" 
                className={`flex items-center gap-1 ${activeTab === "seo" ? "text-blue-600 dark:text-blue-400" : ""}`}
              >
                <FaSearch className="h-3.5 w-3.5 sm:mr-1" />
                <span className="hidden sm:inline">SEO</span>
                {(validationErrors.meta_title || validationErrors.meta_description) && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    !
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className={`flex items-center gap-1 ${activeTab === "settings" ? "text-blue-600 dark:text-blue-400" : ""}`}
              >
                <FaCog className="h-3.5 w-3.5 sm:mr-1" />
                <span className="hidden sm:inline">ຕັ້ງຄ່າ</span>
                {validationErrors.category && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    !
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsContent value="content" className="mt-0 outline-none border-none">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Main Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title and Slug */}
                <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title" className={`text-base font-medium ${validationErrors.title ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                          ຫົວຂໍ້ <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="ໃສ່ຫົວຂໍ້ບົດຄວາມ..."
                          className={`mt-1 text-lg font-medium border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                            validationErrors.title ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                          }`}
                        />
                        {validationErrors.title && (
                          <p className="mt-1 text-sm text-red-500">{validationErrors.title}</p>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center">
                          <Label htmlFor="slug" className={`text-base font-medium ${validationErrors.slug ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                            Slug <span className="text-red-500">*</span>
                          </Label>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <FaQuestionCircle className="w-3.5 h-3.5 ml-1 inline text-gray-400 dark:text-gray-500" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-900 text-white text-sm p-2 rounded shadow-lg">
                                <p>Slug ຈະປະກົດໃນ URL ຂອງບົດຄວາມ</p>
                                <p className="mt-1 text-xs text-gray-300">ຕົວຢ່າງ: yourdomain.com/blog/<strong>your-slug</strong></p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                            /blog/
                          </span>
                          <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="url-friendly-slug"
                            className={`flex-1 rounded-l-none border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                              validationErrors.slug ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                            }`}
                          />
                        </div>
                        {validationErrors.slug ? (
                          <p className="mt-1 text-sm text-red-500">{validationErrors.slug}</p>
                        ) : (
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            *ໃຊ້ຕົວອັກສອນພາສາອັງກິດຕົວພິມນ້ອຍ, ຕົວເລກ ແລະ ຂີດກາງ (-) ເທົ່ານັ້ນ
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Content Editor */}
                <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
                  <CardHeader className="bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 px-6 py-4">
                    <CardTitle className="text-lg font-medium dark:text-white">ເນື້ອໃນບົດຄວາມ</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div>
                      <Label htmlFor="content" className={`text-base font-medium ${validationErrors.content ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                        ເນື້ອໃນ <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        placeholder="ເລີ່ມຂຽນບົດຄວາມຂອງທ່ານ..."
                        rows={18}
                        className={`resize-y min-h-[300px] text-base mt-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                          validationErrors.content ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                        }`}
                      />
                      {validationErrors.content && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.content}</p>
                      )}
                      <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formData.content.length} ຕົວອັກສອນ</span>
                        <span>{formData.content.split(/\s+/).filter(Boolean).length} ຄຳ</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Image */}
                <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
                  <CardHeader className="bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 px-6 py-4">
                    <div className="flex items-center">
                      <FaImages className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <CardTitle className="text-lg font-medium dark:text-white">ຮູບພາບຫຼັກ</CardTitle>
                    </div>
                    <CardDescription className="dark:text-gray-400">ຮູບພາບທີ່ຈະສະແດງເທິງສຸດຂອງບົດຄວາມ</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isUploading && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">ກຳລັງອັບໂຫຼດ...</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                    
                    <AnimatePresence mode="wait">
                      {imagePreview || formData.image ? (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="relative rounded-lg overflow-hidden shadow-md"
                        >
                          <img
                            src={imagePreview || formData.image}
                            alt="Preview"
                            className="w-full h-80 object-cover rounded-lg"
                          />
                          <div className="absolute top-0 right-0 p-2 flex gap-2">
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-gray-900/50 hover:bg-red-500 text-white"
                              onClick={removeImage}
                              aria-label="Remove image"
                            >
                              <FaTrash className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200 ${isUploading ? 'bg-gray-100 dark:bg-gray-750' : 'bg-white dark:bg-gray-800'}`}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-4 mb-4">
                            <FaCloudUploadAlt className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                          </div>
                          <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-2 font-medium">
                            {isUploading ? "ກຳລັງອັບໂຫຼດ..." : "ລາກຮູບໃສ່ນີ້ ຫຼື ກົດເພື່ອເລືອກຮູບ"}
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">ຮອງຮັບ JPG, PNG, GIF (ສູງສຸດ 10MB)</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Publish Settings Card */}
                <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 sticky top-24">
                  <CardHeader className="bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 px-6 py-4">
                    <div className="flex items-center">
                      <FaBolt className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                      <CardTitle className="text-lg font-medium dark:text-white">ພາບລວມ</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Status */}
                      <div>
                        <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">ສະຖານະປັດຈຸບັນ</Label>
                        <div className="mt-2 flex items-center gap-2">
                          <StatusBadge status={formData.status} />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formData.status === "draft" && "ບັນທຶກໄວ້ຊົ່ວຄາວ, ຍັງບໍ່ໄດ້ເຜີຍແຜ່"}
                            {formData.status === "published" && "ເຜີຍແຜ່ໃຫ້ທຸກຄົນສາມາດເບິ່ງໄດ້"}
                            {formData.status === "archived" && "ເກັບຖາວອນ, ບໍ່ສາມາດເບິ່ງໄດ້"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div>
                        <div className="rounded-lg bg-gray-50 dark:bg-gray-750 p-4 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <FaClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-900 dark:text-white">ພ້ອມເຜີຍແຜ່</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400">ບົດຄວາມຂອງທ່ານພ້ອມເຜີຍແຜ່ທັນທີ</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="secondary"
                              onClick={() => handleSubmit("draft")}
                              disabled={submitLoading}
                              className="w-full justify-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                              aria-label="Save Draft"
                            >
                              <FaSave className="w-4 h-4 mr-2" />
                              ບັນທຶກຮ່າງ
                            </Button>
                            <Button 
                              onClick={() => handleSubmit("published")} 
                              disabled={submitLoading}
                              className="w-full justify-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                              aria-label="Publish"
                            >
                              <FaCheck className="w-4 h-4 mr-2" />
                              ເຜີຍແຜ່
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div className="pt-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">ສະຖິຕິດ່ວນ</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">{formData.content.split(/\s+/).filter(Boolean).length}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">ຄຳທັງໝົດ</span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-750 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                              {Math.ceil(formData.content.split(/\s+/).filter(Boolean).length / 200)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">ນາທີໃນການອ່ານ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="seo" className="mt-0 outline-none border-none">
            {/* SEO Settings */}
            <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
              <CardHeader className="bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 px-6 py-4">
                <div className="flex items-center">
                  <FaSearch className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                  <CardTitle className="text-lg font-medium dark:text-white">SEO ແລະ ແທັກ</CardTitle>
                </div>
                <CardDescription className="dark:text-gray-400">ປັບແຕ່ງການຄົ້ນຫາແລະການສະແດງຜົນ</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="meta_title" className={`text-sm font-medium ${validationErrors.meta_title ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                      Meta Title
                    </Label>
                    <Input
                      id="meta_title"
                      name="meta_title"
                      value={formData.meta_title}
                      onChange={handleInputChange}
                      placeholder="ຫົວຂໍ້ສຳລັບ SEO (ຖ້າວ່າງຈະໃຊ້ຫົວຂໍ້ບົດຄວາມ)"
                      className={`mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                        validationErrors.meta_title ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                    />
                    {validationErrors.meta_title ? (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.meta_title}</p>
                    ) : (
                      <CharacterCounter current={formData.meta_title.length} max={60} label="ແນະນຳຫຼາຍກວ່າ 35-50 ຕົວອັກສອນ" />
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="meta_description" className={`text-sm font-medium ${validationErrors.meta_description ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
                      Meta Description
                    </Label>
                    <Textarea
                      id="meta_description"
                      name="meta_description"
                      value={formData.meta_description}
                      onChange={handleInputChange}
                      placeholder="ຄຳອະທິບາຍສັ້ນໆກ່ຽວກັບບົດຄວາມສຳລັບ Search Engine"
                      rows={3}
                      className={`mt-1 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                        validationErrors.meta_description ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
                      }`}
                    />
                    {validationErrors.meta_description ? (
                      <p className="mt-1 text-sm text-red-500">{validationErrors.meta_description}</p>
                    ) : (
                      <CharacterCounter current={formData.meta_description.length} max={160} label="ແນະນຳຫຼາຍກວ່າ 120-155 ຕົວອັກສອນ" />
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="tags" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags
                    </Label>
                    <div className="mt-1 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 flex flex-wrap gap-2 bg-white dark:bg-gray-700 min-h-[80px]">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleTagRemove(tag)}
                            className="ml-1 focus:outline-none"
                          >
                            <FaTimes className="h-2 w-2" />
                          </button>
                        </Badge>
                      ))}
                      <input
                        type="text"
                        placeholder="ເພີ່ມແທັກ... (ກົດ Enter)"
                        className="outline-none flex-grow bg-transparent text-gray-800 dark:text-white text-sm min-w-[100px]"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            e.preventDefault();
                            handleTagAdd(e.target.value.trim());
                            e.target.value = '';
                          }
                        }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      ແທັກຊ່ວຍໃຫ້ຜູ້ອ່ານຄົ້ນຫາເນື້ອໃນທີ່ກ່ຽວຂ້ອງໄດ້
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      ຕົວຢ່າງຜົນການຄົ້ນຫາ Google
                    </Label>
                    <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-750">
                      <p className="text-base text-blue-600 dark:text-blue-400 truncate">
                        {formData.meta_title || formData.title || "ຫົວຂໍ້ບົດຄວາມ"}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-500 truncate">
                        yourdomain.com/blog/{formData.slug || "sample-slug"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                        {formData.meta_description || "ຄຳອະທິບາຍບົດຄວາມຂອງທ່ານຈະສະແດງຢູ່ບ່ອນນີ້..."}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-4 mt-4">
                    <div className="flex">
                      <FaInfoCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">ຂໍ້ແນະນຳ SEO</h3>
                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-400 space-y-1">
                          <p>- ໃຊ້ຄຳສຳຄັນໃນຫົວຂໍ້ແລະຄຳອະທິບາຍ</p>
                          <p>- Meta title ຄວນມີຄວາມຍາວລະຫວ່າງ 35-65 ຕົວອັກສອນ</p>
                          <p>- Meta description ຄວນມີຄວາມຍາວລະຫວ່າງ 120-155 ຕົວອັກສອນ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0 outline-none border-none">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Categories Section */}
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
                <CardHeader className="bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 px-6 py-4">
                  <div className="flex items-center">
                    <FaTag className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <CardTitle className="text-lg font-medium dark:text-white">ໝວດໝູ່</CardTitle>
                  </div>
                  <CardDescription className="dark:text-gray-400">ເລືອກໝວດໝູ່ຢ່າງໜ້ອຍ 1 ໝວດ</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {categoriesLoading ? (
                    <div className="text-center p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">ກຳລັງໂຫລດໝວດໝູ່...</p>
                    </div>
                  ) : categoriesError ? (
                    <div className="text-center p-4 text-red-500">
                      <FaExclamationTriangle className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">ເກີດຂໍ້ຜິດພາດ: {categoriesError}</p>
                      <Button 
                        className="mt-2" 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.refresh()}
                      >
                        ລອງໃໝ່
                      </Button>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-center p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">ບໍ່ມີໝວດໝູ່. ກະລຸນາສ້າງໝວດໝູ່ກ່ອນ.</p>
                      <Button 
                        className="mt-2" 
                        variant="outline" 
                        size="sm"
                        onClick={() => router.push('/blog/categories')}
                      >
                        <FaPlus className="h-3 w-3 mr-1" />
                        ສ້າງໝວດໝູ່
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className={validationErrors.category ? "border-red-500 rounded-md p-1" : ""}>
                        <Select
                          value={formData.categoryIds[0]?.toString() || ""}
                          onValueChange={handleCategoryChange}
                        >
                          <SelectTrigger className="w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                            <SelectValue placeholder="ເລືອກໝວດໝູ່" />
                          </SelectTrigger>
                          <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                            {categories.map((category) => (
                              <SelectItem 
                                key={category.id} 
                                value={category.id.toString()}
                                className="dark:text-white dark:focus:bg-gray-700"
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {validationErrors.category && (
                        <p className="mt-1 text-sm text-red-500">{validationErrors.category}</p>
                      )}
                      
                      {formData.categoryIds.length > 0 && (
                        <div className="mt-4">
                          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            ໝວດໝູ່ທີ່ເລືອກ
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {formData.categoryIds.map((id) => {
                              const category = categories.find(c => c.id === id);
                              return category ? (
                                <Badge 
                                  key={id} 
                                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1"
                                >
                                  {category.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4 text-right">
                        <Link 
                          href="/blog/categories" 
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-end"
                        >
                          <FaPlus className="h-3 w-3 mr-1" />
                          ສ້າງໝວດໝູ່ໃໝ່
                        </Link>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Visibility and Schedule */}
              <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
                <CardHeader className="bg-gray-50 dark:bg-gray-750 border-b dark:border-gray-700 px-6 py-4">
                  <div className="flex items-center">
                    <FaCog className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                    <CardTitle className="text-lg font-medium dark:text-white">ການຕັ້ງຄ່າການເຜີຍແຜ່</CardTitle>
                  </div>
                  <CardDescription className="dark:text-gray-400">ກຳນົດວິທີ ແລະ ເວລາເຜີຍແຜ່</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Visibility */}
                    <div>
                      <Label htmlFor="visibility" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ການເບິ່ງເຫັນ
                      </Label>
                      <Select
                        value={formData.visibility}
                        onValueChange={(value) => handleSelectChange("visibility", value)}
                      >
                        <SelectTrigger className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                          <SelectValue placeholder="ເລືອກການເບິ່ງເຫັນ" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem 
                            value="public"
                            className="dark:text-white dark:focus:bg-gray-700"
                          >
                            <div className="flex items-center">
                              <FaRegEye className="h-4 w-4 mr-2 text-green-500" />
                              ສາທາລະນະ (ທຸກຄົນເບິ່ງໄດ້)
                            </div>
                          </SelectItem>
                          <SelectItem 
                            value="private"
                            className="dark:text-white dark:focus:bg-gray-700"
                          >
                            <div className="flex items-center">
                              <FaRegEyeSlash className="h-4 w-4 mr-2 text-amber-500" />
                              ສ່ວນຕົວ (ສະເພາະຜູ້ບໍລິຫານເທົ່ານັ້ນ)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {formData.visibility === 'public' ? 
                          'ບົດຄວາມນີ້ຈະສະແດງໃນໜ້າເວັບໄຊຕ໌ຂອງທ່ານ ແລະ ເຄື່ອງມືຄົ້ນຫາຕ່າງໆ' : 
                          'ບົດຄວາມນີ້ຈະແສດງສະເພາະຜູ້ບໍລິຫານເທົ່ານັ້ນ'}
                      </p>
                    </div>

                    {/* Status */}
                    <div>
                      <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">ສະຖານະ</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleSelectChange("status", value)}
                      >
                        <SelectTrigger className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                          <SelectValue placeholder="ເລືອກສະຖານະ" />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem 
                            value="draft"
                            className="dark:text-white dark:focus:bg-gray-700"
                          >
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                              ຮ່າງ
                            </div>
                          </SelectItem>
                          <SelectItem 
                            value="published"
                            className="dark:text-white dark:focus:bg-gray-700"
                          >
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                              ເຜີຍແຜ່
                            </div>
                          </SelectItem>
                          <SelectItem 
                            value="archived"
                            className="dark:text-white dark:focus:bg-gray-700"
                          >
                            <div className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                              ເກັບຖາວອນ
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Publish Date */}
                    <div>
                      <Label htmlFor="publish_date" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        <div className="flex items-center">
                          <FaCalendarAlt className="h-4 w-4 mr-2 text-gray-400" />
                          ວັນທີເຜີຍແຜ່
                        </div>
                      </Label>
                      <Input
                        id="publish_date"
                        name="publish_date"
                        type="date"
                        value={formData.publish_date}
                        onChange={handleInputChange}
                        className="mt-1 w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        ບົດຄວາມຈະຖືກເຜີຍແຜ່ໃນມື້ດັ່ງກ່າວຖ້າສະຖານະເປັນ "ເຜີຍແຜ່"
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 dark:bg-gray-750 border-t dark:border-gray-700 px-6 py-4">
                  <div className="w-full">
                    <Button 
                      onClick={() => handleSubmit("published")} 
                      disabled={submitLoading}
                      className="w-full justify-center shadow-sm"
                      aria-label="Publish"
                    >
                      <FaCheck className="w-4 h-4 mr-2" />
                      {submitLoading ? "ກຳລັງເຜີຍແຜ່..." : "ເຜີຍແຜ່ທັນທີ"}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto p-0 dark:bg-gray-800 dark:text-white">
          <DialogHeader className="p-6 border-b sticky top-0 bg-white dark:bg-gray-800 dark:border-gray-700 z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl dark:text-white">ສະແດງຕົວຢ່າງບົດຄວາມ</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full"
                onClick={() => setPreviewDialog(false)}
              >
                <FaTimes className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription className="text-sm dark:text-gray-400">
              ນີ້ແມ່ນການສະແດງຕົວຢ່າງຂອງບົດຄວາມທີ່ຈະເຜີຍແຜ່
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 max-w-3xl mx-auto">
            <article className="prose prose-lg max-w-none dark:prose-invert">
              <h1 className="text-3xl font-bold mb-6 dark:text-white">{formData.title || "ຫົວຂໍ້ບົດຄວາມ"}</h1>
              
              <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 dark:text-gray-400">
                <StatusBadge status={formData.status} size="small" />
                <span className="mx-2">•</span>
                <span>{new Date(formData.publish_date).toLocaleDateString('lo-LA')}</span>
                {formData.categoryIds.length > 0 && (
                  <>
                    <span className="mx-2">•</span>
                    {formData.categoryIds.map((id) => {
                      const category = categories.find(c => c.id === id);
                      return category ? (
                        <Badge key={id} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                          {category.name}
                        </Badge>
                      ) : null;
                    })}
                  </>
                )}
              </div>
              
              {(formData.image || imagePreview) && (
                <div className="mb-6">
                  <img
                    src={formData.image || imagePreview}
                    alt={formData.title}
                    className="w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              )}
              
              <div className="mt-6 space-y-4">
                {formData.content ? (
                  formData.content.split("\n").map((paragraph, index) => (
                    paragraph.trim() ? (
                      <p key={index} className="text-gray-800 dark:text-gray-300 leading-relaxed">{paragraph}</p>
                    ) : <br key={index} />
                  ))
                ) : (
                  <p className="text-gray-500 italic dark:text-gray-400">ກະລຸນາເພີ່ມເນື້ອໃນບົດຄວາມ...</p>
                )}
              </div>
              
              {formData.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium mb-3 dark:text-gray-300">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Dialog */}
      <Dialog open={unsavedChangesDialog} onOpenChange={setUnsavedChangesDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold dark:text-white">ຍັງບໍ່ໄດ້ບັນທຶກການປ່ຽນແປງ</DialogTitle>
            <DialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
              ທ່ານມີການປ່ຽນແປງທີ່ຍັງບໍ່ໄດ້ບັນທຶກ. ທ່ານຕ້ອງການຍົກເລີກການແກ້ໄຂນີ້ບໍ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between mt-4">
            <Button 
              variant="outline" 
              onClick={() => setUnsavedChangesDialog(false)}
              className="w-full sm:w-auto border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            >
              ສືບຕໍ່ການແກ້ໄຂ
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setUnsavedChangesDialog(false);
                router.push("/blog/posts");
              }}
              className="w-full sm:w-auto mt-2 sm:mt-0"
            >
              ຍົກເລີກການແກ້ໄຂ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateBlogPost;