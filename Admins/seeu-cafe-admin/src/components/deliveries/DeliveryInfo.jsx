"use client";

import { format } from 'date-fns';
import { MapPin, Phone, Mail, Clock, Package, CheckCircle2, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const DeliveryInfo = ({ delivery }) => {
  // Format delivery times for display
  const estimatedTime = delivery.estimated_delivery_time ? new Date(delivery.estimated_delivery_time) : null;
  const actualTime = delivery.actual_delivery_time ? new Date(delivery.actual_delivery_time) : null;
  const pickupTime = delivery.pickup_from_kitchen_time ? new Date(delivery.pickup_from_kitchen_time) : null;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Address</h3>
        <div className="flex gap-2">
          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-gray-900">{delivery.delivery_address}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Contact Information</h3>
        <div className="flex gap-2 mb-2">
          <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <p className="text-gray-900">{delivery.phone_number || 'No phone number'}</p>
        </div>
        {delivery.order?.user?.email && (
          <div className="flex gap-2">
            <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <p className="text-gray-900">{delivery.order.user.email}</p>
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Times</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <div>
              <span className="text-sm text-gray-500">Estimated:</span>
              <p className="text-gray-900">
                {estimatedTime ? format(estimatedTime, 'PPp') : 'Not set'}
              </p>
            </div>
          </div>
          
          {pickupTime && (
            <div className="flex items-center">
              <Package className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <span className="text-sm text-gray-500">Picked up from kitchen:</span>
                <p className="text-gray-900">{format(pickupTime, 'PPp')}</p>
              </div>
            </div>
          )}
          
          {actualTime && (
            <div className="flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <span className="text-sm text-gray-500">Delivered:</span>
                <p className="text-gray-900">{format(actualTime, 'PPp')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Driver</h3>
        {delivery.employee ? (
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {delivery.employee.first_name?.charAt(0)}{delivery.employee.last_name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{delivery.employee.first_name} {delivery.employee.last_name}</p>
              {delivery.employee.phone && (
                <p className="text-sm text-gray-500">{delivery.employee.phone}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center text-gray-500">
            <User className="h-5 w-5 mr-2" />
            No driver assigned
          </div>
        )}
      </div>
      
      {delivery.delivery_notes && (
        <div className="md:col-span-2 mt-2">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Delivery Notes</h3>
          <div className="p-3 bg-gray-50 rounded-md text-gray-700">
            {delivery.delivery_notes}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryInfo;