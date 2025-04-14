'use client'
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from '@/components/ui/badge';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Save, 
  X as Times, 
  Image, 
  Link, 
  Upload, 
  ExternalLink,
  Calendar,
  Clock,
  AlertCircle,
  ArrowLeft,
  Eye,
  Loader2
} from 'lucide-react';
import { slideshowService } from "@/services/api";

const CreateSlidePage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: null,
    link: '',
    status: 'active',
    startDate: '',
    endDate: '',
    buttonText: '',
    buttonLink: '',
    buttonTarget: '_self',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    // Mark form as changed if any field is modified
    setFormChanged(true);
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'ກະລຸນາໃສ່ຫົວຂໍ້';
    }
    
    if (!formData.image) {
      newErrors.image = 'ກະລຸນາເລືອກຮູບພາບ';
    }
    
    if (formData.status === 'scheduled') {
      if (!formData.startDate) {
        newErrors.startDate = 'ກະລຸນາໃສ່ວັນທີເລີ່ມຕົ້ນ';
      }
      if (!formData.endDate) {
        newErrors.endDate = 'ກະລຸນາໃສ່ວັນທີສິ້ນສຸດ';
      }
      if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.dateRange = 'ວັນທີສິ້ນສຸດຕ້ອງຫຼັງຈາກວັນທີເລີ່ມຕົ້ນ';
      }
    }
    
    if (formData.buttonText && !formData.buttonLink) {
      newErrors.buttonLink = 'ກະລຸນາໃສ່ລິ້ງເຊື່ອມຕໍ່ສຳລັບປຸ່ມ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description: "ກະລຸນາເລືອກໄຟລ໌ຮູບພາບເທົ່ານັ້ນ",
      });
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description: "ຂະໜາດຮູບພາບຕ້ອງບໍ່ເກີນ 5MB",
      });
      return;
    }
    
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  const triggerImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleExitPage = () => {
    if (formChanged) {
      setExitConfirmOpen(true);
    } else {
      router.push('/slideshow/list');
    }
  };

  const confirmExit = () => {
    setExitConfirmOpen(false);
    router.push('/slideshow/list');
  };

  const createSlide = async (formData) => {
    try {
      setLoading(true);
      // ใช้ API Service จาก @/services/api
      const response = await slideshowService.createSlideWithImage(formData);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      console.error("API Response Error:", error.response?.data);
      console.error(`${error.response?.status} ${error.response?.statusText} from ${error.config?.url}:`, {
        method: error.config?.method,
        requestData: error.config?.data,
        responseData: error.response?.data,
        url: error.config?.url
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // If there are errors, show toast and switch to the tab with errors
      const errorTab = Object.keys(errors).some(key => 
        ['title', 'image', 'subtitle'].includes(key)
      ) ? 'basic' : 'settings';
      
      setActiveTab(errorTab);
      
      toast({
        variant: "destructive",
        title: "ກະລຸນາກວດສອບຂໍ້ມູນ",
        description: "ມີຂໍ້ມູນບາງສ່ວນທີ່ບໍ່ຖືກຕ້ອງ",
      });
      
      return;
    }
    
    try {
      setLoading(true);
      const apiFormData = new FormData();
      
      // ใช้ชื่อฟิลด์ 'file' ตามที่ backend กำหนดใน FileInterceptor
      apiFormData.append('file', formData.image);
      
      // Add other required fields according to backend's CreateSlideshowDto
      apiFormData.append('title', formData.title);
      apiFormData.append('subtitle', formData.subtitle || '');
      apiFormData.append('link', formData.link || '');
      apiFormData.append('status', formData.status);
      apiFormData.append('order', formData.order || 0);
      
      // Add additional fields that might be used
      if (formData.buttonText) {
        apiFormData.append('buttonText', formData.buttonText);
      }
      
      if (formData.buttonLink) {
        apiFormData.append('buttonLink', formData.buttonLink);
      }
      
      if (formData.buttonTarget) {
        apiFormData.append('buttonTarget', formData.buttonTarget);
      }
      
      if (formData.status === 'scheduled') {
        if (!formData.startDate || !formData.endDate) {
          toast({
            variant: "destructive",
            title: "ຂໍ້ຜິດພາດ",
            description: "ກະລຸນາໃສ່ວັນທີເລີ່ມຕົ້ນ ແລະ ວັນທີສິ້ນສຸດ",
          });
          setLoading(false);
          return;
        }
        
        apiFormData.append('startDate', formData.startDate);
        apiFormData.append('endDate', formData.endDate);
      }
      
      const response = await createSlide(apiFormData);
      
      if (response) {
        toast({
          title: "ສຳເລັດ",
          description: "ສ້າງ Slide ໃໝ່ສຳເລັດແລ້ວ",
          action: <ToastAction altText="ກັບໄປຫາລາຍການ" onClick={() => router.push('/slideshow/list')}>ເບິ່ງລາຍການ</ToastAction>,
        });
        
        // Reset form changed status since we saved successfully
        setFormChanged(false);
        
        // Redirect after short delay
        setTimeout(() => {
          router.push('/slideshow/list');
        }, 2000);
      }
    } catch (error) {
      console.error("Error creating slide:", error);
      let errorMessage = "ເກີດຂໍ້ຜິດພາດໃນການສ້າງ Slide";
      
      // ตรวจสอบข้อความ error จาก backend ถ้ามี
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({
        variant: "destructive",
        title: "ຜິດພາດ",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getButtonPreviewText = () => {
    return formData.buttonText || 'ເບິ່ງເພີ່ມເຕີມ';
  };

  return (
    <div className="space-y-8 p-6 md:p-8 font-['Phetsarath_OT']">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleExitPage}
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ສ້າງ Slide ໃໝ່</h1>
            <p className="text-gray-500 mt-1">ເພີ່ມ slide ໃໝ່ສຳລັບໜ້າຫຼັກຂອງທ່ານ</p>
          </div>
        </div>
        <div className="flex gap-2 mt-2 sm:mt-0">
          <Button 
            variant="outline" 
            onClick={handleExitPage}
            className="w-full sm:w-auto"
          >
            <Times className="w-4 h-4 mr-2" />
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ກຳລັງບັນທຶກ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                ບັນທຶກ
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleImageChange} 
      />
      
      <div className="grid gap-8 lg:grid-cols-9">
        <div className="lg:col-span-6 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="basic" className="text-base">
                ຂໍ້ມູນພື້ນຖານ
              </TabsTrigger>
              <TabsTrigger value="settings" className="text-base">
                ຕັ້ງຄ່າການສະແດງ
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>ຂໍ້ມູນພື້ນຖານ</CardTitle>
                  <CardDescription>
                    ຂໍ້ມູນຫຼັກທີ່ຈະປະກົດໃນ Slide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-base">
                        ຫົວຂໍ້ <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        placeholder="ໃສ່ຫົວຂໍ້ສຳລັບ slide..."
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="subtitle" className="text-base">ຫົວຂໍ້ຍ່ອຍ</Label>
                      <Input
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) => handleFieldChange('subtitle', e.target.value)}
                        placeholder="ໃສ່ຫົວຂໍ້ຍ່ອຍ (ຖ້າມີ)..."
                      />
                    </div>
                    <div>
                      <Label className="text-base mb-3 block">
                        ຮູບພາບ <span className="text-red-500">*</span>
                      </Label>
                      <div 
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer hover:bg-gray-50 ${errors.image ? "border-red-300 bg-red-50" : "border-gray-200"}`}
                        onClick={triggerImageUpload}
                      >
                        {imagePreview ? (
                          <div className="space-y-4">
                            <div className="relative aspect-video mx-auto overflow-hidden rounded-md">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerImageUpload();
                              }}
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              ປ່ຽນຮູບພາບ
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="bg-gray-100 rounded-full p-4 mx-auto w-16 h-16 flex items-center justify-center">
                              <Image className="w-8 h-8 text-gray-500" />
                            </div>
                            <p className="mt-4 text-base text-gray-600 font-medium">
                              ລາກຮູບໃສ່ນີ້ ຫຼື ກົດເພື່ອເລືອກຮູບ
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                              ແນະນຳຂະໜາດ: 1920x1080px (16:9) ຂະໜາດສູງສຸດ: 5MB
                            </p>
                          </>
                        )}
                      </div>
                      {errors.image && (
                        <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="link" className="text-base">ລິ້ງເຊື່ອມຕໍ່</Label>
                      <div className="flex gap-2 mt-1.5">
                        <div className="relative flex-1">
                          <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="link"
                            className="pl-10"
                            value={formData.link}
                            onChange={(e) => handleFieldChange('link', e.target.value)}
                            placeholder="ໃສ່ URL ທີ່ຕ້ອງການເຊື່ອມຕໍ່..."
                          />
                        </div>
                        <Button variant="outline" type="button">
                          ເລືອກໜ້າ
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1.5">
                        ເຊື່ອມຕໍ່ຜູ້ໃຊ້ໄປຫາລິ້ງນີ້ເມື່ອຄລິກທີ່ Slide
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>ຕັ້ງຄ່າການສະແດງ</CardTitle>
                  <CardDescription>
                    ກຳນົດວິທີ ແລະ ເວລາສະແດງ Slide
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="status" className="text-base">ສະຖານະ</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleFieldChange('status', value)}
                    >
                      <SelectTrigger id="status" className="mt-1.5">
                        <SelectValue placeholder="ເລືອກສະຖານະ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">ກຳລັງສະແດງ</SelectItem>
                        <SelectItem value="scheduled">ກຳນົດເວລາ</SelectItem>
                        <SelectItem value="inactive">ປິດໃຊ້ງານ</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500 mt-1.5">
                      {formData.status === 'active' && "Slide ຈະສະແດງໃນໜ້າເວັບທັນທີ"}
                      {formData.status === 'scheduled' && "Slide ຈະສະແດງຕາມວັນທີ ແລະ ເວລາທີ່ກຳນົດ"}
                      {formData.status === 'inactive' && "Slide ຈະຖືກເກັບໄວ້ແຕ່ບໍ່ສະແດງໃນໜ້າເວັບ"}
                    </p>
                  </div>
                  
                  {formData.status === 'scheduled' && (
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="startDate" className="text-base">
                          ວັນທີເລີ່ມຕົ້ນ <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative mt-1.5">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="startDate"
                            type="datetime-local"
                            className="pl-10"
                            value={formData.startDate}
                            onChange={(e) => handleFieldChange('startDate', e.target.value)}
                          />
                        </div>
                        {errors.startDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="endDate" className="text-base">
                          ວັນທີສິ້ນສຸດ <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative mt-1.5">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="endDate"
                            type="datetime-local"
                            className="pl-10"
                            value={formData.endDate}
                            onChange={(e) => handleFieldChange('endDate', e.target.value)}
                          />
                        </div>
                        {errors.endDate && (
                          <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                        )}
                      </div>
                      {errors.dateRange && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>ຂໍ້ຜິດພາດ</AlertTitle>
                          <AlertDescription>
                            {errors.dateRange}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  <div className="space-y-4 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isActive" className="text-base cursor-pointer">
                        <div className="space-y-1">
                          <span>ເປີດໃຊ້ງານທັນທີ</span>
                          <p className="text-sm font-normal text-gray-500">
                            {formData.isActive 
                              ? "Slide ຈະເລີ່ມສະແດງທັນທີຫຼັງຈາກບັນທຶກ" 
                              : "Slide ຈະຖືກສ້າງແຕ່ຍັງບໍ່ສະແດງ"}
                          </p>
                        </div>
                      </Label>
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => handleFieldChange('isActive', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-medium text-lg">ຕັ້ງຄ່າປຸ່ມເພີ່ມເຕີມ</h3>
                    <div>
                      <Label htmlFor="buttonText" className="text-base">ຂໍ້ຄວາມປຸ່ມ</Label>
                      <Input
                        id="buttonText"
                        value={formData.buttonText}
                        onChange={(e) => handleFieldChange('buttonText', e.target.value)}
                        placeholder="ເຊັ່ນ: ເບິ່ງເພີ່ມເຕີມ, ຊື້ເລີຍ, ສົ່ງຂໍ້ຄວາມ"
                        className="mt-1.5"
                      />
                      <p className="text-sm text-gray-500 mt-1.5">
                        ປະໄວ້ວ່າງຖ້າບໍ່ຕ້ອງການສະແດງປຸ່ມ
                      </p>
                    </div>

                    {formData.buttonText && (
                      <>
                        <div>
                          <Label htmlFor="buttonLink" className="text-base">
                            ລິ້ງສຳລັບປຸ່ມ
                            {formData.buttonText && <span className="text-red-500"> *</span>}
                          </Label>
                          <div className="relative mt-1.5">
                            <Link className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                              id="buttonLink"
                              className="pl-10"
                              value={formData.buttonLink}
                              onChange={(e) => handleFieldChange('buttonLink', e.target.value)}
                              placeholder="ໃສ່ URL ທີ່ຕ້ອງການເຊື່ອມຕໍ່..."
                            />
                          </div>
                          {errors.buttonLink && (
                            <p className="text-red-500 text-sm mt-1">{errors.buttonLink}</p>
                          )}
                        </div>

                        <div>
                          <Label className="text-base mb-3 block">ການເປີດລິ້ງ</Label>
                          <RadioGroup 
                            value={formData.buttonTarget}
                            onValueChange={(value) => handleFieldChange('buttonTarget', value)}
                            className="flex flex-col space-y-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="_self" id="target-self" />
                              <Label htmlFor="target-self" className="cursor-pointer">
                                ເປີດໃນໜ້າດຽວກັນ
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="_blank" id="target-blank" />
                              <Label htmlFor="target-blank" className="cursor-pointer flex items-center">
                                ເປີດໃນແທັບໃໝ່
                                <ExternalLink className="ml-1 h-3 w-3 text-gray-500" />
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-medium text-lg">ລຳດັບ</h3>
                    <div>
                      <Label htmlFor="order" className="text-base">ລຳດັບທີ່ສະແດງ</Label>
                      <Input
                        id="order"
                        type="number"
                        min="0"
                        value={formData.order}
                        onChange={(e) => handleFieldChange('order', parseInt(e.target.value) || 0)}
                        placeholder="ໃສ່ຕົວເລກລຳດັບ (0 ສະແດງລຳດັບຕາມເວລາສ້າງ)"
                        className="mt-1.5"
                      />
                      <p className="text-sm text-gray-500 mt-1.5">
                        ຖ້າຄ່າແມ່ນ 0 ຫຼື ບໍ່ລະບຸ, ລະບົບຈະຈັດລຳດັບຕາມເວລາທີ່ສ້າງ
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ຕົວຢ່າງ</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="text-xs">ເຕັມຈໍ</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm border border-gray-200">
                {imagePreview ? (
                  <img 
                    src={imagePreview}
                    alt={formData.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                
                {(formData.title || formData.subtitle || formData.buttonText) && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                    {formData.title && (
                      <h3 className="text-white text-xl font-bold">{formData.title}</h3>
                    )}
                    {formData.subtitle && (
                      <p className="text-white/90 mt-2 text-sm">{formData.subtitle}</p>
                    )}
                    {formData.buttonText && (
                      <Button 
                        size="sm" 
                        className="mt-4 bg-white text-black hover:bg-white/90 hover:text-black"
                      >
                        {getButtonPreviewText()}
                      </Button>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">ສະຖານະ:</span>
                  <Badge className={
                    formData.status === 'active' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100' : 
                    formData.status === 'scheduled' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' : 
                    'bg-gray-100 text-gray-800 hover:bg-gray-100'
                  }>
                    {formData.status === 'active' ? 'ກຳລັງສະແດງ' : 
                     formData.status === 'scheduled' ? 'ກຳນົດເວລາ' : 'ປິດໃຊ້ງານ'}
                  </Badge>
                </div>
                {formData.status === 'scheduled' && formData.startDate && formData.endDate && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ເລີ່ມຕົ້ນ:</span>
                      <span className="font-medium">
                        {new Date(formData.startDate).toLocaleString('lo-LA')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">ສິ້ນສຸດ:</span>
                      <span className="font-medium">
                        {new Date(formData.endDate).toLocaleString('lo-LA')}
                      </span>
                    </div>
                  </>
                )}
                {formData.link && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">ລິ້ງເຊື່ອມຕໍ່:</span>
                    <span className="font-medium text-blue-600 truncate max-w-[180px]" title={formData.link}>
                      {formData.link}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">ລຳດັບທີ່ສະແດງ:</span>
                  <span className="font-medium">
                    {formData.order > 0 ? formData.order : 'ອັດຕະໂນມັດ'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ຄຳແນະນຳ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">ຮູບພາບທີ່ດີ</h4>
                <p className="text-sm text-gray-600">
                  ຄວນໃຊ້ຮູບພາບຄຸນນະພາບສູງ ແລະ ມີອັດຕາສ່ວນ 16:9 ເພື່ອສະແດງຜົນໄດ້ດີໃນທຸກອຸປະກອນ
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">ຂໍ້ຄວາມ</h4>
                <p className="text-sm text-gray-600">
                  ຂໍ້ຄວາມຄວນສັ້ນ, ກະທັດຮັດ ແລະ ດຶງດູດຄວາມສົນໃຈ. ໃຊ້ຫົວຂໍ້ຍ່ອຍສຳລັບລາຍລະອຽດເພີ່ມເຕີມ
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">ການກຳນົດເວລາ</h4>
                <p className="text-sm text-gray-600">
                  ການກຳນົດເວລາຊ່ວຍໃຫ້ທ່ານສາມາດວາງແຜນກິດຈະກຳລ່ວງໜ້າໄດ້ ໂດຍບໍ່ຕ້ອງເຂົ້າມາອັບເດດໃນພາຍຫຼັງ
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={exitConfirmOpen} onOpenChange={setExitConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ຢືນຢັນການອອກຈາກໜ້ານີ້</AlertDialogTitle>
            <AlertDialogDescription>
              ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການອອກຈາກໜ້ານີ້? ຂໍ້ມູນທັງໝົດທີ່ປ້ອນໄວ້ຈະຖືກລຶບ ແລະ ບໍ່ສາມາດກູ້ຄືນໄດ້.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ຍົກເລີກ</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmExit}
              className="bg-red-600 hover:bg-red-700"
            >
              ອອກໂດຍບໍ່ບັນທຶກ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CreateSlidePage;