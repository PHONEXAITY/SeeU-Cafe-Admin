'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';

const DeleteDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ຢືນຢັນການລຶບ</DialogTitle>
        </DialogHeader>
        <p className="py-4">ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບໝວດໝູ່ນີ້? ການກະທຳນີ້ບໍ່ສາມາດກັບຄືນໄດ້.</p>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirm}>ລຶບ</Button>
          <Button variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const CategoryDialog = ({ isOpen, onClose, category = null }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-['Phetsarath_OT']">{category ? 'ແກ້ໄຂໝວດໝູ່' : 'ເພີ່ມໝວດໝູ່ໃໝ່'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="font-['Phetsarath_OT']">
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">ຊື່ໝວດໝູ່</Label>
              <Input 
                id="name" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ໃສ່ຊື່ໝວດໝູ່..."
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input 
                id="slug" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="url-friendly-slug"
              />
            </div>
            <div>
              <Label htmlFor="description">ຄຳອະທິບາຍ</Label>
              <Input 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="ອະທິບາຍກ່ຽວກັບໝວດໝູ່..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">ບັນທຶກ</Button>
            <Button type="button" variant="outline" onClick={onClose}>ຍົກເລີກ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const BlogCategoriesPage = () => {
  const [dialogState, setDialogState] = useState({ isOpen: false, category: null });
  const [deleteDialogState, setDeleteDialogState] = useState({ isOpen: false, categoryId: null });
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 1,
      name: "ກາເຟ",
      slug: "coffee",
      description: "ທຸກຢ່າງກ່ຽວກັບກາເຟ",
      posts: 25
    },
    {
      id: 2,
      name: "ຊາ",
      slug: "tea",
      description: "ບົດຄວາມກ່ຽວກັບຊາ",
      posts: 18
    }
  ];

  const handleDelete = (categoryId) => {
    console.log('Deleting category:', categoryId);
    setDeleteDialogState({ isOpen: false, categoryId: null });
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ໝວດໝູ່</h1>
          <p className="text-gray-500">ຈັດການໝວດໝູ່ບົດຄວາມຂອງທ່ານ</p>
        </div>
        <Button onClick={() => setDialogState({ isOpen: true, category: null })}>
          <FaPlus className="w-4 h-4 mr-2" />
          ເພີ່ມໝວດໝູ່ໃໝ່
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="ຄົ້ນຫາໝວດໝູ່..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-medium">{category.name}</h3>
                  <div className="mt-1 text-sm text-gray-500">
                    <p>{category.description}</p>
                    <p className="mt-1">
                      Slug: {category.slug} • ບົດຄວາມ: {category.posts}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDialogState({ isOpen: true, category })}
                  >
                    <FaEdit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600"
                    onClick={() => setDeleteDialogState({ isOpen: true, categoryId: category.id })}
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CategoryDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState({ isOpen: false, category: null })}
        category={dialogState.category}
      />

      <DeleteDialog
        isOpen={deleteDialogState.isOpen}
        onClose={() => setDeleteDialogState({ isOpen: false, categoryId: null })}
        onConfirm={() => handleDelete(deleteDialogState.categoryId)}
      />
    </div>
  );
};

export default BlogCategoriesPage;