"use client";

import { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Filter, Users, SortAsc, Calendar } from "lucide-react";
import { 
  Card,
  CardContent
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TableFilter = ({ onFilterChange }) => {
  const [status, setStatus] = useState('');
  const [capacity, setCapacity] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  const handleStatusChange = (value) => {
    setStatus(value);
    applyFilters({ status: value, capacity, tableNumber });
  };

  const handleCapacityChange = (e) => {
    const value = e.target.value;
    setCapacity(value);
    if (value === '') {
      applyFilters({ status, capacity: null, tableNumber });
    }
  };

  const handleTableNumberChange = (e) => {
    const value = e.target.value;
    setTableNumber(value);
    if (value === '') {
      applyFilters({ status, capacity, tableNumber: null });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters({ status, capacity, tableNumber });
  };

  const applyFilters = (filters) => {
    const appliedFilters = {};
    
    if (filters.status) {
      appliedFilters.status = filters.status;
    }
    
    if (filters.capacity && !isNaN(parseInt(filters.capacity))) {
      appliedFilters.capacity = parseInt(filters.capacity);
    }
    
    if (filters.tableNumber && !isNaN(parseInt(filters.tableNumber))) {
      appliedFilters.tableNumber = parseInt(filters.tableNumber);
    }
    
    onFilterChange(Object.keys(appliedFilters).length > 0 ? appliedFilters : null);
  };

  const clearFilters = () => {
    setStatus('');
    setCapacity('');
    setTableNumber('');
    onFilterChange(null);
  };

  const hasActiveFilters = status || capacity || tableNumber;

  return (
    <Card className="border border-gray-100 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center text-gray-700">
                <Calendar size={16} className="mr-2 text-gray-500" />
                ສະຖານະໂຕະ
              </label>
              <Select
                value={status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="h-9 border-gray-200 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder="ທຸກສະຖານະ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ທຸກສະຖານະ</SelectItem>
                  <SelectItem value="available">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      ພ້ອມຊ້ງານ
                    </div>
                  </SelectItem>
                  <SelectItem value="reserved">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      ຈອງແລ້ວ
                    </div>
                  </SelectItem>
                  <SelectItem value="occupied">
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      ກຳລັງໃຊ້ງານ
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center text-gray-700">
                <Users size={16} className="mr-2 text-gray-500" />
                ຈຳນວນທີ່ນັ່ງ (ຢ່າງນ້ອຍ)
              </label>
              <Input
                type="number"
                placeholder="ຈຳນວນທີ່ນັ່ງ"
                value={capacity}
                onChange={handleCapacityChange}
                min="1"
                className="h-9 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center text-gray-700">
                <SortAsc size={16} className="mr-2 text-gray-500" />
                ເລກໂຕະ
              </label>
              <Input
                type="number"
                placeholder="ເລກໂຕະ"
                value={tableNumber}
                onChange={handleTableNumberChange}
                min="1"
                className="h-9 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                    className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    size="sm"
                  >
                    <X size={16} className="mr-2" />
                    ລ້າງຕົວກອງ
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ລ້າງຕົວກອງທັງໝົດ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Search size={16} className="mr-2" />
                    ຄົ້ນຫາ
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ຄົ້ນຫາຕາມເງື່ອນໄຂ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </form>
        
        {hasActiveFilters && (
          <div className="bg-blue-50 p-3 border-t border-blue-100">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-blue-700 font-medium">ຕົວກອງທີ່ໃຊ້:</span>
              
              {status && (
                <div className="bg-white rounded-full px-2 py-1 text-xs flex items-center border border-blue-200">
                  <span className="text-blue-700 mr-1">ສະຖານະ:</span>
                  <span className="font-medium">
                    {status === 'available' ? 'ພ້ອມໃຊ້ງານ' : 
                     status === 'reserved' ? 'ຈອງແລ້ວ' : 
                     status === 'occupied' ? 'ກຳລັງໃຊ້ງານ' : status}
                  </span>
                  <button 
                    onClick={() => {
                      setStatus('');
                      applyFilters({ status: '', capacity, tableNumber });
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {capacity && (
                <div className="bg-white rounded-full px-2 py-1 text-xs flex items-center border border-blue-200">
                  <span className="text-blue-700 mr-1">ທີ່ນັ່ງ ≥:</span>
                  <span className="font-medium">{capacity}</span>
                  <button 
                    onClick={() => {
                      setCapacity('');
                      applyFilters({ status, capacity: null, tableNumber });
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              {tableNumber && (
                <div className="bg-white rounded-full px-2 py-1 text-xs flex items-center border border-blue-200">
                  <span className="text-blue-700 mr-1">ເລກໂຕະ:</span>
                  <span className="font-medium">{tableNumber}</span>
                  <button 
                    onClick={() => {
                      setTableNumber('');
                      applyFilters({ status, capacity, tableNumber: null });
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 text-xs hover:bg-blue-100 p-1 h-auto"
                onClick={clearFilters}
              >
                ລ້າງທັງໝົດ
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TableFilter;