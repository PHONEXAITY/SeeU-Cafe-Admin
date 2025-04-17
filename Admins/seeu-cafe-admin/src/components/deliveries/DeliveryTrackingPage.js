"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDelivery } from '@/hooks/useDelivery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  AlertTriangle, 
  Loader2,
  CheckCircle,
  Calendar,
  Package,
  User,
  MessageSquare,
  X,
  Send,
  PhoneCall,
  ExternalLink,
  MapPinned,
  Route,
  Info,
  Eye,
  Edit,
  FileText,
  Mail
} from 'lucide-react';
import { format, formatDistance, isToday, isYesterday, isTomorrow } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

// Status configurations for consistent styling
const statusConfigs = {
  pending: {
    bg: "bg-yellow-100", 
    text: "text-yellow-800", 
    border: "border-yellow-200",
    icon: <Clock className="h-4 w-4 text-yellow-600" />,
    iconLarge: <Clock className="h-6 w-6 text-yellow-600" />,
    progress: 0
  },
  preparing: {
    bg: "bg-blue-100", 
    text: "text-blue-800", 
    border: "border-blue-200",
    icon: <Package className="h-4 w-4 text-blue-600" />,
    iconLarge: <Package className="h-6 w-6 text-blue-600" />,
    progress: 33
  },
  out_for_delivery: {
    bg: "bg-purple-100", 
    text: "text-purple-800", 
    border: "border-purple-200",
    icon: <Truck className="h-4 w-4 text-purple-600" />,
    iconLarge: <Truck className="h-6 w-6 text-purple-600" />,
    progress: 66
  },
  delivered: {
    bg: "bg-green-100", 
    text: "text-green-800", 
    border: "border-green-200",
    icon: <CheckCircle className="h-4 w-4 text-green-600" />,
    iconLarge: <CheckCircle className="h-6 w-6 text-green-600" />,
    progress: 100
  },
  cancelled: {
    bg: "bg-red-100", 
    text: "text-red-800", 
    border: "border-red-200",
    icon: <X className="h-4 w-4 text-red-600" />,
    iconLarge: <X className="h-6 w-6 text-red-600" />,
    progress: 0
  }
};

// Status translations
const translateStatus = (status) => {
  const translations = {
    pending: "ລໍຖ້າ",
    preparing: "ກຳລັງກະກຽມ",
    out_for_delivery: "ອອກສົ່ງແລ້ວ",
    delivered: "ສົ່ງແລ້ວ",
    cancelled: "ຍົກເລີກ"
  };
  return translations[status] || status;
};

// Status badge component
const StatusBadge = ({ status, size = "md" }) => {
  const statusConfig = statusConfigs[status] || statusConfigs.pending;
  
  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} ${
        size === "lg" ? "px-3 py-1.5 text-sm" : "px-2 py-0.5 text-xs"
      }`}
    >
      {size === "lg" ? statusConfig.iconLarge : statusConfig.icon}
      <span>{translateStatus(status)}</span>
    </Badge>
  );
};

// Format date with contextual display
const formatDateDisplay = (dateString) => {
  if (!dateString) return "ບໍ່ມີຂໍ້ມູນ";
  
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return `ມື້ນີ້ ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `ມື້ວານນີ້ ${format(date, 'HH:mm')}`;
  } else if (isTomorrow(date)) {
    return `ມື້ອື່ນ ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'dd/MM/yyyy HH:mm');
  }
};

// TimeUpdate dialog component
const TimeUpdateDialog = ({ deliveryId, currentTime, onUpdateTime, open, setOpen }) => {
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && currentTime) {
      const date = new Date(currentTime);
      setNewTime(format(date, "yyyy-MM-dd'T'HH:mm"));
    }
  }, [open, currentTime]);

  const handleSubmit = async () => {
    if (!newTime) {
      toast({
        variant: "destructive",
        title: "ຂໍ້ຜິດພາດ",
        description: "ກະລຸນາເລືອກເວລາໃໝ່",
      });
      return;
    }

    setSubmitting(true);
    try {
      await onUpdateTime({
        timeType: "estimated_delivery_time",
        newTime: new Date(newTime),
        reason,
        notifyCustomer,
        notificationMessage: message || `ເວລາຈັດສົ່ງຂອງທ່ານໄດ້ຖືກອັບເດດເປັນ ${format(new Date(newTime), "dd/MM/yyyy HH:mm")}`,
      });
      
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດເວລາຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດອັບເດດເວລາຈັດສົ່ງໄດ້",
      });
      console.error("Error updating delivery time:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ອັບເດດເວລາຈັດສົ່ງ</DialogTitle>
          <DialogDescription>
            ປັບປ່ຽນເວລາຈັດສົ່ງສຳລັບການຈັດສົ່ງນີ້
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="new_time">ເວລາຈັດສົ່ງໃໝ່</Label>
            <Input
              id="new_time"
              type="datetime-local"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="border-gray-300"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="reason">ເຫດຜົນໃນການປ່ຽນແປງ</Label>
            <Textarea
              id="reason"
              placeholder="ເຫດຜົນທີ່ຕ້ອງປ່ຽນເວລາຈັດສົ່ງ"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px] border-gray-300"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="notify"
              checked={notifyCustomer}
              onChange={(e) => setNotifyCustomer(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="notify" className="cursor-pointer text-sm">
              ແຈ້ງເຕືອນລູກຄ້າກ່ຽວກັບການປ່ຽນແປງນີ້
            </Label>
          </div>
          
          {notifyCustomer && (
            <div className="grid gap-2">
              <Label htmlFor="message">ຂໍ້ຄວາມແຈ້ງເຕືອນ (ທາງເລືອກ)</Label>
              <Textarea
                id="message"
                placeholder="ຂໍ້ຄວາມທີ່ຈະສົ່ງໃຫ້ລູກຄ້າ"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-gray-300"
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-gray-300"
          >
            ຍົກເລີກ
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary hover:bg-primary/90"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ກຳລັງອັບເດດ...
              </>
            ) : "ອັບເດດເວລາ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Status timeline component
const StatusTimeline = ({ timeline = [] }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
        <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">
          ຍັງບໍ່ມີຂໍ້ມູນການອັບເດດສະຖານະ
        </p>
      </div>
    );
  }

  const statusIcons = {
    pending: <Clock className="h-4 w-4 text-yellow-500" />,
    confirmed: <CheckCircle className="h-4 w-4 text-blue-500" />,
    preparing: <Package className="h-4 w-4 text-blue-500" />,
    ready: <Package className="h-4 w-4 text-green-500" />,
    out_for_delivery: <Truck className="h-4 w-4 text-purple-500" />,
    delivered: <CheckCircle className="h-4 w-4 text-green-500" />,
    cancelled: <X className="h-4 w-4 text-red-500" />,
  };

  const statusLabels = {
    pending: "ລໍຖ້າ",
    confirmed: "ຢືນຢັນແລ້ວ",
    preparing: "ກຳລັງກະກຽມ",
    ready: "ພ້ອມສົ່ງ",
    out_for_delivery: "ອອກສົ່ງແລ້ວ",
    delivered: "ສົ່ງແລ້ວ",
    cancelled: "ຍົກເລີກ",
  };

  // Sort timeline by latest first
  const sortedTimeline = [...timeline].sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  return (
    <div className="relative pl-4">
      <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200" />
      {sortedTimeline.map((event, index) => (
        <div key={index} className="relative flex gap-4 pb-5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-white z-10 border ${
            event.status === 'delivered' 
              ? 'border-green-300 text-green-600'
              : event.status === 'cancelled'
              ? 'border-red-300 text-red-600'
              : 'border-primary/30 text-primary'
          }`}>
            {statusIcons[event.status] || (
              <Clock className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col pt-0.5">
            <span className="font-medium text-gray-900">
              {statusLabels[event.status] || event.status}
            </span>
            <time className="text-xs text-gray-500">
              {formatDateDisplay(event.timestamp)}
            </time>
            {event.notes && (
              <p className="mt-1 text-sm text-gray-600 bg-gray-50 p-2 rounded-md border border-gray-100">
                {event.notes}
              </p>
            )}
            {event.employee && (
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <User className="h-3 w-3 mr-1 text-gray-400" />
                ໂດຍ: {event.employee.first_name} {event.employee.last_name}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Customer contact dialog component
const CustomerContactDialog = ({ customer, open, setOpen }) => {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        variant: "destructive",
        title: "ຂໍ້ຜິດພາດ",
        description: "ກະລຸນາປ້ອນຂໍ້ຄວາມ",
      });
      return;
    }

    setSubmitting(true);
    try {
      // ຈຳລອງການສົ່ງຂໍ້ຄວາມ (ໃນຄວາມຈິງຄວນເຊື່ອມຕໍ່ກັບ API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "ສຳເລັດ",
        description: "ສົ່ງຂໍ້ຄວາມຫາລູກຄ້າສຳເລັດແລ້ວ",
      });
      
      setMessage("");
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "ຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດສົ່ງຂໍ້ຄວາມໄດ້",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>ຕິດຕໍ່ ລູກຄ້າ</DialogTitle>
          <DialogDescription>
            ສົ່ງຂໍ້ຄວາມຫາ {customer.first_name} {customer.last_name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="p-3 rounded-md bg-blue-50 border border-blue-100 text-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-500" />
              <p className="font-medium text-sm">ຂໍ້ມູນລູກຄ້າ</p>
            </div>
            <div className="space-y-1 pl-6">
              {customer.phone && (
                <p className="text-sm flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-blue-500" />
                  {customer.phone}
                </p>
              )}
              {customer.email && (
                <p className="text-sm flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-blue-500" />
                  {customer.email}
                </p>
              )}
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="message">ຂໍ້ຄວາມ</Label>
            <Textarea
              id="message"
              placeholder="ພິມຂໍ້ຄວາມທີ່ຕ້ອງການສົ່ງຫາລູກຄ້າ..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[150px] border-gray-300"
            />
          </div>
        </div>
        
        <DialogFooter className="flex-col-reverse sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-gray-300 sm:flex-1"
          >
            ຍົກເລີກ
          </Button>
          {customer.phone && (
            <Button 
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200 hover:border-green-300 sm:flex-1"
              onClick={() => window.location.href = `tel:${customer.phone}`}
            >
              <PhoneCall className="mr-2 h-4 w-4" />
              ໂທຫາລູກຄ້າ
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-primary hover:bg-primary/90 sm:flex-1"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ກຳລັງສົ່ງ...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                ສົ່ງຂໍ້ຄວາມ
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main Component
export default function DeliveryTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
  const { toast } = useToast();

  const { 
    delivery, 
    loading, 
    error, 
    updateTime,
    updateStatus,
  } = useDelivery(params.id);

  const getStatusDescription = (status) => {
    const descriptions = {
      'pending': 'ລໍຖ້າການກະກຽມ',
      'preparing': 'ກຳລັງກະກຽມສິນຄ້າສຳລັບການຈັດສົ່ງ',
      'out_for_delivery': 'ສິນຄ້າກຳລັງຖືກນຳສົ່ງໄປຫາທ່ານ',
      'delivered': 'ຈັດສົ່ງສຳເລັດແລ້ວ',
      'cancelled': 'ການຈັດສົ່ງຖືກຍົກເລີກ'
    };
    
    return descriptions[status] || '';
  };

  const handleTimeUpdate = async (timeData) => {
    try {
      await updateTime(timeData);
      return true;
    } catch (error) {
      console.error("Error updating delivery time:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນການຈັດສົ່ງ...</p>
        </div>
      </div>
    );
  }
  
  if (error || !delivery) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> ກັບຄືນ
        </Button>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>ຂໍ້ຜິດພາດ</AlertTitle>
          <AlertDescription>
            {error || "ບໍ່ພົບຂໍ້ມູນການຈັດສົ່ງ"}
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={() => router.push('/deliveries/list')}
          className="mt-6"
        >
          ກັບໄປໜ້າລາຍການຈັດສົ່ງ
        </Button>
      </div>
    );
  }

  // Calculate progress based on status
  const progressValue = statusConfigs[delivery.status]?.progress || 0;
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex items-center mb-6">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mr-4"
          size="sm"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> ກັບຄືນ
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
            <Truck className="h-6 w-6 text-primary" />
            ຕິດຕາມການຈັດສົ່ງ #{delivery.id}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            ອໍເດີ #{delivery.order?.order_id || delivery.order_id} • 
            {formatDateDisplay(delivery.created_at)}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="shadow-sm border border-gray-200">
            <CardHeader className="pb-2 border-b border-gray-100 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="flex justify-between items-center">
                  <span>ສະຖານະການຈັດສົ່ງ</span>
                </CardTitle>
                <CardDescription>
                  ອັບເດດລ່າສຸດ: {formatDateDisplay(delivery.updated_at || delivery.created_at)}
                </CardDescription>
              </div>
              <StatusBadge status={delivery.status} size="lg" />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <Progress value={progressValue} className="h-2 bg-gray-100" />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-500">ຮັບອໍເດີ</span>
                  <span className="text-xs text-gray-500">ກຳລັງກະກຽມ</span>
                  <span className="text-xs text-gray-500">ອອກຈັດສົ່ງ</span>
                  <span className="text-xs text-gray-500">ສົ່ງສຳເລັດ</span>
                </div>
              </div>
              
              <div className="text-center mb-8">
                <p className="text-lg font-medium text-gray-800">
                  {getStatusDescription(delivery.status)}
                </p>
                {delivery.status === 'out_for_delivery' && delivery.employee && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-2 rounded-full">
                    <Truck className="h-4 w-4" />
                    <span>ກຳລັງຈັດສົ່ງໂດຍ: {delivery.employee.first_name} {delivery.employee.last_name}</span>
                  </div>
                )}
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-gray-100/80 p-1 rounded-lg">
                  <TabsTrigger 
                    value="status" 
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    ເວລາ & ສະຖານະ
                  </TabsTrigger>
                  <TabsTrigger 
                    value="details"
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    ລາຍລະອຽດການຈັດສົ່ງ
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="status" className="pt-4">
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-500">ເວລາຈັດສົ່ງໂດຍປະມານ</p>
                            <p className="font-medium text-lg">
                              {delivery.estimated_delivery_time 
                                ? formatDateDisplay(delivery.estimated_delivery_time)
                                : <span className="text-gray-400 italic">ບໍ່ໄດ້ກຳນົດ</span>
                              }
                            </p>
                            {delivery.estimated_delivery_time && (
                              <p className="text-sm text-gray-500">
                                ({formatDistance(new Date(delivery.estimated_delivery_time), new Date(), { addSuffix: true })})
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <Button 
                          variant="outline"
                          className="border-primary/30 hover:border-primary text-primary hover:bg-primary/5"
                          onClick={() => setTimeDialogOpen(true)}
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          ອັບເດດເວລາ
                        </Button>
                      </div>
                    </div>
                    
                    <StatusTimeline timeline={delivery.order?.timeline} />
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="pt-4">
                  <div className="grid gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          ທີ່ຢູ່ຈັດສົ່ງ
                        </h3>
                        <div className="flex gap-2 items-start">
                          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-gray-900">{delivery.delivery_address || "ບໍ່ມີຂໍ້ມູນທີ່ຢູ່"}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-1 text-xs h-auto p-0 hover:bg-transparent text-primary hover:text-primary/80 hover:underline"
                              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(delivery.delivery_address)}`, '_blank')}
                            >
                              <MapPinned className="h-3 w-3 mr-1" /> ເບິ່ງໃນແຜນທີ່
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          ຂໍ້ມູນການຕິດຕໍ່
                        </h3>
                        {delivery.phone_number ? (
                          <div className="flex gap-2 mb-2 items-center">
                            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-900">{delivery.phone_number}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-green-600 hover:text-green-700 p-0 h-auto mt-1 hover:bg-transparent hover:underline"
                                onClick={() => window.location.href = `tel:${delivery.phone_number}`}
                              >
                                <Phone className="h-3 w-3 mr-1" /> ໂທຫາລູກຄ້າ
                              </Button>
                            </div>
                          </div>
                        ) : delivery.order?.user?.phone ? (
                          <div className="flex gap-2 mb-2 items-center">
                            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-900">{delivery.order.user.phone}</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-green-600 hover:text-green-700 p-0 h-auto mt-1 hover:bg-transparent hover:underline"
                                onClick={() => window.location.href = `tel:${delivery.order.user.phone}`}
                              >
                                <Phone className="h-3 w-3 mr-1" /> ໂທຫາລູກຄ້າ
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2 mb-2 items-center text-gray-500">
                            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            <p>ບໍ່ມີຂໍ້ມູນເບີໂທ</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {delivery.customer_note && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          ໝາຍເຫດຈາກລູກຄ້າ
                        </h3>
                        <div className="p-3 bg-gray-50 rounded-md text-gray-700 border border-gray-100">
                          <div className="flex items-start">
                            <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                            <p>{delivery.customer_note}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {delivery.employee && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">
                          ຄົນຂັບລົດສົ່ງ
                        </h3>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                          <Avatar className="border border-primary/20">
                            {delivery.employee.profile_photo ? (
                              <AvatarImage
                                src={delivery.employee.profile_photo}
                                alt={`${delivery.employee.first_name} ${delivery.employee.last_name}`}
                              />
                            ) : null}
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {delivery.employee.first_name?.charAt(0)}
                              {delivery.employee.last_name?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-medium text-gray-900">
                              {delivery.employee.first_name} {delivery.employee.last_name}
                            </p>
                            {delivery.employee.phone && (
                              <div className="flex gap-2 items-center mt-1">
                                <p className="text-sm text-gray-500">
                                  {delivery.employee.phone}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 rounded-full bg-green-50 hover:bg-green-100 text-green-600"
                                  title="ໂທຫາຄົນຂັບລົດ"
                                  onClick={() => window.location.href = `tel:${delivery.employee.phone}`}
                                >
                                  <Phone className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              className="flex-1 bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800"
              onClick={() => router.push(`/deliveries/${delivery.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              ເບິ່ງລາຍລະອຽດເຕັມ
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700"
              onClick={() => router.push(`/deliveries/${delivery.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              ແກ້ໄຂຂໍ້ມູນ
            </Button>
            {delivery.order?.user && (
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => setContactDialogOpen(true)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                ຕິດຕໍ່ລູກຄ້າ
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <Card className="mb-6 shadow-sm border border-gray-200">
            <CardHeader className="pb-2 border-b border-gray-100">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Route className="h-5 w-5 text-primary" />
                ລາຍລະອຽດຄຳສັ່ງຊື້
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {delivery.order ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="text-gray-500">ອໍເດີ #:</div>
                    <div className="font-medium text-primary">#{delivery.order.order_id}</div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="text-gray-500">ສະຖານະອໍເດີ:</div>
                    <div>
                      <Badge 
                        variant="outline" 
                        className={`bg-${delivery.order.status === 'confirmed' ? 'blue' : 
                          delivery.order.status === 'completed' ? 'green' : 
                          delivery.order.status === 'cancelled' ? 'red' : 'yellow'
                        }-100 text-${delivery.order.status === 'confirmed' ? 'blue' : 
                          delivery.order.status === 'completed' ? 'green' : 
                          delivery.order.status === 'cancelled' ? 'red' : 'yellow'
                        }-800 border-${delivery.order.status === 'confirmed' ? 'blue' : 
                          delivery.order.status === 'completed' ? 'green' : 
                          delivery.order.status === 'cancelled' ? 'red' : 'yellow'
                        }-200`}
                      >
                        {delivery.order.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="text-gray-500">ຄ່າສິນຄ້າ:</div>
                    <div className="font-medium">₭{Number(delivery.order.sub_total || 0).toLocaleString()}</div>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="text-gray-500">ຄ່າຈັດສົ່ງ:</div>
                    <div className="font-medium">₭{Number(delivery.delivery_fee || 0).toLocaleString()}</div>
                  </div>
                  
                  {delivery.order.discount_amount > 0 && (
                    <div className="flex justify-between">
                      <div className="text-gray-500">ສ່ວນຫຼຸດ:</div>
                      <div className="font-medium text-green-600">-₭{Number(delivery.order.discount_amount).toLocaleString()}</div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <div className="text-gray-800 font-medium">ລວມທັງໝົດ:</div>
                    <div className="text-xl font-bold text-primary">₭{Number(delivery.order.total_price || 0).toLocaleString()}</div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full mt-2 group"
                    onClick={() => window.open(`/orders/${delivery.order.id}`, "_blank")}
                  >
                    <FileText className="mr-2 h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                    <span className="text-gray-700 group-hover:text-gray-900">ເບິ່ງລາຍລະອຽດອໍເດີ</span>
                    <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                  <p className="text-gray-600">ບໍ່ພົບຂໍ້ມູນອໍເດີ</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {delivery.order?.user && (
            <Card className="shadow-sm border border-gray-200">
              <CardHeader className="pb-2 border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-primary" />
                  ຂໍ້ມູນລູກຄ້າ
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {delivery.order.user.first_name?.charAt(0) || ""}
                      {delivery.order.user.last_name?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-medium text-lg text-gray-900">
                      {delivery.order.user.first_name} {delivery.order.user.last_name}
                    </p>
                    {delivery.order.user.email && (
                      <p className="text-gray-500 text-sm">{delivery.order.user.email}</p>
                    )}
                  </div>
                </div>
                
                {delivery.order.user.phone && (
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{delivery.order.user.phone}</span>
                  </div>
                )}
                
                {delivery.order.user.address && (
                  <div className="flex items-start gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                    <span>{delivery.order.user.address}</span>
                  </div>
                )}
                
                <div className="flex gap-2 mt-5">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={() => router.push(`/customers/${delivery.order.user.id}`)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    ໂປຣໄຟລ໌
                  </Button>
                  
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => setContactDialogOpen(true)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    ຕິດຕໍ່
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Time Update Dialog */}
      <TimeUpdateDialog
        deliveryId={delivery.id}
        currentTime={delivery.estimated_delivery_time}
        onUpdateTime={handleTimeUpdate}
        open={timeDialogOpen}
        setOpen={setTimeDialogOpen}
      />
      
      {/* Customer Contact Dialog */}
      <CustomerContactDialog
        customer={delivery.order?.user}
        open={contactDialogOpen}
        setOpen={setContactDialogOpen}
      />
    </div>
  );
}