import React from "react";

export const ErrorState = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-red-900 mb-2">
        ເກີດຂໍ້ຜິດພາດ
      </h3>
      <p className="text-red-600">
        {error?.message || "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບເຊີບເວີໄດ້"}
      </p>
    </div>
  );
};