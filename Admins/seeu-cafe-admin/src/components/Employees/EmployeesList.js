'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  FaSearch, FaEdit, FaTrash, FaUserPlus, FaFilter,
  FaCalendarAlt, FaClock, FaPhoneAlt, FaEnvelope 
} from 'react-icons/fa';

const EmployeesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const employees = [
    {
      id: 1,
      name: "ທ. ສົມສະໜຸກ ແສງສະຫວ່າງ",
      position: "ພະນັກງານເສີບ",
      department: "ບໍລິການ",
      startDate: "2024-01-15",
      status: "active",
      phone: "020 XX XXX XXX",
      email: "somsanook@example.com",
      avatar: "/api/placeholder/32/32",
      schedule: "ກະເຊົ້າ (06:00-14:00)",
      salary: "3,500,000 LAK"
    },
    {
      id: 2,
      name: "ນາງ ສົມໃຈ ພົມມະຈັນ",
      position: "ບາລິສຕ້າ",
      department: "ຜະລິດ",
      startDate: "2023-11-01",
      status: "active",
      phone: "020 XX XXX XXX",
      email: "somjai@example.com",
      avatar: "/api/placeholder/32/32",
      schedule: "ກະບ່າຍ (14:00-22:00)",
      salary: "4,000,000 LAK"
    }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800",
      leave: "bg-yellow-100 text-yellow-800",
      inactive: "bg-red-100 text-red-800"
    };
    
    const labels = {
      active: "ເຮັດວຽກຢູ່",
      leave: "ລາພັກ",
      inactive: "ພັກວຽກ"
    };

    return <Badge className={styles[status]}>{labels[status]}</Badge>;
  };

  const EmployeeDetailsDialog = ({ employee, isOpen, onClose }) => {
    if (!employee) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] font-['Phetsarath_OT']">
          <DialogHeader>
            <DialogTitle>ລາຍລະອຽດພະນັກງານ</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="font-medium text-lg">{employee.name}</h3>
                <p className="text-gray-500">{employee.position}</p>
                {getStatusBadge(employee.status)}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-gray-400" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-400" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-gray-400" />
                <span>ເລີ່ມວຽກ: {employee.startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock className="text-gray-400" />
                <span>{employee.schedule}</span>
              </div>
            </div>

            <div className="border-t pt-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ພະແນກ</p>
                  <p className="font-medium">{employee.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ເງິນເດືອນ</p>
                  <p className="font-medium">{employee.salary}</p>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => window.location.href = `/employees/edit/${employee.id}`}
            >
              <FaEdit className="w-4 h-4 mr-2" />
              ແກ້ໄຂຂໍ້ມູນ
            </Button>
            <Button onClick={onClose}>ປິດ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ລາຍຊື່ພະນັກງານ</h1>
          <p className="text-gray-500">ຈັດການຂໍ້ມູນພະນັກງານທັງໝົດ</p>
        </div>
        <a href="/employees/create" className="">
        <Button >
          <FaUserPlus className="w-4 h-4 mr-2" />
          ເພີ່ມພະນັກງານໃໝ່
        </Button>
        </a>
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
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full md:w-48"
        >
          <option value="all">ທຸກພະແນກ</option>
          <option value="service">ບໍລິການ</option>
          <option value="production">ຜະລິດ</option>
          <option value="kitchen">ຄົວ</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48"
        >
          <option value="all">ທຸກສະຖານະ</option>
          <option value="active">ເຮັດວຽກຢູ່</option>
          <option value="leave">ລາພັກ</option>
          <option value="inactive">ພັກວຽກ</option>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">ພະນັກງານ</th>
                  <th className="px-4 py-3 text-left">ພະແນກ</th>
                  <th className="px-4 py-3 text-left">ຕຳແໜ່ງ</th>
                  <th className="px-4 py-3 text-left">ສະຖານະ</th>
                  <th className="px-4 py-3 text-left">ກະເຮັດວຽກ</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={employee.avatar}
                          alt={employee.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{employee.department}</td>
                    <td className="px-4 py-3">{employee.position}</td>
                    <td className="px-4 py-3">
                      {getStatusBadge(employee.status)}
                    </td>
                    <td className="px-4 py-3">{employee.schedule}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setShowDetailsDialog(true);
                          }}
                        >
                          ລາຍລະອຽດ
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <EmployeeDetailsDialog
        employee={selectedEmployee}
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
      />
    </div>
  );
};

export default EmployeesList;