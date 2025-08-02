"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      fetchResults(query);
    }
  }, [query]);

  const fetchResults = async (q) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        throw new Error("خطا در دریافت نتایج");
      }
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("خطا:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">
        نتایج جستجو برای:{" "}
        <span className="text-blue-600">{query || "..."}</span>
      </h1>

      {/* اسکلتون در حال لود */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg shadow bg-white flex flex-col"
            >
              <Skeleton height={150} className="rounded" />
              <Skeleton height={20} className="mt-3" />
              <Skeleton width={80} />
            </div>
          ))}
        </div>
      )}

      {/* وقتی لود تمام شد */}
      {!loading && results.length === 0 && (
        <p className="text-gray-500 text-center text-lg mt-10">
          هیچ محصولی یافت نشد.
        </p>
      )}

      {/* نمایش نتایج */}
      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mt-4">
          {results.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 border rounded-lg shadow hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col"
            >
              {/* تصویر محصول */}
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-72 sm:h-72 object-cover rounded"
                />
              ) : (
                <div className="w-full h-48 sm:h-56 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                  بدون تصویر
                </div>
              )}

              {/* نام محصول */}
              <h2 className="text-base sm:text-lg font-semibold mt-3 text-gray-800 truncate">
                {item.name}
              </h2>

              {/* قیمت */}
              <p className="mt-2 text-blue-600 font-bold text-lg sm:text-xl">
                {item.price.toLocaleString()} تومان
              </p>

              {/* دسته‌بندی */}
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                دسته: {item.category?.title || "نامشخص"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
