"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useTableManagement } from '@/hooks/useTableManagement';
import { 
  ClockIcon, 
  BellIcon, 
  CheckCircle2, 
  Loader2, 
  XCircle,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const TimeUpdateModal = ({ tableId, currentEndTime, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateTableTime } = useTableManagement();
  const { toast } = useToast();
  
  // Format default time - ensure the date is valid
  const formatDefaultTime = () => {
    try {
      if (currentEndTime) {
        const date = new Date(currentEndTime);
        if (isNaN(date.getTime())) throw new Error("Invalid date");
        return date.toISOString().slice(0, 16);
      }
    } catch (error) {
      console.error("Error parsing current end time:", error);
    }
    
    // Default to 1 hour from now if current time is invalid
    return new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);
  };
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      expectedEndTime: formatDefaultTime(),
      notifyCustomers: true,
      notificationMessage: 'ເຮົາຂໍອັບເດດເວລາສີ້ນສຸດການໃຊ້ໂຕະຂອງທ່ານ ກະລຸນາຕິດຕໍ່ພະນັກງານຫາກມີຂໍ້ສົງໄສ',
    }
  });

  const notifyCustomers = watch('notifyCustomers');
  const expectedEndTime = watch('expectedEndTime');

  // Format for display
  const formatTimeForDisplay = (isoDateString) => {
    try {
      const date = new Date(isoDateString);
      return date.toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "ບໍ່ລະບຸ";
    }
  };

  // Quick time buttons
  const addTime = (minutes) => {
    try {
      const currentDate = new Date(expectedEndTime);
      if (!isNaN(currentDate.getTime())) {
        const newDate = new Date(currentDate.getTime() + minutes * 60000);
        setValue('expectedEndTime', newDate.toISOString().slice(0, 16));
      }
    } catch (e) {
      console.error("Error adding time:", e);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      await updateTableTime(tableId, {
        expectedEndTime: new Date(data.expectedEndTime).toISOString(),
        notifyCustomers: data.notifyCustomers,
        notificationMessage: data.notifyCustomers ? data.notificationMessage : null
      });
      
      toast({
        title: "ອັບເດດເວລາສຳເລັດ",
        description: "ເວລາສີ້ນສຸດການໃຊ້ງານໂຕະໄດ້ຮັບການອັບເດດແລ້ວ",
        variant: "success",
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດອັບເດດເວລາໄດ້ ກະລຸນາລອງໃໝ່ອິກຄັ້ງ",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg overflow-hidden rounded-lg p-0 shadow-xl">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white">
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold">ອັບເດດເວລາການໃຊ້ງານໂຕະ</DialogTitle>
          </div>
          <DialogDescription className="text-blue-100 mt-1">
            ກຳນົດໄລຍະເວລາໃຊ້ງານໃໝ່ສຳລັບໂຕະທີ່ກຳລັງໃຊ້ງານຢູ່
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4">
          <div className="space-y-6">
            {currentEndTime && (
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-3 flex items-center space-x-3">
                  <Info className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="text-sm text-blue-800 font-medium">ເວລາສີ້ນສຸດ</div>
                    <div className="text-sm text-blue-600">
                      {formatTimeForDisplay(currentEndTime)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="expectedEndTime" className="text-gray-700 font-medium flex items-center">
                <ClockIcon className="h-4 w-4 mr-2 text-gray-600" />
                ເວລາທີ່ຄາດວ່າຈະສີ້ນສຸດການໃຊ້ງານ
              </Label>
              <Input
                id="expectedEndTime"
                type="datetime-local"
                {...register("expectedEndTime", { required: "ກະລຸນາລະບຸເວລາ" })}
                className={`${errors.expectedEndTime ? "border-red-500 ring-red-500" : "border-gray-200 focus:ring-blue-500 focus:border-blue-500"}`}
              />
              {errors.expectedEndTime && (
                <p className="text-red-500 text-sm flex items-center">
                  <XCircle className="h-4 w-4 mr-1" />
                  {errors.expectedEndTime.message}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge 
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer px-3 py-1"
                  onClick={() => addTime(15)}
                >
                  +15 ນາທີ
                </Badge>
                <Badge 
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer px-3 py-1"
                  onClick={() => addTime(30)}
                >
                  +30 ນາທີ
                </Badge>
                <Badge 
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer px-3 py-1"
                  onClick={() => addTime(60)}
                >
                  +1 ຊົ່ວໂມງ
                </Badge>
                <Badge 
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer px-3 py-1"
                  onClick={() => addTime(120)}
                >
                  +2 ຊົ່ວໂມງ
                </Badge>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="notifyCustomers"
                  {...register("notifyCustomers")}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="notifyCustomers" className="font-medium flex items-center cursor-pointer">
                  <BellIcon className="h-4 w-4 mr-2 text-blue-600" />
                  ແຈ້ງເຕືອນລູກຄ້າກ່ຽວກັບການປ່ຽນແປງ
                </Label>
              </div>

              {notifyCustomers && (
                <div className="space-y-2 pl-6 mt-2">
                  <Label htmlFor="notificationMessage" className="text-gray-700">
                    ຂໍ້ມູນແຈ້ງເຕືອນລູກຄ້າ
                  </Label>
                  <Textarea
                    id="notificationMessage"
                    {...register("notificationMessage")}
                    placeholder="ລະບຸຂໍ້ຄວາມທີ່ຕ້ອງການແຈ້ງເຕືອນລູກຄ້າ"
                    rows={3}
                    className="resize-none border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500">
                    ຂໍ້ຄວາມນີ້ຈະຖືກສົ່ງໄປຍັງລູກຄ້າເພື່ອແຈ້ງໃຫ້ຮູ້ເຖີງການປ່ຽນແປງເວລາ
                  </p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              ຍົກເລີກ
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ກຳລັງບັນທຶກ...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  ອັບເດດເວລາ
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TimeUpdateModal;