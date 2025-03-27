'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { FaSearch, FaFileDownload } from 'react-icons/fa';

const PromotionHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const promotions = [
    {
      id: 1,
      name: "ລົດລາຄາຕ້ອນຮັບປີໃໝ່",
      code: "NEWYEAR2024",
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "expired",
      totalUses: 156,
      totalDiscount: "4,680,000",
      averageDiscount: "30,000"
    },
    {
      id: 2,
      name: "ສ່ວນຫຼຸດວັນວາເລນທາຍ",
      code: "VDAY2024",
      startDate: "2024-02-14",
      endDate: "2024-02-15",
      status: "expired",
      totalUses: 89,
      totalDiscount: "2,225,000",
      averageDiscount: "25,000"
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      expired: "bg-gray-100 text-gray-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    const labels = {
      expired: "ໝົດອາຍຸ",
      completed: "ສຳເລັດ",
      cancelled: "ຍົກເລີກ"
    };

    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ປະຫວັດ Promotion</h1>
          <p className="text-gray-500">ເບິ່ງປະຫວັດ promotions ທີ່ຜ່ານມາທັງໝົດ</p>
        </div>
        <Button variant="outline">
          <FaFileDownload className="w-4 h-4 mr-2" />
          ດາວໂຫຼດລາຍງານ
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="ຄົ້ນຫາຕາມຊື່ຫຼືລະຫັດ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full md:w-48"
            >
              <option value="all">ທຸກໄລຍະເວລາ</option>
              <option value="30">30 ວັນທີ່ຜ່ານມາ</option>
              <option value="90">90 ວັນທີ່ຜ່ານມາ</option>
              <option value="180">180 ວັນທີ່ຜ່ານມາ</option>
              <option value="365">1 ປີທີ່ຜ່ານມາ</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="py-4">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{promotion.name}</h3>
                      {getStatusBadge(promotion.status)}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      ລະຫັດ: {promotion.code}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {promotion.startDate} - {promotion.endDate}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium">ຈຳນວນການໃຊ້</div>
                      <div className="text-gray-500">{promotion.totalUses} ຄັ້ງ</div>
                    </div>
                    <div>
                      <div className="font-medium">ມູນຄ່າລວມ</div>
                      <div className="text-gray-500">{promotion.totalDiscount} ກີບ</div>
                    </div>
                    <div>
                      <div className="font-medium">ສະເລ່ຍຕໍ່ລາຍການ</div>
                      <div className="text-gray-500">{promotion.averageDiscount} ກີບ</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionHistoryPage;