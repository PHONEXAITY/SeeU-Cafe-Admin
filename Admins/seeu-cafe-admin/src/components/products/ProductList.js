'use client'

import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';

const ProductModal = ({ isOpen, onClose, mode, product }) => {
  const [formData, setFormData] = useState(
    mode === 'edit' ? product : {
      name: '',
      price: '',
      category: '',
      description: '',
      image: null,
      stock: '',
      sku: ''
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  const titles = {
    create: 'ເພີ່ມສິນຄ້າໃໝ່',
    edit: 'ແກ້ໄຂສິນຄ້າ',
    delete: 'ຍືນຍັນການລຶບ',
    view: 'ລາຍລະອຽດສິນຄ້າ'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] font-['Phetsarath_OT']">
        <DialogHeader>
          <DialogTitle>{titles[mode]}</DialogTitle>
        </DialogHeader>

        {mode !== 'delete' ? (
          <form onSubmit={handleSubmit} >
            <div className="grid gap-4">
              <div className="grid grid-cols-1 gap-4">
                <Label>ຮູບພາບສິນຄ້າ</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(image) => setFormData({ ...formData, image })}
                  disabled={mode === 'view'}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">ຊື່ສິນຄ້າ</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={mode === 'view'}
                  />
                </div>
                <div>
                  <Label htmlFor="price">ລາຄາ</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    disabled={mode === 'view'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    disabled={mode === 'view'}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    disabled={mode === 'view'}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">ໝວດໝູ່</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={mode === 'view'}
                />
              </div>

              <div>
                <Label htmlFor="description">ລາຍລະອຽດ</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  disabled={mode === 'view'}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              {mode !== 'view' && (
                <Button type="submit">
                  {mode === 'create' ? 'ເພີ່ມສິນຄ້າ' : 'ບັນທຶກການປ່ຽນແປງ'}
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose}>
                {mode === 'view' ? 'Close' : 'ຍົກເລີກ'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <p className="text-center py-4">ທ່ານແນ່ໃຈລະບໍ ວ່າຕ້ອງການລືບຂໍ້ມູນນີ້ ?</p>
            <DialogFooter>
              <Button variant="destructive" onClick={onClose}>ລຶບ</Button>
              <Button variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ProductList = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: null, product: null });

  // Sample products data
  const products = [
    { 
      id: 1, 
      name: 'Espresso', 
      price: 3.99, 
      category: 'Hot Drinks', 
      description: 'Strong Italian coffee',
      image: '/api/placeholder/150/150',
      stock: 100,
      sku: 'ESP001'
    },
    { 
      id: 2, 
      name: 'Latte', 
      price: 4.99, 
      category: 'Hot Drinks', 
      description: 'Espresso with steamed milk',
      image: '/api/placeholder/150/150',
      stock: 80,
      sku: 'LAT001'
    },
  ];

  const openModal = (mode, product = null) => {
    setModalState({ isOpen: true, mode, product });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: null, product: null });
  };

  return (
    <div className="rounded-lg shadow-lg bg-white p-6 font-['Phetsarath_OT']">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">ສິນຄ້າ</h2>
        <Button onClick={() => openModal('create')} className="flex items-center gap-2">
          <FaPlus className="w-4 h-4" />
          ເພີ່ມສິນຄ້າ
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{product.category}</p>
              <p className="text-lg font-bold mb-2">${product.price}</p>
              <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal('view', product)}
                  className="flex-1"
                >
                  <FaEye className="w-4 h-4 mr-2" />
                  ເບີ່ງຂໍ້ມູນ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal('edit', product)}
                  className="flex-1"
                >
                  <FaEdit className="w-4 h-4 mr-2" />
                  ແກ້ໄຂ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal('delete', product)}
                  className="flex-1"
                >
                  <FaTrash className="w-4 h-4 mr-2" />
                  ລຶບ
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        product={modalState.product}
      />
    </div>
  );
};

export default ProductList;