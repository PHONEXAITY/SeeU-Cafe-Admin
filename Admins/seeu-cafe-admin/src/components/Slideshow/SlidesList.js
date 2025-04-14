'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Search, Edit, Trash2, Eye, ArrowUp, ArrowDown, Image, 
  Link, PlusCircle, Loader2, GripVertical, Calendar, LayoutGrid,
  List, Filter, Clock, RefreshCw, Check, Info, ExternalLink,
  Settings, Grid
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSlideshowService } from "@/hooks/useSlideshowService";
import { motion } from "framer-motion";

const PreviewDialog = ({ isOpen, onClose, slide }) => {
  if (!slide) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[850px] p-0 overflow-hidden bg-white/95 backdrop-blur-sm border-none shadow-2xl rounded-xl">
        <div className="aspect-video relative w-full overflow-hidden rounded-t-xl">
          <img 
            src={slide?.image || '/api/placeholder/800/400'} 
            alt={slide?.title}
            className="w-full h-full object-cover"
          />
          {slide?.buttonText && (
            <div className="absolute bottom-20 left-6">
              <Button className="bg-white text-black hover:bg-white/90">
                {slide.buttonText}
              </Button>
            </div>
          )}
          {slide?.title && (
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white text-2xl font-bold">{slide.title}</h3>
              {slide.subtitle && (
                <p className="text-white/90 mt-2 text-lg">{slide.subtitle}</p>
              )}
            </div>
          )}
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm text-gray-500">ສະຖານະ</h4>
              <Badge className={getStatusColorClass(slide.status)}>{getStatusLabel(slide.status)}</Badge>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm text-gray-500">ລຳດັບ</h4>
              <p className="font-medium">{slide.order || 'ອັດຕະໂນມັດ'}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm text-gray-500">ວັນທີປັບປຸງລ່າສຸດ</h4>
              <p className="font-medium">{new Date(slide.updated_at).toLocaleDateString('lo-LA')}</p>
            </div>
          </div>

          {slide.status === 'scheduled' && slide.startDate && slide.endDate && (
            <div className="border rounded-lg p-4 bg-blue-50 space-y-2">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <h4 className="text-sm font-medium text-blue-700">ກຳນົດເວລາສະແດງ</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h5 className="text-xs text-blue-600">ເລີ່ມຕົ້ນ</h5>
                  <p className="text-sm">{new Date(slide.startDate).toLocaleString('lo-LA')}</p>
                </div>
                <div className="space-y-1">
                  <h5 className="text-xs text-blue-600">ສິ້ນສຸດ</h5>
                  <p className="text-sm">{new Date(slide.endDate).toLocaleString('lo-LA')}</p>
                </div>
              </div>
            </div>
          )}

          {slide.link && (
            <div className="flex items-center space-x-2 bg-gray-50 rounded-lg p-3">
              <Link className="w-4 h-4 text-blue-500" />
              <a
                href={slide.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 truncate flex-1"
              >
                {slide.link}
              </a>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </div>
          )}

          <DialogFooter className="flex justify-center sm:justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              ປິດ
            </Button>
            <Button 
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
              asChild
            >
              <a href={`/slideshow/edit/${slide.id}`}>
                <Edit className="w-4 h-4 mr-2" />
                ແກ້ໄຂ
              </a>
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, slideId, isDeleting }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>ຢືນຢັນການລຶບ Slide</AlertDialogTitle>
          <AlertDialogDescription>
            ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບ Slide ນີ້? ການດຳເນີນການນີ້ບໍ່ສາມາດຍົກເລີກໄດ້.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="space-x-2">
          <AlertDialogCancel disabled={isDeleting} className="font-medium">ຍົກເລີກ</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => onConfirm(slideId)}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white font-medium"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ກຳລັງລຶບ...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                ລຶບ
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// Grid View ของ Slide Item
const SlideGridItem = ({ slide, onPreview, onDelete, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all bg-white group"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={slide.image || '/api/placeholder/800/400'} 
          alt={slide.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColorClass(slide.status)}>
            {getStatusLabel(slide.status)}
          </Badge>
        </div>
        
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <Button 
            size="icon" 
            variant="secondary" 
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white"
            onClick={() => onPreview(slide)}
          >
            <Eye className="w-4 h-4 text-gray-700" />
          </Button>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white font-medium line-clamp-1">{slide.title}</p>
              {slide.subtitle && (
                <p className="text-white/80 text-xs line-clamp-1 mt-0.5">{slide.subtitle}</p>
              )}
            </div>
            <div className="flex space-x-1">
              <Button 
                size="icon" 
                variant="outline" 
                className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 border-transparent"
                onClick={() => onEdit(slide.id)}
              >
                <Edit className="w-3.5 h-3.5 text-white" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm hover:bg-red-500 border-transparent"
                onClick={() => onDelete(slide.id)}
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-3 border-t">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(slide.updated_at).toLocaleDateString('lo-LA')}</span>
          </div>
          <p className="text-sm font-medium">#{slide.order || '-'}</p>
        </div>
      </div>
    </motion.div>
  );
};

// List View ของ Slide Item
const SlideItem = ({ slide, onPreview, onDelete, onMove, index, isDragging }) => {
  return (
    <div 
      className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${isDragging ? 'bg-blue-50' : ''}`}
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <div className="text-gray-400 cursor-move">
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="md:w-48">
            <div className="aspect-video relative rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
              <img 
                src={slide.image || '/api/placeholder/800/400'} 
                alt={slide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 hover:bg-white"
                onClick={() => onPreview(slide)}
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                ສະແດງ
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <h3 className="font-medium text-lg truncate">{slide.title}</h3>
                <Badge className={getStatusColorClass(slide.status)}>
                  {getStatusLabel(slide.status)}
                </Badge>
              </div>
              {slide.subtitle && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{slide.subtitle}</p>
              )}
              
              <div className="flex mt-2 flex-wrap gap-3">
                {slide.link && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    <Link className="w-3 h-3" />
                    <span className="truncate max-w-[150px]">{slide.link}</span>
                  </div>
                )}
                {slide.buttonText && (
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                    <Info className="w-3 h-3" />
                    <span>ປຸ່ມ: {slide.buttonText}</span>
                  </div>
                )}
                {slide.status === 'scheduled' && slide.startDate && (
                  <div className="flex items-center gap-1 text-xs text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(slide.startDate).toLocaleDateString('lo-LA')}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
                  <RefreshCw className="w-3 h-3" />
                  <span>{new Date(slide.updated_at).toLocaleDateString('lo-LA')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 mt-3 md:mt-0">
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 border-gray-200 text-gray-600 hover:text-gray-900"
                  onClick={() => onPreview(slide)}
                >
                  <Eye className="w-3.5 h-3.5 mr-1" />
                  ສະແດງ
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="h-8 border-gray-200 text-gray-600 hover:text-gray-900"
                  onClick={() => onEdit(slide.id)}
                >
                  <a href={`/slideshow/edit/${slide.id}`} className='flex items-center'>
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    ແກ້ໄຂ
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 border-gray-200 text-red-500 hover:text-white hover:bg-red-500 hover:border-red-500"
                  onClick={() => onDelete(slide.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  ລຶບ
                </Button>
              </div>
              <Separator orientation="vertical" className="h-8 hidden md:block" />
              <div className="flex flex-col gap-1">
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-6 w-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => onMove(index, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-6 w-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => onMove(index, 'down')}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GridSkeletonLoader = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <div key={n} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <Skeleton className="aspect-video w-full" />
        <div className="p-3 border-t">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonLoader = () => (
  <div className="p-4 border-b border-gray-100">
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="aspect-video w-48 rounded-lg" />
      </div>
      <div className="flex-1">
        <Skeleton className="h-6 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="py-16 flex flex-col items-center justify-center text-center">
    <div className="bg-gray-100 p-6 rounded-full mb-6">
      <Image className="w-10 h-10 text-gray-400" />
    </div>
    <h3 className="text-xl font-medium mb-3">ບໍ່ພົບ Slides</h3>
    <p className="text-gray-500 mb-8 max-w-md">
      ຍັງບໍ່ມີ slides ໃນລະບົບ ຫຼື ບໍ່ມີ slides ທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາຂອງທ່ານ
    </p>
    <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
      <a href="/slideshow/create">
        <PlusCircle className="w-5 h-5 mr-2" />
        ສ້າງ Slide ໃໝ່
      </a>
    </Button>
  </div>
);

const getStatusColorClass = (status) => {
  const styles = {
    active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    inactive: "bg-gray-100 text-gray-800 border-gray-200"
  };
  return styles[status] || styles.inactive;
};

const getStatusLabel = (status) => {
  const labels = {
    active: "ກຳລັງສະແດງ",
    scheduled: "ກຳນົດເວລາ",
    inactive: "ປິດໃຊ້ງານ"
  };
  return labels[status] || "ບໍ່ຮູ້ສະຖານະ";
};

const ImprovedSlidesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogState, setDialogState] = useState({ isOpen: false, slide: null });
  const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, slideId: null });
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [filteredSlides, setFilteredSlides] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  
  const {
    slides,
    loading,
    error,
    getSlides,
    deleteSlide,
    reorderSlides,
    searchSlides
  } = useSlideshowService();

  useEffect(() => {
    getSlides(statusFilter);
  }, [getSlides, statusFilter]);

  useEffect(() => {
    if (slides.length > 0) {
      const filtered = slides.filter(slide => {
        const matchesSearch = 
          !searchQuery || 
          slide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (slide.subtitle && slide.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesStatus = statusFilter === 'all' || slide.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      });
      
      setFilteredSlides(filtered);
    } else {
      setFilteredSlides([]);
    }
  }, [slides, searchQuery, statusFilter]);

  const handlePreview = (slide) => {
    setDialogState({ isOpen: true, slide });
  };

  const handleDeleteClick = (slideId) => {
    setDeleteDialogState({ isOpen: true, slideId });
  };

  const handleDeleteConfirm = async (slideId) => {
    setIsDeleting(true);
    const success = await deleteSlide(slideId);
    if (success) {
      setDeleteDialogState({ isOpen: false, slideId: null });
    }
    setIsDeleting(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    
    // ถ้าต้องการค้นหาแบบทันที (real-time search)
    if (e.target.value.length > 2) {
      // การค้นหาด้วยการดีเลย์เล็กน้อย (debounce)
      clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        searchSlides(e.target.value);
      }, 500);
    } else if (e.target.value.length === 0) {
      // เมื่อลบคำค้นหาทั้งหมด ให้โหลดข้อมูลทั้งหมดใหม่
      getSlides(statusFilter);
    }
  };
  
  // เพิ่ม useRef สำหรับ debounce การค้นหา
  const searchTimeout = useRef(null);

  const handleMove = async (index, direction) => {
    const newSlides = [...filteredSlides];
    
    if (direction === 'up' && index > 0) {
      [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]];
    } else if (direction === 'down' && index < newSlides.length - 1) {
      [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
    }
    
    // Create order map for API
    const ordersMap = newSlides.reduce((acc, slide, idx) => {
      acc[slide.id] = idx + 1;
      return acc;
    }, {});
    
    await reorderSlides(ordersMap);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;
    
    const newSlides = [...filteredSlides];
    const [removed] = newSlides.splice(sourceIndex, 1);
    newSlides.splice(destinationIndex, 0, removed);
    
    // Create order map for API
    const ordersMap = newSlides.reduce((acc, slide, idx) => {
      acc[slide.id] = idx + 1;
      return acc;
    }, {});
    
    await reorderSlides(ordersMap);
  };

  const handleEditSlide = (id) => {
    router.push(`/slideshow/edit/${id}`);
  };

  return (
    <div className="space-y-8 p-6 md:p-8 font-['Phetsarath_OT'] bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ຈັດການ Slides
            </h1>
            <Badge className="ml-2 bg-blue-100 text-blue-800 hover:bg-blue-200">
              {filteredSlides.length} ລາຍການ
            </Badge>
          </div>
          <p className="text-gray-500 mt-2">ຈັດການ slides ສຳລັບໜ້າຫຼັກຂອງທ່ານ ສາມາດລາກເພື່ອຈັດລຳດັບໄດ້</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            size="lg"
            className="w-full md:w-auto"
            asChild
          >
            <a href="/slideshow/settings">
              <Settings className="w-4 h-4 mr-2" />
              ຕັ້ງຄ່າ Slideshow
            </a>
          </Button>
          <Button 
            size="lg" 
            asChild 
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <a href="/slideshow/create">
              <PlusCircle className="w-5 h-5 mr-2" />
              ສ້າງ Slide ໃໝ່
            </a>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border-gray-200 shadow-sm">
        <CardHeader className="bg-white border-b border-gray-100 pb-4">
          <div className="flex flex-col md:flex-row gap-4 w-full items-end">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10 bg-white"
                placeholder="ຄົ້ນຫາ slides..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex gap-2 overflow-x-auto md:overflow-visible pb-1 md:pb-0 flex-1 md:flex-initial">
                {['all', 'active', 'scheduled', 'inactive'].map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? 'default' : 'outline'}
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {status === 'all' ? 'ທັງໝົດ' :
                    status === 'active' ? 'ກຳລັງສະແດງ' :
                    status === 'scheduled' ? 'ກຳນົດເວລາ' : 'ປິດໃຊ້ງານ'}
                  </Button>
                ))}
              </div>
              
              <Separator orientation="vertical" className="h-9 hidden md:block" />
              
              <div className="flex border rounded-md overflow-hidden">
                <Button
                  variant="ghost"
                  className={`rounded-none px-3 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  className={`rounded-none px-3 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className={viewMode === 'grid' ? 'p-6 bg-gray-50' : 'p-0'}>
          {loading ? (
            viewMode === 'grid' ? <GridSkeletonLoader /> : (
              <div className="divide-y divide-gray-100">
                {[1, 2, 3].map((n) => (
                  <SkeletonLoader key={n} />
                ))}
              </div>
            )
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-red-600">ເກີດຂໍ້ຜິດພາດ: {error}</p>
              <Button variant="outline" className="mt-4" onClick={() => getSlides(statusFilter)}>
                ລອງໃໝ່ອີກຄັ້ງ
              </Button>
            </div>
          ) : filteredSlides.length === 0 ? (
            <EmptyState />
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredSlides.map((slide) => (
                <SlideGridItem
                  key={slide.id}
                  slide={slide}
                  onPreview={handlePreview}
                  onDelete={handleDeleteClick}
                  onEdit={handleEditSlide}
                />
              ))}
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="slides">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="divide-y divide-gray-100 bg-white"
                  >
                    <ScrollArea className="max-h-[calc(100vh-250px)]">
                      {filteredSlides.map((slide, index) => (
                        <Draggable key={slide.id} draggableId={String(slide.id)} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <SlideItem
                                slide={slide}
                                onPreview={handlePreview}
                                onDelete={handleDeleteClick}
                                onMove={handleMove}
                                onEdit={handleEditSlide}
                                index={index}
                                isDragging={snapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ScrollArea>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </CardContent>
      </Card>

      <PreviewDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, slide: null })}
        slide={dialogState.slide}
      />
      
      <DeleteConfirmDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, slideId: null })}
        onConfirm={handleDeleteConfirm}
        slideId={deleteDialogState.slideId}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ImprovedSlidesList;