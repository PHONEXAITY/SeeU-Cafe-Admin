'use client'

import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';

const CategoryModal = ({ isOpen, onClose, mode, category }) => {
  const [formData, setFormData] = useState(
    mode === 'edit' ? category : {
      name: '',
      description: '',
      slug: '',
      parentCategory: '',
      image: null
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  const titles = {
    create: 'ເພີ່ມໝວດໝູ່ໃໝ່',
    edit: 'ແກ້ໄຂໝວດໝູ່',
    delete: 'ຍືນຍັນການລຶບ'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] font-['Phetsarath_OT']">
        <DialogHeader>
          <DialogTitle>{titles[mode]}</DialogTitle>
        </DialogHeader>

        {mode !== 'delete' ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <Label>ໝວດໝູ່ຂອງຮູບພາບ</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(image) => setFormData({ ...formData, image })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">ຊື່ໝວດໝູ່</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="unique-category-identifier"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="parentCategory">Parent Category</Label>
                <Input
                  id="parentCategory"
                  value={formData.parentCategory}
                  onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                  placeholder="(Optional) Parent category"
                />
              </div>

              <div>
                <Label htmlFor="description">ລາຍລະອຽດໝວດໝູ່</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                {mode === 'create' ? 'ເພີ່ມໝວດໝູ່' : 'ບັນທຶກການປ່ຽນແປງ'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                ຍົກເລີກ
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <p className="text-center py-4">ເຈົ້າແນ່ໃຈລະບໍວ່າຕ້ອງການລຶບໝວດໝູ່ນີ້? .</p>
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

const CategoryList = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: null, category: null });

  // Sample categories data
  const categories = [
    { 
      id: 1, 
      name: 'Hot Drinks', 
      slug: 'hot-drinks',
      description: 'All hot beverages including coffee and tea',
      productsCount: 15,
      parentCategory: null,
      image: '/api/placeholder/150/150'
    },
    { 
      id: 2, 
      name: 'Cold Drinks', 
      slug: 'cold-drinks',
      description: 'Refreshing cold beverages and iced drinks',
      productsCount: 12,
      parentCategory: null,
      image: '/api/placeholder/150/150'
    },
    { 
      id: 3, 
      name: 'Desserts', 
      slug: 'desserts',
      description: 'Sweet treats and pastries',
      productsCount: 8,
      parentCategory: null,
      image: '/api/placeholder/150/150'
    },
    { 
      id: 4, 
      name: 'Snacks', 
      slug: 'snacks',
      description: 'Light bites and savory snacks',
      productsCount: 10,
      parentCategory: null,
      image: '/api/placeholder/150/150'
    }
  ];

  const openModal = (mode, category = null) => {
    setModalState({ isOpen: true, mode, category });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: null, category: null });
  };

  return (
    <div className="rounded-lg shadow-lg bg-white p-6 font-['Phetsarath_OT']">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">ໝວດໝູ່</h2>
          <p className="text-sm text-gray-500 mt-1">ຈັດການໝວດໝູ່</p>
        </div>
        <Button onClick={() => openModal('create')} className="flex items-center gap-2">
          <FaPlus className="w-4 h-4" />
          ເພີ່ມໝວດໝູ່
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              <img 
                src={category.image} 
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                  <span className="text-sm text-gray-500">{category.productsCount} ສິນຄ້າ</span>
                </div>
                {category.parentCategory && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Sub-category
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal('edit', category)}
                  className="flex-1"
                >
                  <FaEdit className="w-4 h-4 mr-2" />
                  ແກ້ໄຂ
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openModal('delete', category)}
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

      <CategoryModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        category={modalState.category}
      />
    </div>
  );
};

export default CategoryList;