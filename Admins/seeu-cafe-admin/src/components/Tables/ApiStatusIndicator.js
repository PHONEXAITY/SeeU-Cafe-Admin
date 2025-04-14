"use client";

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { WifiIcon, WifiOffIcon, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export const ApiStatusIndicator = ({ className }) => {
  const [status, setStatus] = useState('checking');
  const [lastChecked, setLastChecked] = useState(null);
  const [error, setError] = useState(null);
  
  const checkApiStatus = async () => {
    try {
      setStatus('checking');
      
      // ໃຊ້ endpoint ທີ່ມີຢູ່ໃນລະບົບເພື່ອກວດສະຖານະ API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/tables?limit=1`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // ຕັ້ງເວລາ timeout ໃຫ້ບໍ່ລໍຖ້ານານເກີນໄປ
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        setStatus('online');
        setError(null);
      } else {
        setStatus('error');
        setError(`API ຕອບກັບດ້ວຍສະຖານະ: ${response.status}`);
      }
    } catch (err) {
      setStatus('offline');
      setError(err.message);
    } finally {
      setLastChecked(new Date());
    }
  };
  
  useEffect(() => {
    checkApiStatus();
    
    // ກວດສອບສະຖານະທຸກ 2 ນາທີ
    const interval = setInterval(checkApiStatus, 120000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'API ພ້ອມໃຊ້ງານ';
      case 'offline':
        return 'ບໍ່ສາມາດເຊື່ອມຕໍ່ API ໄດ້';
      case 'error':
        return 'API ເກີດຂໍ້ຜິດພາດ';
      case 'checking':
        return 'ກຳລັງກວດສອບ API...';
      default:
        return 'ບໍ່ຮູ້ສະຖານະ';
    }
  };
  
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300';
      case 'offline':
        return 'bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-300';
      case 'error':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300';
      case 'checking':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-300';
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <WifiIcon className="h-3 w-3 mr-1" />;
      case 'offline':
      case 'error':
        return <WifiOffIcon className="h-3 w-3 mr-1" />;
      case 'checking':
        return <RefreshCw className="h-3 w-3 mr-1 animate-spin" />;
      default:
        return <WifiIcon className="h-3 w-3 mr-1" />;
    }
  };
  
  const formatTimeAgo = (date) => {
    if (!date) return '';
    
    const seconds = Math.floor((new Date() - date) / 1000);
    
    if (seconds < 60) return 'ແປບເດຽວນີ້';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ນາທີກ່ອນ`;
    
    return date.toLocaleTimeString('lo-LA', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs cursor-pointer flex items-center",
              getStatusColor(),
              className
            )}
            onClick={checkApiStatus}
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-medium">ສະຖານະການເຊື່ອມຕໍ່ API</p>
            {lastChecked && (
              <p className="text-xs text-gray-500">
                ກວດສອບຄັ້ງຫຼ້າສຸດ: {formatTimeAgo(lastChecked)}
              </p>
            )}
            {error && status !== 'online' && (
              <p className="text-xs text-rose-500 mt-1">
                {error}
              </p>
            )}
            <p className="text-xs mt-1">ຄລິກເພື່ອກວດສອບໃໝ່</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ApiStatusIndicator;
