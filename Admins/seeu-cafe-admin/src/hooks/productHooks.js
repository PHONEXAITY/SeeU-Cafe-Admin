import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/api";
import { toast } from "react-hot-toast";

export const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const { data } = await productService.getAllProducts(filters);
      return data || { products: [], totalItems: 0, totalPages: 0 };
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

// Legacy hooks for compatibility
export const useFoodProducts = (filters = {}) => {
  return useProducts({ ...filters, type: 'food' });
};

export const useBeverageProducts = (filters = {}) => {
  return useProducts({ ...filters, type: 'beverage' });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await productService.getCategories();
      return data || [];
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await productService.getProductById(id);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productData) => productService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("สินค้าถูกเพิ่มเรียบร้อย");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "ไม่สามารถเพิ่มสินค้าได้");
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("สินค้าถูกปรับปรุงเรียบร้อย");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "ไม่สามารถปรับปรุงสินค้าได้");
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("สินค้าถูกลบเรียบร้อย");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "ไม่สามารถลบสินค้าได้");
    },
  });
};

// Legacy hooks for compatibility
export const useDeleteFoodProduct = () => {
  return useDeleteProduct();
};

export const useDeleteBeverageProduct = () => {
  return useDeleteProduct();
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("lo-LA", {
    style: "currency",
    currency: "LAK",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export const getProductStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "inactive":
      return "bg-gray-100 text-gray-800";
    case "out_of_stock":
      return "bg-red-100 text-red-800";
    case "low_stock":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
