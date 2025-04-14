"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeliveries } from '@/hooks/useDelivery';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, Truck } from 'lucide-react';
import DeliveryList from './DeliveryList';
import DeliveryFilters from './DeliveryFilters';

const DeliveriesPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  
  const { deliveries, loading, error, updateFilters, refetch } = useDeliveries({
    status: statusFilter,
    employeeId: employeeFilter,
  });

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    updateFilters({ status: value });
  };

  const handleEmployeeChange = (value) => {
    setEmployeeFilter(value);
    updateFilters({ employeeId: value });
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Delivery list has been refreshed",
    });
  };
  
  const handleSearch = (query) => {
    // Implement search functionality based on your backend capabilities
    updateFilters({ search: query });
  };

  return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Truck className="h-7 w-7 text-primary" />
              Deliveries Management
            </h1>
            <p className="text-gray-500 mt-1">Manage and track all delivery orders</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Button 
              onClick={() => router.push('/deliveries/create')}
              className="bg-primary hover:bg-primary-dark transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" /> Create Delivery
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryFilters 
              statusFilter={statusFilter}
              employeeFilter={employeeFilter}
              setStatusFilter={handleStatusChange}
              setEmployeeFilter={handleEmployeeChange}
              handleRefresh={handleRefresh}
              onSearch={handleSearch}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center justify-between">
              <span>Delivery Orders</span>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeliveryList 
              deliveries={deliveries} 
              loading={loading} 
              error={error} 
              refetch={refetch} 
            />
          </CardContent>
        </Card>
      </div>
  );
};

export default DeliveriesPage;