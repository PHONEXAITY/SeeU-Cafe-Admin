import { useState, useCallback } from 'react';
import { promotionService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';

const API_ERROR = 'ເກີດຂໍ້ຜິດພາດ';

export const usePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleRequest = useCallback(async (request, errorMsg = API_ERROR, showToast = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await request();
      setLoading(false);
      
      if (showToast) {
        toast({
          title: "ສຳເລັດ",
          description: "ດຳເນີນການສຳເລັດແລ້ວ",
        });
      }
      
      return response.data;
    } catch (err) {
      console.error("API Error:", err);
      const errorMessage = err.response?.data?.message || errorMsg;
      setError(errorMessage);
      setLoading(false);
      
      if (showToast) {
        toast({
          title: "ເກີດຂໍ້ຜິດພາດ",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      return null;
    }
  }, [toast]);

  // แก้ไขการเรียกใช้ fetchPromotions เพื่อรองรับทั้งสตริงและอ็อบเจ็กต์
  const fetchPromotions = useCallback((status = '') => {
    // แปลงพารามิเตอร์ให้อยู่ในรูปแบบที่ถูกต้อง
    const params = typeof status === 'string' && status !== '' 
      ? { status } 
      : (typeof status === 'object' ? status : {});
    
    return handleRequest(
      () => promotionService.getAllPromotions(params), 
      'ໂຫລດໂປຣໂມຊັ່ນລົ້ມເຫລວ'
    ).then(data => {
      if (data) {
        setPromotions(Array.isArray(data) ? data : []);
        return data;
      }
      return [];
    });
  }, [handleRequest]);

  const getPromotionById = useCallback(id => {
    if (!id) return Promise.resolve(null);
    
    return handleRequest(
      () => promotionService.getPromotionById(id), 
      'ບໍ່ພົບໂປຣໂມຊັ່ນ'
    ).then(data => {
      if (data) {
        setPromotion(data);
        return data;
      }
      return null;
    });
  }, [handleRequest]);

  const getPromotionByCode = useCallback(code => {
    if (!code) return Promise.resolve(null);
    
    return handleRequest(
      () => promotionService.getPromotionByCode(code), 
      'ບໍ່ພົບໂປຣໂມຊັ່ນ'
    );
  }, [handleRequest]);

  const createPromotion = useCallback(async (data) => {
    if (!data) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ຂໍ້ມູນ promotion ບໍ່ຖືກຕ້ອງ",
        variant: "destructive",
      });
      return false;
    }
    
    const result = await handleRequest(
      () => promotionService.createPromotion(data), 
      'ສ້າງໂປຣໂມຊັ່ນລົ້ມເຫລວ',
      true
    );
    
    if (result) {
      await fetchPromotions();
      return true;
    }
    return false;
  }, [handleRequest, fetchPromotions, toast]);

  const updatePromotion = useCallback(async (id, data) => {
    if (!id || !data) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ຂໍ້ມູນ promotion ບໍ່ຖືກຕ້ອງ",
        variant: "destructive",
      });
      return false;
    }
    
    const result = await handleRequest(
      () => promotionService.updatePromotion(id, data), 
      'ອັບເດດໂປຣໂມຊັ່ນລົ້ມເຫລວ',
      true
    );
    
    if (result) {
      await fetchPromotions();
      return true;
    }
    return false;
  }, [handleRequest, fetchPromotions, toast]);

  const deletePromotion = useCallback(async (id) => {
    if (!id) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ID ຂອງ promotion ບໍ່ຖືກຕ້ອງ",
        variant: "destructive",
      });
      return false;
    }
    
    const result = await handleRequest(
      () => promotionService.deletePromotion(id), 
      'ລຶບໂປຣໂມຊັ່ນລົ້ມເຫລວ',
      true
    );
    
    if (result) {
      await fetchPromotions();
      return true;
    }
    return false;
  }, [handleRequest, fetchPromotions, toast]);

  const validatePromotion = useCallback((code, amount, userId = null) => {
    if (!code) {
      return Promise.resolve({ valid: false, message: 'ລະຫັດ promotion ບໍ່ຖືກຕ້ອງ' });
    }
    
    return handleRequest(
      () => promotionService.validatePromotion({ code, amount, userId }),
      'ບໍ່ສາມາດກວດສອບລະຫັດໂປຣໂມຊັ່ນໄດ້'
    );
  }, [handleRequest]);

  const togglePromotionStatus = useCallback(async (id, currentStatus) => {
    if (!id) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: "ID ຂອງ promotion ບໍ່ຖືກຕ້ອງ",
        variant: "destructive",
      });
      return false;
    }
    
    // ถ้ามี currentStatus จากพารามิเตอร์ ให้ใช้เลย ไม่ต้องเรียก API ซ้ำ
    if (currentStatus) {
      return updatePromotion(id, { 
        status: currentStatus === 'active' ? 'inactive' : 'active' 
      });
    }
    
    // ถ้าไม่มี currentStatus จะต้องเรียก API เพื่อดึงข้อมูล
    const promo = await getPromotionById(id);
    if (!promo) return false;
    
    return updatePromotion(id, { 
      status: promo.status === 'active' ? 'inactive' : 'active' 
    });
  }, [getPromotionById, updatePromotion, toast]);

  return {
    promotions,
    promotion,
    loading,
    error,
    fetchPromotions,
    getPromotionById,
    getPromotionByCode,
    createPromotion,
    updatePromotion,
    deletePromotion,
    validatePromotion,
    togglePromotionStatus,
  };
};