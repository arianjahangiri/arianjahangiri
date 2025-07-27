import React from "react";
import Link from "next/link";
import { FaHome, FaInfoCircle, FaList } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
  
      <div className="w-60 bg-gray-800 p-6 shadow-xl flex flex-col rounded-lg">
        <h4 className="text-white mb-6 border-b border-gray-600 pb-3 text-2xl font-bold tracking-wide text-shadow-lg">
          منو
        </h4>
        <div className="space-y-5">
          <Link
            href="https://arianjahangiri.vercel.app/admin/product/post"
            className="flex items-center text-base text-blue-400 hover:text-blue-500 transition-all p-2 rounded-lg hover:bg-gray-700 font-medium tracking-wide"
          >
            <FaHome className="mr-3 text-lg" /> محصولات
          </Link>
          <Link
            href="https://arianjahangiri.vercel.app/admin/User/post"
            className="flex items-center text-base text-blue-400 hover:text-blue-500 transition-all p-2 rounded-lg hover:bg-gray-700 font-medium tracking-wide"
          >
            <FaList className="mr-3 text-lg" /> کاربران
          </Link>
          <Link
            href="https://arianjahangiri.vercel.app/admin/discountcode/post"
            className="flex items-center text-base text-blue-400 hover:text-blue-500 transition-all p-2 rounded-lg hover:bg-gray-700 font-medium tracking-wide"
          >
            <FaInfoCircle className="mr-3 text-lg" /> کد تخفیف
          </Link>
          <Link
            href="/admin/comment/post"
            className="flex items-center text-base text-blue-400 hover:text-blue-500 transition-all p-2 rounded-lg hover:bg-gray-700 font-medium tracking-wide"
          >
            <FaInfoCircle className="mr-3 text-lg" /> مدیریت نظرات
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
