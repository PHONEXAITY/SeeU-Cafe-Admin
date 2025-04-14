
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Utensils, Users, Edit, Trash2,Loader2 } from "lucide-react";
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import TableForm from '@/components/Tables/TableForm';
import TableStatusBadge from '@/components/Tables/TableStatusBadge';
import { useTableManagement } from '@/hooks/useTableManagement';
import { useToast } from "@/components/ui/use-toast";
import Layout from '@/components/layout/Layout';

export default function TableDetailPage({ params }) {
  const router = useRouter();
  const { toast } = useToast();
  const { getTableById, deleteTable } = useTableManagement();
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setLoading(true);
        const tableData = await getTableById(parseInt(params.id));
        setTable(tableData);
        setError(null);
      } catch (err) {
        console.error('Error fetching table:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTableData();
    }
  }, [params.id, getTableById]);

  const handleDeleteTable = async () => {
    if (confirmDelete) {
      try {
        await deleteTable(table.id);
        toast({
          title: "ลบโต๊ะสำเร็จ",
          description: `โต๊ะหมายเลข ${table.number} ถูกลบออกจากระบบแล้ว`,
        });
        router.push('/tables');
      } catch (error) {
        // ข้อผิดพลาดถูกจัดการใน hook แล้ว
      }
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    return format(new Date(dateString), 'PPPp', { locale: th });
  };

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-amber-600" />
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">เกิดข้อผิดพลาด! </strong>
          <span className="block sm:inline">{error}</span>
          <div className="mt-4">
            <Button onClick={() => router.push('/admin/tables')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปหน้าจัดการโต๊ะ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!table) {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">ไม่พบข้อมูล! </strong>
          <span className="block sm:inline">ไม่พบข้อมูลโต๊ะที่ต้องการ</span>
          <div className="mt-4">
            <Button onClick={() => router.push('/admin/tables')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> กลับไปหน้าจัดการโต๊ะ
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => router.push('/admin/tables')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          กลับ
        </Button>
        <h1 className="text-2xl font-bold">โต๊ะ #{table.number}</h1>
        <div className="ml-auto flex space-x-2">
          <Button 
            variant="destructive"
            onClick={handleDeleteTable}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {confirmDelete ? "ยืนยันการลบ?" : "ลบโต๊ะ"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">ข้อมูลโต๊ะ</TabsTrigger>
          <TabsTrigger value="edit">แก้ไขข้อมูล</TabsTrigger>
          <TabsTrigger value="orders">ประวัติการใช้งาน</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl">รายละเอียดโต๊ะ</CardTitle>
                  <CardDescription>ข้อมูลและสถานะปัจจุบันของโต๊ะ</CardDescription>
                </div>
                <TableStatusBadge status={table.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ข้อมูลทั่วไป</h3>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 text-gray-400 mr-3" />
                        <p><span className="font-medium">ความจุ:</span> {table.capacity} ที่นั่ง</p>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <p><span className="font-medium">สร้างเมื่อ:</span> {formatDateTime(table.created_at)}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-400 mr-3" />
                        <p><span className="font-medium">อัปเดตล่าสุด:</span> {formatDateTime(table.updated_at)}</p>
                      </div>
                    </div>
                  </div>

                  {table.status === 'occupied' && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">ข้อมูลการใช้งานปัจจุบัน</h3>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                          <p><span className="font-medium">เริ่มใช้งานเมื่อ:</span> {formatDateTime(table.current_session_start)}</p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-5 w-5 text-gray-400 mr-3" />
                          <p><span className="font-medium">คาดว่าจะใช้ถึง:</span> {formatDateTime(table.expected_end_time)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {table.status === 'occupied' && table.orders && table.orders.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">ออเดอร์ที่กำลังใช้งาน</h3>
                    <div className="mt-3 space-y-4">
                      {table.orders.slice(0, 3).map(order => (
                        <Card key={order.id} className="p-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">ออเดอร์ #{order.order_id}</h4>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">เวลา:</span> {formatDateTime(order.create_at)}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">ยอดรวม:</span> {order.total_price.toLocaleString()} บาท
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">รายการ:</span> {order.order_details.length} รายการ
                            </p>
                          </div>
                        </Card>
                      ))}
                      {table.orders.length > 3 && (
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => setActiveTab("orders")}
                        >
                          ดูออเดอร์ทั้งหมด ({table.orders.length})
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <TableForm table={table} />
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>ประวัติการใช้งานโต๊ะ</CardTitle>
              <CardDescription>ออเดอร์ล่าสุดที่ใช้โต๊ะนี้</CardDescription>
            </CardHeader>
            <CardContent>
              {table.orders && table.orders.length > 0 ? (
                <div className="space-y-4">
                  {table.orders.map(order => (
                    <Card key={order.id} className="p-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">ออเดอร์ #{order.order_id}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">เวลา:</span> {formatDateTime(order.create_at)}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">ยอดรวม:</span> {order.total_price.toLocaleString()} บาท
                        </p>
                      </div>
                      {order.order_details && order.order_details.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-medium mb-2">รายการอาหาร:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {order.order_details.map(detail => (
                              <li key={detail.id} className="flex justify-between">
                                <span>
                                  {detail.quantity} x {detail.food_menu?.name || detail.beverage_menu?.name || 'รายการอาหาร'}
                                </span>
                                <span>{detail.price.toLocaleString()} บาท</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Utensils className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-4 text-gray-500">ยังไม่มีประวัติการใช้งานโต๊ะนี้</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}