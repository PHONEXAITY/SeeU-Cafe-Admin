"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { slideshowService } from "@/services/api";

export const useSlideshowService = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleError = useCallback(
    (error, customMessage) => {
      const message =
        error.response?.data?.message ||
        customMessage ||
        "ເກີດຂໍ້ຜິດພາດໃນການເຊື່ອມຕໍ່ກັບເຊີເວີ";

      setError(message);
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description: message,
      });
      return message;
    },
    [toast]
  );

  const getSlides = useCallback(
    async (status) => {
      setLoading(true);
      setError(null);

      try {
        const params = status && status !== "all" ? { status } : {};
        const response = await slideshowService.getSlides(params);
        setSlides(response.data);
        return response.data;
      } catch (error) {
        handleError(error, "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນ Slides ໄດ້");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const getActiveSlides = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await slideshowService.getActiveSlides();
      setSlides(response.data);
      return response.data;
    } catch (error) {
      handleError(error, "ບໍ່ສາມາດໂຫຼດຂໍ້ມູນ Slides ທີ່ກຳລັງໃຊ້ງານໄດ້");
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getSlideById = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        const response = await slideshowService.getSlideById(id);
        return response.data;
      } catch (error) {
        handleError(error, `ບໍ່ສາມາດໂຫຼດຂໍ້ມູນ Slide ID: ${id} ໄດ້`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const createSlide = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await slideshowService.createSlideWithImage(formData);
        setSlides((prev) => [...prev, response.data]);

        toast({
          title: "ສຳເລັດ",
          description: "ສ້າງ Slide ໃໝ່ສຳເລັດແລ້ວ",
        });

        return response.data;
      } catch (error) {
        handleError(error, "ບໍ່ສາມາດສ້າງ Slide ໃໝ່ໄດ້");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError, toast]
  );

  const updateSlide = useCallback(
    async (id, data) => {
      setLoading(true);
      setError(null);

      try {
        const response = await slideshowService.updateSlide(id, data);
        setSlides((prev) =>
          prev.map((slide) => (slide.id === id ? response.data : slide))
        );

        toast({
          title: "ສຳເລັດ",
          description: "ອັບເດດ Slide ສຳເລັດແລ້ວ",
        });

        return response.data;
      } catch (error) {
        handleError(error, `ບໍ່ສາມາດອັບເດດ Slide ID: ${id} ໄດ້`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError, toast]
  );

  const updateSlideImage = useCallback(
    async (id, formData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await slideshowService.updateSlideImage(id, formData);
        setSlides((prev) =>
          prev.map((slide) => (slide.id === id ? response.data : slide))
        );

        toast({
          title: "ສຳເລັດ",
          description: "ອັບເດດຮູບພາບຂອງ Slide ສຳເລັດແລ້ວ",
        });

        return response.data;
      } catch (error) {
        handleError(error, `ບໍ່ສາມາດອັບເດດຮູບພາບຂອງ Slide ID: ${id} ໄດ້`);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError, toast]
  );

  const deleteSlide = useCallback(
    async (id) => {
      setLoading(true);
      setError(null);

      try {
        await slideshowService.deleteSlide(id);
        setSlides((prev) => prev.filter((slide) => slide.id !== id));

        toast({
          title: "ສຳເລັດ",
          description: "ລຶບ Slide ສຳເລັດແລ້ວ",
        });

        return true;
      } catch (error) {
        handleError(error, `ບໍ່ສາມາດລຶບ Slide ID: ${id} ໄດ້`);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [handleError, toast]
  );
  const searchSlides = useCallback(
    async (query) => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await slideshowService.searchSlides(query);
        setSlides(response.data);
        return response.data;
      } catch (error) {
        handleError(error, "ບໍ່ສາມາດຄົ້ນຫາ Slides ໄດ້");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  const reorderSlides = useCallback(
    async (ordersMap) => {
      setLoading(true);
      setError(null);

      try {
        await slideshowService.reorderSlides(ordersMap);
        await getSlides();

        toast({
          title: "ສຳເລັດ",
          description: "ຈັດລຳດັບ Slides ສຳເລັດແລ້ວ",
        });

        return true;
      } catch (error) {
        handleError(error, "ບໍ່ສາມາດຈັດລຳດັບ Slides ໄດ້");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getSlides, handleError, toast]
  );

  return {
    slides,
    loading,
    error,
    getSlides,
    getActiveSlides,
    getSlideById,
    createSlide,
    updateSlide,
    updateSlideImage,
    deleteSlide,
    searchSlides,
    reorderSlides,
  };
};
