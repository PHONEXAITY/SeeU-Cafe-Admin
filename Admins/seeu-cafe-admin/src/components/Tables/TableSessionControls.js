"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Play, StopCircle, Clock, Loader2, Users, AlertCircle } from "lucide-react";
import { useTableManagement } from '@/hooks/useTableManagement';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';

const TableSessionControls = ({ table, onSessionChange }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [notifyCustomers, setNotifyCustomers] = useState(true);
  const [notificationMessage, setNotificationMessage] = useState(
    'ການໃຊ້ງານໂຕະຂອງທ່ານໄດ້ເລີ່ມຕົ້ນແລ້ວ ທ່ານສາມາດສັ່ງອາຫານໄດ້ທັນທີ'
  );
  const [expectedDuration, setExpectedDuration] = useState('2');
  
  const { startTableSession, endTableSession } = useTableManagement();
  const { toast } = useToast();

  const handleStartSession = async () => {
    try {
      setIsStarting(true);
      const result = await startTableSession(table.id);
      
      // แจ้งเตือนสำเร็จ
      toast({
        title: "ເລີ່ມການໃຊ້ງານສຳເລັດ",
        description: `ເລີ່ມການໃຊ້ງານໂຕະ #${table.number} ສຳເລັດແລ້ວ`,
        variant: "success",
      });
      
      if (onSessionChange) {
        onSessionChange(result);
      }
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດເລີ່ມການໃຊ້ງານໂຕະໄດ້ ກະລຸນາລອງໃໝ່ອິກຄັ້ງ",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleEndSession = async () => {
    try {
      setIsEnding(true);
      const result = await endTableSession(table.id);
      
      // แจ้งเตือนสำเร็จ
      toast({
        title: "ສີ້ນສຸດການໃຊ້ງານສຳເລັດ",
        description: `ສີ້ນສຸດການໃຊ້ງານໂຕະ #${table.number} ຮຽບຮ້ອຍແລ້ວ`,
        variant: "success",
      });
      
      if (onSessionChange) {
        onSessionChange(result);
      }
    } catch (error) {
      toast({
        title: "ເກີດຂໍ້ຜິດພາດ",
        description: error.message || "ບໍ່ສາມາດສີ້ນສຸດການໃຊ້ງານໂຕະໄດ້ ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
        variant: "destructive",
      });
    } finally {
      setIsEnding(false);
    }
  };

  const getExpectedEndTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + parseInt(expectedDuration));
    return now.toLocaleTimeString('th-TH');
  };

  const getSessionProgress = () => {
    if (!table.current_session_start || !table.expected_end_time) {
      return 0;
    }

    const start = new Date(table.current_session_start).getTime();
    const end = new Date(table.expected_end_time).getTime();
    const now = new Date().getTime();
    
    // Make sure we don't exceed 100%
    if (now >= end) return 100;
    
    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
  };

  const formatSessionDuration = () => {
    if (!table.current_session_start) return "-";
    const startTime = new Date(table.current_session_start);
    return formatDistanceToNow(startTime, { locale: th, addSuffix: false });
  };

  if (table.status === 'occupied') {
    return (
      <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-red-50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-rose-600" />
            ໂຕະກຳລັງຖືກໃຊ້ງານ
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3 space-y-4">
          <div className="p-3 bg-white/80 rounded-md border border-rose-100 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">ເລີ່ມໃຊ້ງານເມື່ອ:</span>
              <span className="font-medium">
                {table.current_session_start 
                  ? new Date(table.current_session_start).toLocaleString('th-TH')
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700">ໄລຍະເວລາທີ່ໃຊ້:</span>
              <span className="font-medium">{formatSessionDuration()}</span>
            </div>
            {table.expected_end_time && (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">ຄາດວ່າຈະແລ້ວ:</span>
                  <span className="font-medium">
                    {new Date(table.expected_end_time).toLocaleString('th-TH')}
                  </span>
                </div>
                <div className="space-y-1 mt-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>ຄວາມຄືບໜ້າ</span>
                    <span className={getSessionProgress() > 90 ? "text-rose-600 font-medium" : ""}>
                      {getSessionProgress()}%
                    </span>
                  </div>
                  <Progress value={getSessionProgress()} className="h-2" 
                    indicatorClassName={
                      getSessionProgress() > 90 
                        ? "bg-rose-600" 
                        : getSessionProgress() > 75 
                        ? "bg-amber-500" 
                        : "bg-blue-600"
                    } 
                  />
                </div>
              </>
            )}
          </div>
          
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              ເມື່ອລູກຄ້າຊຳລະເງີນແລ້ວ ກະລຸນາກົດປຸ່ມ "ສີ້ນສຸດການໃຊ້ງານ" ເພື່ອຄືນສະຖານະໂຕະເປັນພ້ອມໃຊ້ງານ
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleEndSession}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
            disabled={isEnding}
          >
            {isEnding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ກຳລັງດຳເນີນການ...
              </>
            ) : (
              <>
                <StopCircle className="mr-2 h-5 w-5" />
                ສີ້ນສຸດການໃຊ້ງານໂຕະ
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (table.status === 'available') {
    return (
      <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Play className="h-5 w-5 mr-2 text-emerald-600" />
            ເລີ່ມໃຊ້ງານໂຕະ
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-3 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expectedDuration" className="text-gray-700">ໄລຍະເວລາທີ່ຄາດວ່າຈະໃຊ້ (ຊົ່ວໂມງ)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="expectedDuration"
                type="number"
                value={expectedDuration}
                onChange={(e) => setExpectedDuration(e.target.value)}
                min="0.5"
                step="0.5"
                className="w-24 border-gray-200"
              />
              <span className="text-sm text-gray-600">
                ຄາດວ່າຈະແລ້ວເວລາ {getExpectedEndTime()}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifyCustomers"
              checked={notifyCustomers}
              onCheckedChange={(checked) => setNotifyCustomers(checked)}
              className="text-emerald-600 border-gray-300"
            />
            <Label htmlFor="notifyCustomers" className="font-normal text-sm cursor-pointer">
              ແຈ້ງເຕືອນລູກຄ້າເມື່ອເລີ່ມໃຊ້ງານໂຕະ
            </Label>
          </div>

          {notifyCustomers && (
            <div className="space-y-2">
              <Label htmlFor="notificationMessage" className="text-sm text-gray-700">ຂໍ້ມູນແຈ້ງເຕືອນ</Label>
              <Textarea
                id="notificationMessage"
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={2}
                className="text-sm resize-none border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500">
                ຂໍ້ຄວາມນີ້ຈະຖືກສົ່ງໄປຍັງລູກຄ້າເມື່ອທ່ານເລີ່ມການໃຊ້ງານໂຕະ
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleStartSession}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            disabled={isStarting}
          >
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ກຳລັງເລີ່ມເຊສຊັນ...
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                ເລີ່ມໃຊ້ງານໂຕະ
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // สถานะจองแล้ว
  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2 text-blue-600" />
          ໂຕະຖືກຈອງແລ້ວ
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="p-3 bg-white/80 rounded-md border border-blue-100 space-y-2 mb-3">
          {table.reservation?.customer_name && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">ຊື່ອຜູ້ຈອງ:</span>
              <span className="font-medium">{table.reservation.customer_name}</span>
            </div>
          )}
          
          {table.reservation?.start_time && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">ເວລາຈອງ:</span>
              <span className="font-medium">
                {new Date(table.reservation.start_time).toLocaleString('th-TH')}
              </span>
            </div>
          )}
          
          {table.reservation?.contact && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">ເບີຕິດຕໍ່:</span>
              <span className="font-medium">{table.reservation.contact}</span>
            </div>
          )}
        </div>
        
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800 text-sm">
            ເມື່ອລູກຄ້າມາເຖີງຮ້ານ ກົດປຸ່ມ "ເລີ່ມໃຊ້ງານ" ເພື່ອປ່ຽນສະຖານະໂຕະເປັນກຳລັງໃຊ້ງານ
          </AlertDescription>
        </Alert>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleStartSession}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          disabled={isStarting}
        >
          {isStarting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ກຳລັງເລີ່ມເຊສຊັນ...
            </>
          ) : (
            <>
              <Play className="mr-2 h-5 w-5" />
              ເລີ່ມໃຊ້ງານໂຕະ
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TableSessionControls;