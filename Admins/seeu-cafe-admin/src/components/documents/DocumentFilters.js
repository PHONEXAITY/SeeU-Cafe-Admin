import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Search, Filter, X, Calendar, SlidersHorizontal, User, Users } from 'lucide-react';
import { DateOfBirthPicker } from '../ui/DateOfBirthPicker';
import { format } from 'date-fns';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';

const DOCUMENT_TYPES = [
  { value: "id_card", label: "ບັດປະຈຳຕົວ" },
  { value: "passport", label: "ໜັງສືຜ່ານແດນ" },
  { value: "driver_license", label: "ໃບຂັບຂີ່" },
  { value: "education", label: "ໃບຢັ້ງຢືນການສຶກສາ" },
  { value: "contract", label: "ສັນຍາການຈ້າງງານ" },
  { value: "medical", label: "ໃບຢັ້ງຢືນແພດ" },
  { value: "other", label: "ອື່ນໆ" },
];

export default function DocumentFilters({ filters, setFilters }) {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  const handleTypeFilter = (value) => {
    setFilters(prev => ({ ...prev, type: value === 'all' ? '' : value }));
  };
  
  const handleUserIdChange = (e) => {
    setFilters(prev => ({ ...prev, userId: e.target.value }));
  };
  
  const handleEmployeeIdChange = (e) => {
    setFilters(prev => ({ ...prev, employeeId: e.target.value }));
  };
  
  const handleDateApply = () => {
    setFilters(prev => ({
      ...prev,
      dateFrom: dateFrom,
      dateTo: dateTo
    }));
    
    // Count active filters for badge
    let count = 0;
    if (filters.search) count++;
    if (filters.type) count++;
    if (filters.userId) count++;
    if (filters.employeeId) count++;
    if (dateFrom || dateTo) count++;
    setActiveFiltersCount(count);
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      userId: '',
      employeeId: '',
      dateFrom: null,
      dateTo: null
    });
    setDateFrom(null);
    setDateTo(null);
    setActiveFiltersCount(0);
  };

  return (
    <Card className="mb-6 overflow-hidden border border-primary/20 shadow-sm font-['Phetsarath_OT']">
      <CardContent className="p-0">
        <Tabs defaultValue="basic" className="w-full">
          <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b">
            <TabsList className="bg-background/40">
              <TabsTrigger value="basic" className="text-sm">ຄົ້ນຫາພື້ນຖານ</TabsTrigger>
              <TabsTrigger value="advanced" className="text-sm gap-2">
                ຄົ້ນຫາຂັ້ນສູງ
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {activeFiltersCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              ລ້າງການກັ່ນຕອງ
            </Button>
          </div>
          
          <TabsContent value="basic" className="m-0 p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="ຄົ້ນຫາເອກະສານ..."
                  value={filters.search || ''}
                  onChange={handleSearch}
                />
              </div>
              <Select value={filters.type || 'all'} onValueChange={handleTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="ທຸກປະເພດ" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>ກອງຕາມປະເພດ</SelectLabel>
                    <SelectItem value="all">ທຸກປະເພດ</SelectItem>
                    {DOCUMENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="m-0 border-t">
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    ລະຫັດຜູ້ໃຊ້
                  </Label>
                  <Input
                    placeholder="ລະຫັດຜູ້ໃຊ້..."
                    value={filters.userId || ''}
                    onChange={handleUserIdChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    ລະຫັດພະນັກງານ
                  </Label>
                  <Input
                    placeholder="ລະຫັດພະນັກງານ..."
                    value={filters.employeeId || ''}
                    onChange={handleEmployeeIdChange}
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  ຊ່ວງວັນທີ
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : <span>ຈາກວັນທີ</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={setDateFrom}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, 'dd/MM/yyyy') : <span>ຫາວັນທີ</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <DateOfBirthPicker
                        mode="single"
                        selected={dateTo}
                        onSelect={setDateTo}
                        disabled={(date) => date < dateFrom}
                        initialFocus
                      />
                      
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            
            <div className="bg-muted/50 px-4 py-3 flex justify-end border-t">
              <Button onClick={handleDateApply} size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                ນຳໃຊ້ການກັ່ນຕອງ
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}