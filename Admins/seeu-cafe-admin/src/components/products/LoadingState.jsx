import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-64 bg-gray-50 rounded-lg">
      <div className="text-center">
        <Loader2 className="animate-spin h-12 w-12 text-amber-600 mx-auto mb-4" />
        <p className="text-gray-600">ກຳລັງໂຫລດສິນຄ້າ...</p>
      </div>
    </div>
  );
};