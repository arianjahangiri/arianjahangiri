"use client";
import React, { useEffect, useState } from "react";
 
import { FaBars, FaTimes } from "react-icons/fa";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getCategories } from "@/app/home/lib/getCategories";

const FullScreenMenu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div className="lg:hidden">
      {/* دکمه باز کردن منو */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="p-2 text-gray-700 text-2xl"
      >
        <FaBars />
      </button>

      {/* منوی تمام‌صفحه */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            {/* هدر منو */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">دسته‌بندی‌ها</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-2xl text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* دسته‌بندی‌ها */}
            <div className="p-4">
              {loading ? (
                <p className="text-gray-500">در حال بارگذاری...</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-800 text-lg font-medium hover:text-blue-600 transition"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FullScreenMenu;
