'use client'
import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CarrierModal } from './CarrierModal';

const Carriers = () => {
  const [modalState, setModalState] = useState({ isOpen: false, mode: null, carrier: null });
  const [searchTerm, setSearchTerm] = useState('');
  
    // Sample carriers data
    const carriers = [
      {
        id: 1,
        name: 'DHL Express',
        contactPerson: 'Jane Smith',
        email: 'jane.smith@dhl.com',
        phone: '+1234567890',
        serviceTypes: ['Express', 'Standard', 'Economy'],
        status: 'Active'
      },
      {
        id: 2,
        name: 'FedEx',
        contactPerson: 'John Brown',
        email: 'john.brown@fedex.com',
        phone: '+1234567891',
        serviceTypes: ['Priority', 'Standard', 'Ground'],
        status: 'Active'
      },
      // Add more carriers...
    ];
  
    const filteredCarriers = carriers.filter(carrier => 
        carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        carrier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
      const handleAction = async (action, carrier = null) => {
        switch (action) {
          case 'create':
            // Handle create
            console.log('Creating carrier');
            break;
          case 'edit':
            // Handle edit
            console.log('Editing carrier:', carrier);
            break;
          case 'delete':
            // Handle delete
            console.log('Deleting carrier:', carrier);
            break;
          default:
            break;
        }
      };
    
      return (
        <div className="rounded-lg shadow-lg bg-white p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Shipping Carriers</h2>
              <p className="text-sm text-gray-500 mt-1">Manage shipping carriers and services</p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search carriers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <Button 
                onClick={() => setModalState({ isOpen: true, mode: 'create', carrier: null })} 
                className="flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                Add Carrier
              </Button>
            </div>
          </div>
    
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCarriers.map((carrier) => (
              <div key={carrier.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                {/* ... your existing carrier card JSX ... */}
              </div>
            ))}
          </div>
    
          <CarrierModal
            isOpen={modalState.isOpen}
            onClose={() => setModalState({ isOpen: false, mode: null, carrier: null })}
            mode={modalState.mode}
            carrier={modalState.carrier}
          />
        </div>
      );
    };
export default Carriers;