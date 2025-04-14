"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Users } from "lucide-react";

const TableStatusBadge = ({ status, className }) => {
  if (status === "available") {
    return (
      <Badge className={`bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 flex items-center ${className}`}>
        <CheckCircle2 className="w-3 h-3 mr-1" />
        <span className="text-xs">ພ້ອມໃຊ້ງານ</span>
      </Badge>
    );
  }

  if (status === "reserved") {
    return (
      <Badge className={`bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 flex items-center ${className}`}>
        <Clock className="w-3 h-3 mr-1" />
        <span className="text-xs">ຈອງແລ້ວ</span>
      </Badge>
    );
  }

  if (status === "occupied") {
    return (
      <Badge className={`bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 flex items-center ${className}`}>
        <Users className="w-3 h-3 mr-1" />
        <span className="text-xs">ກຳລັງໃຊ້ງານ</span>
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={className}>
      <span className="text-xs">{status}</span>
    </Badge>
  );
};

export default TableStatusBadge;