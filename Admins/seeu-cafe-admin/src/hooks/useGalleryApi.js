"use client";

import { useState, useCallback } from "react";
import { galleryService } from "@/services/api";

const useGalleryApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchImages = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryService.getAllImages(filters);
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(", ")
        : err.response?.data?.message || "ບໍ່ສາມາດດຶງຂໍ້ມູນຮູບພາບໄດ້";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryService.getCategories();
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(", ")
        : err.response?.data?.message || "ບໍ່ສາມາດດຶງຂໍ້ມູນໝວດໝູ່ໄດ້";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const uploadImage = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryService.uploadImages(formData);
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(", ")
        : err.response?.data?.message || "ບໍ່ສາມາດອັບໂຫລດຮູບພາບໄດ້";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const deleteImage = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryService.deleteImage(id);
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(", ")
        : err.response?.data?.message || "ບໍ່ສາມາດລຶບຮູບພາບໄດ້";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateImage = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await galleryService.updateImageDetails(id, data);
      setLoading(false);
      return response.data;
    } catch (err) {
      const errorMessage = Array.isArray(err.response?.data?.message)
        ? err.response.data.message.join(", ")
        : err.response?.data?.message || "ບໍ່ສາມາດອັບເດດຮູບພາບໄດ້";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    fetchImages,
    fetchCategories,
    uploadImage,
    deleteImage,
    updateImage,
  };
};

export default useGalleryApi;
