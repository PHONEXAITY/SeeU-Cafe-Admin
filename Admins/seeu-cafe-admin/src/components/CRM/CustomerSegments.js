'use client'
import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaBullseye, FaChartLine, FaFilter } from 'react-icons/fa';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Segment Modal Component
const SegmentModal = ({ isOpen, onClose, segment }) => {
  const [formData, setFormData] = useState(
    segment || {
      name: '',
      description: '',
      type: 'behavior',
      criteria: {
        purchaseAmount: '',
        lastPurchase: '',
        visitFrequency: '',
        location: '',
        customerAge: '',
      },
      tags: '',
      status: 'active'
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Segment data:', formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{segment ? 'Edit Segment' : 'Create Segment'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Segment Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Segment Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="behavior">Behavioral</SelectItem>
                <SelectItem value="demographic">Demographic</SelectItem>
                <SelectItem value="value">Value-based</SelectItem>
                <SelectItem value="lifecycle">Lifecycle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Segment Criteria</Label>
            <div className="space-y-4 mt-2">
              <div>
                <Label htmlFor="purchaseAmount">Minimum Purchase Amount ($)</Label>
                <Input
                  id="purchaseAmount"
                  type="number"
                  value={formData.criteria.purchaseAmount}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria, purchaseAmount: e.target.value }
                  })}
                  placeholder="e.g., 1000"
                />
              </div>

              <div>
                <Label htmlFor="lastPurchase">Last Purchase Within (days)</Label>
                <Input
                  id="lastPurchase"
                  type="number"
                  value={formData.criteria.lastPurchase}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria, lastPurchase: e.target.value }
                  })}
                  placeholder="e.g., 30"
                />
              </div>

              <div>
                <Label htmlFor="visitFrequency">Visit Frequency (per month)</Label>
                <Input
                  id="visitFrequency"
                  type="number"
                  value={formData.criteria.visitFrequency}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria, visitFrequency: e.target.value }
                  })}
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.criteria.location}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria, location: e.target.value }
                  })}
                  placeholder="e.g., New York"
                />
              </div>

              <div>
                <Label htmlFor="customerAge">Customer Age Range</Label>
                <Input
                  id="customerAge"
                  value={formData.criteria.customerAge}
                  onChange={(e) => setFormData({
                    ...formData,
                    criteria: { ...formData.criteria, customerAge: e.target.value }
                  })}
                  placeholder="e.g., 25-35"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="mt-1"
              placeholder="e.g., high-value, active, loyal"
            />
          </div>

          <DialogFooter>
            <Button type="submit">
              {segment ? 'Update Segment' : 'Create Segment'}
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

// Analytics Card Component
const AnalyticsCard = ({ title, value, description, icon: Icon }) => {
  return (
    <Card>
      <CardContent className="flex items-center p-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 mt-4">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className='mt-4'>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Main Segments Component
const CustomerSegments = () => {
  const [modalState, setModalState] = useState({ isOpen: false, segment: null });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Sample segments data
  const [segments] = useState([
    { 
      id: 1, 
      name: 'VIP Customers', 
      type: 'value',
      description: 'High-value customers with frequent purchases',
      count: 150, 
      criteria: 'Spent over $1000',
      lastUpdated: '2024-03-15',
      performance: '+15%',
      status: 'active'
    },
    { 
      id: 2, 
      name: 'Inactive Users', 
      type: 'behavior',
      description: 'Customers without recent activity',
      count: 300, 
      criteria: 'No purchase in 90 days',
      lastUpdated: '2024-03-14',
      performance: '-5%',
      status: 'active'
    },
    { 
      id: 3, 
      name: 'New Customers', 
      type: 'lifecycle',
      description: 'Recently acquired customers',
      count: 200, 
      criteria: 'Joined in last 30 days',
      lastUpdated: '2024-03-13',
      performance: '+25%',
      status: 'active'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Total Segments"
          value={segments.length}
          description="Active customer segments"
          icon={FaUsers}
        />
        <AnalyticsCard
          title="Segmented Customers"
          value="2,450"
          description="Customers in segments"
          icon={FaBullseye}
        />
        <AnalyticsCard
          title="Average Growth"
          value="+12%"
          description="Month over month"
          icon={FaChartLine}
        />
      </div>

      {/* Segments Management */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h2 className="text-2xl font-bold">Customer Segments</h2>
          <Button onClick={() => setModalState({ isOpen: true, segment: null })}>
            <FaPlus className="w-4 h-4 mr-2" />
            Create Segment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-grow">
            <Input
              placeholder="Search segments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="behavior">Behavioral</SelectItem>
              <SelectItem value="demographic">Demographic</SelectItem>
              <SelectItem value="value">Value-based</SelectItem>
              <SelectItem value="lifecycle">Lifecycle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Segments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {segments
            .filter(segment => 
              (filterType === 'all' || segment.type === filterType) &&
              segment.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((segment) => (
              <Card key={segment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className={`${segment.type === 'value' ? 'text-purple-600 bg-purple-50' : 
                        segment.type === 'behavior' ? 'text-blue-600 bg-blue-50' : 
                        segment.type === 'lifecycle' ? 'text-green-600 bg-green-50' : 
                        'text-gray-600 bg-gray-50'}`}
                    >
                      {segment.type}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setModalState({ isOpen: true, segment })}
                      >
                        <FaEdit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => console.log('Delete segment:', segment.id)}
                      >
                        <FaTrash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="mt-2">{segment.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{segment.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Members:</span>
                      <span className="font-medium">{segment.count}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Performance:</span>
                      <span className={`font-medium ${
                        segment.performance.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {segment.performance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Last Updated:</span>
                      <span className="text-gray-600">{segment.lastUpdated}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      <SegmentModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, segment: null })}
        segment={modalState.segment}
      />
    </div>
  );
};

export default CustomerSegments;