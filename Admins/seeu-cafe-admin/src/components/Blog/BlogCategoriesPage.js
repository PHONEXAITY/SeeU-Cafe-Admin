"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFolder,
  FaExclamationTriangle,
  FaTags,
  FaLink,
  FaInfoCircle,
  FaBars,
  FaSortAmountDown,
  FaSortAmountUp,
  FaBookmark,
  FaThLarge,
  FaList,
  FaEye,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { useBlogCategories, useBlogActions } from "@/hooks/useBlogHooks";
import { Tooltip } from "@/components/ui/tooltip";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Animations config
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const DeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  categoryName,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-['Phetsarath_OT'] dark:bg-gray-900 dark:text-white">
        <DialogHeader className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <FaExclamationTriangle className="h-8 w-8 text-red-600 dark:text-red-300" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            ຢືນຢັນການລຶບ
          </DialogTitle>
          <DialogDescription className="text-center text-base dark:text-gray-300">
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໝວດໝູ່ນີ້? ການກະທຳນີ້ບໍ່ສາມາດກັບຄືນໄດ້.
          </DialogDescription>
        </DialogHeader>

        {categoryName && (
          <div className="my-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-inner">
            <p className="text-center font-medium text-gray-900 dark:text-white break-words text-lg">
              {categoryName}
            </p>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="mt-3 sm:mt-0 text-base hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ຍົກເລີກ
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 text-base font-medium"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                ກຳລັງລຶບ...
              </>
            ) : (
              <>
                <FaTrash className="h-5 w-5" />
                ລຶບຖາວອນ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CategoryDialog = ({ isOpen, onClose, category = null, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
      });
    }
  }, [category, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug if name field changes and slug is empty or matching the previous name's slug
    if (name === "name") {
      const currentSlug = category?.slug ? slugify(category.name) : "";
      if (!formData.slug || formData.slug === currentSlug) {
        setFormData((prev) => ({ ...prev, slug: slugify(value) }));
      }
    }
  };

  // แก้ไขฟังก์ชัน slugify ให้แปลงเป็นตัวพิมพ์เล็กทั้งหมด
  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase() // ตรงนี้สำคัญมาก ต้องแปลงเป็นตัวพิมพ์เล็กทั้งหมด
      .trim()
      .replace(/\s+/g, "-") // เปลี่ยนช่องว่างเป็น -
      .replace(/[^\w\-]+/g, "") // ลบตัวอักษรพิเศษทั้งหมด
      .replace(/\-\-+/g, "-") // เปลี่ยน --- เป็น -
      .replace(/^-+/, "") // ลบ - ที่ขึ้นต้น
      .replace(/-+$/, ""); // ลบ - ที่ลงท้าย
  };

  // เพิ่มการตรวจสอบ slug ก่อนส่งข้อมูล
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // แปลง slug เป็นตัวพิมพ์เล็กทั้งหมดอีกครั้งก่อนส่งข้อมูล
    const finalData = {
      ...formData,
      slug: formData.slug.toLowerCase()
    };
    
    onSubmit(finalData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md font-['Phetsarath_OT'] dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold dark:text-white">
            {category ? "ແກ້ໄຂໝວດໝູ່" : "ເພີ່ມໝວດໝູ່ໃໝ່"}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-300 text-base">
            {category ? "ແກ້ໄຂລາຍລະອຽດຂອງໝວດໝູ່ນີ້" : "ສ້າງໝວດໝູ່ໃໝ່ສຳລັບບົດຄວາມຂອງທ່ານ"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 py-4">
            <div>
              <Label htmlFor="name" className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1.5 block">
                ຊື່ໝວດໝູ່ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="ໃສ່ຊື່ໝວດໝູ່..."
                className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <div className="flex items-center mb-1.5">
                <Label htmlFor="slug" className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Slug <span className="text-red-500">*</span>
                </Label>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">(URL ສຳລັບໝວດໝູ່ນີ້)</span>
              </div>
              <div className="flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300 text-sm">
                  /category/
                </span>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="url-friendly-slug"
                  className="flex-1 rounded-l-none border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-blue-500"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                * Slug ต้องประกอบด้วยตัวอักษรภาษาอังกฤษพิมพ์เล็ก ตัวเลข และเครื่องหมาย - เท่านั้น
              </p>
            </div>
            <div>
              <Label htmlFor="description" className="text-base font-medium text-gray-700 dark:text-gray-200 mb-1.5 block">
                ຄຳອະທິບາຍ
              </Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="ອະທິບາຍກ່ຽວກັບໝວດໝູ່..."
                className="border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-blue-500"
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-3 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="mt-3 sm:mt-0 border-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
            >
              ຍົກເລີກ
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  ກຳລັງບັນທຶກ...
                </>
              ) : (
                <>
                  {category ? <FaEdit className="h-5 w-5" /> : <FaPlus className="h-5 w-5" />}
                  ບັນທຶກ
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const BlogCategoriesPage = () => {
  const { toast } = useToast();
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    category: null,
  });
  const [deleteDialogState, setDeleteDialogState] = useState({
    isOpen: false,
    categoryId: null,
    categoryName: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [sortConfig, setSortConfig] = useState({
    field: "name",
    direction: "asc",
  });

  // Use custom hooks
  const { categories, loading, error, refetch } = useBlogCategories();
  const {
    createCategory,
    updateCategory,
    deleteCategory,
    loading: actionLoading,
  } = useBlogActions();

  // Sort and filter categories
  const sortedAndFilteredCategories = React.useMemo(() => {
    // First filter
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        category.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Then sort
    return [...filtered].sort((a, b) => {
      const fieldA = a[sortConfig.field]
        ? a[sortConfig.field].toLowerCase()
        : "";
      const fieldB = b[sortConfig.field]
        ? b[sortConfig.field].toLowerCase()
        : "";

      if (fieldA < fieldB) return sortConfig.direction === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [categories, searchQuery, sortConfig]);

  const handleSort = (field) => {
    setSortConfig({
      field,
      direction:
        sortConfig.field === field && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const handleSaveCategory = async (formData) => {
    try {
      if (dialogState.category) {
        await updateCategory(dialogState.category.id, formData);
        toast({
          title: "ອັບເດດໝວດໝູ່ສຳເລັດ",
          description: "ໝວດໝູ່ຖືກອັບເດດແລ້ວ",
          variant: "success",
        });
      } else {
        await createCategory(formData);
        toast({
          title: "ສ້າງໝວດໝູ່ສຳເລັດ",
          description: "ໝວດໝູ່ໃໝ່ຖືກສ້າງແລ້ວ",
          variant: "success",
        });
      }
      refetch(); // Refresh data after save
      setDialogState({ isOpen: false, category: null });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດບັນທຶກໝວດໝູ່ໄດ້",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteDialogState.categoryId) return;

    try {
      await deleteCategory(deleteDialogState.categoryId);
      toast({
        title: "ລຶບໝວດໝູ່ສຳເລັດ",
        description: "ໝວດໝູ່ຖືກລຶບອອກແລ້ວ",
        variant: "success",
      });
      refetch(); // Refresh data after delete
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດລຶບໝວດໝູ່ໄດ້",
      });
    } finally {
      setDeleteDialogState({
        isOpen: false,
        categoryId: null,
        categoryName: "",
      });
    }
  };

  // Generate category color based on id for visual distinction
  const getCategoryColor = (id) => {
    const colors = [
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Phetsarath_OT']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                <FaTags className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                ຈັດການໝວດໝູ່ບົດຄວາມ
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-300 mt-1 flex items-center flex-wrap gap-2">
                ສ້າງ ແລະ ແກ້ໄຂໝວດໝູ່ສຳລັບບົດຄວາມຂອງທ່ານ
                <Badge
                  variant="outline"
                  className="ml-2 bg-gray-100 dark:bg-gray-700 dark:text-gray-200"
                >
                  {sortedAndFilteredCategories.length}{" "}
                  {sortedAndFilteredCategories.length !== 1
                    ? "ລາຍການ"
                    : "ລາຍການ"}
                </Badge>
              </p>
            </div>
            <Button
              onClick={() => setDialogState({ isOpen: true, category: null })}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow-sm transition-all duration-200 transform hover:scale-[1.02] text-base"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              ເພີ່ມໝວດໝູ່ໃໝ່
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md rounded-xl dark:bg-gray-800">
          <CardHeader className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center">
                <FaTags className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                <CardTitle className="text-lg font-medium dark:text-white">
                  ໝວດໝູ່ທັງໝົດ
                </CardTitle>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`rounded p-1.5 ${
                      viewMode === "grid"
                        ? "bg-white dark:bg-gray-600"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <FaThLarge className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`rounded p-1.5 ${
                      viewMode === "list"
                        ? "bg-white dark:bg-gray-600"
                        : "hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <FaList className="h-4 w-4 text-gray-700 dark:text-gray-200" />
                  </Button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1 dark:border-gray-600 dark:text-gray-200"
                    >
                      <FaSortAmountDown className="h-3.5 w-3.5 mr-1" />
                      ຮຽງຕາມ: {sortConfig.field === "name" ? "ຊື່" : "Slug"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="dark:bg-gray-800 dark:border-gray-700">
                    <DropdownMenuItem
                      onClick={() => handleSort("name")}
                      className="flex items-center justify-between dark:text-white dark:hover:bg-gray-700"
                    >
                      ຊື່ໝວດໝູ່
                      {sortConfig.field === "name" &&
                        (sortConfig.direction === "asc" ? (
                          <FaSortAmountUp className="h-3.5 w-3.5 ml-2" />
                        ) : (
                          <FaSortAmountDown className="h-3.5 w-3.5 ml-2" />
                        ))}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSort("slug")}
                      className="flex items-center justify-between dark:text-white dark:hover:bg-gray-700"
                    >
                      Slug
                      {sortConfig.field === "slug" &&
                        (sortConfig.direction === "asc" ? (
                          <FaSortAmountUp className="h-3.5 w-3.5 ml-2" />
                        ) : (
                          <FaSortAmountDown className="h-3.5 w-3.5 ml-2" />
                        ))}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <CardDescription className="dark:text-gray-300 mt-1.5">
              ຈັດການໝວດໝູ່ສຳລັບບົດຄວາມຂອງທ່ານ
            </CardDescription>
          </CardHeader>

          <div className="p-6 border-b dark:border-gray-700">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                className="pl-10 pr-10 py-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md transition-all duration-200"
                placeholder="ຄົ້ນຫາໝວດໝູ່..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <span aria-hidden="true" className="text-xl">
                    &times;
                  </span>
                </button>
              )}
            </div>
          </div>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-pulse"
                  >
                    <div className="flex-1">
                      <Skeleton className="h-6 w-1/3 mb-3 bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-4 w-2/3 mt-2 bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-9 rounded bg-gray-200 dark:bg-gray-700" />
                      <Skeleton className="h-9 w-9 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                <div className="rounded-full bg-red-100 dark:bg-red-900/30 p-4 text-red-600 dark:text-red-400 mb-4">
                  <FaExclamationTriangle className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  ເກີດຂໍ້ຜິດພາດ
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
                <Button
                  onClick={refetch}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                >
                  ລອງໃໝ່ອີກຄັ້ງ
                </Button>
              </div>
            ) : sortedAndFilteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-6">
                <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4 text-gray-500 dark:text-gray-400 mb-4">
                  <FaFolder className="h-8 w-8" />
                </div>
                {searchQuery ? (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      ບໍ່ພົບໝວດໝູ່ທີ່ກົງກັບການຄົ້ນຫາ
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      ລອງປ່ຽນຄຳຄົ້ນຫາຂອງທ່ານ ຫຼື ລ້າງຕົວກອງ
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setSearchQuery("")}
                      className="border-gray-300 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      ລ້າງການຄົ້ນຫາ
                    </Button>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      ຍັງບໍ່ມີໝວດໝູ່
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      ສ້າງໝວດໝູ່ໃໝ່ເພື່ອຈັດລະບຽບບົດຄວາມຂອງທ່ານ
                    </p>
                    <Button
                      onClick={() =>
                        setDialogState({ isOpen: true, category: null })
                      }
                      className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white shadow transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <FaPlus className="w-4 h-4 mr-2" />
                      ເພີ່ມໝວດໝູ່ໃໝ່
                    </Button>
                  </>
                )}
              </div>
            ) : viewMode === "list" ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {sortedAndFilteredCategories.map((category) => (
                  <motion.div
                    key={category.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="py-5 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <div
                          className={`${getCategoryColor(
                            category.id
                          )} p-2.5 rounded-md mr-3 shadow-sm transition-transform duration-300 hover:scale-110`}
                        >
                          <FaFolder className="h-4 w-4" />
                        </div>
                        <h3 className="font-medium text-lg truncate dark:text-white">
                          {category.name}
                        </h3>
                        <Badge
                          variant="outline"
                          className="ml-2 hidden sm:inline-flex bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                        >
                          ID: {category.id}
                        </Badge>
                      </div>

                      <div className="mt-2.5 text-sm text-gray-500 dark:text-gray-400 space-y-2 ml-10">
                        <div className="flex items-center group">
                          <FaLink className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                          <span className="text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            /category/{category.slug}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-2 p-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                `/category/${category.slug}`
                              );
                              toast({
                                title: "คัดลอกลิงค์แล้ว",
                                description: `คัดลอก /category/${category.slug} ไปยังคลิปบอร์ดแล้ว`,
                                duration: 2000,
                              });
                            }}
                          >
                            <FaExternalLinkAlt className="w-3 h-3 text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400" />
                          </Button>
                        </div>

                        {category.description && (
                          <div className="flex items-start">
                            <FaInfoCircle className="w-3.5 h-3.5 mr-2 text-gray-400 dark:text-gray-500 mt-1" />
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                              {category.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 ml-10 sm:ml-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 dark:text-gray-200 transition-all"
                        onClick={() =>
                          setDialogState({ isOpen: true, category })
                        }
                      >
                        <FaEdit className="w-4 h-4 mr-1.5" />
                        <span className="hidden sm:inline">ແກ້ໄຂ</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-500 transition-all"
                        onClick={() =>
                          setDeleteDialogState({
                            isOpen: true,
                            categoryId: category.id,
                            categoryName: category.name,
                          })
                        }
                      >
                        <FaTrash className="w-4 h-4 mr-1.5" />
                        <span className="hidden sm:inline">ລຶບ</span>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Grid view
              <div className="p-6">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {sortedAndFilteredCategories.map((category) => (
                    <motion.div
                      key={category.id}
                      variants={itemVariants}
                      className="bg-white dark:bg-gray-750 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                    >
                      <div className={`${getCategoryColor(category.id)} h-3`} />
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div
                              className={`${getCategoryColor(
                                category.id
                              )} p-2.5 rounded-md shadow-sm`}
                            >
                              <FaFolder className="h-4 w-4" />
                            </div>
                            <h3 className="font-medium text-lg ml-3 truncate dark:text-white">
                              {category.name}
                            </h3>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0"
                              >
                                <FaBars className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="dark:bg-gray-800 dark:border-gray-700"
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  setDialogState({ isOpen: true, category })
                                }
                                className="cursor-pointer dark:text-white dark:hover:bg-gray-700"
                              >
                                <FaEdit className="mr-2 h-4 w-4" />
                                <span>ແກ້ໄຂ</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `/category/${category.slug}`
                                  );
                                  toast({
                                    title: "คัดลอกลิงค์แล้ว",
                                    description: `คัดลอก /category/${category.slug} ไปยังคลิปบอร์ดแล้ว`,
                                    duration: 2000,
                                  });
                                }}
                                className="cursor-pointer dark:text-white dark:hover:bg-gray-700"
                              >
                                <FaLink className="mr-2 h-4 w-4" />
                                <span>คัดลอกลิงค์</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="dark:border-gray-600" />
                              <DropdownMenuItem
                                onClick={() =>
                                  setDeleteDialogState({
                                    isOpen: true,
                                    categoryId: category.id,
                                    categoryName: category.name,
                                  })
                                }
                                className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-gray-700"
                              >
                                <FaTrash className="mr-2 h-4 w-4" />
                                <span>ລຶບ</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-4 space-y-3 text-sm">
                          <div className="flex items-center text-gray-500 dark:text-gray-400">
                            <FaLink className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300 truncate">
                              /category/{category.slug}
                            </span>
                          </div>

                          {category.description && (
                            <div className="flex text-gray-500 dark:text-gray-400">
                              <FaInfoCircle className="w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                                {category.description || "ບໍ່ມີຄຳອະທິບາຍ"}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
                          <Badge
                            variant="outline"
                            className="bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
                          >
                            ID: {category.id}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 h-8 w-8 p-0 dark:text-gray-200"
                              onClick={() =>
                                setDialogState({ isOpen: true, category })
                              }
                            >
                              <FaEdit className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-500 h-8 w-8 p-0"
                              onClick={() =>
                                setDeleteDialogState({
                                  isOpen: true,
                                  categoryId: category.id,
                                  categoryName: category.name,
                                })
                              }
                            >
                              <FaTrash className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Floating action button for mobile */}
      <div className="fixed right-6 bottom-6 md:hidden z-10">
        <Button
          onClick={() => setDialogState({ isOpen: true, category: null })}
          className="h-14 w-14 rounded-full shadow-lg bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white flex items-center justify-center"
        >
          <FaPlus className="h-6 w-6" />
        </Button>
      </div>

      {/* Dialogs */}
      <CategoryDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, category: null })}
        category={dialogState.category}
        onSubmit={handleSaveCategory}
        isSubmitting={actionLoading}
      />

      <DeleteDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() =>
          setDeleteDialogState({
            isOpen: false,
            categoryId: null,
            categoryName: "",
          })
        }
        onConfirm={handleDelete}
        isDeleting={actionLoading}
        categoryName={deleteDialogState.categoryName}
      />
    </div>
  );
};

export default BlogCategoriesPage;
