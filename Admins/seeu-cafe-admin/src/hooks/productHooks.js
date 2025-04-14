"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/api";
import { toast } from "react-hot-toast";

export const useFoodProducts = (filters = {}) => {
  return useQuery({
    queryKey: ["foodProducts", filters],
    queryFn: async () => {
      if (!filters) return { products: [], totalItems: 0, totalPages: 0 };

      const { data } = await productService.getFoodProducts(filters);
      return {
        products: data || [],
        totalItems: data?.length || 0,
        totalPages: 1,
      };
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const useBeverageProducts = (filters = {}) => {
  return useQuery({
    queryKey: ["beverageProducts", filters],
    queryFn: async () => {
      if (!filters) return { products: [], totalItems: 0, totalPages: 0 };

      const { data } = await productService.getBeverageProducts(filters);
      return {
        products: data || [],
        totalItems: data?.length || 0,
        totalPages: 1,
      };
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const DEFAULT_PLACEHOLDER_IMAGE = "https://via.placeholder.com/150";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const { data } = await productService.getCategories();
        return data || [];
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("ບໍ່ສາມາດໂຫລດຂໍ້ມູນໝວດໝູ່ໄດ້");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 30,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryData) => {
      try {
        const dataToSend = {
          name: categoryData.name,
          description: categoryData.description || "",
          image: categoryData.image || null,
          type: categoryData.type || "food",
          parent_id: categoryData.parentCategoryId
            ? Number(categoryData.parentCategoryId)
            : null,
        };

        delete dataToSend.parentCategoryId;

        console.log("Creating category with data:", dataToSend);

        const response = await productService.createCategory(dataToSend);
        return response.data;
      } catch (error) {
        console.error("Error creating category:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("ເພີ່ມໝວດໝູ່ສຳເລັດແລ້ວ");
    },
    onError: (error) => {
      console.error("Error creating category:", error);
      toast.error(error.response?.data?.message || "ບໍ່ສາມາດເພີ່ມໝວດໝູ່ໄດ້");
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      try {
        const dataToSend = {
          name: data.name,
          description: data.description || "",
          image: data.image || null,
          type: data.type || "food",
          parent_id: data.parentCategoryId
            ? Number(data.parentCategoryId)
            : null,
        };

        delete dataToSend.parentCategoryId;

        console.log(`Updating category ${id} with data:`, dataToSend);

        const response = await productService.updateCategory(id, dataToSend);
        return response.data;
      } catch (error) {
        console.error(`Error updating category ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("ອັບເດດໝວດໝູ່ສຳເລັດແລ້ວ");
    },
    onError: (error) => {
      console.error("Error updating category:", error);
      toast.error(error.response?.data?.message || "ບໍ່ສາມາດອັບເດດໝວດໝູ່ໄດ້");
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      try {
        console.log("Deleting category with id:", id);
        const response = await productService.deleteCategory(id);
        return response.data;
      } catch (error) {
        console.error(`Error deleting category ${id}:`, error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      toast.success("ລຶບໝວດໝູ່ສຳເລັດແລ້ວ");
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || "ບໍ່ສາມາດລຶບໝວດໝູ່ໄດ້");
    },
  });
};

export const enhancedProductService = {
  ...productService,

  uploadImage: (formData) => {
    console.log("Uploading image...");

    return productService.uploadImage(formData).catch((error) => {
      console.error("Error uploading image:", error);
      toast.error("ເກີດຂໍ້ຜິດພາດໃນການອັບໂຫລດຮູບພາບ");
      throw error;
    });
  },
};

export const useDeleteFoodProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteFoodProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["foodProducts"]);
      toast.success("ລຶບສິນຄ້າອາຫານສຳເລັດແລ້ວ");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "ບໍ່ສາມາດລຶບສິນຄ້າອາຫານໄດ້");
    },
  });
};

export const useDeleteBeverageProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => productService.deleteBeverageProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["beverageProducts"]);
      toast.success("ລຶບສິນຄ້າເຄື່ອງດື່ມສຳເລັດແລ້ວ");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "ບໍ່ສາມາດລຶບສິນຄ້າເຄື່ອງດື່ມໄດ້"
      );
    },
  });
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
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
