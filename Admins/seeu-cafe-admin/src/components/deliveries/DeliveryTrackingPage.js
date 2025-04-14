"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDelivery } from '@/hooks/useDelivery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import  StatusTimeline  from '@/components/deliveries/StatusTimeline';
import TimeUpdateDialog from '@/components/deliveries/TimeUpdateDialog'
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  Truck, 
  MapPin, 
  Phone, 
  Clock, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

export default function DeliveryTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { delivery, loading, error } = useDelivery(params.id);
  const [progress, setProgress] = useState(0);
  
  // คำนวณความคืบหน้าตามสถานะ
  useEffect(() => {
    if (!delivery) return;
    
    const statusMap = {
      'pending': 0,
      'preparing': 33,
      'out_for_delivery': 66,
      'delivered': 100,
      'cancelled': 0
    };
    
    setProgress(statusMap[delivery.status] || 0);
  }, [delivery]);
  
  // แปลงสถานะเป็นข้อความอธิบาย
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
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
              <h2 className="mt-4 text-xl font-semibold text-red-700">
                {error || "ບໍ່ພົບຂໍ້ມູນການຈັດສົ່ງ"}
              </h2>
              <Button 
                onClick={() => router.push('/deliveries')}
                className="mt-6"
              >
                ກັບໄປໜ້າລາຍການຈັດສົ່ງ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
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
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Truck className="h-6 w-6 text-primary" />
          ຕິດຕາມການຈັດສົ່ງ #{delivery.id}
        </h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>ສະຖານະການຈັດສົ່ງ</div>
            <StatusTimeline status={delivery.status} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2 mb-4" />
          
          <div className="text-center mt-4 mb-8">
            <p className="text-lg font-medium">
              {getStatusDescription(delivery.status)}
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">ທີ່ຢູ່ຈັດສົ່ງ</p>
                <p className="font-medium">{delivery.delivery_address}</p>
              </div>
            </div>
            
            {delivery.estimated_delivery_time && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">ເວລາຈັດສົ່ງໂດຍປະມານ</p>
                  <p className="font-medium">
                    {new Date(delivery.estimated_delivery_time).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            
            {delivery.employee && (
              <div className="flex items-start gap-3">
                <Truck className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">ຄົນສົ່ງ</p>
                  <p className="font-medium">
                    {delivery.employee.first_name} {delivery.employee.last_name}
                  </p>
                  {delivery.employee.phone && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-1" />
                      {delivery.employee.phone}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>ໄທມ໌ໄລນ໌ການຈັດສົ່ງ</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeUpdateDialog timeline={delivery.order?.timeline} />
        </CardContent>
      </Card>
    </div>
  );
}