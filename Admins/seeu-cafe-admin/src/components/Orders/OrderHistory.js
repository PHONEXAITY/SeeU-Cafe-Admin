'use client'
import React, { useState } from 'react';
import { FaSearch, FaFilter, FaEye, FaChevronLeft, FaChevronRight, FaDownload } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';

const orderStatuses = ['All', 'Completed', 'Cancelled', 'Refunded'];

const mockOrderHistory = [
  { id: '001', customer: 'John Doe', date: '2023-10-28', total: '$56.00', status: 'Completed' },
  { id: '002', customer: 'Jane Smith', date: '2023-10-27', total: '$128.50', status: 'Completed' },
  { id: '003', customer: 'Bob Johnson', date: '2023-10-26', total: '$37.25', status: 'Cancelled' },
  { id: '004', customer: 'Alice Brown', date: '2023-10-25', total: '$92.00', status: 'Completed' },
  { id: '005', customer: 'Charlie Wilson', date: '2023-10-24', total: '$15.75', status: 'Refunded' },
];

const ViewOrderDialog = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const handleExportPDF = () => {
    console.log('Exporting order:', order.id);
    toast.success('ດາວໂຫລດໃບບິນສຳເລັດ');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ລາຍລະອຽດການສັ່ງຊື້ #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>ລູກຄ້າ</Label>
            <p className="text-gray-700">{order.customer}</p>
          </div>
          <div>
            <Label>ວັນທີ</Label>
            <p className="text-gray-700">{order.date}</p>
          </div>
          <div>
            <Label>ສະຖານະ</Label>
            <p className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold
              ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}>
              {order.status}
            </p>
          </div>
          <div>
            <Label>ຍອດລວມ</Label>
            <p className="text-gray-700 font-bold">{order.total}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleExportPDF}>
            <FaDownload className="w-4 h-4 mr-2" />
            ດາວໂຫລດໃບບິນ
          </Button>
          <Button onClick={onClose}>ປິດ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const OrderHistory = () => {
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const ordersPerPage = 5;

  const filteredOrders = mockOrderHistory.filter(order => 
    (selectedStatus === 'All' || order.status === selectedStatus) &&
    (order.id.includes(searchTerm) || order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!startDate || order.date >= startDate) &&
    (!endDate || order.date <= endDate)
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDialog(true);
  };

  const handleExport = () => {
    console.log('Exporting data...');
    toast.success('ດາວໂຫລດຂໍ້ມູນສຳເລັດ');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 font-['Phetsarath_OT']">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">ປະຫວັດການສັ່ງຊື້</h1>
        <Button onClick={handleExport}>
          <FaDownload className="w-4 h-4 mr-2" />
          ດາວໂຫລດຂໍ້ມູນ
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            {orderStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="ຄົ້ນຫາປະຫວັດການສັ່ງຊື້"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table and Mobile View remain the same, but update button to use shadcn/ui Button */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          {/* ... header remains the same ... */}
  <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ລະຫັດການສັ່ງຊື້</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ລູກຄ້າ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ວັນທີ່</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ຍອດລວມ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ສະຖານະ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ການຈັດການ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                 <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                <td className="px-6 py-4 whitespace-nowrap">{order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewOrder(order)}
                  >
                    <FaEye className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination using shadcn/ui Button */}
      <div className="mt-4 flex justify-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft className="w-4 h-4" />
        </Button>
        
        {[...Array(Math.ceil(filteredOrders.length / ordersPerPage))].map((_, index) => (
          <Button
            key={index + 1}
            variant={currentPage === index + 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
        >
          <FaChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <ViewOrderDialog 
        isOpen={showOrderDialog}
        onClose={() => setShowOrderDialog(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderHistory;