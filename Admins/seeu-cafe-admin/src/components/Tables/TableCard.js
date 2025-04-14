"use client";

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { th } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Users, 
  Clock, 
  Calendar, 
  ArrowRight, 
  PlayCircle, 
  StopCircle,
  Coffee,
  Timer,
  BellRing
} from "lucide-react";
import TableStatusBadge from './TableStatusBadge';
import TableActionMenu from './TableActionMenu';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const TableCard = ({ table, onStatusChange, onStartSession, onEndSession }) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (timeString) => {
    if (!timeString) return 'ບໍ່ມີ';
    const date = new Date(timeString);
    return `${date.toLocaleDateString('th-TH')} ${date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getSessionTimeInfo = () => {
    if (!table.current_session_start) {
      return 'ບໍ່ມີການໃຊ້ງານ';
    }

    const startTime = new Date(table.current_session_start);
    return formatDistanceToNow(startTime, { locale: th, addSuffix: true });
  };

  // Calculate session progress
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

  // Get background style based on status
  const getStatusStyle = () => {
    if (table.status === 'occupied') {
      return 'bg-gradient-to-br from-rose-50 to-red-50 border-rose-200';
    } else if (table.status === 'reserved') {
      return 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200';
    } else {
      return 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200';
    }
  };

  const getHeaderStyle = () => {
    if (table.status === 'occupied') {
      return 'bg-rose-100 text-rose-900';
    } else if (table.status === 'reserved') {
      return 'bg-blue-100 text-blue-900';
    } else {
      return 'bg-emerald-100 text-emerald-900';
    }
  };

  const getProgressColor = () => {
    const progress = getSessionProgress();
    if (progress > 90) return "bg-red-600";
    if (progress > 75) return "bg-amber-500";
    return "bg-blue-500";
  };

  return (
    <Card 
      className={`border ${isHovered ? 'shadow-lg' : 'shadow-sm'} transition-all duration-300 overflow-hidden`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${getHeaderStyle()} px-4 py-2 flex items-center justify-between transition-colors duration-300`}>
        <div className="flex items-center space-x-2">
          <Coffee className="h-4 w-4" />
          <CardTitle className="text-base font-semibold">ໂຕະ #{table.number}</CardTitle>
        </div>
        <div className="flex items-center space-x-2">
          <TableStatusBadge status={table.status} />
          <div className="relative">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setShowActions(!showActions)}
                    className="h-7 w-7 rounded-full bg-white/30 hover:bg-white/60 text-current"
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>ຕົວເລືອກເພີ່ມເຕີມ</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {showActions && (
              <TableActionMenu 
                table={table} 
                onClose={() => setShowActions(false)}
                onStatusChange={onStatusChange}
                onStartSession={onStartSession}
                onEndSession={onEndSession}
              />
            )}
          </div>
        </div>
      </div>
      
      <CardContent className={`pt-4 ${getStatusStyle()}`}>
        <div className="flex items-center mb-3">
          <Users size={16} className="mr-1.5 text-gray-700" />
          <span className="font-medium text-gray-800">{table.capacity} ທີ່ນັ່ງ</span>
        </div>
        
        {table.status === 'occupied' && (
          <div className="space-y-3 p-3 rounded-md bg-white/70 border border-rose-100 mb-2">
            <div className="flex justify-between text-sm">
              <div className="flex items-center text-gray-700">
                <Calendar size={14} className="mr-1.5" />
                <span>ເລີ່ມໃຊ້ງານ:</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatTime(table.current_session_start)}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <div className="flex items-center text-gray-700">
                <Timer size={14} className="mr-1.5" />
                <span>ໃຊ້ງານມາແລ້ວ:</span>
              </div>
              <span className="font-medium text-gray-900">
                {getSessionTimeInfo()}
              </span>
            </div>
            
            {table.expected_end_time && (
              <>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-gray-700">
                    <Clock size={14} className="mr-1.5 text-rose-500" />
                    <span>ຄາດວ່າຈະແລ້ວ:</span>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatTime(table.expected_end_time)}
                  </span>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">ຄວາມຄືບໜ້າ</span>
                    <span className={`font-medium ${getSessionProgress() > 90 ? 'text-red-600' : 'text-gray-700'}`}>
                      {getSessionProgress()}%
                    </span>
                  </div>
                  <Progress 
                    value={getSessionProgress()} 
                    className="h-1.5" 
                    indicatorClassName={getProgressColor()}
                  />
                </div>
              </>
            )}
          </div>
        )}
        
        {table.status === 'reserved' && (
          <div className="p-3 rounded-md bg-white/70 border border-blue-100 mb-2">
            {table.reservation?.customer_name && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">ຊື່ຜູ້ຈອງ:</span>
                <span className="font-medium text-gray-900">
                  {table.reservation.customer_name}
                </span>
              </div>
            )}
            
            {table.reservation?.start_time && (
              <div className="flex justify-between text-sm mt-1">
                <div className="flex items-center text-gray-700">
                  <BellRing size={14} className="mr-1.5 text-blue-500" />
                  <span>ເວລາຈອງ:</span>
                </div>
                <span className="font-medium text-gray-900">
                  {formatTime(table.reservation.start_time)}
                </span>
              </div>
            )}
            
            {table.reservation?.contact && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-700">ຕິດຕໍ່:</span>
                <span className="font-medium text-gray-900">
                  {table.reservation.contact}
                </span>
              </div>
            )}
          </div>
        )}
        
        {table.status === 'available' && (
          <div className="py-6 flex items-center justify-center text-center">
            <div className="text-gray-500">
              <span className="block text-sm">ໂຕະຫວ່າງພ້ອມໃຫ້ບໍລິການ</span>
              <span className="text-xs mt-1 block">ກົດປຸ່ມ "ເລີ່ມໃຊ້ງານ" ເພື່ອເລີ່ມໃຫ້ບໍລິການ</span>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between p-3 bg-white border-t">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/tables/${table.id}`} passHref>
                <Button variant="outline" size="sm" className="text-xs h-8 border-gray-200">
                  ລາຍລະອຽດ
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>ເບີ່ງລາຍລະອຽດໂຕະເພີ່ມເຕີມ</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {table.status === 'available' ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => onStartSession(table.id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                  size="sm"
                >
                  <PlayCircle className="mr-1 h-3 w-3" />
                  ເລີ່ມໃຊ້ງານ
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>ເລີ່ມການໃຊ້ງານໂຕະ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : table.status === 'occupied' ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => onEndSession(table.id)}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs h-8"
                  size="sm"
                >
                  <StopCircle className="mr-1 h-3 w-3" />
                  ສີ້ນສຸດການໃຊ້ງານ
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>ຈົບການໃຊ້ງານໂຕະ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span></span>
        )}
      </CardFooter>
    </Card>
  );
};

export default TableCard;