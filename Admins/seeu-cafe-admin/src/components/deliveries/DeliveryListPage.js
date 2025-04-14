"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDeliveries } from '@/hooks/useDelivery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Truck, 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  Loader2, 
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// สีสำหรับสถานะต่างๆ
const statusColors = {
  pending: {
    bg: "bg-yellow-100", 
    text: "text-yellow-800", 
    border: "border-yellow-200",
    icon: "text-yellow-600"
  },
  preparing: {
    bg: "bg-blue-100", 
    text: "text-blue-800", 
    border: "border-blue-200",
    icon: "text-blue-600"
  },
  out_for_delivery: {
    bg: "bg-purple-100", 
    text: "text-purple-800", 
    border: "border-purple-200",
    icon: "text-purple-600"
  },
  delivered: {
    bg: "bg-green-100", 
    text: "text-green-800", 
    border: "border-green-200",
    icon: "text-green-600"
  },
  cancelled: {
    bg: "bg-red-100", 
    text: "text-red-800", 
    border: "border-red-200",
    icon: "text-red-600"
  }
};

// แปลสถานะเป็นภาษาลาว
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

export default function DeliveryListPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [params, setParams] = useState({});
  
  // ฟิลเตอร์และการค้นหา
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    from_date: '',
    to_date: '',
    employee_id: '',
  });
  
  // สถานะการแสดงผล
  const [viewMode, setViewMode] = useState('table'); // 'table' หรือ 'card'
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // เรียกใช้ custom hook เพื่อดึงข้อมูลการจัดส่ง
  const { deliveries, loading, error, updateFilters, refetch } = useDeliveries();

  useEffect(() => {
    if (activeTab === 'all') {
      setFilters(prev => ({ ...prev, status: '' }));
      updateFilters({ status: '' });  // ใช้ updateFilters แทน refetch
    } else {
      setFilters(prev => ({ ...prev, status: activeTab }));
      updateFilters({ status: activeTab });  // ใช้ updateFilters แทน refetch
    }
  }, [activeTab, updateFilters]);
  
  // จัดการการเปลี่ยนแปลงฟิลเตอร์
  const handleFilterChange = useCallback((field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);
  
  // ใช้ฟิลเตอร์ในการค้นหา
  const applyFilters = useCallback(() => {
    updateFilters(filters);
    setCurrentPage(1); // รีเซ็ตหน้าเมื่อใช้ฟิลเตอร์ใหม่
  }, [filters, updateFilters]);
  
  // ล้างฟิลเตอร์ทั้งหมด
  const clearFilters = useCallback(() => {
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
  }, [activeTab, updateFilters]);
  
  // จัดการการเรียงลำดับ
  const handleSort = useCallback((field) => {
    setSortBy(field);
    setSortOrder(prev => (sortBy === field && prev === 'asc' ? 'desc' : 'asc'));
  }, [sortBy]);
  
  // คำนวณข้อมูลที่จะแสดงผลหลังจากการเรียงลำดับและแบ่งหน้า
  const displayedDeliveries = useCallback(() => {
    if (!deliveries) return [];
    
    // เรียงลำดับข้อมูล
    const sortedData = [...deliveries].sort((a, b) => {
      // ตรวจสอบประเภทของข้อมูลและใช้การเปรียบเทียบที่เหมาะสม
      if (['created_at', 'updated_at', 'estimated_delivery_time'].includes(sortBy)) {
        // เรียงตามวันที่
        const dateA = new Date(a[sortBy] || '1970-01-01');
        const dateB = new Date(b[sortBy] || '1970-01-01');
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // เรียงตามข้อความหรือตัวเลข
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
    
    // แบ่งหน้า
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return sortedData.slice(startIndex, endIndex);
  }, [deliveries, sortBy, sortOrder, currentPage, itemsPerPage]);
  
  // ฟอร์แมตวันที่
  const formatDate = (dateString) => {
    if (!dateString) return "ບໍ່ມີຂໍ້ມູນ";
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return dateString;
    }
  };
  
  // นำทางไปยังหน้ารายละเอียดการจัดส่ง
  const navigateToDetail = (id) => {
    router.push(`/deliveries/${id}`);
  };
  
  // นำทางไปยังหน้าสร้างการจัดส่งใหม่
  const navigateToCreate = () => {
    router.push('/deliveries/create');
  };
  
  // คำนวณจำนวนหน้าทั้งหมด
  const totalPages = Math.ceil(
    deliveries?.length ? deliveries.length / itemsPerPage : 0
  );
  
  // การเปลี่ยนหน้า
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };
  
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 mb-2">
            <Truck className="h-6 w-6 text-primary" />
            ລາຍການຈັດສົ່ງ
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
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" /> ໂຫຼດຄືນໃໝ່
          </Button>
          
          <Button 
            onClick={navigateToCreate}
            size="sm"
            className="flex items-center gap-1 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> ສ້າງການຈັດສົ່ງໃໝ່
          </Button>
        </div>
      </div>
      
      {/* ແທັບສຳລັບກັ່ນຕອງຕາມສະຖານະ */}
      <Tabs 
        defaultValue={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full mb-6"
      >
        <div className="flex justify-between items-center mb-3">
          <TabsList className="grid grid-cols-6 w-full max-w-3xl">
            <TabsTrigger value="all">ທັງໝົດ</TabsTrigger>
            <TabsTrigger value="pending">ລໍຖ້າ</TabsTrigger>
            <TabsTrigger value="preparing">ກຳລັງກະກຽມ</TabsTrigger>
            <TabsTrigger value="out_for_delivery">ກຳລັງສົ່ງ</TabsTrigger>
            <TabsTrigger value="delivered">ສົ່ງແລ້ວ</TabsTrigger>
            <TabsTrigger value="cancelled">ຍົກເລີກ</TabsTrigger>
          </TabsList>
          
          {/* ປຸ່ມສະຫຼັບການສະແດງຜົນ */}
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
        
        {/* ຟິວເຕີແລະການຄົ້ນຫາ */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Label htmlFor="search">ຄົ້ນຫາ</Label>
                <div className="relative mt-1.5">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="ຄົ້ນຫາທີ່ຢູ່, ຊື່ລູກຄ້າ..."
                    className="pl-9"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="from_date">ຈາກວັນທີ</Label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="from_date"
                    type="date"
                    className="pl-9"
                    value={filters.from_date}
                    onChange={(e) => handleFilterChange('from_date', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="to_date">ຮອດວັນທີ</Label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="to_date"
                    type="date"
                    className="pl-9"
                    value={filters.to_date}
                    onChange={(e) => handleFilterChange('to_date', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="employee">ຄົນຂັບລົດ</Label>
                <Select
                  value={filters.employee_id}
                  onValueChange={(value) => handleFilterChange('employee_id', value)}
                >
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="ເລືອກຄົນຂັບລົດ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ທັງໝົດ</SelectItem>
                    {/* ເພີ່ມຕົວເລືອກຄົນຂັບລົດຈາກ API */}
                    <SelectItem value="1">ຄົນຂັບລົດ A</SelectItem>
                    <SelectItem value="2">ຄົນຂັບລົດ B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" /> ລ້າງຟິວເຕີ
              </Button>
              
              <Button
                onClick={applyFilters}
                size="sm"
                className="flex items-center gap-1"
              >
                <Filter className="h-4 w-4" /> ນຳໃຊ້ຟິວເຕີ
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* ສະແດງຂໍ້ຜິດພາດ (ຖ້າມີ) */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>ຂໍ້ຜິດພາດ</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* ສະແດງຜົນການຄົ້ນຫາ */}
        {loading ? (
          // ສະແດງສະເກເລຕັນເມື່ອກຳລັງໂຫຼດ
          viewMode === 'table' ? (
            <Card>
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
                    <TableRow key={index}>
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
                <Card key={index}>
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
              // ສະແດງຜົນໃນຮູບແບບຕາຕະລາງ
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">ID</TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent"
                          onClick={() => handleSort('order_id')}
                        >
                          ອໍເດີ #
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent"
                          onClick={() => handleSort('delivery_address')}
                        >
                          ທີ່ຢູ່
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent"
                          onClick={() => handleSort('created_at')}
                        >
                          ວັນທີ
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent"
                          onClick={() => handleSort('status')}
                        >
                          ສະຖານະ
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          className="flex items-center gap-1 p-0 hover:bg-transparent"
                          onClick={() => handleSort('employee_id')}
                        >
                          ຄົນຂັບລົດ
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">ການຈັດການ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedDeliveries().length > 0 ? (
                      displayedDeliveries().map((delivery) => (
                        <TableRow key={delivery.id}>
                          <TableCell className="font-medium">{delivery.id}</TableCell>
                          <TableCell>#{delivery.order_id}</TableCell>
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
                              <span>{formatDate(delivery.created_at)}</span>
                              {delivery.estimated_delivery_time && (
                                <span className="text-xs text-gray-500 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatDate(delivery.estimated_delivery_time)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${statusColors[delivery.status]?.bg} ${statusColors[delivery.status]?.text}`}>
                              {translateStatus(delivery.status)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {delivery.employee ? (
                              <div className="flex items-center">
                                <User className="h-4 w-4 text-gray-400 mr-1" />
                                <span>{delivery.employee.first_name} {delivery.employee.last_name}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500">ບໍ່ໄດ້ມອບໝາຍ</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">ເປີດເມນູ</span>
                                  <Filter className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>ຈັດການການຈັດສົ່ງ</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => navigateToDetail(delivery.id)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  ເບິ່ງລາຍລະອຽດ
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Truck className="h-4 w-4 mr-2" />
                                  ຕິດຕາມການຈັດສົ່ງ
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          <div className="flex flex-col items-center">
                            <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
                            <p className="text-lg font-medium text-gray-500">ບໍ່ພົບລາຍການຈັດສົ່ງ</p>
                            <p className="text-sm text-gray-500 mt-1">ບໍ່ພົບຂໍ້ມູນການຈັດສົ່ງທີ່ຕົງກັບຟິວເຕີທີ່ເລືອກ</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              // ສະແດງຜົນໃນຮູບແບບກອງ (Card)
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedDeliveries().length > 0 ? (
                  displayedDeliveries().map((delivery) => (
                    <Card key={delivery.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateToDetail(delivery.id)}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-1">
                              ການຈັດສົ່ງ #{delivery.id}
                            </CardTitle>
                            <CardDescription className="flex items-center text-sm">
                              <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                              {formatDate(delivery.created_at)}
                            </CardDescription>
                          </div>
                          <Badge className={`${statusColors[delivery.status]?.bg} ${statusColors[delivery.status]?.text}`}>
                            {translateStatus(delivery.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1 flex-shrink-0" />
                          <div className="text-sm line-clamp-2">
                            {delivery.delivery_address}
                          </div>
                        </div>
                        
                        {delivery.employee ? (
                          <div className="flex items-center text-sm">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{delivery.employee.first_name} {delivery.employee.last_name}</span>
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
                            <span>ຄາດວ່າຈະສົ່ງຮອດ: {formatDate(delivery.estimated_delivery_time)}</span>
                          </div>
                        )}
                      </CardContent>
                      
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToDetail(delivery.id);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          ເບິ່ງລາຍລະອຽດ
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full">
                    <Card className="p-6">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-12 w-12 text-gray-400 mb-3" />
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
            
            {/* ແຖບຫນ້າຈັດສັນຫນ້າ (Pagination) */}
            {displayedDeliveries().length > 0 && totalPages > 1 && (
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
                    className="w-8 h-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-8 h-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      
                      if (totalPages <= 5) {
                        // ຖ້າມີໜ້າທັງໝົດບໍ່ເກີນ 5 ໜ້າ, ສະແດງທຸກໜ້າ
                        pageNum = i + 1;
                      } else {
                        // ຖ້າມີຫຼາຍກວ່າ 5 ໜ້າ, ຄຳນວນດັດປັບໃຫ້ຢູ່ໃນຊ່ວງທີ່ເໝາະສົມ
                        if (currentPage <= 3) {
                          // ຖ້າຢູ່ໜ້າຕົ້ນໆ, ສະແດງໜ້າ 1-5
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // ຖ້າຢູ່ໜ້າທ້າຍໆ, ສະແດງ 5 ໜ້າສຸດທ້າຍ
                          pageNum = totalPages - 4 + i;
                        } else {
                          // ຖ້າຢູ່ໜ້າກາງ, ສະແດງໜ້າປັດຈຸບັນຢູ່ຕຳແໜ່ງກາງ
                          pageNum = currentPage - 2 + i;
                        }
                      }
                      
                      return (
                        <Button
                          key={i}
                          variant={pageNum === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-8 h-8 p-0"
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
                    className="w-8 h-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 p-0"
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