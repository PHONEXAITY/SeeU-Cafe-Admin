import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmptyProductState = ({ onAddProduct }) => {
  return (
    <div className="bg-gray-50 rounded-lg shadow-sm p-8 text-center">
      <div className="mx-auto max-w-md">
        <div className="text-gray-400 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          ບໍ່ພົບສິນຄ້າ
        </h3>
        <p className="text-gray-500 mb-6">
          ບໍ່ມີສິນຄ້າທີ່ຕົກລົງກັບການຄົ້ນຫາຂອງທ່ານ
        </p>
        <Button
          onClick={onAddProduct}
          className="bg-gradient-to-r from-amber-500 to-amber-600"
        >
          <Plus className="mr-2 h-4 w-4" /> ເພີ່ມສິນຄ້າໃໝ່
        </Button>
      </div>
    </div>
  );
};