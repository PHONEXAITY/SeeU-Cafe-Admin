'use client'

import React, { useState } from 'react';
import { FaStar, FaCheck, FaBan, FaEdit, FaTrash, FaFilter, FaSearch } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Star Rating Component
const StarRating = ({ rating, size = "normal" }) => {
  const sizes = {
    small: "w-3 h-3",
    normal: "w-5 h-5",
    large: "w-6 h-6"
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`${sizes[size]} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

// Review Action Modal
const ReviewModal = ({ isOpen, onClose, mode, review }) => {
  const [formData, setFormData] = useState(
    mode === 'edit' ? review : {
      status: 'pending',
      adminReply: '',
      moderationNotes: ''
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    onClose();
  };

  const titles = {
    edit: 'Edit Review',
    moderate: 'Moderate Review',
    delete: 'Confirm Delete'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{titles[mode]}</DialogTitle>
        </DialogHeader>

        {mode !== 'delete' ? (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={review?.userAvatar || '/api/placeholder/40/40'} 
                      alt={review?.userName}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{review?.userName}</p>
                      <p className="text-sm text-gray-500">{review?.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review?.rating} />
                </div>
                <p className="text-gray-700">{review?.comment}</p>
              </div>

              <div>
                <Label>Status</Label>
                <div className="flex gap-2 mt-2">
                  {['approved', 'pending', 'rejected'].map((status) => (
                    <Button
                      key={status}
                      type="button"
                      variant={formData.status === status ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, status })}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="adminReply">Public Reply</Label>
                <Textarea
                  id="adminReply"
                  value={formData.adminReply}
                  onChange={(e) => setFormData({ ...formData, adminReply: e.target.value })}
                  placeholder="Write a public reply to this review..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="moderationNotes">Internal Notes</Label>
                <Textarea
                  id="moderationNotes"
                  value={formData.moderationNotes}
                  onChange={(e) => setFormData({ ...formData, moderationNotes: e.target.value })}
                  placeholder="Add internal notes about moderation decision..."
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                Save Changes
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <p className="text-center py-4">Are you sure you want to delete this review?</p>
            <DialogFooter>
              <Button variant="destructive" onClick={onClose}>Delete</Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Reviews List Page
const ReviewsList = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: null, review: null });
  const [filters, setFilters] = useState({
    status: 'all',
    rating: 'all',
    searchQuery: ''
  });

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      userName: "John Doe",
      userAvatar: "/api/placeholder/40/40",
      productName: "Espresso",
      productImage: "/api/placeholder/50/50",
      rating: 5,
      comment: "Best coffee I've ever had! The espresso was perfectly brewed.",
      date: "2024-03-15",
      status: "approved",
      adminReply: "Thank you for your wonderful feedback!",
      moderationNotes: "Genuine review, approved"
    },
    {
      id: 2,
      userName: "Jane Smith",
      userAvatar: "/api/placeholder/40/40",
      productName: "Cappuccino",
      productImage: "/api/placeholder/50/50",
      rating: 4,
      comment: "Great cappuccino but could be a bit hotter.",
      date: "2024-03-14",
      status: "pending",
      adminReply: "",
      moderationNotes: ""
    },
    // Add more reviews as needed
  ];

  const openModal = (mode, review = null) => {
    setModalState({ isOpen: true, mode, review });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: null, review: null });
  };

  const getStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Filter by Status</Label>
              <div className="flex gap-2 mt-2">
                {['all', 'approved', 'pending', 'rejected'].map((status) => (
                  <Button
                    key={status}
                    variant={filters.status === status ? 'default' : 'outline'}
                    onClick={() => setFilters({ ...filters, status })}
                    size="sm"
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Filter by Rating</Label>
              <div className="flex gap-2 mt-2">
                {['all', '5', '4', '3', '2', '1'].map((rating) => (
                  <Button
                    key={rating}
                    variant={filters.rating === rating ? 'default' : 'outline'}
                    onClick={() => setFilters({ ...filters, rating })}
                    size="sm"
                  >
                    {rating === 'all' ? 'All' : `${rating} ★`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search reviews..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="divide-y divide-gray-200">
          {reviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-64 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{review.productName}</h3>
                      <StarRating rating={review.rating} size="small" />
                    </div>
                  </div>
                </div>

                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={review.userAvatar}
                        alt={review.userName}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{review.userName}</p>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-700">{review.comment}</p>
                  
                  {review.adminReply && (
                    <div className="mt-3 pl-4 border-l-2 border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Admin Reply:</span> {review.adminReply}
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('moderate', review)}
                    >
                      <FaCheck className="w-4 h-4 mr-2" />
                      Moderate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('edit', review)}
                    >
                      <FaEdit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal('delete', review)}
                    >
                      <FaTrash className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ReviewModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        mode={modalState.mode}
        review={modalState.review}
      />
    </div>
  );
};

export default ReviewsList;