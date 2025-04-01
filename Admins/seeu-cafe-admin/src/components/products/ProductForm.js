'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner, FaImage, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { productService } from '@/services/api';
import FileUpload from '@/components/FileUpload';
import { useCategories } from '@/hooks/productHooks';

const ProductForm = ({ product = null, mode = 'create' }) => {
  const router = useRouter();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    status: 'active',
    type: 'food', // Default to food, can be 'food' or 'beverage'
    hot_price: '', // Only for beverages
    ice_price: '', // Only for beverages
    image: ''
  });

  // Load product data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        category_id: product.category_id?.toString() || '',
        status: product.status || 'active',
        type: product.type || (product.hot_price !== undefined ? 'beverage' : 'food'),
        hot_price: product.hot_price?.toString() || '',
        ice_price: product.ice_price?.toString() || '',
        image: product.image || ''
      });
      
      setImageUrl(product.image || '');
    }
  }, [product, mode]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'ກະລຸນາປ້ອນຊື່ສິນຄ້າ';
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'ກະລຸນາປ້ອນລາຄາສິນຄ້າທີ່ຖືກຕ້ອງ';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'ກະລຸນາເລືອກໝວດໝູ່';
    }
    
    if (formData.type === 'beverage') {
      if (formData.hot_price && (isNaN(parseFloat(formData.hot_price)) || parseFloat(formData.hot_price) < 0)) {
        newErrors.hot_price = 'ກະລຸນາປ້ອນລາຄາຮ້ອນທີ່ຖືກຕ້ອງ';
      }
      
      if (formData.ice_price && (isNaN(parseFloat(formData.ice_price)) || parseFloat(formData.ice_price) < 0)) {
        newErrors.ice_price = 'ກະລຸນາປ້ອນລາຄາເຢັນທີ່ຖືກຕ້ອງ';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (e) => {
    const type = e.target.value;
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const handleImageUpload = (url) => {
    setImageUrl(url);
    setFormData(prev => ({
      ...prev,
      image: url
    }));
  };

  const filterCategoriesByType = () => {
    if (!categoriesData) return [];
    
    const allCategories = Array.isArray(categoriesData) 
      ? categoriesData 
      : categoriesData.data || [];
      
    return allCategories.filter(category => 
      formData.type === 'food' 
        ? category.type === 'food' 
        : category.type === 'beverage'
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('ກະລຸນາກວດສອບຂໍ້ມູນທີ່ປ້ອນ');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare product data
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category_id: parseInt(formData.category_id),
        status: formData.status,
        image: imageUrl
      };
      
      // Add beverage-specific fields if type is beverage
      if (formData.type === 'beverage') {
        if (formData.hot_price) {
          productData.hot_price = parseFloat(formData.hot_price);
        }
        
        if (formData.ice_price) {
          productData.ice_price = parseFloat(formData.ice_price);
        }
      }
      
      // Create or update product
      if (mode === 'create') {
        if (formData.type === 'food') {
          await productService.createFoodProduct(productData);
        } else {
          await productService.createBeverageProduct(productData);
        }
        toast.success('ສ້າງສິນຄ້າສຳເລັດແລ້ວ');
      } else {
        if (formData.type === 'food') {
          await productService.updateFoodProduct(product.id, productData);
        } else {
          await productService.updateBeverageProduct(product.id, productData);
        }
        toast.success('ອັບເດດສິນຄ້າສຳເລັດແລ້ວ');
      }
      
      // Redirect to products list
      router.push('/products/list');
    } catch (error) {
      console.error('Error saving product:', error);
      
      // Handle specific errors
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກສິນຄ້າ');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 font-['Phetsarath_OT']">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {mode === 'create' ? 'ສ້າງສິນຄ້າໃໝ່' : 'ແກ້ໄຂສິນຄ້າ'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Type Selection (Food/Beverage) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ປະເພດສິນຄ້າ
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="food"
                checked={formData.type === 'food'}
                onChange={handleTypeChange}
                className="text-brown-600 focus:ring-brown-500"
              />
              <span className="ml-2">ອາຫານ</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="type"
                value="beverage"
                checked={formData.type === 'beverage'}
                onChange={handleTypeChange}
                className="text-brown-600 focus:ring-brown-500"
              />
              <span className="ml-2">ເຄື່ອງດື່ມ</span>
            </label>
          </div>
        </div>
        
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ຊື່ສິນຄ້າ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="ປ້ອນຊື່ສິນຄ້າ"
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ຄຳອະທິບາຍ
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
            placeholder="ຄຳອະທິບາຍກ່ຽວກັບສິນຄ້າ"
          />
        </div>
        
        {/* Price Fields - Conditional based on type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Regular Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ລາຄາ <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₭</span>
              </div>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full pl-7 pr-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                required
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>
          
          {/* Beverage-specific prices */}
          {formData.type === 'beverage' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ລາຄາຮ້ອນ
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₭</span>
                  </div>
                  <input
                    type="number"
                    name="hot_price"
                    value={formData.hot_price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-7 pr-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                      errors.hot_price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.hot_price && (
                  <p className="mt-1 text-sm text-red-600">{errors.hot_price}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ລາຄາເຢັນ
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">₭</span>
                  </div>
                  <input
                    type="number"
                    name="ice_price"
                    value={formData.ice_price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className={`w-full pl-7 pr-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
                      errors.ice_price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.ice_price && (
                  <p className="mt-1 text-sm text-red-600">{errors.ice_price}</p>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ໝວດໝູ່ <span className="text-red-500">*</span>
          </label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-brown-500 focus:border-brown-500 ${
              errors.category_id ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          >
            <option value="">ເລືອກໝວດໝູ່</option>
            {isLoadingCategories ? (
              <option disabled>ກຳລັງໂຫລດໝວດໝູ່...</option>
            ) : (
              filterCategoriesByType().map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            )}
          </select>
          {errors.category_id && (
            <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
          )}
        </div>
        
        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ສະຖານະ
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brown-500 focus:border-brown-500"
          >
            <option value="active">ເປີດໃຊ້ງານ</option>
            <option value="inactive">ປິດໃຊ້ງານ</option>
          </select>
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ຮູບພາບສິນຄ້າ
          </label>
          <FileUpload
            onFileSelect={handleImageUpload}
            initialPreview={imageUrl}
            allowedTypes="image/*"
          />
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => router.push('/products/list')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            ຍົກເລີກ
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 focus:outline-none focus:ring-2 focus:ring-brown-500 flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin h-5 w-5" />
                <span>{mode === 'create' ? 'ກຳລັງສ້າງ...' : 'ກຳລັງອັບເດດ...'}</span>
              </>
            ) : (
              <span>{mode === 'create' ? 'ສ້າງສິນຄ້າ' : 'ອັບເດດສິນຄ້າ'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;