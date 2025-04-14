"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronRight,
  FaThLarge,
  FaList,
  FaFilter,
  FaSearch,
  FaUtensils,
  FaCoffee,
  FaSpinner,
} from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useFoodProducts, useBeverageProducts } from "@/hooks/productHooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  enhancedProductService,
  DEFAULT_PLACEHOLDER_IMAGE,
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/productHooks";
import { toast } from "react-hot-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/dzr7xfhbz/image/upload/v1617638749/seeu-cafe/placeholder-image.jpg";

const uploadCategoryImage = async (file) => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await enhancedProductService.uploadImage(formData);

    if (response.data?.secure_url) {
      return response.data.secure_url;
    } else if (response.data?.url) {
      return response.data.url;
    }

    throw new Error("No URL returned from image upload");
  } catch (error) {
    console.error("Failed to upload category image:", error);
    toast.error("ບໍ່ສາມາດອັບໂຫລດຮູບພາບໄດ້");
    return null;
  }
};

const ImageUpload = ({ value, onChange }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("ຮູບພາບຕ້ອງມີຂະໜາດນ້ອຍກວ່າ 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setPreview(result);
      onChange(result, file);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null, null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {preview ? (
        <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Image preview failed to load:", preview);
              e.target.src = FALLBACK_IMAGE;
            }}
          />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            ລຶບ
          </Button>
        </div>
      ) : (
        <div
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          onClick={() => document.getElementById("image-upload").click()}
        >
          <div className="text-center">
            <p className="text-gray-500">ອັບໂຫລດຮູບພາບ</p>
            <p className="text-xs text-gray-400">
              PNG, JPG ຫຼື GIF (ສູງສຸດ 5MB)
            </p>
          </div>
        </div>
      )}

      <Input
        type="file"
        id="image-upload"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <label htmlFor="image-upload" className="cursor-pointer">
        <Button type="button" variant="outline" size="sm">
          {preview ? "ປ່ຽນຮູບ" : "ເລືອກຮູບ"}
        </Button>
      </label>
    </div>
  );
};

const CategoryModal = ({
  isOpen,
  onClose,
  mode,
  category,
  onSubmit,
  categories,
}) => {
  const previousFocusRef = React.useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
    }
  }, [isOpen]);

  const handleSafeClose = () => {
    if (previousFocusRef.current) {
      setTimeout(() => {
        previousFocusRef.current.focus();
      }, 0);
    }
    onClose();
  };

  const [formData, setFormData] = useState(
    mode === "edit" && category
      ? {
          name: category.name,
          description: category.description || "",
          image: category.image,
          parentCategoryId: category.parent_id,
          type: category.type || "food",
        }
      : {
          name: "",
          description: "",
          image: null,
          parentCategoryId: null,
          type: "food",
        }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        image: category.image,
        parentCategoryId: category.parent_id,
        type: category.type || "food",
      });
      setImageFile(null);
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        image: null,
        parentCategoryId: null,
        type: "food",
      });
      setImageFile(null);
    }
  }, [mode, category, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let formDataWithImage = { ...formData };

      if (imageFile) {
        const imageUrl = await uploadCategoryImage(imageFile);

        if (imageUrl) {
          formDataWithImage.image = imageUrl;
        } else {
          formDataWithImage.image = null;
          toast.warning("ດຳເນີນການຕໍ່ໂດຍບໍ່ມີຮູບພາບ");
        }
      }

      if (mode === "edit" && !imageFile && category.image) {
        formDataWithImage.image = category.image;
      }

      console.log("Submitting category data:", formDataWithImage);
      await onSubmit(formDataWithImage);
      handleSafeClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("ເກີດຂໍ້ຜິດພາດໃນການສົ່ງຂໍ້ມູນ");
    } finally {
      setIsSubmitting(false);
    }
  };

  const titles = {
    create: "ເພີ່ມໝວດໝູ່ໃໝ່",
    edit: "ແກ້ໄຂໝວດໝູ່",
    delete: "ຍືນຍັນການລຶບ",
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleSafeClose}>
      <DialogContent className="sm:max-w-[600px] font-['Phetsarath_OT'] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4 border-b pb-3">
          <DialogTitle className="text-xl font-semibold">
            {titles[mode]}
          </DialogTitle>
        </DialogHeader>

        {mode !== "delete" ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <Label className="text-md mb-1">ຮູບພາບໝວດໝູ່</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(image, file) => {
                    setFormData({ ...formData, image });
                    setImageFile(file);
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-md mb-1">
                    ຊື່ໝວດໝູ່ <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="bg-white focus:border-amber-500 focus:ring-amber-500"
                    placeholder="ໃສ່ຊື່ໝວດໝູ່"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-md mb-1">
                    ປະເພດ <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="bg-white focus:border-amber-500 focus:ring-amber-500">
                      {}
                      <span className="flex items-center">
                        {formData.type === "food" && (
                          <>
                            <FaUtensils className="mr-2 h-4 w-4 text-amber-500" />{" "}
                            ອາຫານ
                          </>
                        )}
                        {formData.type === "beverage" && (
                          <>
                            <FaCoffee className="mr-2 h-4 w-4 text-blue-500" />{" "}
                            ເຄື່ອງດື່ມ
                          </>
                        )}
                        {!formData.type && "ເລືອກປະເພດ"}
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="food"
                        className="flex items-center gap-2"
                      >
                        <span className="flex items-center">
                          <FaUtensils className="mr-2 h-4 w-4 text-amber-500" />{" "}
                          ອາຫານ
                        </span>
                      </SelectItem>
                      <SelectItem
                        value="beverage"
                        className="flex items-center gap-2"
                      >
                        <span className="flex items-center">
                          <FaCoffee className="mr-2 h-4 w-4 text-blue-500" />{" "}
                          ເຄື່ອງດື່ມ
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="parentCategoryId" className="text-md mb-1">
                  ໝວດໝູ່ຫຼັກ
                </Label>
                <Select
                  value={
                    formData.parentCategoryId
                      ? formData.parentCategoryId.toString()
                      : ""
                  }
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      parentCategoryId: value ? Number(value) : null,
                    })
                  }
                >
                  <SelectTrigger className="bg-white focus:border-amber-500 focus:ring-amber-500">
                    <SelectValue placeholder="ເລືອກໝວດໝູ່ຫຼັກ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ບໍ່ມີໝວດໝູ່ຫຼັກ</SelectItem>
                    {categories
                      ?.filter((cat) => cat.id !== (category?.id || 0))
                      .filter((cat) => !cat.parent_id)
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description" className="text-md mb-1">
                  ລາຍລະອຽດໝວດໝູ່
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="bg-white focus:border-amber-500 focus:ring-amber-500"
                  placeholder="ໃສ່ລາຍລະອຽດໝວດໝູ່"
                />
              </div>
            </div>
            <DialogFooter className="border-t pt-4 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSafeClose}
                className="gap-2"
              >
                ຍົກເລີກ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    {mode === "create"
                      ? "ກຳລັງເພີ່ມໝວດໝູ່..."
                      : "ກຳລັງບັນທຶກ..."}
                  </>
                ) : (
                  <>
                    {mode === "create" ? (
                      <FaPlus className="w-4 h-4" />
                    ) : (
                      <FaEdit className="w-4 h-4" />
                    )}
                    {mode === "create" ? "ເພີ່ມໝວດໝູ່" : "ບັນທຶກການປ່ຽນແປງ"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FaTrash
                    className="h-5 w-5 text-red-500"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    ຄຳເຕືອນ - ການລຶບບໍ່ສາມາດກູ້ຄືນໄດ້
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      ເຈົ້າແນ່ໃຈລະບໍວ່າຕ້ອງການລຶບໝວດໝູ່ "{category?.name}" ນີ້?
                      ການລຶບບໍ່ສາມາດກູ້ຄືນໄດ້.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t pt-4">
              <Button
                variant="outline"
                onClick={handleSafeClose}
                className="gap-2"
              >
                ຍົກເລີກ
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onSubmit(category.id);
                  handleSafeClose();
                }}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin" />
                    ກຳລັງລຶບ...
                  </>
                ) : (
                  <>
                    <FaTrash className="w-4 h-4" /> ລຶບໝວດໝູ່
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const CategoryList = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null,
    category: null,
  });

  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const { data: categories, isLoading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  const [categoryCounts, setCategoryCounts] = useState({});

  const { data: foodData } = useFoodProducts({ limit: 1000 });
  const { data: beverageData } = useBeverageProducts({ limit: 1000 });

  useEffect(() => {
    if ((foodData?.products || beverageData?.products) && categories) {
      const counts = {};

      if (foodData?.products) {
        foodData.products.forEach((product) => {
          if (product.category_id) {
            counts[product.category_id] =
              (counts[product.category_id] || 0) + 1;
          }
        });
      }

      if (beverageData?.products) {
        beverageData.products.forEach((product) => {
          if (product.category_id) {
            counts[product.category_id] =
              (counts[product.category_id] || 0) + 1;
          }
        });
      }

      setCategoryCounts(counts);
    }
  }, [foodData?.products, beverageData?.products, categories]);

  const previousFocusRef = React.useRef(null);

  const openModal = (mode, category = null) => {
    previousFocusRef.current = document.activeElement;
    setModalState({ isOpen: true, mode, category });
  };

  const closeModal = () => {
    if (previousFocusRef.current) {
      setTimeout(() => {
        previousFocusRef.current.focus();
      }, 0);
    }
    setModalState({ isOpen: false, mode: null, category: null });
  };

  const handleSubmit = async (formData) => {
    if (modalState.mode === "create") {
      await createCategory.mutateAsync(formData);
    } else if (modalState.mode === "edit") {
      await updateCategory.mutateAsync({
        id: modalState.category.id,
        data: formData,
      });
    } else if (modalState.mode === "delete") {
      await deleteCategory.mutateAsync(formData);
    }
  };

  const getItemCount = useCallback(
    (category) => {
      return categoryCounts[category.id] || 0;
    },
    [categoryCounts]
  );

  const filteredCategories = React.useMemo(() => {
    if (!categories) return [];

    return categories.filter((category) => {
      if (filterType !== "all" && category.type !== filterType) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          category.name.toLowerCase().includes(query) ||
          (category.description &&
            category.description.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [categories, filterType, searchQuery]);

  if (isLoading) {
    return (
      <div className="rounded-lg shadow-lg bg-white p-6 font-['Phetsarath_OT']">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">ໝວດໝູ່</h2>
            <p className="text-sm text-gray-500 mt-1">ຈັດການໝວດໝູ່</p>
          </div>
        </div>
        <div className="flex justify-center items-center p-12">
          <div className="flex flex-col items-center">
            <FaSpinner className="h-12 w-12 text-amber-500 animate-spin mb-4" />
            <p className="text-gray-600">ກຳລັງໂຫລດຂໍ້ມູນ...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg shadow-lg bg-white p-6 font-['Phetsarath_OT']">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">ໝວດໝູ່</h2>
            <p className="text-sm text-gray-500 mt-1">ຈັດການໝວດໝູ່</p>
          </div>
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700">
                ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ: {error.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg shadow-lg bg-white p-6 font-['Phetsarath_OT']">
      {}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">ໝວດໝູ່</h2>
          <p className="text-sm text-gray-500 mt-1">
            ຈັດການໝວດໝູ່ | ທັງໝົດ {filteredCategories.length} ໝວດໝູ່
          </p>
        </div>
        <Button
          onClick={() => openModal("create")}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 shadow-md"
        >
          <FaPlus className="w-4 h-4" />
          ເພີ່ມໝວດໝູ່
        </Button>
      </div>

      {}
      <div className="bg-gray-50 p-4 mb-6 rounded-lg border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="ຄົ້ນຫາໝວດໝູ່..."
              className="pl-10 bg-white focus:border-amber-500 focus:ring-amber-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px] bg-white focus:border-amber-500 focus:ring-amber-500">
                  <SelectValue placeholder="ເລືອກປະເພດສິນຄ້າ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <span className="flex items-center">
                      <FaFilter className="mr-2 h-4 w-4 text-gray-500" />{" "}
                      ທຸກປະເພດ
                    </span>
                  </SelectItem>
                  <SelectItem value="food">
                    <span className="flex items-center">
                      <FaUtensils className="mr-2 h-4 w-4 text-amber-500" />{" "}
                      ອາຫານ
                    </span>
                  </SelectItem>
                  <SelectItem value="beverage">
                    <span className="flex items-center">
                      <FaCoffee className="mr-2 h-4 w-4 text-blue-500" />{" "}
                      ເຄື່ອງດື່ມ
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex bg-white border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className={`px-3 ${
                  viewMode === "grid" ? "bg-amber-100 text-amber-700" : ""
                }`}
                onClick={() => setViewMode("grid")}
              >
                <FaThLarge className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className={`px-3 ${
                  viewMode === "list" ? "bg-amber-100 text-amber-700" : ""
                }`}
                onClick={() => setViewMode("list")}
              >
                <FaList className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {}
      {filteredCategories.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={category.image || FALLBACK_IMAGE}
                    alt={category.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      console.log("Image failed to load:", category.image);
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {category.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <svg
                          className="mr-1 h-4 w-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                          />
                        </svg>
                        {getItemCount(category)} ລາຍການ
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {category.parent_id && (
                        <Badge
                          variant="outline"
                          className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-700 mb-1"
                        >
                          ໝວດໝູ່ຍ່ອຍ
                        </Badge>
                      )}
                      <Badge
                        variant={
                          category.type === "food" ? "secondary" : "default"
                        }
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          category.type === "food"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {category.type === "food" ? (
                          <span className="flex items-center">
                            <FaUtensils className="mr-1 h-3 w-3" /> ອາຫານ
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <FaCoffee className="mr-1 h-3 w-3" /> ເຄື່ອງດື່ມ
                          </span>
                        )}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                    {category.description || "ບໍ່ມີລາຍລະອຽດ"}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal("edit", category)}
                      className="flex-1 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors"
                    >
                      <FaEdit className="w-4 h-4 mr-2" />
                      ແກ້ໄຂ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal("delete", category)}
                      className="flex-1 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    >
                      <FaTrash className="w-4 h-4 mr-2" />
                      ລຶບ
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-12 bg-gray-50 p-3 border-b border-gray-200 font-medium text-sm text-gray-600">
              <div className="col-span-4 md:col-span-5">ຊື່ໝວດໝູ່</div>
              <div className="col-span-2 md:col-span-2 text-center">ປະເພດ</div>
              <div className="col-span-2 md:col-span-2 text-center">
                ຈຳນວນລາຍການ
              </div>
              <div className="col-span-2 md:col-span-1 text-center">
                ໝວດໝູ່ຍ່ອຍ
              </div>
              <div className="col-span-2 md:col-span-2 text-right">ຈັດການ</div>
            </div>

            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="grid grid-cols-12 p-3 border-b border-gray-200 hover:bg-gray-50 items-center text-sm"
              >
                <div className="col-span-4 md:col-span-5 flex items-center">
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3 bg-gray-100 flex-shrink-0">
                    <img
                      src={category.image || FALLBACK_IMAGE}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = FALLBACK_IMAGE;
                      }}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {category.description || "ບໍ່ມີລາຍລະອຽດ"}
                    </div>
                  </div>
                </div>

                <div className="col-span-2 md:col-span-2 text-center">
                  <Badge
                    variant={category.type === "food" ? "secondary" : "default"}
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      category.type === "food"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {category.type === "food" ? (
                      <span className="flex items-center">
                        <FaUtensils className="mr-1 h-3 w-3" /> ອາຫານ
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <FaCoffee className="mr-1 h-3 w-3" /> ເຄື່ອງດື່ມ
                      </span>
                    )}
                  </Badge>
                </div>

                <div className="col-span-2 md:col-span-2 text-center">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                    {getItemCount(category)} ລາຍການ
                  </span>
                </div>

                <div className="col-span-2 md:col-span-1 text-center">
                  {category.parent_id ? (
                    <Badge
                      variant="outline"
                      className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-700"
                    >
                      ມີ
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-xs">ບໍ່ມີ</span>
                  )}
                </div>

                <div className="col-span-2 md:col-span-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal("edit", category)}
                      className="h-8 w-8 p-0 hover:bg-amber-50 hover:text-amber-700"
                    >
                      <FaEdit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openModal("delete", category)}
                      className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-700"
                    >
                      <FaTrash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-white p-4 rounded-full">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                ></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              ບໍ່ພົບຂໍ້ມູນໝວດໝູ່
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || filterType !== "all"
                ? "ບໍ່ມີໝວດໝູ່ທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ"
                : "ຍັງບໍ່ມີຂໍ້ມູນໝວດໝູ່ໃດໆ ເທື່ອ"}
            </p>
            {searchQuery || filterType !== "all" ? (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setFilterType("all");
                  }}
                >
                  ລ້າງການຄົ້ນຫາ
                </Button>
                <Button
                  onClick={() => openModal("create")}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                >
                  <FaPlus className="w-4 h-4 mr-2" />
                  ເພີ່ມໝວດໝູ່ໃໝ່
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => openModal("create")}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white"
              >
                <FaPlus className="w-4 h-4 mr-2" />
                ເພີ່ມໝວດໝູ່ໃໝ່
              </Button>
            )}
          </div>
        </div>
      )}

      <CategoryModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        category={modalState.category}
        onSubmit={handleSubmit}
        categories={categories}
      />
    </div>
  );
};

export default CategoryList;
