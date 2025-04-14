"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, ArrowLeft, Users, Coffee, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useTableManagement } from '@/hooks/useTableManagement';
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TableStatusBadge from './TableStatusBadge';
import { Alert, AlertDescription } from "@/components/ui/alert";

const TableForm = ({ table = null }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createTable, updateTable } = useTableManagement();
  const { toast } = useToast();
  const isEditMode = !!table;

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, isDirty }, 
    setValue,
    watch,
    reset
  } = useForm({
    defaultValues: {
      number: table?.number || '',
      capacity: table?.capacity || '',
      status: table?.status || 'available'
    },
    mode: 'onBlur'
  });

  // ใช้ useState สำหรับค่า select ที่ react-hook-form ไม่รองรับโดยตรง
  const [status, setStatus] = useState(table?.status || 'available');

  useEffect(() => {
    if (isEditMode && table) {
      reset({
        number: table.number,
        capacity: table.capacity,
        status: table.status
      });
      setStatus(table.status);
    }
  }, [isEditMode, table, reset]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      const tableData = {
        number: parseInt(data.number),
        capacity: parseInt(data.capacity),
        status: status
      };

      if (isEditMode) {
        await updateTable(table.id, tableData);
        toast({
          title: "ບັນທຶກສຳເລັດ",
          description: `ອັບເດດຂໍ້ມູນໂຕະ #${data.number} ສຳເລັດແລ້ວ`,
          variant: "success",
        });
      } else {
        await createTable(tableData);
        toast({
          title: "ເພີ່ມໂຕະສຳເລັດ",
          description: `ເພີ່ມໂຕະ #${data.number} ສຳເລັດແລ້ວ`,
          variant: "success",
        });
      }

      router.push('/tables');
      router.refresh();
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໂຕະໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case 'available':
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'reserved':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'occupied':
        return <Users className="h-4 w-4 text-rose-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-white border-0 shadow-md font-['Phetsarath_OT']">
      <CardHeader className="pb-4 border-b bg-gradient-to-r from-slate-50 to-gray-50">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="mr-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
          </Button>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Coffee className="h-5 w-5 text-gray-700" />
            {isEditMode ? `ແກ້ໄຂໂຕະ #${table.number}` : 'ເພີ່ມໂຕະໃໝ່'}
          </CardTitle>
        </div>
      </CardHeader>

      {isEditMode && (
        <div className="px-6 pt-4 flex items-center justify-between">
          <TableStatusBadge status={status} className="px-3 py-1" />
          <div className="text-sm text-gray-500">
            ອັບເດດລ່າສຸດ: {table.updated_at ? new Date(table.updated_at).toLocaleString('th-TH') : 'ບໍ່ມີຂໍ້ມູນ'}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="number" className="text-gray-700 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                ເລກໂຕະ
              </Label>
              <Input
                id="number"
                type="number"
                {...register("number", { 
                  required: "ກະລຸນາລະບຸເລກໂຕະ",
                  min: { value: 1, message: "ເລກໂຕະຕ້ອງຫຼາຍກວ່າ 0" } 
                })}
                placeholder="ລະບຸເລກໂຕະ"
                className={errors.number ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}
              />
              {errors.number && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.number.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity" className="text-gray-700 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                ຈຳນວນທີ່ນັ່ງ
              </Label>
              <Input
                id="capacity"
                type="number"
                {...register("capacity", { 
                  required: "ກະລຸນາລະບຸຈຳນວນທີ່ນັ່ງ",
                  min: { value: 1, message: "ຈຳນວນທີ່ນັ່ງຕ້ອງຫຼາຍກວ່າ 0" } 
                })}
                placeholder="ລະບຸຈຳນວນທີ່ນັ່ງ"
                className={errors.capacity ? "border-red-300 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"}
              />
              {errors.capacity && (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.capacity.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-700">ສະຖານະ</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select 
                    value={status} 
                    onValueChange={(value) => {
                      setStatus(value);
                      setValue('status', value);
                    }}
                  >
                    <SelectTrigger className="w-full border-gray-200 focus:ring-blue-400">
                      <SelectValue placeholder="ເລືອກສະຖານະ">
                        <div className="flex items-center">
                          {getStatusIcon(status)}
                          <span className="ml-2">{
                            status === 'available' ? 'ພ້ອມໃຊ້ງານ' : 
                            status === 'reserved' ? 'ຈອງແລ້ວ' : 
                            status === 'occupied' ? 'ກຳລັງໃຊ້ງານ' : 'ເລືອກສະຖານະ'
                          }</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available" className="flex items-center py-2">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2" />
                          ພ້ອມໃຊ້ງານ
                        </div>
                      </SelectItem>
                      <SelectItem value="reserved" className="flex items-center py-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-2" />
                          ຈອງແລ້ວ
                        </div>
                      </SelectItem>
                      <SelectItem value="occupied" className="flex items-center py-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-rose-500 mr-2" />
                          ກຳລັງໃຊ້ງານ
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ເລືອກສະຖານະປັດຈຸບັນຂອງໂຕະ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {isEditMode && table.status === 'occupied' && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-700">
                ໂຕະນີ້ກຳລັງຖືກໃຊ້ງານຢູ່ ການປ່ຽນແປງສະຖານະຈະມີຜົນກັບເຊສຊັນການໃຊ້ງານປັດຈຸບັນ
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex justify-between pt-4 pb-6 border-t bg-gray-50">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/tables')}
            className="text-gray-700 border-gray-300 hover:bg-gray-100"
          >
            ຍົກເລີກ
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || (!isDirty && isEditMode)}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ກຳລັງບັນທຶກ...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'ບັນທຶກການແກ້ໄຂ' : 'ເພີ່ມໂຕະ'}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TableForm;