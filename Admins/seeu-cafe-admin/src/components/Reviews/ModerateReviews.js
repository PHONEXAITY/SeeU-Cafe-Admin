'use client'

import React, { useState } from 'react';
import { FaStar, FaCheck, FaBan, FaFlag, FaSearch, FaExclamationTriangle } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Reuse StarRating component from previous code
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

// Moderation Action Modal
const ModerationModal = ({ isOpen, onClose, review }) => {
  const [decision, setDecision] = useState({
    status: 'pending',
    adminReply: '',
    moderationNotes: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Moderation submitted:', decision);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Review Moderation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Review Content Preview */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={review?.userAvatar || '/api/placeholder/40/40'}
                    alt={review?.userName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{review?.userName}</p>
                    <p className="text-sm text-gray-500">{review?.date}</p>
                  </div>
                </div>
                <StarRating rating={review?.rating} />
              </div>
              <div className="flex gap-2">
                <img 
                  src={review?.productImage || '/api/placeholder/40/40'}
                  alt={review?.productName}
                  className="w-12 h-12 rounded object-cover"
                />
                <div>
                  <p className="font-medium">{review?.productName}</p>
                  <p className="text-sm text-gray-500">Product ID: {review?.productId}</p>
                </div>
              </div>
              <p className="text-gray-700">{review?.comment}</p>
            </div>

            {/* Moderation Actions */}
            <div className="space-y-4">
              <div>
                <Label>Moderation Decision</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={decision.status === 'approved' ? 'default' : 'outline'}
                    onClick={() => setDecision({ ...decision, status: 'approved' })}
                    className="flex-1"
                  >
                    <FaCheck className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    type="button"
                    variant={decision.status === 'rejected' ? 'destructive' : 'outline'}
                    onClick={() => setDecision({ ...decision, status: 'rejected' })}
                    className="flex-1"
                  >
                    <FaBan className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    type="button"
                    variant={decision.status === 'flagged' ? 'default' : 'outline'}
                    onClick={() => setDecision({ ...decision, status: 'flagged' })}
                    className="flex-1"
                  >
                    <FaFlag className="w-4 h-4 mr-2" />
                    Flag
                  </Button>
                </div>
              </div>

              {decision.status === 'rejected' && (
                <div>
                  <Label htmlFor="reason">Rejection Reason</Label>
                  <select
                    id="reason"
                    className="w-full mt-1 rounded-md border border-gray-300 p-2"
                    value={decision.reason}
                    onChange={(e) => setDecision({ ...decision, reason: e.target.value })}
                  >
                    <option value="">Select a reason</option>
                    <option value="inappropriate">Inappropriate Content</option>
                    <option value="spam">Spam</option>
                    <option value="offensive">Offensive Language</option>
                    <option value="fake">Fake Review</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              <div>
                <Label htmlFor="adminReply">Public Reply (Optional)</Label>
                <Textarea
                  id="adminReply"
                  value={decision.adminReply}
                  onChange={(e) => setDecision({ ...decision, adminReply: e.target.value })}
                  placeholder="Write a public response to this review..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="moderationNotes">Internal Notes</Label>
                <Textarea
                  id="moderationNotes"
                  value={decision.moderationNotes}
                  onChange={(e) => setDecision({ ...decision, moderationNotes: e.target.value })}
                  placeholder="Add internal notes about your decision..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Submit Decision</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Moderation Page Component
const ModerateReviews = () => {
  const [selectedReviews, setSelectedReviews] = useState(new Set());
  const [modalState, setModalState] = useState({ isOpen: false, review: null });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample pending reviews data
  const pendingReviews = [
    {
      id: 1,
      userName: "John Smith",
      userAvatar: "/api/placeholder/40/40",
      productName: "Espresso",
      productImage: "/api/placeholder/50/50",
      productId: "PROD001",
      rating: 2,
      comment: "The coffee was cold and the service was slow.",
      date: "2024-03-15",
      flags: ["inappropriate"],
      aiAnalysis: {
        sentiment: "negative",
        toxicity: "low",
        spam: "unlikely"
      }
    },
    {
      id: 2,
      userName: "Alice Johnson",
      userAvatar: "/api/placeholder/40/40",
      productName: "Cappuccino",
      productImage: "/api/placeholder/50/50",
      productId: "PROD002",
      rating: 5,
      comment: "Amazing coffee and wonderful service! Will definitely come back again.",
      date: "2024-03-15",
      flags: [],
      aiAnalysis: {
        sentiment: "positive",
        toxicity: "none",
        spam: "unlikely"
      }
    },
    // Add more reviews as needed
  ];

  const handleBatchAction = (action) => {
    console.log(`Batch ${action} for reviews:`, Array.from(selectedReviews));
    setSelectedReviews(new Set());
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Reviews</p>
              <p className="text-2xl font-bold">24</p>
            </div>
            <FaExclamationTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Flagged Reviews</p>
              <p className="text-2xl font-bold">8</p>
            </div>
            <FaFlag className="w-8 h-8 text-red-400" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Response Time</p>
              <p className="text-2xl font-bold">2.4h</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm font-medium">↓12%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="flex gap-2">
              {['all', 'pending', 'flagged', 'spam'].map((filterOption) => (
                <Button
                  key={filterOption}
                  variant={filter === filterOption ? 'default' : 'outline'}
                  onClick={() => setFilter(filterOption)}
                  size="sm"
                >
                  {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="w-full md:w-72">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedReviews.size > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg shadow flex items-center justify-between">
          <p className="text-sm text-blue-700">
            {selectedReviews.size} reviews selected
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBatchAction('approve')}
            >
              <FaCheck className="w-4 h-4 mr-2" />
              Approve All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleBatchAction('reject')}
            >
              <FaBan className="w-4 h-4 mr-2" />
              Reject All
            </Button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="divide-y divide-gray-200">
          {pendingReviews.map((review) => (
            <div key={review.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  checked={selectedReviews.has(review.id)}
                  onChange={(e) => {
                    const newSelected = new Set(selectedReviews);
                    if (e.target.checked) {
                      newSelected.add(review.id);
                    } else {
                      newSelected.delete(review.id);
                    }
                    setSelectedReviews(newSelected);
                  }}
                  className="mt-1"
                />

                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.productImage}
                        alt={review.productName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{review.productName}</h3>
                          <span className="text-sm text-gray-500">#{review.productId}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <img
                            src={review.userAvatar}
                            alt={review.userName}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-600">{review.userName}</span>
                        </div>
                        <StarRating rating={review.rating} size="small" />
                      </div>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span className="text-sm text-gray-500">{review.date}</span>
                      {review.flags.length > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                          Flagged: {review.flags.join(', ')}
                        </span>
                      )}
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          review.aiAnalysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          review.aiAnalysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {review.aiAnalysis.sentiment}
                        </span>
                        // ต่อจากโค้ดก่อนหน้า...

{review.aiAnalysis.toxicity !== 'none' && (
  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
    Toxicity: {review.aiAnalysis.toxicity}
  </span>
)}
{review.aiAnalysis.spam !== 'unlikely' && (
  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
    Potential Spam
  </span>
)}
</div>
</div>
</div>

<div className="mt-4">
<p className="text-gray-700">{review.comment}</p>
</div>

<div className="mt-4 flex flex-wrap gap-2">
<Button
variant="outline"
size="sm"
className="text-green-600 hover:bg-green-50"
onClick={() => setModalState({ isOpen: true, review })}
>
<FaCheck className="w-4 h-4 mr-2" />
Approve
</Button>
<Button
variant="outline"
size="sm"
className="text-red-600 hover:bg-red-50"
onClick={() => setModalState({ isOpen: true, review })}
>
<FaBan className="w-4 h-4 mr-2" />
Reject
</Button>
<Button
variant="outline"
size="sm"
onClick={() => setModalState({ isOpen: true, review })}
>
Moderate with Reply
</Button>
</div>
</div>
</div>
</div>
))}
</div>
</div>

{/* Moderation Guidelines */}
<div className="bg-white p-6 rounded-lg shadow-lg">
<h3 className="text-lg font-medium mb-4">Moderation Guidelines</h3>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
<div className="p-4 bg-green-50 rounded-lg">
<h4 className="font-medium text-green-800 mb-2">When to Approve</h4>
<ul className="text-sm text-green-700 space-y-1">
<li>• Genuine customer experience</li>
<li>• Constructive feedback</li>
<li>• Follows community guidelines</li>
</ul>
</div>
<div className="p-4 bg-red-50 rounded-lg">
<h4 className="font-medium text-red-800 mb-2">When to Reject</h4>
<ul className="text-sm text-red-700 space-y-1">
<li>• Inappropriate content</li>
<li>• Spam or promotional content</li>
<li>• Offensive language</li>
</ul>
</div>
<div className="p-4 bg-yellow-50 rounded-lg">
<h4 className="font-medium text-yellow-800 mb-2">When to Flag</h4>
<ul className="text-sm text-yellow-700 space-y-1">
<li>• Potential fake reviews</li>
<li>• Needs further investigation</li>
<li>• Requires manager attention</li>
</ul>
</div>
</div>
</div>

{/* Keyboard Shortcuts */}
<div className="bg-gray-50 p-4 rounded-lg">
<p className="text-sm text-gray-600 text-center">
Keyboard shortcuts: <span className="font-mono">A</span> to approve, <span className="font-mono">R</span> to reject, <span className="font-mono">F</span> to flag, <span className="font-mono">M</span> to open moderation modal
</p>
</div>

<ModerationModal
isOpen={modalState.isOpen}
onClose={() => setModalState({ isOpen: false, review: null })}
review={modalState.review}
/>
</div>
);
};

export default ModerateReviews;