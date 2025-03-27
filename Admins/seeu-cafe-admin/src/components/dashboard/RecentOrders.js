import React from 'react';
import Image from 'next/image';

const orderData = [
  { id: '01', item: 'Cappuccino', date: '27 Oct 2023, 01:05 PM', table: '28', price: '$200', payment: 'Cash' },
  { id: '02', item: 'Americano', date: '28 Oct 2023, 10:25 PM', table: '88', price: '$80', payment: 'Card' },
];

const RecentOrders = () => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow font-['Phetsarath_OT']">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">ການສັ່ງຊື້ລ່າສຸດ</h2>
        <a href="#" className="text-brown-500 text-sm">ເບີ່ງທັງໝົດ</a>
      </div>
      
      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="pb-2">ລຳດັບ</th>
              <th className="pb-2">ລາຍການສິນຄ້າ</th>
              <th className="pb-2">ວັນທີ່ & ເວລາ</th>
              <th className="pb-2">ໝາຍເລກໂຕະ</th>
              <th className="pb-2">ລາຄາ</th>
              <th className="pb-2">ການຊຳລະ</th>
              <th className="pb-2">ການຈັດການ</th>
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
                <td className="py-2">
                  <button className="text-blue-500 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {orderData.map((order, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Image src={`/coffee-${index + 1}.jpg`} alt={order.item} width={40} height={40} className="rounded-full mr-2" />
                <div>
                  <p className="font-semibold">{order.item}</p>
                  <p className="text-sm text-gray-500">{order.date}</p>
                </div>
              </div>
              <p className="text-lg font-bold">{order.price}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="font-semibold">Table:</span> {order.table}</p>
              <p><span className="font-semibold">Payment:</span> {order.payment}</p>
              <p><span className="font-semibold">Order ID:</span> {order.id}</p>
              <button className="text-blue-500 hover:underline justify-self-end">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;