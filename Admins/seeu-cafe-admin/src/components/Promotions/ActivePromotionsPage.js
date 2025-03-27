'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FaSearch, FaPause, FaPlay, FaEdit, FaClock } from 'react-icons/fa';
import { formatDate } from '@/utils/dateFormatter';

const PromotionCard = ({ promotion }) => {
  const getStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  const getProgressWidth = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);
    const progress = ((now - startDate) / (endDate - startDate)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <Card>
      <CardContent className="p-6 font-['Phetsarath_OT']">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">{promotion.name}</h3>
              <Badge className={getStatusColor(promotion.status)}>
                {promotion.status === 'active' ? 'ກຳລັງໃຊ້ງານ' : 'ຢຸດຊົ່ວຄາວ'}
              </Badge>
            </div>
            <p className="text-gray-600">{promotion.description}</p>
            <div className="text-sm text-gray-500 space-y-1">
              <div>ລະຫັດ: {promotion.code}</div>
              <div>ສ່ວນຫຼຸດ: {promotion.discount}</div>
              <div>ໃຊ້ໄປແລ້ວ: {promotion.usedCount} / {promotion.maxUses}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <FaEdit className="w-4 h-4 mr-2" />
                ແກ້ໄຂ
              </Button>
              <Button variant="outline" size="sm">
                {promotion.status === 'active' ? (
                  <>
                    <FaPause className="w-4 h-4 mr-2" />
                    ຢຸດຊົ່ວຄາວ
                  </>
                ) : (
                  <>
                    <FaPlay className="w-4 h-4 mr-2" />
                    ເປີດໃຊ້ງານ
                  </>
                )}
              </Button>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2">
                <FaClock className="w-4 h-4" />
                <span>
                  {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${getProgressWidth(promotion.startDate, promotion.endDate)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ActivePromotionsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const promotions = [
    {
      id: 1,
      name: "ສ່ວນຫຼຸດເດືອນມີນາ",
      code: "MARCH2024",
      description: "ສ່ວນຫຼຸດ 15% ສຳລັບການສັ່ງຊື້ທັງໝົດໃນເດືອນມີນາ",
      discount: "15%",
      startDate: "2024-03-01",
      endDate: "2024-03-31",
      status: "active",
      usedCount: 45,
      maxUses: 100
    },
    {
      id: 2,
      name: "ຕ້ອນຮັບສະມາຊິກໃໝ່",
      code: "NEWMEMBER",
      description: "ສ່ວນຫຼຸດ 20% ສຳລັບການສັ່ງຊື້ຄັ້ງທຳອິດ",
      discount: "20%",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "paused",
      usedCount: 89,
      maxUses: 200
    }
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Promotions ທີ່ໃຊ້ງານຢູ່</h1>
          <p className="text-gray-500">ເບິ່ງແລະຈັດການ promotions ທີ່ກຳລັງໃຊ້ງານຢູ່</p>
        </div>
        <a href="/promotions/create" className="">
        <Button >
          ສ້າງ Promotion ໃໝ່
        </Button>
        </a>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="ຄົ້ນຫາ promotions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            ທັງໝົດ
          </Button>
          <Button 
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
          >
            ກຳລັງໃຊ້ງານ
          </Button>
          <Button 
            variant={statusFilter === 'paused' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('paused')}
          >
            ຢຸດຊົ່ວຄາວ
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {promotions.map((promotion) => (
          <PromotionCard key={promotion.id} promotion={promotion} />
        ))}
      </div>
    </div>
  );
};

export default ActivePromotionsPage;