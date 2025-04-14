"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import useGalleryApi from "@/hooks/useGalleryApi";
import {
  FaSearch,
  FaEdit,
  FaTrash,
  FaDownload,
  FaCopy,
  FaFolder,
  FaImage,
  FaLink,
  FaEllipsisV,
  FaFilter,
  FaThLarge,
  FaList,
  FaCheck,
  FaSyncAlt,
  FaArrowLeft,
  FaHeart,
  FaShareAlt,
  FaTags,
  FaEye,
  FaClock,
} from "react-icons/fa";

const ImageDetailsDialog = ({ isOpen, onClose, image, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedImage, setEditedImage] = useState({ ...image });
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteImage, updateImage, loading, error } = useGalleryApi();

  useEffect(() => {
    setEditedImage({ ...image });
  }, [image]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteImage(image.id);
      toast({
        title: "ລຶບຮູບພາບສຳເລັດ",
        description: "ຮູບພາບຖືກລຶບອອກຈາກລະບົບແລ້ວ",
        variant: "success",
      });
      onDelete(image.id);
      onClose();
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດລຶບຮູບພາບໄດ້",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const updateData = {
        title: editedImage.title,
        category: editedImage.category,
      };
      await updateImage(image.id, updateData);
      toast({
        title: "ອັບເດດສຳເລັດ",
        description: "ຂໍ້ມູນຮູບພາບຖືກອັບເດດແລ້ວ",
        variant: "success",
      });
      onUpdate(image.id, editedImage);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດອັບເດດຂໍ້ມູນຮູບພາບໄດ້",
        variant: "destructive",
      });
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(image?.image);
    toast({
      title: "ສຳເນົາ URL ແລ້ວ",
      description: "URL ຂອງຮູບພາບຖືກສຳເນົາໄປທີ່ clipboard ແລ້ວ",
      duration: 3000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] overflow-hidden rounded-xl bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-xl font-semibold flex items-center">
            {isEditing ? (
              <FaEdit className="text-blue-500 mr-2" />
            ) : (
              <FaEye className="text-blue-500 mr-2" />
            )}
            {isEditing ? "ແກ້ໄຂຂໍ້ມູນຮູບພາບ" : "ລາຍລະອຽດຮູບພາບ"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="aspect-square relative overflow-hidden rounded-xl border shadow-md group bg-gray-50">
            <img
              src={image?.image || "/api/placeholder/400/400"}
              alt={image?.title || "Gallery Image"}
              className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 top-0 p-2 flex justify-between items-center">
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-800 px-3 py-1 shadow-md">
                {image?.category || "ບໍ່ມີ"}
              </Badge>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white border-0 shadow-md"
                onClick={() => window.open(image?.image, "_blank")}
              >
                <FaEye className="h-4 w-4 text-blue-500" />
              </Button>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
              <p className="text-white font-medium truncate">
                {image?.title || "ບໍ່ມີຊື່"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {isEditing ? (
              <>
                <div>
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium mb-1 flex items-center gap-2"
                  >
                    <FaTags className="text-blue-500" /> ຊື່ຮູບພາບ
                  </Label>
                  <Input
                    id="title"
                    value={editedImage.title || ""}
                    onChange={(e) =>
                      setEditedImage({ ...editedImage, title: e.target.value })
                    }
                    className="border-2 focus-visible:ring-blue-500 rounded-md"
                    placeholder="ປ້ອນຊື່ຮູບພາບ..."
                  />
                </div>
                <div>
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium mb-1 flex items-center gap-2"
                  >
                    <FaFolder className="text-blue-500" /> ໝວດໝູ່
                  </Label>
                  <Select
                    value={editedImage.category || ""}
                    onValueChange={(value) =>
                      setEditedImage({ ...editedImage, category: value })
                    }
                  >
                    <SelectTrigger className="border-2 rounded-md">
                      <SelectValue placeholder="ເລືອກໝວດໝູ່" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "ທຳມະຊາດ",
                        "ສະຖາປັດຕະຍະກຳ",
                        "ອາຫານ",
                        "ບຸກຄົນ",
                        "ສັດ",
                      ].map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="all">ບໍ່ມີໝວດໝູ່</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border">
                  <Label className="text-sm text-gray-500 flex items-center gap-2">
                    <FaTags className="text-blue-500" /> ຊື່ຮູບພາບ
                  </Label>
                  <p className="text-sm font-medium mt-1">
                    {image?.title || "ບໍ່ມີ"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border">
                  <Label className="text-sm text-gray-500 flex items-center gap-2">
                    <FaFolder className="text-blue-500" /> ໝວດໝູ່
                  </Label>
                  <p className="text-sm font-medium mt-1">
                    {image?.category ? (
                      <Badge
                        variant="secondary"
                        className="font-normal bg-blue-100 text-blue-700 border border-blue-200"
                      >
                        {image.category}
                      </Badge>
                    ) : (
                      "ບໍ່ມີ"
                    )}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border">
                  <Label className="text-sm text-gray-500 flex items-center gap-2">
                    <FaClock className="text-blue-500" /> ວັນທີອັບໂຫລດ
                  </Label>
                  <p className="text-sm font-medium mt-1">
                    {image?.created_at
                      ? new Date(image.created_at).toLocaleDateString("lo-LA")
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                    <FaLink className="text-blue-500" /> URL
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={image?.image}
                      readOnly
                      className="text-xs bg-gray-50 border-2 rounded-md"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyUrl}
                      size="icon"
                      className="border-2 rounded-md hover:bg-blue-50"
                    >
                      <FaCopy className="w-4 h-4 text-blue-500" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 flex-wrap border-t pt-4 mt-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={loading}
                className="rounded-md border-2 hover:bg-gray-100"
              >
                <FaArrowLeft className="w-4 h-4 mr-2 text-gray-500" />
                ຍົກເລີກ
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={loading}
                className="rounded-md bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              >
                {loading ? (
                  <FaSyncAlt className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FaCheck className="w-4 h-4 mr-2" />
                )}
                ບັນທຶກ
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => window.open(image?.image, "_blank")}
                className="rounded-md border-2 hover:bg-blue-50"
              >
                <FaDownload className="w-4 h-4 mr-2 text-blue-500" />
                ດາວໂຫລດ
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="rounded-md border-2 hover:bg-green-50"
              >
                <FaEdit className="w-4 h-4 mr-2 text-green-500" />
                ແກ້ໄຂ
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-md border-2 hover:bg-red-50 text-red-500 hover:text-red-600"
              >
                {isDeleting ? (
                  <FaSyncAlt className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FaTrash className="w-4 h-4 mr-2" />
                )}
                ລຶບ
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const LoadingGallery = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
    {Array(10)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className="aspect-square overflow-hidden rounded-xl border bg-gray-50 shadow-sm"
        >
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-full h-full" />
            <FaImage className="absolute text-gray-300 opacity-20 w-12 h-12" />
          </div>
        </div>
      ))}
  </div>
);

const GalleryList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const { fetchImages, fetchCategories, loading, error } = useGalleryApi();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const imagesData = await fetchImages({
          category: categoryFilter || undefined,
        });
        // Map backend fields to frontend expectations
        const mappedImages = imagesData.map((img) => ({
          id: img.id,
          title: img.title || "",
          image: img.image,
          category: img.category || "",
          created_at: img.created_at,
        }));
        setImages(mappedImages);

        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: error.message || "ບໍ່ສາມາດດຶງຂໍ້ມູນຮູບພາບໄດ້",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [categoryFilter, fetchImages, fetchCategories]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSearchQuery(formData.get("search") || "");
  };

  const handleDeleteImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleUpdateImage = (id, updatedData) => {
    setImages(
      images.map((img) => (img.id === id ? { ...img, ...updatedData } : img))
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT'] bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start bg-white rounded-xl p-5 shadow-md border-b-4 border-blue-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ຮູບພາບທັງໝົດ
          </h1>
          <p className="text-gray-500">ຈັດການຮູບພາບທັງໝົດຂອງທ່ານຢ່າງງ່າຍດາຍ</p>
        </div>
        <div className="flex gap-2">
          <a href="/gallery/upload">
            <Button className="rounded-md bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all shadow-md">
              <FaImage className="w-4 h-4 mr-2" />
              ອັບໂຫລດຮູບພາບ
            </Button>
          </a>
        </div>
      </div>

      <Card className="overflow-hidden border-0 shadow-md rounded-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 pb-2 border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <FaFilter className="text-blue-500" /> ຕົວກອງຮູບພາບ
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                name="search"
                className="pl-10 rounded-md border-2 focus-visible:ring-blue-500 focus-visible:border-blue-500"
                placeholder="ຄົ້ນຫາຮູບພາບ..."
                defaultValue={searchQuery}
                disabled
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 rounded-md border-2">
                <SelectValue placeholder="ທຸກໝວດໝູ່" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ທຸກໝວດໝູ່</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.category} value={cat.category}>
                    {cat.category} ({cat.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Tabs
                value={viewMode}
                onValueChange={setViewMode}
                className="w-fit"
              >
                <TabsList className="grid w-20 grid-cols-2 p-1 bg-gray-100 rounded-md">
                  <TabsTrigger
                    value="grid"
                    className="rounded-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                  >
                    <FaThLarge className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="list"
                    className="rounded-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                  >
                    <FaList className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                type="submit"
                size="icon"
                variant="default"
                className="rounded-md bg-blue-500 hover:bg-blue-600"
                disabled
              >
                <FaSearch className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden shadow-lg border-0 rounded-xl">
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500 flex items-center">
              <FaImage className="w-4 h-4 text-blue-500 mr-2" />
              ພົບ <span className="font-medium mx-1">{images.length}</span>{" "}
              ຮູບພາບ
              {categoryFilter && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-blue-100 text-blue-700 border border-blue-200"
                >
                  {categoryFilter}
                </Badge>
              )}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <LoadingGallery />
          ) : (
            <>
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative overflow-hidden rounded-xl cursor-pointer border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 aspect-square bg-gray-50"
                    >
                      <img
                        src={image.image}
                        alt={image.title || "Gallery Image"}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {image.category && (
                        <Badge className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-blue-800 px-2.5 py-0.5 text-xs shadow-md">
                          {image.category}
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                        <p className="text-sm font-medium text-white truncate mb-1">
                          {image.title || "ບໍ່ມີຊື່"}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-300">
                            {image.created_at
                              ? new Date(image.created_at).toLocaleDateString(
                                  "lo-LA"
                                )
                              : ""}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                              onClick={() => setSelectedImage(image)}
                            >
                              <FaEye className="h-3.5 w-3.5" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                                >
                                  <FaEllipsisV className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-40 rounded-md"
                              >
                                <DropdownMenuItem
                                  onClick={() => setSelectedImage(image)}
                                  className="cursor-pointer"
                                >
                                  <FaEye className="mr-2 h-4 w-4 text-blue-500" />{" "}
                                  ເບິ່ງລາຍລະອຽດ
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    window.open(image.image, "_blank")
                                  }
                                  className="cursor-pointer"
                                >
                                  <FaDownload className="mr-2 h-4 w-4 text-green-500" />{" "}
                                  ດາວໂຫລດ
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigator.clipboard.writeText(image.image)
                                  }
                                  className="cursor-pointer"
                                >
                                  <FaCopy className="mr-2 h-4 w-4 text-orange-500" />{" "}
                                  ສຳເນົາ URL
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                      <div
                        className="absolute inset-0 cursor-pointer"
                        onClick={() => setSelectedImage(image)}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="list" className="mt-0">
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="py-3 px-4 text-left">ຮູບພາບ</th>
                        <th className="py-3 px-4 text-left">ຊື່</th>
                        <th className="py-3 px-4 text-left">ໝວດໝູ່</th>
                        <th className="py-3 px-4 text-left">ວັນທີ</th>
                        <th className="py-3 px-4 text-right">ຈັດການ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {images.map((image) => (
                        <tr
                          key={image.id}
                          className="border-b hover:bg-blue-50/30 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border shadow-sm">
                              <img
                                src={image.image}
                                alt={image.title || "Gallery Image"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">
                            {image.title || "ບໍ່ມີ"}
                          </td>
                          <td className="py-3 px-4">
                            {image.category ? (
                              <Badge className="bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200">
                                {image.category}
                              </Badge>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                ບໍ່ມີ
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {image.created_at
                              ? new Date(image.created_at).toLocaleDateString(
                                  "lo-LA"
                                )
                              : "N/A"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedImage(image)}
                                className="h-8 w-8 rounded-full text-blue-500 hover:bg-blue-50"
                              >
                                <FaEye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-green-500 hover:bg-green-50"
                                onClick={() =>
                                  window.open(image.image, "_blank")
                                }
                              >
                                <FaDownload className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-orange-500 hover:bg-orange-50"
                                onClick={() =>
                                  navigator.clipboard.writeText(image.image)
                                }
                              >
                                <FaCopy className="h-3.5 w-3.5" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
                                  >
                                    <FaEllipsisV className="h-3.5 w-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-40"
                                >
                                  <DropdownMenuItem
                                    onClick={() => setSelectedImage(image)}
                                  >
                                    <FaEye className="mr-2 h-4 w-4 text-blue-500" />{" "}
                                    ເບິ່ງລາຍລະອຽດ
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedImage(image);
                                      setIsEditing(true);
                                    }}
                                  >
                                    <FaEdit className="mr-2 h-4 w-4 text-green-500" />{" "}
                                    ແກ້ໄຂຂໍ້ມູນ
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </>
          )}

          {images.length === 0 && !loading && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300 shadow-sm">
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <FaImage className="h-10 w-10 text-blue-300" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                ບໍ່ພົບຮູບພາບ
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {categoryFilter
                  ? "ບໍ່ພົບຮູບພາບໃນໝວດນີ້ ລອງເລືອກໝວດອື່ນ ຫຼື ລ້າງຕົວກອງ"
                  : "ເລີ່ມຕົ້ນອັບໂຫລດຮູບພາບເພື່ອເບິ່ງພວກມັນທີ່ນີ້"}
              </p>
              <div className="flex gap-3 justify-center mt-5">
                {categoryFilter && (
                  <Button
                    variant="outline"
                    onClick={() => setCategoryFilter("")}
                    className="rounded-md border-2 hover:bg-blue-50"
                  >
                    <FaFilter className="w-4 h-4 mr-2 text-blue-500" />
                    ລ້າງຕົວກອງທັງໝົດ
                  </Button>
                )}
                {!categoryFilter && (
                  <a href="/gallery/upload">
                    <Button className="rounded-md bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 shadow-md">
                      <FaImage className="w-4 h-4 mr-2" />
                      ອັບໂຫລດຮູບພາບໃໝ່
                    </Button>
                  </a>
                )}
              </div>
            </div>
          )}

          {images.length > 0 && !loading && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                ສະແດງ {images.length} ຈາກທັງໝົດ {images.length} ຮູບພາບ
              </p>
              <Button
                variant="outline"
                className="mt-2 rounded-md border-2 hover:bg-blue-50"
                disabled={images.length < 10}
              >
                <FaSyncAlt className="w-4 h-4 mr-2 text-blue-500" />
                ໂຫລດເພີ່ມເຕີມ
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedImage && (
        <ImageDetailsDialog
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          image={selectedImage}
          onDelete={handleDeleteImage}
          onUpdate={handleUpdateImage}
        />
      )}
    </div>
  );
};

export default GalleryList;
