'use client'

import React from 'react';
import Image from 'next/image';
import { FaCoffee } from 'react-icons/fa';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-brown-900 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <div className="relative w-24 h-24 mb-4">
          <Image 
            src="/logo (2).jpg" 
            alt="SeeU Cafe Logo" 
            fill
            className="rounded-full object-contain"
          />
        </div>
        <h2 className="text-xl font-semibold text-brown-800 mb-4">Loading...</h2>
        <div className="flex items-center">
          <FaCoffee className="text-brown-600 mr-2 animate-pulse text-2xl" />
          <div className="relative w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-brown-600 animate-progress rounded-full"></div>
          </div>
          <FaCoffee className="text-brown-600 ml-2 animate-pulse text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;