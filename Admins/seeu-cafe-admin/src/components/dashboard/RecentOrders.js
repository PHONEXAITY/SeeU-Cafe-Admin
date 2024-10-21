// components/dashboard/RecentOrders.js
import React from 'react';
import Image from 'next/image';

const orderData = [
  { id: '01', item: 'Cappuccino', date: '27 Oct 2023, 01:05 PM', table: '28', price: '$200', payment: 'Cash' },
  { id: '01', item: 'Americano', date: '28 Oct 2023, 10:25 PM', table: '88', price: '$80', payment: 'Card' },
];

const RecentOrders = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Order</h2>
        <a href="#" className="text-brown-500 text-sm">See all</a>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="pb-2">#</th>
            <th className="pb-2">Items</th>
            <th className="pb-2">Date & Time</th>
            <th className="pb-2">Table Number</th>
            <th className="pb-2">Price</th>
            <th className="pb-2">Payment</th>
            <th className="pb-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {orderData.map((order, index) => (
            <tr key={index} className="border-t">
              <td className="py-2">{order.id}</td>
              <td className="py-2 flex items-center">
                <Image src={`/coffee-${index + 1}.jpg`} alt={order.item} width={30} height={30} className="rounded-full mr-2" />
                {order.item}
              </td>
              <td className="py-2">{order.date}</td>
              <td className="py-2">{order.table}</td>
              <td className="py-2">{order.price}</td>
              <td className="py-2">{order.payment}</td>
              <td className="py-2">...</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;