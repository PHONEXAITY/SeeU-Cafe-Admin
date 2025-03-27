'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from '@/components/ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  FaSearch, FaCalendarAlt, FaUserClock, FaPlus, 
  FaCheck, FaTimes, FaClock 
} from 'react-icons/fa';

const AttendancePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const attendance = [
    {
      id: 1,
      employeeName: "ທ. ສົມສະໜຸກ ແສງສະຫວ່າງ",
      type: "late",
      date: "2024-03-15",
      time: "08:30",
      expectedTime: "08:00",
      reason: "ລົດຕິດ",
      status: "approved"
    },
    {
      id: 2,
      employeeName: "ນາງ ສົມໃຈ ພົມມະຈັນ",
      type: "leave",
      date: "2024-03-16",
      time: "ເຕັມມື້",
      reason: "ລາປ່ວຍ",
      status: "pending"
    }
  ];

  const getTypeBadge = (type) => {
    const styles = {
      late: "bg-yellow-100 text-yellow-800",
      absent: "bg-red-100 text-red-800",
      leave: "bg-blue-100 text-blue-800"
    };

    const labels = {
      late: "ມາສາຍ",
      absent: "ຂາດງານ",
      leave: "ລາພັກ"
    };

    return <Badge className={styles[type]}>{labels[type]}</Badge>;
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800"
    };

    const labels = {
      approved: "ອະນຸມັດແລ້ວ",
      pending: "ລໍຖ້າອະນຸມັດ",
      rejected: "ປະຕິເສດ"
    };

    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const AddAttendanceDialog = () => {
    const [formData, setFormData] = useState({
      employeeId: '',
      type: '',
      date: '',
      time: '',
      reason: ''
    });

    const handleSubmit = () => {
      console.log('Submit:', formData);
      setShowAddDialog(false);
    };

    return (
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ບັນທຶກການຂາດ/ລາ/ມາສາຍ</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>ພະນັກງານ</Label>
              <Select
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              >
                <option value="">ເລືອກພະນັກງານ...</option>
                <option value="1">ທ. ສົມສະໜຸກ ແສງສະຫວ່າງ</option>
                <option value="2">ນາງ ສົມໃຈ ພົມມະຈັນ</option>
              </Select>
            </div>
            <div>
              <Label>ປະເພດ</Label>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="">ເລືອກປະເພດ...</option>
                <option value="late">ມາສາຍ</option>
                <option value="absent">ຂາດງານ</option>
                <option value="leave">ລາພັກ</option>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>ວັນທີ</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label>ເວລາ</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label>ເຫດຜົນ</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
                placeholder="ລະບຸເຫດຜົນ..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              ຍົກເລີກ
            </Button>
            <Button onClick={handleSubmit}>
              ບັນທຶກ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
    <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ການຂາດ, ລາ, ມາສາຍ</h1>
          <p className="text-gray-500">ຈັດການການຂາດ, ລາ, ມາສາຍຂອງພະນັກງານ</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <FaPlus className="w-4 h-4 mr-2" />
          ບັນທຶກໃໝ່
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4 ">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-sm text-gray-500">ລາພັກທັງໝົດ</p>
                <p className="text-2xl font-semibold mt-1">15</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FaCalendarAlt className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-sm text-gray-500">ມາສາຍ</p>
                <p className="text-2xl font-semibold mt-1">8</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <FaClock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-sm text-gray-500">ຂາດງານ</p>
                <p className="text-2xl font-semibold mt-1">2</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FaTimes className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-sm text-gray-500">ລໍຖ້າອະນຸມັດ</p>
                <p className="text-2xl font-semibold mt-1">3</p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <FaUserClock className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="ຄົ້ນຫາພະນັກງານ..."
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
          <option value="today">ມື້ນີ້</option>
          <option value="week">ອາທິດນີ້</option>
          <option value="month">ເດືອນນີ້</option>
        </Select>
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full md:w-48"
        >
          <option value="all">ທຸກປະເພດ</option>
          <option value="late">ມາສາຍ</option>
          <option value="absent">ຂາດງານ</option>
          <option value="leave">ລາພັກ</option>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">ພະນັກງານ</th>
                  <th className="px-4 py-3 text-left">ປະເພດ</th>
                  <th className="px-4 py-3 text-left">ວັນທີ</th>
                  <th className="px-4 py-3 text-left">ເວລາ</th>
                  <th className="px-4 py-3 text-left">ເຫດຜົນ</th>
                  <th className="px-4 py-3 text-left">ສະຖານະ</th>
                  <th className="px-4 py-3 text-right">ຄຳສັ່ງ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{record.employeeName}</td>
                    <td className="px-4 py-3">{getTypeBadge(record.type)}</td>
                    <td className="px-4 py-3">{record.date}</td>
                    <td className="px-4 py-3">{record.time}</td>
                    <td className="px-4 py-3">{record.reason}</td>
                    <td className="px-4 py-3">{getStatusBadge(record.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {record.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" className="text-green-600">
                              <FaCheck className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <FaTimes className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <AddAttendanceDialog />
    </div>
  );
};

export default AttendancePage;