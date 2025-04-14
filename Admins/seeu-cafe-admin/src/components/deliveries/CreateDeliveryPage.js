// src/pages/deliveries/create.jsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateDelivery } from '@/hooks/useDelivery';
import {
  useOrders,
  useUpdateOrderStatus,
  useDeleteOrder,
  orderStatusOptions,
  formatCurrency,
} from "@/hooks/orderHooks";
import { orderService, employeeService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Truck, AlertCircle, ShoppingBag, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import  DeliveryForm  from '@/components/deliveries/DeliveryForm';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

function CreateDeliveryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { createDelivery, loading, error } = useCreateDelivery();
  const didFetchRef = useRef(false);

  const [formData, setFormData] = useState({
    order_id: '',
    employee_id: '',
    delivery_address: '',
    customer_note: '',
    status: 'pending',
    estimated_delivery_time: '',
    delivery_fee: '',
  });

  const [pendingOrders, setPendingOrders] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [employeeError, setEmployeeError] = useState(null);

  useEffect(() => {
    if (didFetchRef.current) return;
    didFetchRef.current = true;

    fetchPendingOrders();
    fetchEmployees();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await orderService.getAllOrders({
        status: 'confirmed',
        order_type: 'delivery',
      });

      const ordersWithoutDelivery = response.data.filter(order => !order.delivery);
      setPendingOrders(ordersWithoutDelivery);
      setOrderError(null);
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setOrderError('ບໍ່ສາມາດໂຫຼດອໍເດີທີ່ມີໄດ້');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await employeeService.getAllEmployees({
        position: 'delivery_driver',
        status: 'active',
      });
      setEmployees(response.data);
      setEmployeeError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setEmployeeError('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນຄົນຂັບລົດສົ່ງໄດ້');
    } finally {
      setLoadingEmployees(false);
    }
  };

  const handleOrderChange = async (orderId) => {
    try {
      if (!orderId) return;

      const selectedOrder = pendingOrders.find(o => o.id.toString() === orderId);

      if (selectedOrder) {
        setFormData(prev => ({
          ...prev,
          order_id: orderId,
          delivery_address: selectedOrder.delivery_address || '',
          customer_note: selectedOrder.customer_note || '',
          phone_number: selectedOrder.phone_number || (selectedOrder.user?.phone) || '',
          delivery_fee: selectedOrder.delivery_fee || '0',
        }));
      } else {
        const response = await orderService.getOrderById(orderId);
        const order = response.data;

        setFormData(prev => ({
          ...prev,
          order_id: orderId,
          delivery_address: order.delivery_address || '',
          customer_note: order.customer_note || '',
          phone_number: order.phone_number || (order.user?.phone) || '',
          delivery_fee: order.delivery_fee || '0',
        }));
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      toast({
        title: "ຂໍ້ຜິດພາດ",
        description: "ບໍ່ສາມາດໂຫຼດລາຍລະອຽດອໍເດີໄດ້",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const submissionData = {
        order_id: parseInt(formData.order_id, 10),
        employee_id: formData.employee_id ? parseInt(formData.employee_id, 10) : undefined,
        delivery_address: formData.delivery_address,
        customer_note: formData.customer_note,
        status: formData.status,
        delivery_fee: formData.delivery_fee ? parseFloat(formData.delivery_fee) : undefined,
      };

      if (formData.estimated_delivery_time) {
        submissionData.estimated_delivery_time = new Date(formData.estimated_delivery_time);
      }

      const result = await createDelivery(submissionData);

      toast({
        title: "ສຳເລັດ",
        description: "ສ້າງລາຍການຈັດສົ່ງສຳເລັດແລ້ວ",
      });

      router.push(`/deliveries/${result.id}`);
      return true;
    } catch (err) {
      console.error('Error creating delivery:', err);
      return false;
    }
  };

  const handleRefresh = () => {
    fetchPendingOrders();
    fetchEmployees();
    toast({
      title: "ກຳລັງໂຫຼດຂໍ້ມູນ",
      description: "ກຳລັງໂຫຼດຂໍ້ມູນໃໝ່...",
    });
  };

  return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
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
              ສ້າງການຈັດສົ່ງໃໝ່
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-4 w-4" /> ໂຫຼດຄືນໃໝ່
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/orders?status=confirmed&type=delivery')}
              className="flex items-center gap-1"
            >
              <ShoppingBag className="h-4 w-4" /> ເບິ່ງອໍເດີທັງໝົດ
            </Button>
          </div>
        </div>

        {loadingOrders && loadingEmployees ? (
          <div className="space-y-6">
            <Card className="p-8">
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
                <Skeleton className="h-48" />
              </div>
            </Card>
          </div>
        ) : (
          <>
            <DeliveryForm
              isEditing={false}
              initialData={formData}
              orderOptions={pendingOrders}
              employeeOptions={employees}
              loadingOrders={loadingOrders}
              loadingEmployees={loadingEmployees}
              orderError={orderError}
              employeeError={employeeError}
              onSubmit={handleSubmit}
              onOrderChange={handleOrderChange}
              isSubmitting={loading}
            />

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>ຂໍ້ຜິດພາດ</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </>
        )}
      </div>
  );
}

export default CreateDeliveryPage;