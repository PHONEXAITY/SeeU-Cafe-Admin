"use client";

import { format } from 'date-fns';
import { Clock, Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

const statusIcons = {
  pending: <Clock className="h-4 w-4" />,
  preparing: <Package className="h-4 w-4" />,
  out_for_delivery: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <AlertCircle className="h-4 w-4" />,
};

const statusLabels = {
  pending: "Pending",
  preparing: "Preparing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const StatusTimeline = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return <p className="text-gray-500">No status updates available</p>;
  }
  
  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200" />
      {timeline.map((event, index) => (
        <div key={index} className="relative flex gap-4 pb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white z-10 border border-primary">
            {statusIcons[event.status] || <Clock className="h-4 w-4" />}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-900">
              {statusLabels[event.status] || event.status}
            </span>
            <time className="text-xs text-gray-500">
              {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')}
            </time>
            {event.notes && (
              <p className="mt-1 text-sm text-gray-600">{event.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;