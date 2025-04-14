"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import {
  Search,
  Filter,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import {
  useFoodProducts,
  useBeverageProducts,
  useDeleteFoodProduct,
  useDeleteBeverageProduct,
  useCategories,
} from "@/hooks/productHooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

import { ProductCard } from "./ProductCard";
import { ProductFilters } from "./ProductFilters";
import { AddProductModal } from "./AddProductModal";
import { EditProductModal } from "./EditProductModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { EmptyProductState } from "./EmptyProductState";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

import { sortProducts, initialFormState } from "@/utils/productUtils";

const ProductList = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [filters, setFilters] = useState({
    productType: "all",
    searchTerm: "",
    categoryId: "",
    status: "",
    sortField: "name",
    sortDirection: "asc",
    page: 1,
    limit: 12,
  });

  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setFilters((prev) => ({ ...prev, searchTerm: value, page: 1 }));
      }, 300),
    []
  );

  const handleSearchChange = useCallback(
    (e) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handleSortChange = useCallback((field) => {
    setFilters((prev) => ({
      ...prev,
      sortField: field,
      sortDirection:
        prev.sortField === field && prev.sortDirection === "asc"
          ? "desc"
          : "asc",
      page: 1,
    }));
  }, []);

  const queryFilters = useMemo(
    () => ({
      search: filters.searchTerm,
      categoryId: filters.categoryId || undefined,
      status: filters.status || undefined,
      sortBy: filters.sortField,
      sortDir: filters.sortDirection,
      page: filters.page,
      limit: filters.limit,
    }),
    [filters]
  );

  const {
    data: foodData,
    isLoading: isLoadingFood,
    error: foodError,
  } = useFoodProducts(
    filters.productType === "all" || filters.productType === "food"
      ? queryFilters
      : null
  );

  const {
    data: beverageData,
    isLoading: isLoadingBeverage,
    error: beverageError,
  } = useBeverageProducts(
    filters.productType === "all" || filters.productType === "beverage"
      ? queryFilters
      : null
  );

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories();

  const { mutate: deleteFoodProduct, isLoading: isDeletingFood } =
    useDeleteFoodProduct();
  const { mutate: deleteBeverageProduct, isLoading: isDeletingBeverage } =
    useDeleteBeverageProduct();

  const products = useMemo(() => {
    if (isLoadingFood || isLoadingBeverage || foodError || beverageError) {
      return [];
    }

    let result = [];

    if (filters.productType === "all" || filters.productType === "food") {
      const foodProducts = foodData?.products || [];
      result.push(
        ...foodProducts.map((product) => ({ ...product, type: "food" }))
      );
    }

    if (filters.productType === "all" || filters.productType === "beverage") {
      const beverageProducts = beverageData?.products || [];
      result.push(
        ...beverageProducts.map((product) => ({ ...product, type: "beverage" }))
      );
    }

    return sortProducts(result, filters.sortField, filters.sortDirection);
  }, [
    foodData?.products,
    beverageData?.products,
    filters.productType,
    filters.sortField,
    filters.sortDirection,
    isLoadingFood,
    isLoadingBeverage,
    foodError,
    beverageError,
  ]);

  const totalItems = useMemo(
    () =>
      (filters.productType === "all" || filters.productType === "food"
        ? foodData?.totalItems || 0
        : 0) +
      (filters.productType === "all" || filters.productType === "beverage"
        ? beverageData?.totalItems || 0
        : 0),
    [foodData, beverageData, filters.productType]
  );

  const totalPages = useMemo(
    () =>
      Math.max(
        filters.productType === "all" || filters.productType === "food"
          ? foodData?.totalPages || 0
          : 0,
        filters.productType === "all" || filters.productType === "beverage"
          ? beverageData?.totalPages || 0
          : 0
      ),
    [foodData, beverageData, filters.productType]
  );

  const categoryOptions = useMemo(
    () =>
      categoriesData
        ? (Array.isArray(categoriesData)
            ? categoriesData
            : categoriesData.data || []
          )
            .filter((category) => category.id && category.id !== "") // Filter out invalid IDs
            .map((category) => ({
              value: category.id.toString(), // Ensure value is a non-empty string
              label: category.name || "Unnamed Category", // Fallback for missing names
            }))
        : [],
    [categoriesData]
  );

  const getCategoryName = useCallback(
    (categoryId) => {
      if (!categoriesData) return "Loading...";
      const categories = Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData.data || [];
      const category = categories.find((cat) => cat.id === categoryId);
      return category ? category.name : "Unknown";
    },
    [categoriesData]
  );

  const handleViewProduct = useCallback(
    (product) => {
      router.push(`/products/${product.type}/${product.id}`);
    },
    [router]
  );

  const handleEditProduct = useCallback((product) => {
    setProductToEdit(product);
    setFormData({
      type: product.type,
      name: product.name,
      price: product.price || "",
      category_id: product.category_id || "",
      status: product.status || "active",
      description: product.description || "",
      image: product.image || null,
      hot_price: product.hot_price || "",
      ice_price: product.ice_price || "",
    });
    document.body.style.overflow = "hidden";
    setShowEditModal(true);
  }, []);

  const handleDeleteProduct = useCallback((product) => {
    setProductToDelete(product);
    document.body.style.overflow = "hidden";
    setShowDeleteModal(true);
  }, []);

  const handleAddProduct = useCallback(() => {
    setFormData(initialFormState);
    document.body.style.overflow = "hidden";
    setShowAddModal(true);
  }, []);

  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((file) => {
    setFormData((prev) => ({ ...prev, image: file }));
  }, []);

  const handleCloseModal = useCallback(() => {
    document.body.style.overflow = "auto";
    if (showAddModal) setShowAddModal(false);
    if (showEditModal) {
      setShowEditModal(false);
      setProductToEdit(null);
    }
    if (showDeleteModal) {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  }, [showAddModal, showEditModal, showDeleteModal]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const renderProductList = () => {
    if (isLoadingFood || isLoadingBeverage) {
      return <LoadingState />;
    }

    if (foodError || beverageError) {
      return <ErrorState error={foodError || beverageError} />;
    }

    if (products.length === 0) {
      return <EmptyProductState onAddProduct={handleAddProduct} />;
    }

    return (
      <>
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {products.map((product) => (
            <ProductCard
              key={`${product.type}-${product.id}`}
              product={product}
              onView={handleViewProduct}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              getCategoryName={getCategoryName}
            />
          ))}
        </motion.div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter("page", filters.page - 1)}
                disabled={filters.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <Button
                    key={pageNum}
                    variant={pageNum === filters.page ? "default" : "outline"}
                    size="sm"
                    className={pageNum === filters.page ? "bg-amber-500" : ""}
                    onClick={() => updateFilter("page", pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateFilter("page", filters.page + 1)}
                disabled={filters.page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="bg-amber-100 p-3 rounded-xl">
            <ShoppingBag className="h-8 w-8 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
              ສິນຄ້າທັງໝົດ
            </h1>
            <p className="text-gray-500 text-sm md:text-base">
              ຈັດການສິນຄ້າແລະເຄື່ອງດື່ມຂອງທ່ານ · {totalItems} ລາຍການ
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddProduct}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-md transition-all duration-300 transform hover:scale-105 w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> ເພີ່ມສິນຄ້າ
        </Button>
      </div>

      <div className="block md:hidden mb-4">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              className="pl-10 bg-gray-50 border-gray-200"
              placeholder="ຄົ້ນຫາສິນຄ້າ..."
              onChange={handleSearchChange}
            />
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="w-full flex justify-center items-center"
              onClick={() => setIsFiltersVisible((prev) => !prev)}
            >
              <Filter className="mr-2 h-4 w-4" /> ຕົວກອງ
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFiltersVisible && (
          <ProductFilters
            mobile={true}
            filters={filters}
            updateFilter={updateFilter}
            categoryOptions={categoryOptions}
            isLoadingCategories={isLoadingCategories}
            onClose={() => setIsFiltersVisible(false)}
          />
        )}
      </AnimatePresence>

      <div className="hidden md:block mb-8">
        <ProductFilters
          mobile={false}
          filters={filters}
          updateFilter={updateFilter}
          categoryOptions={categoryOptions}
          isLoadingCategories={isLoadingCategories}
          handleSearchChange={handleSearchChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="text-sm text-gray-500 mb-4 sm:mb-0">
          ສະແດງ {products.length} ຈາກທັງໝົດ {totalItems} ລາຍການ
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={filters.limit.toString()}
            onValueChange={(value) => updateFilter("limit", Number(value))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="ຈຳນວນຕໍ່ໜ້າ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8 ລາຍການ</SelectItem>
              <SelectItem value="12">12 ລາຍການ</SelectItem>
              <SelectItem value="24">24 ລາຍການ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {renderProductList()}

      <AddProductModal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        formData={formData}
        categoryOptions={categoryOptions}
        handleFormChange={handleFormChange}
        handleSelectChange={handleSelectChange}
        handleImageChange={handleImageChange}
        queryClient={queryClient}
      />

      <EditProductModal
        isOpen={showEditModal}
        onClose={handleCloseModal}
        formData={formData}
        productToEdit={productToEdit}
        categoryOptions={categoryOptions}
        handleFormChange={handleFormChange}
        handleSelectChange={handleSelectChange}
        handleImageChange={handleImageChange}
        queryClient={queryClient}
      />

      <DeleteProductModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        productToDelete={productToDelete}
        isDeleting={isDeletingFood || isDeletingBeverage}
        deleteFoodProduct={deleteFoodProduct}
        deleteBeverageProduct={deleteBeverageProduct}
      />
    </div>
  );
};

export default ProductList;