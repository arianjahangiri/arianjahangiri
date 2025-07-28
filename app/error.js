"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}) {
  useEffect(() => {
    console.error("خطا:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-6 py-12">
      <div className="max-w-md text-center space-y-6">
        <div>
          <h1 className="text-5xl font-extrabold text-red-600 dark:text-red-400 mb-2">خطای غیرمنتظره</h1>
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            متأسفیم! مشکلی در اجرای صفحه رخ داده است.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-5 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            🔄 رفرش صفحه
          </button>

          <a
            href="/"
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium py-2 px-5 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            🏠 بازگشت به صفحه اصلی
          </a>
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500">کد خطا در کنسول ثبت شده است</p>
      </div>
    </main>
  );
}
