"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/app/home/lib/getCategories";

const SideMenu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("خطا در دریافت دسته‌ها:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex">
      {/* منوی کناری */}
      <aside className="w-64 h-screen bg-white border-l shadow-md p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">دسته‌بندی‌ها</h2>
        {loading ? (
          <p className="text-gray-500">در حال بارگذاری...</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="block p-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                >
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* محتوای اصلی */}
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">محتوای اصلی اینجاست</h1>
      </main>
    </div>
  );
};

export default SideMenu;
