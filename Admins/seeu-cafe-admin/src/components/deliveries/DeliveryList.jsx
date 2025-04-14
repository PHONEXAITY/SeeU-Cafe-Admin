"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistance } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, MapPin, User, Calendar } from 'lucide-react';

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

const DeliveryList = ({ deliveries, loading, error, refetch }) => {
  const router = useRouter();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Est. Delivery</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && deliveries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                <p className="mt-2 text-sm text-gray-500">Loading deliveries...</p>
              </TableCell>
            </TableRow>
          ) : deliveries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <p className="text-gray-500">No deliveries found</p>
                <Button 
                  variant="link" 
                  onClick={() => router.push('/deliveries/create')}
                  className="mt-2"
                >
                  Create a new delivery
                </Button>
              </TableCell>
            </TableRow>
          ) : (
            deliveries.map((delivery) => (
              <TableRow key={delivery.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">#{delivery.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{delivery.order?.user?.first_name} {delivery.order?.user?.last_name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="truncate max-w-[200px]">{delivery.delivery_address}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {delivery.employee ? (
                    `${delivery.employee.first_name} ${delivery.employee.last_name}`
                  ) : (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>
                      {delivery.estimated_delivery_time 
                        ? formatDistance(new Date(delivery.estimated_delivery_time), new Date(), { addSuffix: true })
                        : 'Not set'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={`${statusColors[delivery.status] || 'bg-gray-100 text-gray-800'}`}
                  >
                    {statusLabels[delivery.status] || delivery.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/deliveries/${delivery.id}`)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/deliveries/${delivery.id}/edit`)}
                    >
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryList;