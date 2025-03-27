'use client'
import React, { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPrint, FaTruckLoading } from 'react-icons/fa';
import { OrderModal } from './OrderModal';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ShippingOrders = () => {
  const [modalState, setModalState] = useState({ 
    isOpen: false, 
    mode: null, 
    order: null 
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data
  const orders = [
    {
      id: "SHP001",
      orderNumber: "ORD-2024-001",
      customer: "John Doe",
      address: "123 Main St, City, Country",
      carrier: "DHL",
      status: "Pending",
      createdAt: "2024-02-20",
      items: [
        { name: "Espresso Machine", quantity: 1 },
        { name: "Coffee Beans", quantity: 2 }
      ]
    },
  ];

  const handleCreateOrder = (orderData) => {
    console.log('Creating order:', orderData);
    // Add API call here
  };

  const handleUpdateOrder = (orderId, orderData) => {
    console.log('Updating order:', orderId, orderData);
    // Add API call here
  };

  const handlePrintLabel = (orderId) => {
    console.log('Printing label for order:', orderId);
    // Add API call here
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    console.log('Updating status:', orderId, newStatus);
    // Add API call here
  };

  const filteredOrders = orders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-lg shadow-lg bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">ຈັດສົ່ງ Order</h2>
          <p className="text-sm text-gray-500 mt-1">   ຈັດການແລະຕິດຕາມການສັ່ງຊື້ຈັດສົ່ງທັງໝົດ</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search orders..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <Button 
            onClick={() => setModalState({ 
              isOpen: true, 
              mode: 'create', 
              order: null 
            })}
          >
            Create Order
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ລະຫັດການສັ່ງຊື້</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ລູກຄ້າ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ຜູ້ໃຫ້ບໍລິການ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ສະຖານະ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-medium">{order.id}</span>
                  <div className="text-sm text-gray-500">{order.orderNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{order.customer}</div>
                  <div className="text-sm text-gray-500">{order.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.carrier}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{order.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setModalState({
                        isOpen: true,
                        mode: 'edit',
                        order: order
                      })}
                    >
                      <FaEdit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePrintLabel(order.id)}
                    >
                      <FaPrint className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUpdateStatus(order.id, 'Processing')}
                    >
                      <FaTruckLoading className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, mode: null, order: null })}
        mode={modalState.mode}
        order={modalState.order}
      />
    </div>
  );
};

export default ShippingOrders;