"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDelivery } from '@/hooks/useDelivery';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Loader2, Edit, AlertCircle } from 'lucide-react';
import DeliveryInfo from './DeliveryInfo';
import OrderDetails from './OrderDetails';
import StatusTimeline from './StatusTimeline';
import CustomerInfo from './CustomerInfo';
import StatusUpdateDialog from './StatusUpdateDialog';
import TimeUpdateDialog from './TimeUpdateDialog';

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  out_for_delivery: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusLabels = {
  pending: "Pending",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const DeliveryDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [timeDialogOpen, setTimeDialogOpen] = useState(false);

  const { delivery, loading, error, updateStatus, updateTime } = useDelivery(params.id);
  
  if (loading) {
    return (
        <div className="container mx-auto px-4 py-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-lg text-gray-600">Loading delivery details...</p>
          </div>
        </div>

    );
  }
  
  if (error) {
    return (
        <div className="container mx-auto px-4 py-10">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                <h2 className="mt-4 text-xl font-semibold text-red-700">Error Loading Delivery</h2>
                <p className="mt-2 text-gray-600">{error}</p>
                <Button 
                  onClick={() => router.push('/deliveries')}
                  className="mt-6"
                >
                  Return to Deliveries
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

    );
  }
  
  if (!delivery) {
    return (
        <div className="container mx-auto px-4 py-10">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <AlertCircle className="h-10 w-10 text-amber-500 mx-auto" />
                <h2 className="mt-4 text-xl font-semibold">Delivery Not Found</h2>
                <p className="mt-2 text-gray-600">The delivery you're looking for doesn't exist or has been removed.</p>
                <Button 
                  onClick={() => router.push('/deliveries')}
                  className="mt-6"
                >
                  Return to Deliveries
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
    );
  }
  
  return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="mr-4"
              size="sm"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back
            </Button>
            <h1 className="text-2xl font-bold">
              Delivery #{delivery.id}
            </h1>
            <Badge 
              variant="outline" 
              className={`ml-3 ${statusColors[delivery.status] || 'bg-gray-100'}`}
            >
              {statusLabels[delivery.status] || delivery.status}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <StatusUpdateDialog 
              deliveryId={delivery.id}
              currentStatus={delivery.status}
              onUpdateStatus={updateStatus}
              open={statusDialogOpen}
              setOpen={setStatusDialogOpen}
            />
            
            <TimeUpdateDialog 
              deliveryId={delivery.id}
              onUpdateTime={updateTime}
              open={timeDialogOpen}
              setOpen={setTimeDialogOpen}
            />
            
            <Button 
              variant="outline" 
              onClick={() => router.push(`/deliveries/${delivery.id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <DeliveryInfo delivery={delivery} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Order Details</CardTitle>
                {delivery.order && (
                  <CardDescription>
                    Order #{delivery.order.order_id} • 
                    {delivery.order.create_at && 
                      new Date(delivery.order.create_at).toLocaleString()}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <OrderDetails order={delivery.order} />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Delivery Status</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusTimeline timeline={delivery.order?.timeline} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CustomerInfo user={delivery.order?.user} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default DeliveryDetailPage;