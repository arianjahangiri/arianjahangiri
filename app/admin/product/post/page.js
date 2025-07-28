"use client";
import { FcGallery } from "react-icons/fc";
// import AuthWrapper from "@/app/commponent/auth/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const route = useRouter();

  const fetchDel = async (id) => {
    if (!window.confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    try {
      await fetch(`https://arianjahangiri.vercel.app/api/product/${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://arianjahangiri.vercel.app/api/product");
      if (!res.ok) throw new Error("خطا در بارگذاری محصولات");

      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);

      // اسکرول به پایین پس از بارگذاری داده‌ها
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    // <AuthWrapper>
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white p-6">

{loading &&<div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div> }
      {/* دکمه ایجاد پست جدید */}
      <div className="flex justify-end mb-6">
        <Link
          href="creat"
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-2"
        >
          <FaPlus /> ساخت محصول جدید
        </Link>
      </div>

      {/* نمایش جدول */}
      <div ref={tableRef} className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center text-gray-400 text-lg">در حال بارگذاری...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white text-md">
                <th className="p-3 border-b">نام</th>
                <th className="p-3 border-b">توضیحات</th>
                <th className="p-3 border-b">موجودی</th>
                <th className="p-3 border-b">عکس</th>
                <th className="p-3 border-b">قیمت</th>
                <th className="p-3 border-b">دسته‌بندی</th>
                <th className="p-3 border-b">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-700 transition-all">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.description}</td>
                  <td className="p-3 text-center">{product.stock}</td>
                  <td className="p-3 flex justify-center">
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                  </td>
                  <td className="p-3">{product.price}</td>
                  <td className="p-3">{product.category?.title || "دسته‌بندی نامشخص"}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <Link
                      href={`/admin/product/edite/${product._id}`}
                      className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-all flex items-center justify-center w-10 h-10"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => fetchDel(product._id)}
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-all flex items-center justify-center w-10 h-10"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => route.push(`/admin/ProductGallery/post/${product._id}`)}
                      className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-all flex items-center justify-center w-10 h-10"
                    >
                      <FcGallery />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    // </AuthWrapper>
  );
};

export default Page;
