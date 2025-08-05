
import React from 'react';
import { FaHome, FaShoppingCart, FaThLarge, FaUser } from "react-icons/fa";
import { MdApps } from "react-icons/md";
const menumobile = () => {
  return (
   <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 block lg:hidden z-50">
      <nav className="flex justify-around items-center h-16 text-gray-600 text-xs sm:text-sm">
        
        {/* دیجی‌کالای من */}
        <div className="flex flex-col items-center hover:text-red-500 cursor-pointer">
          <FaUser className="text-lg sm:text-xl mb-1" />
          <span>دیجی‌کالای من</span>
        </div>

        {/* مگنت */}
        <div className="flex flex-col items-center hover:text-red-500 cursor-pointer">
          <MdApps className="text-lg sm:text-xl mb-1" />
          <span>مگنت</span>
        </div>

        {/* سبد خرید */}
        <div className="relative flex flex-col items-center hover:text-red-500 cursor-pointer">
          <FaShoppingCart className="text-lg sm:text-xl mb-1" />
          {/* آیکون قرمز روی سبد */}
          <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
            0
          </span>
          <span>سبد خرید</span>
        </div>

        {/* دسته‌بندی */}
        <div className="flex flex-col items-center hover:text-red-500 cursor-pointer">
          <FaThLarge className="text-lg sm:text-xl mb-1" />
          <span>دسته‌بندی</span>
        </div>

        {/* خانه */}
        <div className="flex flex-col items-center text-black font-bold cursor-pointer">
          <FaHome className="text-lg sm:text-xl mb-1" />
          <span>خانه</span>
        </div>

      </nav>
    </div>
  );
};

export default menumobile;