'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDeliveries } from '@/hooks/useDelivery';
import useEmployees from '@/hooks/useEmployees';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from "@/components/ui/tabs";
import { 
  Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  CheckCircle, Clock, Package, Truck, X, MoreVertical, Search, Filter, Plus,
  AlertTriangle, RefreshCw, MapPin, Calendar, User, ArrowUpDown, Eye, Edit,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, PhoneCall, ExternalLink
} from 'lucide-react';
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

// Status color and icon configurations
const statusConfigs = {
  pending: {
    bg: "bg-yellow-100", 
    text: "text-yellow-800", 
    border: "border-yellow-200",
    icon: <Clock className="h-4 w-4 text-yellow-600" />
  },
  preparing: {
    bg: "bg-blue-100", 
    text: "text-blue-800", 
    border: "border-blue-200",
    icon: <Package className="h-4 w-4 text-blue-600" />
  },
  out_for_delivery: {
    bg: "bg-purple-100", 
    text: "text-purple-800", 
    border: "border-purple-200",
    icon: <Truck className="h-4 w-4 text-purple-600" />
  },
  delivered: {
    bg: "bg-green-100", 
    text: "text-green-800", 
    border: "border-green-200",
    icon: <CheckCircle className="h-4 w-4 text-green-600" />
  },
  cancelled: {
    bg: "bg-red-100", 
    text: "text-red-800", 
    border: "border-red-200",
    icon: <X className="h-4 w-4 text-red-600" />
  }
};

// Translate status to Lao
const translateStatus = (status) => {
  const translations = {
    pending: "ລໍຖ້າ",
    preparing: "ກຳລັງກະກຽມ",
    out_for_delivery: "ອອກສົ່ງແລ້ວ",
    delivered: "ສົ່ງແລ້ວ",
    cancelled: "ຍົກເລີກ"
  };
  return translations[status] || status;
};

// Status badge component with consistent styling
const DeliveryStatusBadge = ({ status }) => {
  const statusConfig = statusConfigs[status] || statusConfigs.pending;
  
  return (
    <Badge 
      variant="outline" 
      className={`flex items-center gap-1 ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
    >
      {statusConfig.icon}
      <span>{translateStatus(status)}</span>
    </Badge>
  );
};

// Format date with contextual display
const formatDateDisplay = (dateString) => {
  if (!dateString) return "ບໍ່ມີຂໍ້ມູນ";
  
  const date = new Date(dateString);
  
  if (isToday(date)) {
    return `ມື້ນີ້ ${format(date, 'HH:mm')}`;
  } else if (isYesterday(date)) {
    return `ມື້ວານນີ້ ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'dd/MM/yyyy HH:mm');
  }
};

// Main Dashboard Component
export default function DeliveryDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Filters state
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    from_date: '',
    to_date: '',
    employee_id: '',
  });
  
  // Fetch deliveries using custom hook
  const {
    deliveries,
    loading,
    error,
    updateFilters,
    refetch,
  } = useDeliveries();
  
  // Fetch employees for filter dropdown
  const { employees } = useEmployees();
  
  // Calculate stats from deliveries data
  const stats = React.useMemo(() => {
    return {
      total: deliveries?.length || 0,
      pending: deliveries?.filter(d => d.status === 'pending')?.length || 0,
      preparing: deliveries?.filter(d => d.status === 'preparing')?.length || 0,
      out_for_delivery: deliveries?.filter(d => d.status === 'out_for_delivery')?.length || 0,
      delivered: deliveries?.filter(d => d.status === 'delivered')?.length || 0,
      cancelled: deliveries?.filter(d => d.status === 'cancelled')?.length || 0,
    };
  }, [deliveries]);

  // Update filters when tab changes
  useEffect(() => {
    if (activeTab === 'all') {
      setFilters(prev => ({ ...prev, status: '' }));
      updateFilters({ status: '' });
    } else {
      setFilters(prev => ({ ...prev, status: activeTab }));
      updateFilters({ status: activeTab });
    }
    setCurrentPage(1);
  }, [activeTab, updateFilters]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Apply filters to API
  const applyFilters = () => {
    updateFilters(filters);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      status: activeTab !== 'all' ? activeTab : '',
      search: '',
      from_date: '',
      to_date: '',
      employee_id: '',
    });
    
    updateFilters({
      status: activeTab !== 'all' ? activeTab : '',
    });
    
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(prev => (sortBy === field && prev === 'asc' ? 'desc' : 'asc'));
  };

  // Process deliveries for display with sorting and pagination
  const displayedDeliveries = React.useMemo(() => {
    if (!deliveries?.length) return [];
    
    // Sort data
    const sortedData = [...deliveries].sort((a, b) => {
      if (['created_at', 'updated_at', 'estimated_delivery_time'].includes(sortBy)) {
        const dateA = new Date(a[sortBy] || '1970-01-01');
        const dateB = new Date(b[sortBy] || '1970-01-01');
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const valA = a[sortBy] || '';
        const valB = b[sortBy] || '';
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortOrder === 'asc' ? valA - valB : valB - valA;
        }
        
        return sortOrder === 'asc' 
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }
    });
    
    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return sortedData.slice(startIndex, endIndex);
  }, [deliveries, sortBy, sortOrder, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(
    deliveries?.length ? deliveries.length / itemsPerPage : 0
  );

  // Handle page changes
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  // Navigation helpers
  const navigateToDetail = (id) => {
    router.push(`/deliveries/${id}`);
  };

  const navigateToEdit = (id) => {
    router.push(`/deliveries/${id}/edit`);
  };

  const navigateToTrack = (id) => {
    router.push(`/deliveries/${id}/track`);
  };

  const navigateToCreate = () => {
    router.push('/deliveries/create');
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2 text-gray-900">
            <Truck className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ລາຍການຈັດສົ່ງ
            </span>
          </h1>
          <p className="text-gray-500">
            ຈັດການແລະຕິດຕາມການຈັດສົ່ງທັງໝົດ
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" /> ໂຫຼດຄືນໃໝ່
          </Button>
          
          <Button 
            onClick={navigateToCreate}
            size="sm"
            className="flex items-center gap-1 bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 shadow-sm"
          >
            <Plus className="h-4 w-4" /> ສ້າງການຈັດສົ່ງໃໝ່
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <Card className="bg-gray-50 border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">{stats.total}</span>
              <span className="text-sm text-gray-500">ທັງໝົດ</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`bg-yellow-50 border border-yellow-200 shadow-sm hover:shadow transition-shadow ${activeTab === 'pending' ? 'ring-2 ring-yellow-400' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-yellow-600">{stats.pending}</span>
              <span className="text-sm text-yellow-600">ລໍຖ້າ</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-blue-50 border border-blue-200 shadow-sm hover:shadow transition-shadow ${activeTab === 'preparing' ? 'ring-2 ring-blue-400' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{stats.preparing}</span>
              <span className="text-sm text-blue-600">ກຳລັງກະກຽມ</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-purple-50 border border-purple-200 shadow-sm hover:shadow transition-shadow ${activeTab === 'out_for_delivery' ? 'ring-2 ring-purple-400' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-purple-600">{stats.out_for_delivery}</span>
              <span className="text-sm text-purple-600">ກຳລັງສົ່ງ</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-green-50 border border-green-200 shadow-sm hover:shadow transition-shadow ${activeTab === 'delivered' ? 'ring-2 ring-green-400' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-green-600">{stats.delivered}</span>
              <span className="text-sm text-green-600">ສົ່ງແລ້ວ</span>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-red-50 border border-red-200 shadow-sm hover:shadow transition-shadow ${activeTab === 'cancelled' ? 'ring-2 ring-red-400' : ''}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-red-600">{stats.cancelled}</span>
              <span className="text-sm text-red-600">ຍົກເລີກ</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Status Tabs and View Toggles */}
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full mb-6"
      >
        <div className="flex justify-between items-center mb-3">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">ທັງໝົດ</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">ລໍຖ້າ</TabsTrigger>
            <TabsTrigger value="preparing" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">ກຳລັງກະກຽມ</TabsTrigger>
            <TabsTrigger value="out_for_delivery" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">ກຳລັງສົ່ງ</TabsTrigger>
            <TabsTrigger value="delivered" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">ສົ່ງແລ້ວ</TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm rounded-md">ຍົກເລີກ</TabsTrigger>
          </TabsList>
          
          {/* View Toggle Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="px-3"
            >
              ຕາຕະລາງ
            </Button>
            <Button
              variant={viewMode === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="px-3"
            >
              ກອງ
            </Button>
          </div>
        </div>

        {/* Search and Filter Card */}
        <Card className="mb-6 border border-gray-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="search" className="text-gray-700">ຄົ້ນຫາ</Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="ຄົ້ນຫາທີ່ຢູ່, ຊື່ລູກຄ້າ..."
                    className="pl-9 border-gray-300 focus:border-primary focus:ring-primary"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="from_date" className="text-gray-700">ຈາກວັນທີ</Label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="from_date"
                    type="date"
                    className="pl-9 border-gray-300 focus:border-primary focus:ring-primary"
                    value={filters.from_date}
                    onChange={(e) => handleFilterChange('from_date', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="to_date" className="text-gray-700">ຮອດວັນທີ</Label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="to_date"
                    type="date"
                    className="pl-9 border-gray-300 focus:border-primary focus:ring-primary"
                    value={filters.to_date}
                    onChange={(e) => handleFilterChange('to_date', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="employee" className="text-gray-700">ຄົນຂັບລົດ</Label>
                <select
                  id="employee"
                  value={filters.employee_id}
                  onChange={(e) => handleFilterChange('employee_id', e.target.value)}
                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="">ທັງໝົດ</option>
                  {employees?.length > 0 && employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1 border-gray-300 text-gray-700"
              >
                <X className="h-4 w-4" /> ລ້າງຟິວເຕີ
              </Button>
              
              <Button
                onClick={applyFilters}
                size="sm"
                className="flex items-center gap-1 bg-primary"
              >
                <Filter className="h-4 w-4" /> ນຳໃຊ້ຟິວເຕີ
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>ຂໍ້ຜິດພາດ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading ? (
          viewMode === 'table' ? (
            <Card className="border border-gray-200 shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">ID</TableHead>
                    <TableHead>ອໍເດີ #</TableHead>
                    <TableHead>ທີ່ຢູ່</TableHead>
                    <TableHead>ວັນທີ</TableHead>
                    <TableHead>ສະຖານະ</TableHead>
                    <TableHead>ຄົນຂັບລົດ</TableHead>
                    <TableHead className="text-right">ການຈັດການ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5).fill(0).map((_, index) => (
                    <TableRow key={index} className="animate-pulse">
                      <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, index) => (
                <Card key={index} className="border border-gray-200 shadow-sm animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          )
        ) : (
          <>
            {viewMode === 'table' ? (
              /* Table View */
              <Card className="border border-gray-200 shadow overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-20 font-semibold">ID</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent font-semibold"
                          onClick={() => handleSort('order_id')}
                        >
                          ອໍເດີ #
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent font-semibold"
                          onClick={() => handleSort('delivery_address')}
                        >
                          ທີ່ຢູ່
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent font-semibold"
                          onClick={() => handleSort('created_at')}
                        >
                          ວັນທີ
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent font-semibold"
                          onClick={() => handleSort('status')}
                        >
                          ສະຖານະ
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent font-semibold"
                          onClick={() => handleSort('employee_id')}
                        >
                          ຄົນຂັບລົດ
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right font-semibold">ການຈັດການ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedDeliveries.length > 0 ? (
                      displayedDeliveries.map((delivery) => (
                        <TableRow 
                          key={delivery.id} 
                          className="cursor-pointer hover:bg-gray-50 group border-b border-gray-200" 
                          onClick={() => navigateToDetail(delivery.id)}
                        >
                          <TableCell className="font-medium text-gray-700">{delivery.id}</TableCell>
                          <TableCell className="font-medium text-primary">#{delivery.order_id}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            <div className="flex items-start">
                              <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                              <span className="truncate" title={delivery.delivery_address}>
                                {delivery.delivery_address}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-gray-900">{formatDateDisplay(delivery.created_at)}</span>
                              {delivery.estimated_delivery_time && (
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDateDisplay(delivery.estimated_delivery_time)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DeliveryStatusBadge status={delivery.status} />
                          </TableCell>
                          <TableCell>
                            {delivery.employee ? (
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-1" />
                                <span className="text-gray-900">{delivery.employee.first_name} {delivery.employee.last_name}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500 italic">ບໍ່ໄດ້ມອບໝາຍ</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToDetail(delivery.id);
                                }}
                                className="h-8 w-8 p-0 text-gray-700 hover:text-primary hover:bg-primary/10"
                                title="ເບິ່ງລາຍລະອຽດ"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToEdit(delivery.id);
                                }}
                                className="h-8 w-8 p-0 text-gray-700 hover:text-primary hover:bg-primary/10"
                                title="ແກ້ໄຂຂໍ້ມູນ"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToTrack(delivery.id);
                                }}
                                className="h-8 w-8 p-0 text-gray-700 hover:text-primary hover:bg-primary/10"
                                title="ຕິດຕາມການຈັດສົ່ງ"
                              >
                                <Truck className="h-4 w-4" />
                              </Button>
                              {delivery.phone_number && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `tel:${delivery.phone_number}`;
                                  }}
                                  className="h-8 w-8 p-0 text-gray-700 hover:text-green-600 hover:bg-green-50"
                                  title="ໂທຫາລູກຄ້າ"
                                >
                                  <PhoneCall className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <div className="flex flex-col items-center">
                            <AlertTriangle className="h-10 w-10 text-gray-400 mb-3" />
                            <p className="text-lg font-medium text-gray-500">ບໍ່ພົບລາຍການຈັດສົ່ງ</p>
                            <p className="text-sm text-gray-500 mt-1">ບໍ່ພົບຂໍ້ມູນການຈັດສົ່ງທີ່ຕົງກັບຟິວເຕີທີ່ເລືອກ</p>
                            <Button 
                              variant="outline" 
                              className="mt-4 flex items-center gap-2"
                              onClick={clearFilters}
                            >
                              <RefreshCw className="h-4 w-4" />
                              ລ້າງຟິວເຕີແລະຄົ້ນຫາອີກຄັ້ງ
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              /* Card View */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDeliveries.length > 0 ? (
                  displayedDeliveries.map((delivery) => (
                    <Card 
                      key={delivery.id} 
                      className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer group" 
                      onClick={() => navigateToDetail(delivery.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-1">
                              ການຈັດສົ່ງ #{delivery.id}
                            </CardTitle>
                            <CardDescription className="flex items-center text-sm">
                              <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              {formatDateDisplay(delivery.created_at)}
                            </CardDescription>
                          </div>
                          <DeliveryStatusBadge status={delivery.status} />
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                          <div className="text-sm line-clamp-2 text-gray-800">
                            {delivery.delivery_address}
                          </div>
                        </div>
                        
                        {delivery.employee ? (
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-800 font-medium">{delivery.employee.first_name} {delivery.employee.last_name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span>ບໍ່ໄດ້ມອບໝາຍຄົນຂັບລົດ</span>
                          </div>
                        )}
                        
                        {delivery.estimated_delivery_time && (
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700">ຄາດວ່າຈະສົ່ງຮອດ: {formatDateDisplay(delivery.estimated_delivery_time)}</span>
                          </div>
                        )}
                        
                        {delivery.phone_number && (
                          <div className="flex items-center text-sm">
                            <PhoneCall className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-700">{delivery.phone_number}</span>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter className="flex gap-2 pt-2 border-t border-gray-100">
                        <Button 
                          variant="outline" 
                          className="flex-1 flex items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToDetail(delivery.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          ເບິ່ງລາຍລະອຽດ
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="flex-1 flex items-center justify-center gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToTrack(delivery.id);
                          }}
                        >
                          <Truck className="h-4 w-4" />
                          ຕິດຕາມ
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card className="p-6 border border-gray-200 text-center">
                      <div className="flex flex-col items-center">
                        <AlertTriangle className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-lg font-medium text-gray-500">ບໍ່ພົບລາຍການຈັດສົ່ງ</p>
                        <p className="text-gray-500 mt-1 text-center">ບໍ່ພົບຂໍ້ມູນການຈັດສົ່ງທີ່ຕົງກັບຟິວເຕີທີ່ເລືອກ</p>
                        <Button 
                          variant="outline" 
                          className="mt-4 flex items-center gap-2"
                          onClick={clearFilters}
                        >
                          <RefreshCw className="h-4 w-4" />
                          ລ້າງຟິວເຕີແລະຄົ້ນຫາອີກຄັ້ງ
                        </Button>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}
            
            {/* Pagination Controls */}
            {displayedDeliveries.length > 0 && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-500">
                  ສະແດງ {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, deliveries.length)} ຈາກ {deliveries.length} ລາຍການ
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 p-0 rounded-md border-gray-200"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 p-0 rounded-md border-gray-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      
                      if (totalPages <= 5) {
                        // ถ้ามีหน้าทั้งหมดไม่เกิน 5 หน้า, แสดงทุกหน้า
                        pageNum = i + 1;
                      } else {
                        // ถ้ามีมากกว่า 5 หน้า, คำนวณให้เหมาะสม
                        if (currentPage <= 3) {
                          // ถ้าอยู่หน้าต้นๆ, แสดงหน้า 1-5
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // ถ้าอยู่หน้าท้ายๆ, แสดง 5 หน้าสุดท้าย
                          pageNum = totalPages - 4 + i;
                        } else {
                          // ถ้าอยู่หน้ากลาง, แสดงหน้าปัจจุบันอยู่ตรงกลาง
                          pageNum = currentPage - 2 + i;
                        }
                      }
                      
                      return (
                        <Button
                          key={i}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-8 h-8 p-0 rounded-md ${
                            pageNum === currentPage
                              ? "bg-primary hover:bg-primary/90 text-white"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 p-0 rounded-md border-gray-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 p-0 rounded-md border-gray-200"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}