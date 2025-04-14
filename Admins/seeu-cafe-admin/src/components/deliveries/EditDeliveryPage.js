"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import  DeliveryForm  from '@/components/deliveries/DeliveryForm';
import { useDelivery, useUpdateDelivery } from '@/hooks/useDelivery';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Truck, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { employeeService } from '@/services/api';

export default function EditDeliveryPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const { delivery, loading: loadingDelivery, error: fetchError } = useDelivery(params.id);
  const { updateDelivery, loading: updating, error: updateError } = useUpdateDelivery();
  
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [employeeError, setEmployeeError] = useState(null);
  
  // Fetch delivery drivers
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoadingEmployees(true);
        const response = await employeeService.getAllEmployees({ position: 'delivery_driver', status: 'active' });
        setEmployees(response.data);
        setEmployeeError(null);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setEmployeeError('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຄົນຂັບລົດສົ່ງໄດ້');
      } finally {
        setLoadingEmployees(false);
      }
    };
    
    fetchEmployees();
  }, []);
  
  const handleSubmit = async (formData) => {
    try {
      const submissionData = {
        ...formData,
        employee_id: formData.employee_id ? parseInt(formData.employee_id, 10) : null,
      };
      
      await updateDelivery(params.id, submissionData);
      
      toast({
        title: "ສຳເລັດ",
        description: "ອັບເດດຂໍ້ມູນການຈັດສົ່ງສຳເລັດແລ້ວ",
      });
      
      router.push(`/deliveries/${params.id}`);
      return true;
    } catch (err) {
      console.error('Error updating delivery:', err);
      return false;
    }
  };
  
  if (loadingDelivery) {
    return (
      <div className="container mx-auto px-4 py-10 flex justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-lg text-gray-600">ກຳລັງໂຫຼດຂໍ້ມູນການຈັດສົ່ງ...</p>
        </div>
      </div>
    );
  }
  
  if (fetchError || !delivery) {
    return (
      <div className="container mx-auto px-4 py-10">
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> ກັບຄືນ
        </Button>
        
        <div className="p-8 border border-red-200 rounded-lg bg-red-50">
          <div className="text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-red-700">ຂໍ້ຜິດພາດ</h2>
            <p className="mt-2 text-gray-600">{fetchError || "ບໍ່ພົບຂໍ້ມູນການຈັດສົ່ງ"}</p>
            <Button 
              onClick={() => router.push('/deliveries')}
              className="mt-6"
            >
              ກັບໄປໜ້າລາຍການຈັດສົ່ງ
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Format delivery time for the form
  const formattedDelivery = {
    ...delivery,
    employee_id: delivery.employee_id?.toString() || '',
    estimated_delivery_time: delivery.estimated_delivery_time 
      ? new Date(delivery.estimated_delivery_time).toISOString().slice(0, 16) 
      : '',
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
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
          ແກ້ໄຂການຈັດສົ່ງ #{delivery.id}
        </h1>
      </div>
      
      <DeliveryForm 
        isEditing={true}
        initialData={formattedDelivery}
        orderId={delivery.order_id}
        deliveryId={delivery.id}
        employeeOptions={employees}
        loadingEmployees={loadingEmployees}
        employeeError={employeeError}
        onSubmit={handleSubmit}
        isSubmitting={updating}
      />
      
      {updateError && (
        <div className="mt-6 p-4 border border-red-200 rounded-md bg-red-50">
          <div className="flex gap-2 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{updateError}</p>
          </div>
        </div>
      )}
    </div>
  );
}