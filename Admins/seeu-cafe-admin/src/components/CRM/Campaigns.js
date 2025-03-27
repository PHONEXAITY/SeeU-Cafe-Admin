'use client'
import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Campaign Modal Component
const CampaignModal = ({ isOpen, onClose, campaign }) => {
  const [formData, setFormData] = useState(
    campaign || {
      name: '',
      type: 'email',
      status: 'draft',
      segment: '',
      subject: '',
      content: '',
      scheduledDate: '',
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Campaign data:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{campaign ? 'Edit Campaign' : 'Create Campaign'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Campaign Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Campaign Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email Campaign</SelectItem>
                <SelectItem value="sms">SMS Campaign</SelectItem>
                <SelectItem value="push">Push Notification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="segment">Target Segment</Label>
            <Select
              value={formData.segment}
              onValueChange={(value) => setFormData({ ...formData, segment: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="active">Active Users</SelectItem>
                <SelectItem value="inactive">Inactive Users</SelectItem>
                <SelectItem value="vip">VIP Customers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subject">Subject/Title</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="scheduledDate">Schedule Date</Label>
            <Input
              id="scheduledDate"
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="mt-1"
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              {campaign ? 'Update Campaign' : 'Create Campaign'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Main Campaigns Component
const Campaigns = () => {
  const [modalState, setModalState] = useState({ isOpen: false, campaign: null });
  
  // Sample campaigns data
  const [campaigns] = useState([
    { id: 1, name: 'Summer Sale', type: 'email', status: 'active', segment: 'all', sentDate: '2024-03-15' },
    { id: 2, name: 'Welcome Series', type: 'email', status: 'draft', segment: 'new', sentDate: null },
    { id: 3, name: 'Re-engagement', type: 'push', status: 'scheduled', segment: 'inactive', sentDate: '2024-03-20' },
  ]);

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      draft: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold">Campaigns</h2>
          <Button onClick={() => setModalState({ isOpen: true, campaign: null })}>
            <FaPlus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>

        <div className="bg-white rounded-lg divide-y divide-gray-200">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 hover:bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-medium">{campaign.name}</h3>
                  <p className="text-sm text-gray-500">
                    Type: {campaign.type} | Segment: {campaign.segment}
                  </p>
                  {campaign.sentDate && (
                    <p className="text-sm text-gray-500">Sent: {campaign.sentDate}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(campaign.status)}>
                    {campaign.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setModalState({ isOpen: true, campaign })}
                  >
                    <FaEdit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => console.log('Delete campaign:', campaign.id)}
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CampaignModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, campaign: null })}
        campaign={modalState.campaign}
      />
    </div>
  );
};

export default Campaigns;