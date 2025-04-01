'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  useFoodProducts,
  useBeverageProducts,
  useDeleteFoodProduct,
  useDeleteBeverageProduct,
  useCategories,
  formatCurrency,
  getProductStatusColor,
} from '@/hooks/productHooks';
import { productService } from '@/services/api';
import { toast } from 'react-hot-toast';

// Import the custom UI components
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogFooter,
  DialogTitle,
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';

const ProductList = () => {
  // State for filters and pagination
  const [productType, setProductType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // State for form data
  const [formData, setFormData] = useState({
    type: 'food',
    name: '',
    price: '',
    category_id: '',
    status: 'active',
    description: '',
    image: null,
    hot_price: '',
    ice_price: '',
  });

  const router = useRouter();

  // Fetch data
  const filters = { search: searchTerm, categoryId: categoryId || undefined, status: status || undefined, sortBy: sortField, sortDir: sortDirection, page, limit };
  const { data: foodData, isLoading: isLoadingFood, error: foodError } = useFoodProducts(productType === 'all' || productType === 'food' ? filters : null);
  const { data: beverageData, isLoading: isLoadingBeverage, error: beverageError } = useBeverageProducts(productType === 'all' || productType === 'beverage' ? filters : null);
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const { mutate: deleteFoodProduct, isLoading: isDeletingFood } = useDeleteFoodProduct();
  const { mutate: deleteBeverageProduct, isLoading: isDeletingBeverage } = useDeleteBeverageProduct();

  // Combine products
  const products = [];
  const isLoadingProducts = isLoadingFood || isLoadingBeverage;
  const hasProductsError = foodError || beverageError;

  if (!isLoadingProducts && !hasProductsError) {
    if (productType === 'all' || productType === 'food') {
      const foodProducts = foodData?.products || [];
      products.push(...foodProducts.map((product) => ({ ...product, type: 'food' })));
    }
    if (productType === 'all' || productType === 'beverage') {
      const beverageProducts = beverageData?.products || [];
      products.push(...beverageProducts.map((product) => ({ ...product, type: 'beverage' })));
    }
  }

  products.sort((a, b) => {
    let compareA = a[sortField];
    let compareB = b[sortField];
    if (typeof compareA === 'string') compareA = compareA.toLowerCase();
    if (typeof compareB === 'string') compareB = compareB.toLowerCase();
    return sortDirection === 'asc' ? (compareA < compareB ? -1 : 1) : (compareA > compareB ? -1 : 1);
  });

  const totalItems = (productType === 'all' || productType === 'food' ? foodData?.totalItems || 0 : 0) + (productType === 'all' || productType === 'beverage' ? beverageData?.totalItems || 0 : 0);
  const totalPages = Math.max(productType === 'all' || productType === 'food' ? foodData?.totalPages || 0 : 0, productType === 'all' || productType === 'beverage' ? beverageData?.totalPages || 0 : 0);

  // Handlers
  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setPage(1); };
  const handleCategoryChange = (value) => { setCategoryId(value); setPage(1); };
  const handleStatusChange = (value) => { setStatus(value); setPage(1); };
  const handleProductTypeChange = (value) => { setProductType(value); setPage(1); };
  const handleSortChange = (field) => {
    setSortField(field);
    setSortDirection(sortField === field && sortDirection === 'asc' ? 'desc' : 'asc');
    setPage(1);
  };
  const handlePageChange = (newPage) => setPage(newPage);
  const handleLimitChange = (value) => { setLimit(Number(value)); setPage(1); };

  const getCategoryName = (categoryId) => {
    if (!categoriesData) return 'Loading...';
    const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [];
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // Modal Handlers
  const handleAddProduct = () => {
    setFormData({ type: 'food', name: '', price: '', category_id: '', status: 'active', description: '', image: null, hot_price: '', ice_price: '' });
    setShowAddModal(true);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setFormData({
      type: product.type,
      name: product.name,
      price: product.price || '',
      category_id: product.category_id || '',
      status: product.status || 'active',
      description: product.description || '',
      image: product.image || null,
      hot_price: product.hot_price || '',
      ice_price: product.ice_price || '',
    });
    setShowEditModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      if (formData.type === 'food') {
        await productService.createFoodProduct(data);
        toast.success('ເພີ່ມສິນຄ້າອາຫານສຳເລັດ');
      } else {
        await productService.createBeverageProduct(data);
        toast.success('ເພີ່ມສິນຄ້າເຄື່ອງດື່ມສຳເລັດ');
      }
      setShowAddModal(false);
    } catch (error) {
      toast.error(`ເພີ່ມສິນຄ້າລົ້ມເຫລວ: ${error.message}`);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) data.append(key, formData[key]);
    });

    try {
      if (formData.type === 'food') {
        await productService.updateFoodProduct(productToEdit.id, data);
        toast.success('ແກ້ໄຂສິນຄ້າອາຫານສຳເລັດ');
      } else {
        await productService.updateBeverageProduct(productToEdit.id, data);
        toast.success('ແກ້ໄຂສິນຄ້າເຄື່ອງດື່ມສຳເລັດ');
      }
      setShowEditModal(false);
    } catch (error) {
      toast.error(`ແກ້ໄຂສິນຄ້າລົ້ມເຫລວ: ${error.message}`);
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (!productToDelete) return;
    const deleteFn = productToDelete.type === 'food' ? deleteFoodProduct : deleteBeverageProduct;
    deleteFn(productToDelete.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        setProductToDelete(null);
        toast.success(productToDelete.type === 'food' ? 'ລຶບສິນຄ້າອາຫານສຳເລັດ' : 'ລຶບສິນຄ້າເຄື່ອງດື່ມສຳເລັດ');
      },
      onError: (error) => toast.error(`ລຶບສິນຄ້າລົ້ມເຫລວ: ${error.message}`),
    });
  };

  const handleViewProduct = (product) => router.push(`/products/${product.type}/${product.id}`);

  // Status badge renderer
  const renderStatusBadge = (status) => {
    const bgColor = status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {status === 'active' ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
      </span>
    );
  };

  // Category options for select
  const categoryOptions = categoriesData ? 
    (Array.isArray(categoriesData) ? categoriesData : categoriesData.data || []).map(category => ({
      value: category.id,
      label: category.name
    })) : [];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 font-['Phetsarath_OT']">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">ສິນຄ້າທັງໝົດ</h1>
        <Button onClick={handleAddProduct} className="bg-amber-700 hover:bg-amber-800">
          <Plus className="mr-2 h-4 w-4" /> ເພີ່ມສິນຄ້າ
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              type="text" 
              className="pl-8" 
              placeholder="ຄົ້ນຫາສິນຄ້າ..." 
              value={searchTerm} 
              onChange={handleSearchChange} 
            />
          </div>
        </div>
        
        <Select 
          value={productType} 
          onValueChange={handleProductTypeChange}
        >
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4 text-gray-400" />
            <SelectValue placeholder="ເລືອກປະເພດສິນຄ້າ">
              {productType === 'all' ? 'ທຸກປະເພດ' : 
               productType === 'food' ? 'ອາຫານ' : 'ເຄື່ອງດື່ມ'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ທຸກປະເພດ</SelectItem>
            <SelectItem value="food">ອາຫານ</SelectItem>
            <SelectItem value="beverage">ເຄື່ອງດື່ມ</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={categoryId} 
          onValueChange={handleCategoryChange}
          disabled={isLoadingCategories}
        >
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4 text-gray-400" />
            <SelectValue placeholder="ເລືອກໝວດໝູ່">
              {categoryId ? getCategoryName(categoryId) : 'ທຸກໝວດໝູ່'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">ທຸກໝວດໝູ່</SelectItem>
            {categoryOptions.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select 
          value={status} 
          onValueChange={handleStatusChange}
        >
          <SelectTrigger>
            <Filter className="mr-2 h-4 w-4 text-gray-400" />
            <SelectValue placeholder="ເລືອກສະຖານະ">
              {status === 'active' ? 'ເປີດໃຊ້ງານ' : 
               status === 'inactive' ? 'ປິດໃຊ້ງານ' : 'ທຸກສະຖານະ'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">ທຸກສະຖານະ</SelectItem>
            <SelectItem value="active">ເປີດໃຊ້ງານ</SelectItem>
            <SelectItem value="inactive">ປິດໃຊ້ງານ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-6 rounded-lg border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-600">ຮູບພາບ</th>
              <th 
                className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer" 
                onClick={() => handleSortChange('name')}
              >
                <div className="flex items-center">
                  ຊື່ສິນຄ້າ 
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortField !== 'name' && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left font-medium text-gray-600 cursor-pointer" 
                onClick={() => handleSortChange('category_id')}
              >
                <div className="flex items-center">
                  ໝວດໝູ່ 
                  {sortField === 'category_id' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortField !== 'category_id' && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-right font-medium text-gray-600 cursor-pointer" 
                onClick={() => handleSortChange('price')}
              >
                <div className="flex items-center justify-end">
                  ລາຄາ 
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? 
                    <ArrowUp className="ml-1 h-4 w-4" /> : 
                    <ArrowDown className="ml-1 h-4 w-4" />
                  )}
                  {sortField !== 'price' && <ArrowUpDown className="ml-1 h-4 w-4" />}
                </div>
              </th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">ສະຖານະ</th>
              <th className="px-4 py-3 text-center font-medium text-gray-600">ປະເພດ</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">ຈັດການ</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoadingProducts ? (
              <tr><td colSpan={7} className="text-center py-8">
                <Loader2 className="animate-spin inline-block mr-2 h-5 w-5" /> ກຳລັງໂຫລດ...
              </td></tr>
            ) : hasProductsError ? (
              <tr><td colSpan={7} className="text-center py-8 text-red-500">
                ເກີດຂໍ້ຜິດພາດ: {foodError?.message || beverageError?.message}
              </td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-500">ບໍ່ພົບສິນຄ້າ</td></tr>
            ) : (
              products.map((product) => (
                <tr key={`${product.type}-${product.id}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="w-14 h-14 relative rounded-md overflow-hidden border bg-gray-100">
                      {product.image ? 
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill 
                          className="object-cover" 
                        /> : 
                        <div className="flex items-center justify-center h-full text-xs text-gray-400">No Image</div>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-gray-600">{getCategoryName(product.category_id)}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-3 text-center">
                    {renderStatusBadge(product.status)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.type === 'food' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {product.type === 'food' ? 'ອາຫານ' : 'ເຄື່ອງດື່ມ'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        onClick={() => handleViewProduct(product)} 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleEditProduct(product)} 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => confirmDelete(product)} 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            ສະແດງ {(page - 1) * limit + 1} ຫາ {Math.min(page * limit, totalItems)} ຈາກທັງໝົດ {totalItems} ລາຍການ
          </div>
          <div className="flex space-x-1">
            <Button 
              onClick={() => handlePageChange(page - 1)} 
              disabled={page === 1} 
              variant="outline" 
              size="sm" 
              className="px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show at most 5 page buttons
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else {
                // Center the current page
                const startPage = Math.max(1, page - 2);
                const endPage = Math.min(totalPages, startPage + 4);
                pageNum = startPage + i;
                if (pageNum > endPage) return null;
              }
              
              return (
                <Button 
                  key={pageNum} 
                  onClick={() => handlePageChange(pageNum)} 
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className={page === pageNum ? "bg-amber-700 hover:bg-amber-800" : ""}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button 
              onClick={() => handlePageChange(page + 1)} 
              disabled={page === totalPages} 
              variant="outline" 
              size="sm" 
              className="px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">ເພີ່ມສິນຄ້າໃໝ່</DialogTitle>
            <DialogDescription>
              ກະລຸນາປ້ອນຂໍ້ມູນສິນຄ້າທີ່ທ່ານຕ້ອງການເພີ່ມ
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitAdd}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">ປະເພດສິນຄ້າ</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleSelectChange('type', value)}
                  className="col-span-3"
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="ເລືອກປະເພດສິນຄ້າ">
                      {formData.type === 'food' ? 'ອາຫານ' : 'ເຄື່ອງດື່ມ'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">ອາຫານ</SelectItem>
                    <SelectItem value="beverage">ເຄື່ອງດື່ມ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">ຊື່ສິນຄ້າ</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleFormChange} 
                  className="col-span-3" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">ລາຄາ</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={handleFormChange} 
                  className="col-span-3" 
                  required 
                />
              </div>
              
              {formData.type === 'beverage' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hot_price" className="text-right">ລາຄາ (ຮ້ອນ)</Label>
                    <Input 
                      id="hot_price" 
                      name="hot_price" 
                      type="number" 
                      value={formData.hot_price} 
                      onChange={handleFormChange} 
                      className="col-span-3" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="ice_price" className="text-right">ລາຄາ (ເຢັນ)</Label>
                    <Input 
                      id="ice_price" 
                      name="ice_price" 
                      type="number" 
                      value={formData.ice_price} 
                      onChange={handleFormChange} 
                      className="col-span-3" 
                    />
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">ໝວດໝູ່</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => handleSelectChange('category_id', value)}
                  className="col-span-3"
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="ເລືອກໝວດໝູ່">
                      {formData.category_id ? getCategoryName(formData.category_id) : 'ເລືອກໝວດໝູ່'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">ເລືອກໝວດໝູ່</SelectItem>
                    {categoryOptions.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">ສະຖານະ</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                  className="col-span-3"
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="ເລືອກສະຖານະ">
                      {formData.status === 'active' ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">ເປີດໃຊ້ງານ</SelectItem>
                    <SelectItem value="inactive">ປິດໃຊ້ງານ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">ຄຳອະທິບາຍ</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleFormChange} 
                  className="col-span-3 min-h-[80px]" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="image" className="text-right pt-2">ຮູບພາບ</Label>
                <div className="col-span-3">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={handleImageChange} 
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddModal(false)}
              >
                ຍົກເລີກ
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-700 hover:bg-amber-800"
              >
                ເພີ່ມສິນຄ້າ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">ແກ້ໄຂສິນຄ້າ</DialogTitle>
            <DialogDescription>
              ທ່ານກຳລັງແກ້ໄຂສິນຄ້າ "{productToEdit?.name}"
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">ປະເພດສິນຄ້າ</Label>
                <Input 
                  id="edit-type" 
                  value={formData.type === 'food' ? 'ອາຫານ' : 'ເຄື່ອງດື່ມ'} 
                  className="col-span-3" 
                  disabled 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">ຊື່ສິນຄ້າ</Label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleFormChange} 
                  className="col-span-3" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">ລາຄາ</Label>
                <Input 
                  id="edit-price" 
                  name="price" 
                  type="number" 
                  value={formData.price} 
                  onChange={handleFormChange} 
                  className="col-span-3" 
                  required 
                />
              </div>
              
              {formData.type === 'beverage' && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-hot-price" className="text-right">ລາຄາ (ຮ້ອນ)</Label>
                    <Input 
                      id="edit-hot-price" 
                      name="hot_price" 
                      type="number" 
                      value={formData.hot_price} 
                      onChange={handleFormChange} 
                      className="col-span-3" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-ice-price" className="text-right">ລາຄາ (ເຢັນ)</Label>
                    <Input 
                      id="edit-ice-price" 
                      name="ice_price" 
                      type="number" 
                      value={formData.ice_price} 
                      onChange={handleFormChange} 
                      className="col-span-3" 
                    />
                  </div>
                </>
              )}
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">ໝວດໝູ່</Label>
                <Select 
                  value={formData.category_id} 
                  onValueChange={(value) => handleSelectChange('category_id', value)}
                  className="col-span-3"
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="ເລືອກໝວດໝູ່">
                      {formData.category_id ? getCategoryName(formData.category_id) : 'ເລືອກໝວດໝູ່'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">ເລືອກໝວດໝູ່</SelectItem>
                    {categoryOptions.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">ສະຖານະ</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                  className="col-span-3"
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="ເລືອກສະຖານະ">
                      {formData.status === 'active' ? 'ເປີດໃຊ້ງານ' : 'ປິດໃຊ້ງານ'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">ເປີດໃຊ້ງານ</SelectItem>
                    <SelectItem value="inactive">ປິດໃຊ້ງານ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-description" className="text-right pt-2">ຄຳອະທິບາຍ</Label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleFormChange} 
                  className="col-span-3 min-h-[80px]" 
                />
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-image" className="text-right pt-2">ຮູບພາບ</Label>
                <div className="col-span-3">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={handleImageChange} 
                  />
                  {formData.image && typeof formData.image === 'string' && (
                    <div className="mt-2 w-full">
                      <p className="text-xs text-gray-500 mb-1">ຮູບພາບປັດຈຸບັນ:</p>
                      <div className="w-32 h-32 relative rounded-md overflow-hidden border">
                        <img src={formData.image} alt="Preview" className="object-cover w-full h-full" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowEditModal(false)}
              >
                ຍົກເລີກ
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-700 hover:bg-amber-800"
              >
                ບັນທຶກການແກ້ໄຂ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">ຢືນຢັນການລຶບສິນຄ້າ</DialogTitle>
            <DialogDescription>
              ການກະທຳນີ້ບໍ່ສາມາດຍ້ອນກັບໄດ້
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-2">ທ່ານແນ່ໃຈບໍ່ວ່າຕ້ອງການລຶບສິນຄ້ານີ້?</p>
            <div className="flex items-center p-3 bg-gray-50 rounded-md">
              {productToDelete?.image && (
                <div className="w-12 h-12 relative mr-3 rounded-md overflow-hidden border">
                  <Image 
                    src={productToDelete.image} 
                    alt={productToDelete.name} 
                    fill 
                    className="object-cover" 
                  />
                </div>
              )}
              <div>
                <p className="font-medium">{productToDelete?.name}</p>
                <p className="text-sm text-gray-500">
                  {productToDelete?.type === 'food' ? 'ອາຫານ' : 'ເຄື່ອງດື່ມ'} • {formatCurrency(productToDelete?.price)}
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowDeleteModal(false)}
            >
              ຍົກເລີກ
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteConfirmed}
              disabled={isDeletingFood || isDeletingBeverage}
            >
              {isDeletingFood || isDeletingBeverage ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> ກຳລັງລຶບ...
                </>
              ) : 'ລຶບສິນຄ້າ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductList;