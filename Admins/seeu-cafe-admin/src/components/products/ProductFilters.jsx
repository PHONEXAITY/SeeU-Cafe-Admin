import React from "react";
import { motion } from "framer-motion";
import { Search, Filter, ShoppingBag, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const ProductFilters = ({
  mobile,
  filters,
  updateFilter,
  categoryOptions,
  isLoadingCategories,
  onClose,
  handleSearchChange,
}) => {
  if (mobile) {
    return (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="block md:hidden mb-6 overflow-hidden"
      >
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <Select
            value={filters.productType}
            onValueChange={(value) => updateFilter("productType", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="ເລືອກປະເພດສິນຄ້າ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ທຸກປະເພດ</SelectItem>
              <SelectItem value="food">ອາຫານ</SelectItem>
              <SelectItem value="beverage">ເຄື່ອງດື່ມ</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.categoryId}
            onValueChange={(value) => updateFilter("categoryId", value)}
            disabled={isLoadingCategories}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="ເລືອກໝວດໝູ່" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ທຸກໝວດໝູ່</SelectItem>
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="ເລືອກສະຖານະ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ທຸກສະຖານະ</SelectItem>
              <SelectItem value="active">ເປີດໃຊ້ງານ</SelectItem>
              <SelectItem value="inactive">ປິດໃຊ້ງານ</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex justify-center">
            <Button variant="outline" onClick={onClose} className="text-sm">
              ປິດຕົວກອງ
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          className="pl-10 bg-gray-50 border-gray-200"
          placeholder="ຄົ້ນຫາສິນຄ້າ..."
          onChange={handleSearchChange}
        />
      </div>

      <Select
        value={filters.productType}
        onValueChange={(value) => updateFilter("productType", value)}
      >
        <SelectTrigger className="bg-gray-50 border-gray-200">
          <ShoppingBag className="mr-2 h-4 w-4 text-amber-500" />
          <span>
            {filters.productType === "all" && "ທຸກປະເພດ"}
            {filters.productType === "food" && "ອາຫານ"}
            {filters.productType === "beverage" && "ເຄື່ອງດື່ມ"}
            {!filters.productType && "ເລືອກປະເພດສິນຄ້າ"}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ທຸກປະເພດ</SelectItem>
          <SelectItem value="food">ອາຫານ</SelectItem>
          <SelectItem value="beverage">ເຄື່ອງດື່ມ</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.categoryId}
        onValueChange={(value) => updateFilter("categoryId", value)}
        disabled={isLoadingCategories}
      >
        <SelectTrigger className="bg-gray-50 border-gray-200">
          <Tag className="mr-2 h-4 w-4 text-amber-500" />
          <span>
            {filters.categoryId === "all" && "ທຸກໝວດໝູ່"}
            {filters.categoryId &&
              filters.categoryId !== "all" &&
              categoryOptions.find((cat) => cat.value === filters.categoryId)
                ?.label}
            {!filters.categoryId && "ເລືອກໝວດໝູ່"}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ທຸກໝວດໝູ່</SelectItem>
          {categoryOptions.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => updateFilter("status", value)}
      >
        <SelectTrigger className="bg-gray-50 border-gray-200">
          <Filter className="mr-2 h-4 w-4 text-amber-500" />
          <span>
            {filters.status === "all" && "ທຸກສະຖານະ"}
            {filters.status === "active" && "ເປີດໃຊ້ງານ"}
            {filters.status === "inactive" && "ປິດໃຊ້ງານ"}
            {!filters.status && "ເລືອກສະຖານະ"}
          </span>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">ທຸກສະຖານະ</SelectItem>
          <SelectItem value="active">ເປີດໃຊ້ງານ</SelectItem>
          <SelectItem value="inactive">ປິດໃຊ້ງານ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};