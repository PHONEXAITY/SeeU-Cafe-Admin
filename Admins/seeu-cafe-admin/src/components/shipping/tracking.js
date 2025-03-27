'use client'
import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaTruck, FaBox } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) return;

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrackingResult({
        trackingNumber: trackingNumber,
        status: 'In Transit',
        estimatedDelivery: '2024-02-25',
        currentLocation: 'Distribution Center, City',
        carrier: 'DHL Express',
        history: [
          { date: '2024-02-20 14:30', status: 'Package received', location: 'Warehouse A', icon: <FaBox /> },
          { date: '2024-02-21 09:15', status: 'In transit', location: 'Distribution Center', icon: <FaTruck /> },
          { date: '2024-02-21 15:45', status: 'Arrived at sorting facility', location: 'Main Hub', icon: <FaMapMarkerAlt /> },
        ]
      });
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  return (
    <div className="rounded-lg shadow-lg bg-white p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Track Shipment</h2>
        <p className="text-sm text-gray-500 mb-6">Enter your tracking number to get real-time updates</p>
        
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <Button 
            onClick={handleTrack} 
            disabled={!trackingNumber.trim() || loading}
          >
            {loading ? 'Tracking...' : 'Track Package'}
          </Button>
        </div>

        {trackingResult && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-500">Tracking Number</label>
                  <p className="font-medium">{trackingResult.trackingNumber}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Carrier</label>
                  <p className="font-medium">{trackingResult.carrier}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Current Status</label>
                  <p className="font-medium text-blue-600">{trackingResult.status}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Estimated Delivery</label>
                  <p className="font-medium">{trackingResult.estimatedDelivery}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm text-gray-500">Current Location</label>
                  <p className="font-medium">{trackingResult.currentLocation}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Tracking History</h3>
              <div className="space-y-4">
                {trackingResult.history.map((event, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100">
                    <div className="text-blue-500 mt-1">
                      {event.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{event.status}</p>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{event.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
  export default Tracking;