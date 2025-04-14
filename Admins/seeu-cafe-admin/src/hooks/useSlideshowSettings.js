"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { slideshowService } from "@/services/api";

export const useSlideshowSettings = () => {
  const [settings, setSettings] = useState(null);
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

  const getSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await slideshowService.getSettings();
      setSettings(response.data);
      return response.data;
    } catch (error) {
      handleError(error, "ບໍ່ສາມາດໂຫຼດການຕັ້ງຄ່າ Slideshow ໄດ້");
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateSettings = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);

      try {
        const response = await slideshowService.updateSettings(data);
        setSettings(response.data);

        toast({
          title: "ສຳເລັດ",
          description: "ບັນທຶກການຕັ້ງຄ່າສຳເລັດແລ້ວ",
        });

        return response.data;
      } catch (error) {
        handleError(error, "ບໍ່ສາມາດບັນທຶກການຕັ້ງຄ່າ Slideshow ໄດ້");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleError, toast]
  );

  const resetSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await slideshowService.resetSettings();
      setSettings(response.data);

      toast({
        title: "ສຳເລັດ",
        description: "ຣີເຊັດການຕັ້ງຄ່າກັບສູ່ຄ່າເລີ່ມຕົ້ນແລ້ວ",
      });

      return response.data;
    } catch (error) {
      handleError(error, "ບໍ່ສາມາດຣີເຊັດການຕັ້ງຄ່າ Slideshow ໄດ້");
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, toast]);

  return {
    settings,
    loading,
    error,
    getSettings,
    updateSettings,
    resetSettings,
  };
};
