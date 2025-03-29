'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, 
  FaSortAmountDown, FaSortAmountUp, FaEye, FaSpinner,
  FaChevronLeft, FaChevronRight, FaAngleDoubleLeft, FaAngleDoubleRight
} from 'react-icons/fa';
import { useProducts, useDeleteProduct, useCategories } from '@/hooks/productHooks';
import { formatCurrency } from '@/hooks/orderHooks';
import { toast } from 'react-hot-toast';

const ProductList = () => {
  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const router = useRouter();

  // Build filter object for API
  const filters = {
    search: searchTerm,
    category,
    sortBy: sortField,
    sortDir: sortDirection,
    page,
    limit,
  };

  // Fetch products with filters
  const { 
    data: productsData, 
    isLoading: isLoadingProducts,
    isError: isProductsError,
    error: productsError
  } = useProducts(filters);

  // Fetch categories for filter dropdown
  const { 
    data: categoriesData, 
    isLoading: isLoadingCategories 
  } = useCategories();

  // Delete product mutation
  const { mutate: deleteProduct, isLoading: isDeleting } = useDeleteProduct();

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  // Handle category filter changes
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1); // Reset to first page on new filter
  };

  // Handle sort changes
  const handleSortChange = (field) => {
    if (field === sortField) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to desc for new field
      setSortField(field);
      setSortDirection('desc');
    }
    setPage(1); // Reset to first page on new sort
  };

  // Navigate to add product page
  const handleAddProduct = () => {
    router.push('/products/add');
  };

  // Navigate to edit product page
  const handleEditProduct = (id) => {
    router.push(`/products/edit/${id}`);
  };

  // Navigate to view product page
  const handleViewProduct = (id) => {
    router.push(`/products/${id}`);
  };

  // Handle delete confirmation
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Handle actual deletion
  const handleDeleteConfirmed = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setProductToDelete(null);
        }
      });
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Handle limit change
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page on limit change
  };

  if (isProductsError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-red-600 mb-2">Error loading products</h2>
        <p className="text-gray-600">{productsError?.message || 'Please try again later'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4 sm:mb-0">Products</h1>
        <button
          onClick={handleAddProduct}
          className="flex items-center px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brown-500 focus:border-brown-500"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaFilter className="text-gray-400" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brown-500 focus:border-brown-500"
            value={category}
            onChange={handleCategoryChange}
            disabled={isLoadingCategories}
          >
            <option value="">All Categories</option>
            {categoriesData?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Items per page */}
        <div className="flex items-center">
          <span className="text-gray-600 mr-2">Show:</span>
          <select
            className="border border-gray-300 rounded-md focus:outline-none focus:ring-brown-500 focus:border-brown-500 p-2"
            value={limit}
            onChange={handleLimitChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-gray-600 ml-2">per page</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Image</th>
              <th 
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSortChange('name')}
              >
                <div className="flex items-center">
                  <span>Name</span>
                  {sortField === 'name' && (
                    sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-2 text-left cursor-pointer"
                onClick={() => handleSortChange('category')}
              >
                <div className="flex items-center">
                  <span>Category</span>
                  {sortField === 'category' && (
                    sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-2 text-right cursor-pointer"
                onClick={() => handleSortChange('price')}
              >
                <div className="flex items-center justify-end">
                  <span>Price</span>
                  {sortField === 'price' && (
                    sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-2 text-right cursor-pointer"
                onClick={() => handleSortChange('stock')}
              >
                <div className="flex items-center justify-end">
                  <span>Stock</span>
                  {sortField === 'stock' && (
                    sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                  )}
                </div>
              </th>
              <th className="px-4 py-2 text-center">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingProducts ? (
              // Loading state
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <FaSpinner className="w-6 h-6 mr-2 animate-spin text-brown-600" />
                    <span>Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : productsData?.products?.length === 0 ? (
              // Empty state
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  <p className="text-gray-500">No products found.</p>
                  <button
                    onClick={handleAddProduct}
                    className="mt-2 px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
                  >
                    Add your first product
                  </button>
                </td>
              </tr>
            ) : (
              // Products list
              productsData?.products?.map((product) => (
                <tr key={product.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="w-12 h-12 relative rounded overflow-hidden">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No image</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.category?.name || '-'}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(product.price)}</td>
                  <td className="px-4 py-2 text-right">{product.stock}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewProduct(product.id)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="View Product"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEditProduct(product.id)}
                        className="p-1 text-yellow-600 hover:text-yellow-800"
                        title="Edit Product"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => confirmDelete(product)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete Product"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {productsData?.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, productsData?.totalItems)} of {productsData?.totalItems} products
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaAngleDoubleLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`px-3 py-1 rounded ${
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: Math.min(5, productsData?.totalPages) }, (_, i) => {
              // Logic to handle showing correct page numbers
              let pageNum;
              if (productsData?.totalPages <= 5) {
                // If 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (page <= 3) {
                // If near the start
                pageNum = i + 1;
              } else if (page >= productsData?.totalPages - 2) {
                // If near the end
                pageNum = productsData?.totalPages - 4 + i;
              } else {
                // Somewhere in the middle
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded ${
                    page === pageNum
                      ? 'bg-brown-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === productsData?.totalPages}
              className={`px-3 py-1 rounded ${
                page === productsData?.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handlePageChange(productsData?.totalPages)}
              disabled={page === productsData?.totalPages}
              className={`px-3 py-1 rounded ${
                page === productsData?.totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaAngleDoubleRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={handleCancelDelete}></div>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
              <div className="px-6 py-4">
                <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-3 bg-gray-50 text-right">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brown-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirmed}
                  disabled={isDeleting}
                  className="ml-2 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {isDeleting ? (
                    <div className="flex items-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Deleting...
                    </div>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;