'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, useUpdateOrderStatus, formatCurrency, orderStatusOptions, getOrderStatusColor, paymentStatusOptions, getPaymentStatusColor } from '@/hooks/orderHooks';
import { FaUser, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaTruck, FaMoneyBillWave, FaArrowLeft, FaPrint, FaSpinner, FaEdit, FaCheck } from 'react-icons/fa';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const OrderDetails = ({ orderId }) => {
  const router = useRouter();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  // Fetch order details
  const { 
    data: order, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useOrder(orderId);
  
  // Update order status mutation
  const { 
    mutate: updateStatus, 
    isLoading: isUpdatingStatus 
  } = useUpdateOrderStatus();
  
  // Handle back button click
  const handleBackClick = () => {
    router.push('/orders');
  };
  
  // Handle edit status click
  const handleEditStatusClick = () => {
    setNewStatus(order?.status || '');
    setIsEditingStatus(true);
  };
  
  // Handle status change
  const handleStatusChange = (e) => {
    setNewStatus(e.target.value);
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditingStatus(false);
  };
  
  // Handle save status
  const handleSaveStatus = () => {
    updateStatus(
      { id: orderId, status: newStatus },
      {
        onSuccess: () => {
          setIsEditingStatus(false);
          refetch();
          toast.success(`Order status updated to ${newStatus}`);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to update status');
        }
      }
    );
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="w-8 h-8 text-brown-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading order details...</span>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-red-600 mb-2">Error loading order</h2>
        <p className="text-gray-600">{error?.message || 'Please try again later'}</p>
        <button
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
        >
          Go Back to Orders
        </button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl text-gray-800 mb-2">Order Not Found</h2>
        <p className="text-gray-600">The order you're looking for does not exist.</p>
        <button
          onClick={handleBackClick}
          className="mt-4 px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
        >
          Go Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Order Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 print:hidden">
        <div className="flex items-center">
          <button
            onClick={handleBackClick}
            className="mr-4 text-gray-500 hover:text-brown-600"
          >
            <FaArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-800">
            Order #{order.orderNumber}
          </h1>
        </div>
        <div className="flex mt-4 sm:mt-0">
          <button
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors mr-2"
          >
            <FaPrint className="mr-2" />
            Print
          </button>
          {!isEditingStatus ? (
            <button
              onClick={handleEditStatusClick}
              className="flex items-center px-4 py-2 bg-brown-600 text-white rounded-md hover:bg-brown-700 transition-colors"
            >
              <FaEdit className="mr-2" />
              Edit Status
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStatus}
                disabled={isUpdatingStatus}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                {isUpdatingStatus ? (
                  <>
                    <FaSpinner className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Save
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Order Info and Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Order Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Order Date</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                  order.paymentStatus
                )}`}
              >
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <FaUser className="text-gray-400 mt-1 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{order.customer?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaEnvelope className="text-gray-400 mt-1 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{order.customer?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaPhoneAlt className="text-gray-400 mt-1 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{order.customer?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Shipping Information</h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-gray-400 mt-1 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{order.shippingAddress?.address || 'N/A'}</p>
                <p className="font-medium">
                  {order.shippingAddress?.city || ''}{order.shippingAddress?.city && order.shippingAddress?.postalCode ? ', ' : ''}
                  {order.shippingAddress?.postalCode || ''}
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <FaTruck className="text-gray-400 mt-1 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Shipping Method</p>
                <p className="font-medium">{order.shippingMethod || 'Standard'}</p>
              </div>
            </div>
            <div className="flex items-start">
              <FaMoneyBillWave className="text-gray-400 mt-1 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Shipping Cost</p>
                <p className="font-medium">{formatCurrency(order.shippingCost || 0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Status */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Order Status</h2>
        {isEditingStatus ? (
          <div className="flex items-center">
            <select
              value={newStatus}
              onChange={handleStatusChange}
              className="border border-gray-300 rounded-md focus:outline-none focus:ring-brown-500 focus:border-brown-500 p-2 mr-4"
            >
              {orderStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(
                order.status
              )}`}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
        )}
      </div>
      
      {/* Order Items */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Order Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-center">Quantity</th>
                <th className="px-4 py-2 text-right">Price</th>
                <th className="px-4 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-12 h-12 relative rounded overflow-hidden">
                          {item.product?.image ? (
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{item.product?.name || 'Unknown Product'}</p>
                        {item.options && Object.keys(item.options).length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {Object.entries(item.options).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key}: <span className="font-medium">{value}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-right">{formatCurrency(item.price)}</td>
                  <td className="px-4 py-2 text-right font-medium">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-800 mb-4">Order Summary</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">{formatCurrency(order.shippingCost)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-{formatCurrency(order.discount)}</span>
              </div>
            )}
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{formatCurrency(order.tax)}</span>
              </div>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Notes */}
      {order.notes && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Order Notes</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700">{order.notes}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;