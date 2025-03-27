import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FaStar, FaThumbsUp, FaComments, FaChartLine } from 'react-icons/fa';

const FeedbackCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full bg-gray-100`}>
            <Icon className="w-6 h-6 text-gray-600" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 text-sm text-green-600">
            +{trend}% ຈາກເດືອນທີ່ຜ່ານມາ
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const FeedbackPage = () => {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ຄຳຕິຊົມຂອງຜູ້ໃຊ້</h1>
          <p className="text-gray-500">ຈັດການແລະວິເຄາະຄຳຕິຊົມຂອງຜູ້ໃຊ້</p>
        </div>
        <div className="flex gap-3">
          <Button>
            <FaChartLine className="w-4 h-4 mr-2" />
            ລາຍງານ
          </Button>
          <Button variant="outline">
            <FaComments className="w-4 h-4 mr-2" />
            ການຕັ້ງຄ່າ
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FeedbackCard
          title="ຄຳຕິຊົມທັງໝົດ"
          value="2,851"
          icon={FaComments}
          trend="12.5"
        />
        <FeedbackCard
          title="ຄະແນນສະເລ່ຍ"
          value="4.8/5"
          icon={FaStar}
          trend="2.1"
        />
        <FeedbackCard
          title="ຄວາມເພິ່ງພໍໃຈ"
          value="92%"
          icon={FaThumbsUp}
          trend="5.2"
        />
        <FeedbackCard
          title="ຄຳຕິຊົມໃໝ່"
          value="127"
          icon={FaComments}
        />
      </div>

      {/* Main Content Area - Placeholder for ReviewsList component */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>ຄຳຕິຊົມລ່າສຸດ</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="text-center py-8 text-gray-500">
            ບ່ອນນີ້ຈະເປັນບ່ອນສະແດງລາຍການ ReviewsList
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackPage;