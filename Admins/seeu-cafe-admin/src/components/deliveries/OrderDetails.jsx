"use client";

import { format } from 'date-fns';

const OrderDetails = ({ order }) => {
  if (!order) {
    return <p className="text-gray-500">Order information not available</p>;
  }
  
  return (
    <>
      {order.order_details && order.order_details.length > 0 ? (
        <div className="divide-y">
          {order.order_details.map((item) => (
            <div key={item.id} className="py-3 flex justify-between">
              <div>
                <p className="font-medium">
                  {item.quantity} × {item.food_menu?.name || item.beverage_menu?.name || 'Unknown Item'}
                </p>
                {item.notes && <p className="text-sm text-gray-500 mt-1">{item.notes}</p>}
              </div>
              <p className="font-medium">${item.price?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No items in this order</p>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between py-1">
          <p className="text-gray-600">Subtotal</p>
          <p className="font-medium">${order.sub_total?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="flex justify-between py-1">
          <p className="text-gray-600">Delivery Fee</p>
          <p className="font-medium">${order.delivery_fee?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="flex justify-between py-1">
          <p className="text-gray-600">Tax</p>
          <p className="font-medium">${order.tax?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="flex justify-between py-2 text-lg font-bold">
          <p>Total</p>
          <p>${order.total_price?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
    </>
  );
};

export default OrderDetails;