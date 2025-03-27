'use client'
import React, { useState } from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';

const mockProducts = [
  { id: 1, name: 'Espresso', price: 2.5 },
  { id: 2, name: 'Cappuccino', price: 3.5 },
  { id: 3, name: 'Latte', price: 3.0 },
  { id: 4, name: 'Mocha', price: 4.0 },
  { id: 5, name: 'Americano', price: 2.0 },
];

const CreateOrder = () => {
  const [customerName, setCustomerName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleAddProduct = () => {
    const productToAdd = mockProducts.find(p => p.id === parseInt(selectedProductId));
    if (productToAdd) {
      // Check if product already exists
      const existingProduct = selectedProducts.find(p => p.id === productToAdd.id);
      if (existingProduct) {
        toast.warning('ສິນຄ້ານີ້ຖືກເພີ່ມແລ້ວ');
        return;
      }
      setSelectedProducts([...selectedProducts, { ...productToAdd, quantity: 1 }]);
      setSelectedProductId('');
      toast.success('ເພີ່ມສິນຄ້າສຳເລັດ');
    }
  };

  const handleQuantityChange = (index, change) => {
    const updatedProducts = selectedProducts.map((product, i) => {
      if (i === index) {
        const newQuantity = Math.max(1, product.quantity + change);
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    toast.success('ລຶບສິນຄ້າສຳເລັດ');
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => 
      total + (product.price * product.quantity), 0
    ).toFixed(2);
  };

  const handleConfirmOrder = (orderData) => {
    // API call simulation
    console.log('Order submitted:', orderData);
    toast.success('ສ້າງການສັ່ງຊື້ສຳເລັດ');
    // Reset form
    setCustomerName('');
    setSelectedProducts([]);
    setSelectedProductId('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!customerName.trim()) {
      toast.error('ກະລຸນາປ້ອນຊື່ລູກຄ້າ');
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error('ກະລຸນາເລືອກສິນຄ້າຢ່າງໜ້ອຍ 1 ລາຍການ');
      return;
    }

    const orderData = {
      customerName,
      products: selectedProducts,
      total: calculateTotal()
    };

    setShowConfirmDialog(true);
  };

  const ConfirmOrderDialog = ({ isOpen, onClose, orderData }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ຢືນຢັນການສັ່ງຊື້</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>ລູກຄ້າ</Label>
              <p className="text-gray-700">{orderData?.customerName}</p>
            </div>
            <div>
              <Label>ລາຍການສິນຄ້າ</Label>
              <div className="space-y-2 mt-2">
                {orderData?.products?.map((product, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{product.name} x {product.quantity}</span>
                    <span>${(product.price * product.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between font-bold">
                <span>ຍອດລວມ</span>
                <span>${orderData?.total}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
            <Button onClick={() => {
              handleConfirmOrder(orderData);
              onClose();
            }}>ຢືນຢັນການສັ່ງຊື້</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 font-['Phetsarath_OT']">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">ສ້າງລາຍການສັ່ງຊື້ໃໝ່</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="customerName">
            ຊື່ລູກຄ້າ
          </label>
          <input
            id="customerName"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-500 focus:border-brown-500"
            placeholder="ປ້ອນຊື່ລູກຄ້າ"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="product">
            ເພີ່ມສິນຄ້າ
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <select
              id="product"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-brown-500 focus:border-brown-500 border-gray-300"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
            >
              <option value="">ເລືອກສິນຄ້າ</option>
              {mockProducts.map(product => (
                <option key={product.id} value={product.id}>{product.name} - ${product.price}</option>
              ))}
            </select>
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 hover:bg-gray-100"
              onClick={handleAddProduct}
            >
              <FaPlus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-2">ສິນຄ້າທີ່ຖືກເລືອກມີ :</h2>
          {selectedProducts.map((product, index) => (
            <div key={index} className="flex items-center justify-between border-b border-gray-200 py-2">
              <span>{product.name} - ${product.price}</span>
              <div className="flex items-center">
                <button type="button" onClick={() => handleQuantityChange(index, -1)} className="text-red-500 p-1">
                  <FaMinus className="h-4 w-4" />
                </button>
                <span className="mx-2">{product.quantity}</span>
                <button type="button" onClick={() => handleQuantityChange(index, 1)} className="text-green-500 p-1">
                  <FaPlus className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => handleRemoveProduct(index)} className="text-red-500 p-1 ml-2">
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium text-gray-700">ຍອດລວມ :</span>
            <span className="text-2xl font-bold text-gray-900">${calculateTotal()}</span>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brown-600 hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
          >
           ສ້າງການສັ່ງຊື້
          </button>
        </div>
      </form>
      <ConfirmOrderDialog 
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        orderData={{  
          customerName,
          products: selectedProducts,
          total: calculateTotal()
        }}
      />
    </div>
  );
};

export default CreateOrder;