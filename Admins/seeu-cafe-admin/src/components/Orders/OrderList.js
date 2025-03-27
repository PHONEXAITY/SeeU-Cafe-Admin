'use client'
import React, { useState, useEffect } from 'react';
import { Coffee, Search, Filter, Eye, Edit, Trash2, Clock, Package, Check, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { Card, CardContent } from '@/components/ui/card';

// ค่าคงที่
const orderStatuses = ['All', 'Pending', 'Processing', 'Ready', 'Delivered', 'Cancelled'];

// ข้อมูลตัวอย่าง
const mockOrders = [
  { 
    id: '001', 
    customer: 'John Doe', 
    date: '2023-10-28', 
    time: '10:30',
    items: [
      { name: 'Latte', quantity: 2, price: '$4.50' },
      { name: 'Croissant', quantity: 1, price: '$3.50' }
    ],
    total: '$12.50', 
    status: 'Pending' 
  },
  { 
    id: '002', 
    customer: 'Jane Smith', 
    date: '2023-10-28', 
    time: '11:15',
    items: [
      { name: 'Cappuccino', quantity: 1, price: '$4.00' },
      { name: 'Sandwich', quantity: 1, price: '$6.50' }
    ],
    total: '$10.50', 
    status: 'Processing' 
  },
  { 
    id: '003', 
    customer: 'Bob Wilson', 
    date: '2023-10-28', 
    time: '12:00',
    items: [
      { name: 'Espresso', quantity: 2, price: '$3.00' },
      { name: 'Cake', quantity: 1, price: '$5.50' }
    ],
    total: '$11.50', 
    status: 'Ready' 
  }
];

// Component สำหรับแสดงเวลา
const TimeDisplay = () => {
  const [time, setTime] = useState(() => 
    new Date().toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit', hour12: false })
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit', hour12: false }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return <span>{time}</span>;
};

// Component สำหรับแสดงสถานะ
const StatusBadge = ({ status }) => {
  const statusConfig = {
    Pending: {
      icon: Clock,
      styles: 'bg-amber-100 text-amber-800 border-amber-200',
      label: 'ລໍຖ້າ'
    },
    Processing: {
      icon: Coffee,
      styles: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'ກຳລັງຊົງ'
    },
    Ready: {
      icon: Package,
      styles: 'bg-green-100 text-green-800 border-green-200',
      label: 'ພ້ອມສົ່ງ'
    },
    Delivered: {
      icon: Check,
      styles: 'bg-purple-100 text-purple-800 border-purple-200',
      label: 'ສົ່ງແລ້ວ'
    },
    Cancelled: {
      icon: X,
      styles: 'bg-red-100 text-red-800 border-red-200',
      label: 'ຍົກເລີກ'
    }
  };

  const config = statusConfig[status] || {
    icon: Coffee,
    styles: 'bg-gray-100 text-gray-800 border-gray-200',
    label: status || 'Unknown'
  };
  
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.styles}`}>
      <Icon className="w-4 h-4 mr-1" />
      {config.label}
    </span>
  );
};

// Main OrderList Component
const OrderList = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogState, setDialogState] = useState({
    view: { isOpen: false, order: null },
    edit: { isOpen: false, order: null },
    delete: { isOpen: false, orderId: null }
  });

  // กรองรายการ orders
  const filteredOrders = orders.filter(order => 
    (selectedStatus === 'All' || order.status === selectedStatus) &&
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     order.customer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // จัดการการกดปุ่มต่างๆ
  const handleAction = (type, order) => {
    setDialogState({
      ...dialogState,
      [type]: {
        isOpen: true,
        order: order,
        orderId: order?.id
      }
    });
  };

  // ปิด dialog
  const closeDialog = (type) => {
    setDialogState(prev => ({
      ...prev,
      [type]: {
        isOpen: false,
        order: null,
        orderId: null
      }
    }));
  };

  // อัพเดทสถานะ order
  const updateOrderStatus = (orderId, newStatus, note) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId
          ? { ...order, status: newStatus, note: note }
          : order
      )
    );
  };

  // ลบ order
  const deleteOrder = (orderId) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  // โหลดข้อมูลใหม่
  const refreshOrders = () => {
    toast({
      title: "ກຳລັງໂຫຼດ",
      description: "ກຳລັງດຶງຂໍ້ມູນໃໝ່...",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-['Phetsarath_OT']">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Coffee className="w-6 h-6 text-amber-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">ລາຍການສັ່ງຊື້</h1>
              </div>
              <Button
                size="sm"
                className="bg-amber-600 hover:bg-amber-700"
                onClick={refreshOrders}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                ໂຫຼດຄືນໃໝ່
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-amber-50 rounded-lg">
                <div className="text-amber-600 font-medium">ລໍຖ້າ</div>
                <div className="text-2xl font-bold mt-1">
                  {orders.filter(o => o.status === 'Pending').length}
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 font-medium">ກຳລັງຈັດສົ່ງ</div>
                <div className="text-2xl font-bold mt-1">
                  {orders.filter(o => o.status === 'Processing').length}
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 font-medium">ພ້ອມສົ່ງ</div>
                <div className="text-2xl font-bold mt-1">
                  {orders.filter(o => o.status === 'Ready').length}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-purple-600 font-medium">ສົ່ງແລ້ວ</div>
                <div className="text-2xl font-bold mt-1">
                  {orders.filter(o => o.status === 'Delivered').length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  className="w-full"
                >
                  {orderStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'All' ? 'ທັງໝົດ' : 
                       status === 'Pending' ? 'ລໍຖ້າ' :
                       status === 'Processing' ? 'ກຳລັງຈັດສົ່ງ' :
                       status === 'Ready' ? 'ພ້ອມສົ່ງ' :
                       status === 'Delivered' ? 'ສົ່ງແລ້ວ' : 'ຍົກເລີກ'}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="ຄົ້ນຫາດ້ວຍ ID ຫຼື ຊື່ລູກຄ້າ"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden md:block">
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ລະຫັດ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ລູກຄ້າ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ເວລາ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ຈຳນວນ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ຍອດລວມ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ສະຖານະ
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ຈັດການ
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="font-medium">#{order.id}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>{order.time}</div>
                                <div className="text-sm text-gray-500">{order.date}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {order.items.length} ລາຍການ{order.items.length} ລາຍການ
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-medium">
                                {order.total}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <StatusBadge status={order.status} />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex justify-center space-x-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="hover:bg-amber-50"
                                    onClick={() => handleAction('view', order)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="hover:bg-blue-50"
                                    onClick={() => handleAction('edit', order)}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="hover:bg-red-50 text-red-600"
                                    onClick={() => handleAction('delete', order)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Mobile View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredOrders.map(order => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Coffee className="w-4 h-4 text-amber-600" />
                          <span className="font-semibold">#{order.id}</span>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ລູກຄ້າ:</span>
                          <span className="font-medium">{order.customer}</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">ເວລາ:</span>
                          <div className="text-right">
                            <div className="font-medium">{order.time}</div>
                            <div className="text-sm text-gray-500">{order.date}</div>
                          </div>
                        </div>

                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">ລາຍການ:</span>
                            <span className="text-sm font-medium">{order.items.length} ລາຍການ</span>
                          </div>
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm pl-4">
                              <span>{item.quantity}x {item.name}</span>
                              <span>{item.price}</span>
                            </div>
                          ))}
                        </div>

                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">ລວມ:</span>
                            <span className="text-lg font-bold">{order.total}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-3 border-t mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-amber-50"
                          onClick={() => handleAction('view', order)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          <span>ເບິ່ງ</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-blue-50"
                          onClick={() => handleAction('edit', order)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          <span>ແກ້ໄຂ</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="hover:bg-red-50 text-red-600"
                          onClick={() => handleAction('delete', order)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          <span>ລຶບ</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                    <Coffee className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">ບໍ່ພົບຂໍ້ມູນ</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    ບໍ່ພົບຂໍ້ມູນການສັ່ງຊື້ທີ່ກົງກັບເງື່ອນໄຂການຄົ້ນຫາ
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Footer */}
          <Card>
            <CardContent className="py-3">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                  ສະແດງ {filteredOrders.length} ຈາກທັງໝົດ {orders.length} ລາຍການ
                </span>
                <span>
                  ອັບເດດຄັ້ງສຸດທ້າຍ: <TimeDisplay />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dialogs */}
        <Dialog open={dialogState.view.isOpen} onOpenChange={() => closeDialog('view')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Coffee className="w-5 h-5 text-amber-600" />
                <span>ລາຍລະອຽດການສັ່ງຊື້ #{dialogState.view.order?.id}</span>
              </DialogTitle>
            </DialogHeader>
            {dialogState.view.order && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label className="text-sm text-gray-500">ລູກຄ້າ</Label>
                      <p className="text-lg font-medium">{dialogState.view.order.customer}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-500">ວັນທີ</Label>
                        <p className="font-medium">{dialogState.view.order.date}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">ເວລາ</Label>
                        <p className="font-medium">{dialogState.view.order.time}</p>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 space-y-2">
                      <Label className="text-sm text-gray-500">ລາຍການອາຫານ</Label>
                      {dialogState.view.order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{item.quantity}x</span>
                            <span>{item.name}</span>
                          </div>
                          <span className="font-medium">{item.price}</span>
                        </div>
                      ))}
                      <div className="pt-2 mt-2 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">ລວມທັງໝົດ</span>
                          <span className="text-lg font-bold">{dialogState.view.order.total}</span>
                        </div>
                      </div>
                    </div>

                    {dialogState.view.order.note && (
                      <div>
                        <Label className="text-sm text-gray-500">ໝາຍເຫດ</Label>
                        <p className="text-sm text-gray-600 mt-1">{dialogState.view.order.note}</p>
                      </div>
                    )}

                    <div>
                      <Label className="text-sm text-gray-500">ສະຖານະ</Label>
                      <div className="mt-2">
                        <StatusBadge status={dialogState.view.order.status} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => closeDialog('view')}>ປິດ</Button>
              <Button onClick={() => {
                toast({
                  title: "ກຳລັງພິມ",
                  description: "ກຳລັງສົ່ງໃບບິນໄປຫາເຄື່ອງພິມ...",
                  duration: 3000,
                });
              }}>
                ພິມໃບບິນ
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    
<Dialog open={dialogState.edit.isOpen} onOpenChange={() => closeDialog('edit')}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <Edit className="w-5 h-5 text-blue-600" />
        <span>ແກ້ໄຂການສັ່ງຊື້ #{dialogState.edit.order?.id}</span>
      </DialogTitle>
    </DialogHeader>
    {dialogState.edit.order && (
      <form onSubmit={(e) => {
        e.preventDefault();
        const form = e.target;
        const newStatus = form.querySelector('select[name="status"]').value;
        const note = form.querySelector('input[name="note"]').value;
        updateOrderStatus(dialogState.edit.order.id, newStatus, note);
        closeDialog('edit');
        toast({
          title: "ອັບເດດສຳເລັດ",
          description: `ອໍເດີ້ #${dialogState.edit.order.id} ຖືກອັບເດດເປັນ ${newStatus}`,
          duration: 3000,
        });
      }}>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label className="text-sm text-gray-500">ສະຖານະປັດຈຸບັນ</Label>
              <div className="mt-2">
                <StatusBadge status={dialogState.edit.order.status} />
              </div>
            </div>
            
            <div>
              <Label>ອັບເດດສະຖານະ</Label>
              <select
                name="status"
                defaultValue={dialogState.edit.order.status}
                className="w-full mt-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {orderStatuses
                  .filter(s => s !== 'All')
                  .map(s => (
                    <option key={s} value={s}>
                      {s === 'Pending' ? 'ລໍຖ້າ' :
                       s === 'Processing' ? 'ກຳລັງຊົງ' :
                       s === 'Ready' ? 'ພ້ອມສົ່ງ' :
                       s === 'Delivered' ? 'ສົ່ງແລ້ວ' : 'ຍົກເລີກ'}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <Label>ໝາຍເຫດ</Label>
              <Input
                type="text"
                name="note"
                defaultValue={dialogState.edit.order.note || ''}
                placeholder="ເພີ່ມໝາຍເຫດ (ຖ້າມີ)"
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
        <DialogFooter className="mt-6">
          <Button type="button" variant="outline" onClick={() => closeDialog('edit')}>
            ຍົກເລີກ
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            ບັນທຶກ
          </Button>
        </DialogFooter>
      </form>
    )}
  </DialogContent>
</Dialog>

        <Dialog open={dialogState.delete.isOpen} onOpenChange={() => closeDialog('delete')}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-red-600">
                <Trash2 className="w-5 h-5" />
                <span>ຢືນຢັນການລຶບ</span>
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-gray-700">ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບການສັ່ງຊື້ນີ້? ການກະທຳນີ້ບໍ່ສາມາດກັບຄືນໄດ້.</p>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => closeDialog('delete')}>ຍົກເລີກ</Button>
              <Button 
              variant="destructive" 
              onClick={() => {
                if (dialogState.delete.orderId) {
                  deleteOrder(dialogState.delete.orderId);
                  closeDialog('delete');
                }
              }}
            >
              ລຶບ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </div>
);
};

export default OrderList;