// AddProductModal.jsx
import React, { useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { ShoppingBag, Coffee } from "lucide-react";
import { productService } from "@/services/api";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/ui/image-upload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const AddProductModal = ({
  isOpen,
  onClose,
  formData,
  categoryOptions,
  handleFormChange,
  handleSelectChange,
  handleImageChange,
  queryClient,
}) => {
  // Reference to element that will receive focus when dialog closes
  const previousFocusRef = useRef(null);

  // Save the currently focused element when dialog opens
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
    }
  }, [isOpen]);

  // Ensure focus is restored before the parent component's onClose is called
  const handleSafeClose = (open) => {
    // ปิด modal เฉพาะเมื่อมีการเปลี่ยนสถานะเป็น false
    if (open === false) {
      if (previousFocusRef.current) {
        setTimeout(() => {
          previousFocusRef.current.focus();
        }, 0);
      }
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // 1. Upload image if it's a File object
      let imageUrl = formData.image;
      if (formData.image instanceof File) {
        const imageFormData = new FormData();
        imageFormData.append("file", formData.image);
        
        const uploadResponse = await productService.uploadImage(imageFormData);
        imageUrl = uploadResponse.data.secure_url || uploadResponse.data.url;
        
        if (!imageUrl) {
          throw new Error("Image upload succeeded but no URL was returned");
        }
      }
  
      // 2. Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description || "",
        category_id: parseInt(formData.category_id),
        status: formData.status || "active",
        image: imageUrl,
      };
  
      // 3. Create product based on type
      if (formData.type === "food") {
        productData.price = parseFloat(formData.price) || 0;
        await productService.createFoodProduct(productData);
        toast.success("ເພີ່ມສິນຄ້າອາຫານສຳເລັດ");
      } else {
        if (formData.hot_price) {
          productData.hot_price = parseFloat(formData.hot_price);
        }
        if (formData.ice_price) {
          productData.ice_price = parseFloat(formData.ice_price);
        }
        await productService.createBeverageProduct(productData);
        toast.success("ເພີ່ມສິນຄ້າເຄື່ອງດື່ມສຳເລັດ");
      }
  
      // 4. Close modal and refresh data
      handleSafeClose();
      
      // 5. Refresh data
      await queryClient.invalidateQueries(
        formData.type === "food" ? ["foodProducts"] : ["beverageProducts"]
      );
  
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(`ເພີ່ມສິນຄ້າລົ້ມເຫລວ: ${errorMessage}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          // Only handle closing, not opening
          if (previousFocusRef.current) {
            setTimeout(() => {
              previousFocusRef.current.focus();
            }, 0);
          }
          onClose();
        }
      }}>
      <DialogContent 
        className="sm:max-w-[800px] max-h-[80vh] font-['Phetsarath_OT'] bg-gray-50 rounded-xl shadow-lg overflow-y-auto"
      >
        <DialogHeader className="border-b pb-3">
          <DialogTitle className="text-xl font-semibold text-gray-800">
            ເພີ່ມສິນຄ້າໃໝ່
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            ກະລຸນາປ້ອນຂໍ້ມູນລາຍລະອຽດຂອງສິນຄ້າ
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Tabs
              defaultValue="food"
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4 bg-gray-100 rounded-lg p-1">
                <TabsTrigger
                  value="food"
                  className="text-base py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" /> ອາຫານ
                </TabsTrigger>
                <TabsTrigger
                  value="beverage"
                  className="text-base py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md"
                >
                  <Coffee className="h-4 w-4 mr-2" /> ເຄື່ອງດື່ມ
                </TabsTrigger>
              </TabsList>

              {/* Food Tab */}
              <TabsContent value="food" className="mt-0">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label
                        htmlFor="image"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        ຮູບພາບສິນຄ້າ
                      </Label>
                      <ImageUpload
                        value={formData.image}
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="col-span-2 grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ຊື່ສິນຄ້າ <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="price"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ລາຄາ <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleFormChange}
                            required
                            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="category_id"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ໝວດໝູ່ <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.category_id}
                            onValueChange={(value) =>
                              handleSelectChange("category_id", value)
                            }
                            required
                          >
                            <SelectTrigger
                              id="category_id"
                              className="border-gray-300"
                            >
                              <SelectValue placeholder="ເລືອກໝວດໝູ່" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map((category) => (
                                <SelectItem
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor="status"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ສະຖານະ
                          </Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) =>
                              handleSelectChange("status", value)
                            }
                          >
                            <SelectTrigger
                              id="status"
                              className="border-gray-300"
                            >
                              <SelectValue placeholder="ເລືອກສະຖານະ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                ເປີດໃຊ້ງານ
                              </SelectItem>
                              <SelectItem value="inactive">
                                ປິດໃຊ້ງານ
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="description"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          ລາຍລະອຽດ
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleFormChange}
                          rows={2}
                          className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Beverage Tab */}
              <TabsContent value="beverage" className="mt-0">
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label
                        htmlFor="image"
                        className="mb-1 block text-sm font-medium text-gray-700"
                      >
                        ຮູບພາບສິນຄ້າ
                      </Label>
                      <ImageUpload
                        value={formData.image}
                        onChange={handleImageChange}
                      />
                    </div>
                    <div className="col-span-2 grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ຊື່ສິນຄ້າ <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="category_id"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ໝວດໝູ່ <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={formData.category_id}
                            onValueChange={(value) =>
                              handleSelectChange("category_id", value)
                            }
                            required
                          >
                            <SelectTrigger
                              id="category_id"
                              className="border-gray-300"
                            >
                              <SelectValue placeholder="ເລືອກໝວດໝູ່" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryOptions.map((category) => (
                                <SelectItem
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="hot_price"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ລາຄາຮ້ອນ
                          </Label>
                          <Input
                            id="hot_price"
                            name="hot_price"
                            type="number"
                            value={formData.hot_price}
                            onChange={handleFormChange}
                            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="ice_price"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ລາຄາເຢັນ
                          </Label>
                          <Input
                            id="ice_price"
                            name="ice_price"
                            type="number"
                            value={formData.ice_price}
                            onChange={handleFormChange}
                            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="status"
                            className="mb-1 block text-sm font-medium text-gray-700"
                          >
                            ສະຖານະ
                          </Label>
                          <Select
                            value={formData.status}
                            onValueChange={(value) =>
                              handleSelectChange("status", value)
                            }
                          >
                            <SelectTrigger
                              id="status"
                              className="border-gray-300"
                            >
                              <SelectValue placeholder="ເລືອກສະຖານະ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">
                                ເປີດໃຊ້ງານ
                              </SelectItem>
                              <SelectItem value="inactive">
                                ປິດໃຊ້ງານ
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="description"
                          className="mb-1 block text-sm font-medium text-gray-700"
                        >
                          ລາຍລະອຽດ
                        </Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleFormChange}
                          rows={2}
                          className="border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleSafeClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              ຍົກເລີກ
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700"
            >
              ເພີ່ມສິນຄ້າ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};