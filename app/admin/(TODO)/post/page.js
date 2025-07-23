"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaHome, FaList } from "react-icons/fa"; // افزودن آیکون‌ها

const page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRouter();
  const [Id, setId] = useState([]);

  const fetchdel = async (id) => {
    try {
      await fetch(`http://localhost:3000/Posts/${id}`, {
        method: "DELETE",
      });

      fetchData();
      route.push("/admin/post");
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:3000/Posts");
      if (!res.ok) throw new Error("خطا در بارگذاری پست‌ها");

      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const Edite = (post) => {
    setId(post._id);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="flex-1 p-10 flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-2xl transform transition-all duration-300 hover:scale-105">
        <Link
          href="/create"
          className="bg-green-500 text-white px-6 py-3 rounded-full mb-8 text-xl font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
        >
          <FaPlus className="inline-block mr-2" /> ساخت پست جدید
        </Link>

        <div className="mt-8 w-full max-w-lg space-y-6">
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <svg
                className="w-12 h-12 text-green-500 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="60"
                  strokeDashoffset="45"
                />
              </svg>
            </div>
          ) : data.length > 0 ? (
            data.map((post) => (
              <div
                key={post._id}
                className="flex justify-between items-center bg-gray-800 p-6 my-4 rounded-2xl shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105"
              >
                <p className="text-xl font-semibold">{post.title}</p>
                <div className="space-x-4">
                  <Link
                    onClick={() => Edite(post)}
                    href={` edite/${post._id}`}
                    className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                  >
                    <FaEdit className="inline-block mr-2" /> ویرایش
                  </Link>
                  <button
                    onClick={() => fetchdel(post._id)}
                    className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                  >
                    <FaTrash className="inline-block mr-2" /> حذف
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center text-xl">در حال بارگذاری...</p>
          )}
        </div>
      </div>

      {/* منوی بهبود یافته */}
      <div className="w-64 bg-gray-800 p-6 shadow-2xl flex flex-col items-start rounded-xl">
        <h4 className="text-white mb-6 border-b-2 border-gray-600 pb-3 text-xl font-semibold">
          منو
        </h4>
        <div className="space-y-4">
          <Link
            href="/categories"
            className="flex items-center space-x-2 text-blue-400 text-lg font-medium hover:text-blue-500 transition-all duration-300"
          >
            <FaList className="text-xl" />
            <span>دسته بندی‌ها</span>
          </Link>
          <Link
            href="/home"
            className="flex items-center space-x-2 text-blue-400 text-lg font-medium hover:text-blue-500 transition-all duration-300"
          >
            <FaHome className="text-xl" />
            <span>خانه</span>
          </Link>
          <Link
            href="/about"
            className="flex items-center space-x-2 text-blue-400 text-lg font-medium hover:text-blue-500 transition-all duration-300"
          >
            <FaHome className="text-xl" />
            <span>درباره ما</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
