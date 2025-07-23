"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiUser,
  FiHeart,
  FiSettings,
  FiLogOut,
  FiClock,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
 
import { FaSignOutAlt } from "react-icons/fa";
import LogoutButton from "@/app/commponent/auth/LogoutButton";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("همه");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) throw new Error("خطا در دریافت سفارش‌ها");
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    if (status.includes("پرداخت شده ")) return <FiClock className="ml-1" />;
    if (status.includes("  درحال انتظار  ")) return <FiClock className="ml-1" />;
    if (status.includes("تکمیل شده ")) return <FiCheckCircle className="ml-1" />;
    if (status.includes("لغو شده ")) return <FiXCircle className="ml-1" />;
    return null;
  };

  const filteredOrders = filter === "همه" ? orders : orders.filter(order => order.status.includes(filter));

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black p-4 text-white">
        <div className="bg-[#0a0a0a] p-8 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.2)] w-full max-w-md text-center">
          <FiXCircle className="text-red-500 w-12 h-12 mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">خطا در دریافت اطلاعات</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap gap-2">
          <button onClick={() => setFilter("درحال پردازش ")} className="px-4 py-2 rounded-lg text-sm bg-yellow-900 text-yellow-100 hover:bg-yellow-800">در حال پردازش</button>
          <button onClick={() => setFilter("لغو شده")} className="px-4 py-2 rounded-lg text-sm bg-red-950 text-red-200 hover:bg-red-800">لغو شده</button>
          <button onClick={() => setFilter("تکمیل شده ")} className="px-4 py-2 rounded-lg text-sm bg-green-950 text-green-200 hover:bg-green-800">تکمیل شده</button>  <button onClick={() => setFilter("در انتظار  پرداخت ")} className="px-4 py-2 rounded-lg text-sm bg-green-950 text-green-200 hover:bg-green-800">در انتظار  پرداخت </button>
          <button onClick={() => setFilter("همه")} className="px-4 py-2 rounded-lg text-sm bg-gray-700 text-white hover:bg-gray-600">نمایش همه</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-[#0a0a0a] rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.2)] p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center border-b pb-3 border-gray-800">
                <FiUser className="ml-2 text-indigo-500" />
                پنل کاربری
              </h2>
              <nav className="space-y-2 text-sm">
                <Link
                  href="/my-orders"
                  className="flex items-center p-2 rounded-lg bg-indigo-700 text-white font-medium"
                >
                  <FiPackage className="ml-2" />
                  سفارش‌های من
                </Link>
                <Link href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <FiSettings className="ml-2" />
                  تنظیمات حساب
                </Link>
                <Link href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-800">
                  <FiHeart className="ml-2" />
                  علاقه‌مندی‌ها
                </Link>
                   <LogoutButton className="w-full py-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors font-medium flex items-center justify-center gap-2">
                      <FaSignOutAlt />
                      <span>خروج از حساب</span>
                    </LogoutButton>
              </nav>
            </div>
          </aside>

          {/* Orders */}
          <main className="md:col-span-3">
            <div className="bg-[#0a0a0a] rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h1 className="text-2xl font-bold flex items-center">
                  <FiPackage className="ml-2" />
                  سفارش‌های من
                </h1>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gray-800 flex items-center justify-center mb-4">
                    <FiPackage size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">سفارشی ثبت نشده</h3>
                  <p className="text-gray-400 mb-4">{filter === "همه" ? "شما هنوز سفارشی ثبت نکرده‌اید." : `هیچ سفارشی با وضعیت '${filter}' یافت نشد.`}</p>
                  <Link
                    href="/products"
                    className="inline-flex px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    مشاهده محصولات
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {filteredOrders.map((order) => (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                      className="p-6 hover:bg-gray-900 transition"
                    >
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <p className="font-semibold text-sm">کد سفارش: {order._id}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center">
                            <FiClock className="ml-1" />
                            {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                          <div>
                          <p className="font-semibold text-sm">کد سفارش: {order._id}</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center">
                            <FiClock className="ml-1" />
                            {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">
                            {order.finalPrice.toLocaleString()} تومان
                          </p>
                          <span
                            className={`inline-flex items-center mt-2 px-3 py-1 text-xs font-medium rounded-full ${
                              order.status.includes("در انتظار  پرداخت ") ? "bg-blue-950 text-blue-200" :
                              order.status.includes("پردازش") ? "bg-yellow-900 text-yellow-100" :
                              order.status.includes(" تکمیل شده ") ? "bg-green-950 text-green-200" :
                              order.status.includes("لغوشده ") ? "bg-red-950 text-red-200" :
                              "bg-gray-800 text-gray-300"
                            }`}
                          >
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {/* Products in order */}
                      <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                        {order.items.map((item) => (
                          <div
                            key={item._id || item.product?._id}
                            className="flex items-center p-3 border border-gray-800 rounded-lg bg-black"
                          >
                            <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800">
                              {item.product?.imageUrl ? (
                                <Image
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  width={64}
                                  height={64}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                  <FiPackage size={20} />
                                </div>
                              )}
                            </div>
                            <div className="mr-4 flex-1">
                              <h4 className="font-semibold text-sm line-clamp-1">
                                {item.product?.name || "بدون نام"}
                              </h4>
                              <p className="text-xs text-gray-400 mt-1 flex gap-2">
                                <span>تعداد: {item.quantity}</span>
                                <span>|</span>
                                <span>{item.product?.price?.toLocaleString()} تومان</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyOrder;