"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle, FiHome, FiArrowLeft } from 'react-icons/fi';

export default function NotFoundPage() {
  const router = useRouter();
  
  return (
    <div className="container mx-auto py-20 px-4 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center">
        <div className="text-red-500 mb-6">
          <FiAlertTriangle size={80} className="mx-auto" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">صفحه مورد نظر یافت نشد!</h1>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          متأسفانه صفحه‌ای که به دنبال آن بودید وجود ندارد یا حذف شده است.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
          >
            <FiArrowLeft />
            <span>بازگشت به صفحه قبلی</span>
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <FiHome />
            <span>صفحه اصلی</span>
          </Link>
        </div>
      </div>
    </div>
  );
}