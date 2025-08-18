"use client";

 
import { getAdsImage } from "@/app/home/lib/AdsSection/GetAds";
import { getBrandImage } from "@/app/home/lib/BrandSection/getBrand";
 
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
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Brandsection/${id}`, {

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
      const jsonData = await getBrandImage();
      
      if (!jsonData) throw new Error("داده‌ای دریافت نشد!");
  
      setData(jsonData);
    } catch (error) {
      console.error("خطا در fetchData:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
 
    <div className="flex flex-col min-h-screen w-full bg-gray-900 text-white p-6">

{loading &&<div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
    </div> }
      {/* دکمه ایجاد پست جدید */}
 
      <Link
                      href={`/admin/Brand/add`}
                      className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-all flex items-center justify-center w-10 h-10"
                    >
                      <FaPlus/>
                    </Link>
      {/* نمایش جدول */}
      <div ref={tableRef} className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center text-gray-400 text-lg">در حال بارگذاری...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white text-md">
                <th className="p-3 border-b">نام</th>
      
                <th className="p-3 border-b">عکس</th>
           
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-700 transition-all">
                  <td className="p-3">{product.name}</td>
            
                  <td className="p-3 flex justify-center">
                    <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                  </td>
            
                  <td className="p-3 flex justify-center">
                     <p>{product.UrlLink}</p>
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <Link
                      href={`/admin/Brand/Edite/${product._id}`}
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
 
  );
};

export default Page;
