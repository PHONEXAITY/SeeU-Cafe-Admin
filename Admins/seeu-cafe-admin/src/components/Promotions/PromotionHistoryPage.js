'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
  ChevronRight,
  Calendar,
  Download,
  Search,
  BarChart4,
  Clock,
  Tag,
  Percent,
  RefreshCcw,
  AlertCircle,
  ArrowUpDown,
  FileText,
  Filter,
  CalendarDays,
} from 'lucide-react';
import { format, parseISO, subDays, isValid } from 'date-fns';
import { promotionService } from '@/services/api';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const PromotionHistoryPage = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('recent');
  const [expandedId, setExpandedId] = useState(null);

  // ฟังก์ชันจัดรูปแบบวันที่ให้ปลอดภัย
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return 'N/A';
      return format(date, 'dd/MM/yyyy');
    } catch {
      return 'N/A';
    }
  };

  // ฟังก์ชันจัดรูปแบบสกุลเงิน
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('lo-LA').format(amount || 0);
  };

  // โหลดข้อมูลจาก API
  const fetchPromotionHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (dateFilter !== 'all') {
        const days = parseInt(dateFilter);
        const startDate = subDays(new Date(), days).toISOString();
        params.start_date = startDate;
      }
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await promotionService.getAllPromotions(params);
      let historyData = response.data || [];

      // คำนวณข้อมูลเพิ่มเติม
      historyData = historyData.map((promotion) => {
        const totalUses = promotion.totalUses || promotion.promotionUsages?.length || 0;
        const totalDiscount = promotion.totalDiscount || 0;
        const averageDiscount = totalUses > 0 ? totalDiscount / totalUses : 0;

        return {
          ...promotion,
          totalUses,
          totalDiscount,
          averageDiscount,
          start_date: promotion.start_date || null,
          end_date: promotion.end_date || null,
        };
      });

      // เรียงลำดับข้อมูล
      setPromotions(sortPromotions(historyData, sortBy));
    } catch (err) {
      console.error('Error fetching promotion history:', err);
      setError('ບໍ່ສາມາດໂຫຼດຂໍ້ມູນປະຫວັດ Promotion ໄດ້');
      toast({
        title: 'ເກີດຂໍ້ຜິດພາດ',
        description: 'ບໍ່ສາມາດໂຫຼດຂໍ້ມູນປະຫວັດ Promotion ໄດ້',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [dateFilter, statusFilter, sortBy, toast]);

  // โหลดข้อมูลเมื่อคอมโพเนนต์เริ่มต้นหรือตัวกรองเปลี่ยน
  useEffect(() => {
    fetchPromotionHistory();
  }, [fetchPromotionHistory]);

  // ฟังก์ชันเรียงลำดับข้อมูล
  const sortPromotions = (data, sortOption) => {
    const sortedData = [...data];

    return sortedData.sort((a, b) => {
      const dateA = a.end_date && isValid(new Date(a.end_date)) ? new Date(a.end_date) : new Date(0);
      const dateB = b.end_date && isValid(new Date(b.end_date)) ? new Date(b.end_date) : new Date(0);

      switch (sortOption) {
        case 'recent':
          return dateB - dateA;
        case 'oldest':
          return dateA - dateB;
        case 'most-used':
          return (b.totalUses || 0) - (a.totalUses || 0);
        case 'highest-value':
          return (b.totalDiscount || 0) - (a.totalDiscount || 0);
        default:
          return 0;
      }
    });
  };

  // กรองข้อมูลจากคำค้นหา
  const filteredPromotions = promotions.filter(
    (promo) =>
      promo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.code?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ฟังก์ชันดาวน์โหลดรายงาน
  const handleDownloadReport = async () => {
    try {
      toast({
        title: 'ກຳລັງເຕຣີຍມການດາວໂຫຼດ',
        description: 'ກຳລັງສ້າງລາຍງານສຳລັບການດາວໂຫຼດ...',
      });

      const headers = [
        'ຊື່',
        'ລະຫັດ',
        'ວັນທີເລີ່ມຕົ້ນ',
        'ວັນທີສິ້ນສຸດ',
        'ສະຖານະ',
        'ຈຳນວນການໃຊ້',
        'ມູນຄ່າລວມ',
        'ສະເລ່ຍຕໍ່ລາຍການ',
      ];

      let csvContent = headers.join(',') + '\n';

      filteredPromotions.forEach((promotion) => {
        const row = [
          `"${promotion.name || ''}"`,
          `"${promotion.code || ''}"`,
          `"${promotion.start_date && isValid(new Date(promotion.start_date)) ? format(new Date(promotion.start_date), 'yyyy-MM-dd') : 'N/A'}"`,
          `"${promotion.end_date && isValid(new Date(promotion.end_date)) ? format(new Date(promotion.end_date), 'yyyy-MM-dd') : 'N/A'}"`,
          `"${promotion.status || ''}"`,
          `"${promotion.totalUses || 0}"`,
          `"${promotion.totalDiscount || 0}"`,
          `"${promotion.averageDiscount || 0}"`,
        ];
        csvContent += row.join(',') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `promotion_history_${format(new Date(), 'yyyyMMdd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'ດາວໂຫຼດສຳເລັດ',
        description: 'ລາຍງານຖືກດາວໂຫຼດສຳເລັດແລ້ວ',
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: 'ເກີດຂໍ້ຜິດພາດ',
        description: 'ບໍ່ສາມາດດາວໂຫຼດລາຍງານໄດ້',
        variant: 'destructive',
      });
    }
  };

  // ฟังก์ชันดาวน์โหลดข้อมูลของ promotion เฉพาะตัว
  const handleDownloadPromotion = async (promotionId) => {
    try {
      toast({
        title: 'ກຳລັງເຕຣີຍມການດາວໂຫຼດ',
        description: 'ກຳລັງສ້າງລາຍງານສຳລັບການດາວໂຫຼດ...',
      });

      const promotion = promotions.find((p) => p.id === promotionId);
      if (!promotion) {
        throw new Error('ບໍ່ພົບຂໍ້ມູນ promotion');
      }

      const headers = [
        'ຊື່',
        'ລະຫັດ',
        'ວັນທີເລີ່ມຕົ້ນ',
        'ວັນທີສິ້ນສຸດ',
        'ສະຖານະ',
        'ຈຳນວນການໃຊ້',
        'ມູນຄ່າລວມ',
        'ສະເລ່ຍຕໍ່ລາຍການ',
      ];

      let csvContent = headers.join(',') + '\n';

      const row = [
        `"${promotion.name || ''}"`,
        `"${promotion.code || ''}"`,
        `"${promotion.start_date && isValid(new Date(promotion.start_date)) ? format(new Date(promotion.start_date), 'yyyy-MM-dd') : 'N/A'}"`,
        `"${promotion.end_date && isValid(new Date(promotion.end_date)) ? format(new Date(promotion.end_date), 'yyyy-MM-dd') : 'N/A'}"`,
        `"${promotion.status || ''}"`,
        `"${promotion.totalUses || 0}"`,
        `"${promotion.totalDiscount || 0}"`,
        `"${promotion.averageDiscount || 0}"`,
      ];

      csvContent += row.join(',') + '\n';

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `promotion_${promotion.code}_${format(new Date(), 'yyyyMMdd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: 'ດາວໂຫຼດສຳເລັດ',
        description: 'ຂໍ້ມູນໂປຣໂມຊັນຖືກດາວໂຫຼດສຳເລັດແລ້ວ',
      });
    } catch (error) {
      console.error('Error downloading promotion data:', error);
      toast({
        title: 'ເກີດຂໍ້ຜິດພາດ',
        description: 'ບໍ່ສາມາດດາວໂຫຼດຂໍ້ມູນໄດ້',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      expired: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200',
      active: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200',
      inactive: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200',
      completed: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
      cancelled: 'bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-200',
    };

    const labels = {
      expired: 'ໝົດອາຍຸ',
      active: 'ກຳລັງໃຊ້ງານ',
      inactive: 'ຢຸດຊົ່ວຄາວ',
      completed: 'ສຳເລັດ',
      cancelled: 'ຍົກເລີກ',
    };

    return (
      <Badge className={styles[status] || 'bg-gray-100 text-gray-700'}>
        {labels[status] || status}
      </Badge>
    );
  };

  // Component สำหรับแสดงค่าสถิติ
  const StatisticItem = ({ title, value, subValue, icon: Icon, iconColor, onClick }) => (
    <div
      className={cn(
        'flex flex-col p-4 rounded-lg border bg-card shadow-sm',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow'
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subValue && <p className="text-xs text-muted-foreground">{subValue}</p>}
        </div>
        <div className={`p-2 rounded-full bg-${iconColor}-100`}>
          <Icon className={`h-5 w-5 text-${iconColor}-600`} />
        </div>
      </div>
    </div>
  );

  // คำนวณค่าสถิติรวม
  const totalStats = {
    totalPromotions: filteredPromotions.length,
    totalUses: filteredPromotions.reduce((sum, p) => sum + (p.totalUses || 0), 0),
    totalDiscount: filteredPromotions.reduce((sum, p) => sum + (p.totalDiscount || 0), 0),
    avgDiscount:
      filteredPromotions.length > 0 && filteredPromotions.reduce((sum, p) => sum + (p.totalUses || 0), 0) > 0
        ? filteredPromotions.reduce((sum, p) => sum + (p.totalDiscount || 0), 0) /
          filteredPromotions.reduce((sum, p) => sum + (p.totalUses || 0), 0)
        : 0,
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto font-['Phetsarath_OT']">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm border"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">ປະຫວັດ Promotion</h1>
          <p className="text-gray-500">ສະຫຼຸບຜົນແລະເບິ່ງປະຫວັດ promotions ທີ່ຜ່ານມາທັງໝົດ</p>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="border faithfully-200 text-gray-700 hover:bg-gray-50"
            onClick={() => router.push('/promotions/active')}
          >
            <Tag className="w-4 h-4 mr-2 text-blue-500" />
            ຈັດການ Promotions
          </Button>

          <Button
            variant="outline"
            onClick={handleDownloadReport}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <Download className="w-4 h-4 mr-2 text-green-600" />
            ດາວໂຫຼດລາຍງານ
          </Button>
        </div>
      </motion.div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticItem
          title="ຈຳນວນ Promotions"
          value={totalStats.totalPromotions}
          icon={Tag}
          iconColor="blue"
        />
        <StatisticItem
          title="ຈຳນວນການໃຊ້"
          value={totalStats.totalUses.toLocaleString()}
          subValue="ລາຍການທັງໝົດ"
          icon={RefreshCcw}
          iconColor="emerald"
        />
        <StatisticItem
          title="ມູນຄ່າລວມ"
          value={`${formatCurrency(totalStats.totalDiscount)} ₭`}
          icon={BarChart4}
          iconColor="purple"
        />
        <StatisticItem
          title="ມູນຄ່າສະເລ່ຍ"
          value={`${formatCurrency(totalStats.avgDiscount)} ₭`}
          subValue="ຕໍ່ລາຍການ"
          icon={Percent}
          iconColor="amber"
        />
      </div>

      <Card className="shadow-sm">
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              ປະຫວັດການໃຊ້ງານ Promotions
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchPromotionHistory()}
                className="text-gray-500 hover:text-gray-700"
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                placeholder="ຄົ້ນຫາຕາມຊື່ຫຼືລະຫັດ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <Filter className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="ສະຖານະ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ທັງໝົດ</SelectItem>
                  <SelectItem value="expired">ໝົດອາຍຸ</SelectItem>
                  <SelectItem value="active">ກຳລັງໃຊ້ງານ</SelectItem>
                  <SelectItem value="inactive">ຢຸດຊົ່ວຄາວ</SelectItem>
                  <SelectItem value="completed">ສຳເລັດ</SelectItem>
                  <SelectItem value="cancelled">ຍົກເລີກ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <CalendarDays className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="ໄລຍະເວລາ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ທຸກໄລຍະເວລາ</SelectItem>
                  <SelectItem value="30">30 ວັນທີ່ຜ່ານມາ</SelectItem>
                  <SelectItem value="90">90 ວັນທີ່ຜ່ານມາ</SelectItem>
                  <SelectItem value="180">180 ວັນທີ່ຜ່ານມາ</SelectItem>
                  <SelectItem value="365">1 ປີທີ່ຜ່ານມາ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-52">
                  <ArrowUpDown className="w-4 h-4 mr-2 text-gray-500" />
                  <SelectValue placeholder="ຈັດລຽງຕາມ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">ລ່າສຸດ (ໃໝ່ → ເກົ່າ)</SelectItem>
                  <SelectItem value="oldest">ດົນທີ່ສຸດ (ເກົ່າ → ໃໝ່)</SelectItem>
                  <SelectItem value="most-used">ການນຳໃຊ້ (ຫຼາຍ → ໜ້ອຍ)</SelectItem>
                  <SelectItem value="highest-value">ມູນຄ່າລວມ (ສູງ → ຕ່ຳ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-4">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </div>
                      <Skeleton className="h-4 w-32 mt-2" />
                      <Skeleton className="h-4 w-40 mt-2" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <AlertCircle className="h-12 w-12 text-rose-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <Button
                variant="outline"
                onClick={fetchPromotionHistory}
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                ລອງໃໝ່ອີກຄັ້ງ
              </Button>
            </div>
          ) : filteredPromotions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <FileText className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ບໍ່ພົບຂໍ້ມູນ</h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? `ບໍ່ພົບຜົນການຄົ້ນຫາສຳລັບ "${searchQuery}"`
                  : 'ບໍ່ພົບປະຫວັດ Promotion ໃນໄລຍະເວລາທີ່ເລືອກ'}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  ລ້າງການຄົ້ນຫາ
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredPromotions.map((promotion) => (
                <div
                  key={promotion.id}
                  className={cn(
                    'py-6 px-6 hover:bg-gray-50 transition-colors cursor-pointer',
                    expandedId === promotion.id && 'bg-gray-50'
                  )}
                  onClick={() => setExpandedId(expandedId === promotion.id ? null : promotion.id)}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium">{promotion.name}</h3>
                        {getStatusBadge(promotion.status)}
                      </div>
                      <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-blue-500" />
                        <span>
                          ລະຫັດ: <code className="bg-gray-100 px-1.5 py-0.5 rounded font-mono text-blue-600">{promotion.code}</code>
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        <span>
                          {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-sm mt-2 md:mt-0">
                      <div>
                        <div className="font-medium flex items-center gap-1 text-gray-700">
                          <RefreshCcw className="w-3.5 h-3.5 text-emerald-500" />
                          ຈຳນວນການໃຊ້
                        </div>
                        <div className="text-gray-700 font-semibold">
                          {(promotion.totalUses || 0).toLocaleString()} ຄັ້ງ
                        </div>
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1 text-gray-700">
                          <BarChart4 className="w-3.5 h-3.5 text-purple-500" />
                          ມູນຄ່າລວມ
                        </div>
                        <div className="text-gray-700 font-semibold">
                          {formatCurrency(promotion.totalDiscount || 0)} ກີບ
                        </div>
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1 text-gray-700">
                          <Percent className="w-3.5 h-3.5 text-amber-500" />
                          ສະເລ່ຍຕໍ່ລາຍການ
                        </div>
                        <div className="text-gray-700 font-semibold">
                          {formatCurrency(promotion.averageDiscount || 0)} ກີບ
                        </div>
                      </div>
                    </div>
                  </div>

                  {expandedId === promotion.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-dashed border-gray-200"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">ຂໍ້ມູນພື້ນຖານ</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">ປະເພດສ່ວນຫຼຸດ:</span>
                              <span className="font-medium">
                                {promotion.discount_type === 'percentage' ? 'ເປີເຊັນ (%)' : 'ຈຳນວນເງິນ (₭)'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">ມູນຄ່າສ່ວນຫຼຸດ:</span>
                              <span className="font-medium">
                                {promotion.discount_value}
                                {promotion.discount_type === 'percentage' ? '%' : '₭'}
                              </span>
                            </div>
                            {promotion.minimum_order && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">ຍອດຊື້ຂັ້ນຕ່ຳ:</span>
                                <span className="font-medium">{formatCurrency(promotion.minimum_order)}₭</span>
                              </div>
                            )}
                            {promotion.maximum_discount && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">ສ່ວນຫຼຸດສູງສຸດ:</span>
                                <span className="font-medium">{formatCurrency(promotion.maximum_discount)}₭</span>
                              </div>
                            )}
                            {promotion.usage_limit && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">ຈຳກັດການໃຊ້:</span>
                                <span className="font-medium">{promotion.usage_limit} ຄັ້ງ</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">ສະຖິຕິການນຳໃຊ້</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">ຈຳນວນຜູ້ໃຊ້ທັງໝົດ:</span>
                              <span className="font-medium">{promotion.uniqueUsers || 0} ຄົນ</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">ມູນຄ່າສູງສຸດຕໍ່ລາຍການ:</span>
                              <span className="font-medium">
                                {formatCurrency(promotion.maxDiscountPerUse || 0)}₭
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">ມູນຄ່າຕ່ຳສຸດຕໍ່ລາຍການ:</span>
                              <span className="font-medium">
                                {formatCurrency(promotion.minDiscountPerUse || 0)}₭
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">ຄັ້ງທີໃຊ້ຫຼ້າສຸດ:</span>
                              <span className="font-medium">{formatDate(promotion.lastUsedAt)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-gray-700">ການຕັ້ງຄ່າເພີ່ມເຕີມ</h4>
                          <div className="space-y-1 text-sm">
                            {promotion.applicable_products && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">ສິນຄ້າທີ່ໃຊ້ໄດ້:</span>
                                <span className="font-medium">{promotion.applicable_products}</span>
                              </div>
                            )}
                            {promotion.applicable_categories && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">ໝວດໝູ່ທີ່ໃຊ້ໄດ້:</span>
                                <span className="font-medium">{promotion.applicable_categories}</span>
                              </div>
                            )}
                            {promotion.excluded_products && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">ສິນຄ້າທີ່ຍົກເວັ້ນ:</span>
                                <span className="font-medium">{promotion.excluded_products}</span>
                              </div>
                            )}
                            {promotion.user_groups && (
                              <div className="flex justify-between">
                                <span className="text-gray-500">ກຸ່ມຜູ້ໃຊ້ທີ່ສາມາດໃຊ້ໄດ້:</span>
                                <span className="font-medium">{promotion.user_groups}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end lg:col-span-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/promotions/edit/${promotion.id}`);
                            }}
                            className="mr-2"
                          >
                            ແກ້ໄຂຂໍ້ມູນ
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPromotion(promotion.id);
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            ດາວໂຫຼດຂໍ້ມູນ
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionHistoryPage;