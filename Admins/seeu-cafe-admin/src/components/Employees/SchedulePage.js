'use client'
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FaCalendarAlt, FaUserClock, FaExchangeAlt 
} from 'react-icons/fa';

const SchedulePage = () => {
  const [selectedWeek, setSelectedWeek] = useState('current');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // ข้อมูลตัวอย่าง
  const schedules = [
    {
      id: 1,
      name: "ທ. ສົມສະໜຸກ ແສງສະຫວ່າງ",
      department: "ບໍລິການ",
      shifts: {
        monday: "ກະເຊົ້າ",
        tuesday: "ກະເຊົ້າ",
        wednesday: "ພັກ",
        thursday: "ກະບ່າຍ",
        friday: "ກະບ່າຍ",
        saturday: "ກະເຊົ້າ",
        sunday: "ພັກ"
      }
    },
    {
      id: 2,
      name: "ນາງ ສົມໃຈ ພົມມະຈັນ",
      department: "ຜະລິດ",
      shifts: {
        monday: "ກະບ່າຍ",
        tuesday: "ກະບ່າຍ",
        wednesday: "ກະບ່າຍ",
        thursday: "ພັກ",
        friday: "ພັກ",
        saturday: "ກະເຊົ້າ",
        sunday: "ກະເຊົ້າ"
      }
    }
  ];

  const getShiftBadge = (shift) => {
    const styles = {
      'ກະເຊົ້າ': "bg-green-100 text-green-800",
      'ກະບ່າຍ': "bg-blue-100 text-blue-800",
      'ກະກາງຄືນ': "bg-purple-100 text-purple-800",
      'ພັກ': "bg-gray-100 text-gray-800"
    };

    return <Badge className={styles[shift]}>{shift}</Badge>;
  };

  return (
    <div className="space-y-6 p-4 md:p-6 font-['Phetsarath_OT']">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ຕາຕະລາງເຮັດວຽກ</h1>
          <p className="text-gray-500">ຈັດການຕາຕະລາງເຮັດວຽກຂອງພະນັກງານ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FaCalendarAlt className="w-4 h-4 mr-2" />
            ເບິ່ງປະຕິທິນ
          </Button>
          <Button>
            <FaExchangeAlt className="w-4 h-4 mr-2" />
            ຈັດການກະ
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="w-full md:w-48"
        >
          <option value="previous">ອາທິດທີ່ຜ່ານມາ</option>
          <option value="current">ອາທິດນີ້</option>
          <option value="next">ອາທິດໜ້າ</option>
        </Select>
        <Select
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
          className="w-full md:w-48"
        >
          <option value="all">ທຸກພະແນກ</option>
          <option value="service">ບໍລິການ</option>
          <option value="production">ຜະລິດ</option>
          <option value="kitchen">ຄົວ</option>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">ພະນັກງານ</th>
                  <th className="px-4 py-3 text-center">ຈັນ</th>
                  <th className="px-4 py-3 text-center">ອັງຄານ</th>
                  <th className="px-4 py-3 text-center">ພຸດ</th>
                  <th className="px-4 py-3 text-center">ພະຫັດ</th>
                  <th className="px-4 py-3 text-center">ສຸກ</th>
                  <th className="px-4 py-3 text-center">ເສົາ</th>
                  <th className="px-4 py-3 text-center">ອາທິດ</th>
                  <th className="px-4 py-3 text-center">ຈຳນວນຊົ່ວໂມງ</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {schedules.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.department}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">{getShiftBadge(employee.shifts.monday)}</td>
                    <td className="px-4 py-3 text-center">{getShiftBadge(employee.shifts.tuesday)}</td>
                    <td className="px-4 py-3 text-center">{getShiftBadge(employee.shifts.wednesday)}</td>
                    <td className="px-4 py-3 text-center">{getShiftBadge(employee.shifts.thursday)}</td>
                    <td className="px-4 py-3 text-center">{getShiftBadge(employee.shifts.friday)}</td>
                    <td className="px-4 py-3 text-center">{getShiftBadge(employee.shifts.saturday)}</td>
                    <td className="px-4 py-3 text-center">{getShiftBadge(employee.shifts.sunday)}</td>
                    <td className="px-4 py-3 text-center">40 ຊົ່ວໂມງ</td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline">
                        <FaUserClock className="w-4 h-4 mr-2" />
                        ແກ້ໄຂກະ
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ສະຫຼຸບກະເຮັດວຽກປະຈຳອາທິດ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">ພະນັກງານທັງໝົດ</p>
              <p className="mt-1 text-2xl font-semibold">24 ຄົນ</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">ຊົ່ວໂມງເຮັດວຽກລວມ</p>
              <p className="mt-1 text-2xl font-semibold">960 ຊົ່ວໂມງ</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">ການລາພັກ</p>
              <p className="mt-1 text-2xl font-semibold">3 ຄົນ</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">ຂາດງານ</p>
              <p className="mt-1 text-2xl font-semibold">0 ຄົນ</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;