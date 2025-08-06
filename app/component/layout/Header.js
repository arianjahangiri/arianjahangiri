"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCategories } from "../../home/lib/getCategories";
import {
  FaShoppingCart,
  FaUserEdit,
  FaHeart,
  FaSignOutAlt,
  FaBoxOpen,
  FaKey,
  FaRegUser,
  FaUserShield,
  FaHome,
  FaThLarge,
  FaUser,
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "@/app/commponent/auth/LogoutButton";
import { useCart } from "@/app/context/cartContext";
import SearchBar from "./sercha-bar/serachbar";
import { MdApps } from "react-icons/md";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const { cart } = useCart();
  const totalItems =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

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
    <header className="w-full shadow-sm z-50 sticky top-0 border-b bg-white border-gray-100">
      {/* هدر اصلی */}
      <div className="max-w-7xl mx-auto h-[109px] flex items-center justify-between px-4 py-3">
        {/* لوگو */}
        <Image
          src="/images/brand/ChatGPT Image Jul 28, 2025, 11_30_02 PM.png"
          alt="Logo"
          width={108}
          height={101}
          priority
          className="hover:opacity-90 hidden md:flex transition-opacity"
        />

        {/* نوار جستجو */}
        <SearchBar />

        {/* بخش پروفایل و سبد خرید (فقط دسکتاپ) */}
        <div className="hidden md:flex items-center gap-4">
          {/* دکمه ادمین */}
          {status === "authenticated" && session?.user?.isAdmin && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-xl p-2 rounded-full transition-colors hover:bg-gray-100 text-red-600 cursor-pointer"
            >
              <Link
                href="/admin"
                aria-label="پنل مدیریت"
                className="flex items-center gap-1"
              >
                <FaUserShield />
                <span className="hidden sm:inline text-sm font-medium">
                  ادمین
                </span>
              </Link>
            </motion.div>
          )}

          {/* سبد خرید */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <Link
              href="/Cart"
              className="text-xl p-2 rounded-full transition-colors flex items-center hover:bg-gray-100 text-gray-700"
            >
              <FaShoppingCart className="text-gray-700" />
              {totalItems > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  {totalItems}
                </span>
              )}
            </Link>
          </motion.div>

          {/* اگر کاربر لاگین نکرده */}
          {status !== "authenticated" ? (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-50 rounded-full transition-all text-sm font-medium"
                >
                  ورود
                </motion.button>
              </Link>
              <Link href="/auth/register">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-1.5 rounded-full text-white transition-all text-sm font-medium shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  ثبت‌نام
                </motion.button>
              </Link>
            </div>
          ) : (
            // اگر کاربر لاگین کرده
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="cursor-pointer"
              >
                {session?.user?.Image_profile ? (
                  <Image
                    src={session.user.Image_profile}
                    alt="User Avatar"
                    width={36}
                    height={36}
                    className="rounded-full w-10 h-10 object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center bg-blue-100 border-blue-500 text-blue-500">
                    <FaRegUser />
                  </div>
                )}
              </motion.div>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="absolute mt-2 w-56 shadow-xl rounded-lg z-50 bg-white border-gray-100 border right-0"
                  >
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <p className="font-semibold truncate text-gray-800">
                        {session.user.name || "کاربر"}
                      </p>
                      <p className="text-xs truncate text-gray-500">
                        {session.user.email}
                      </p>
                    </div>

                    <Link
                      href="/my-profile"
                      className="flex items-center px-4 py-3 hover:bg-blue-50 text-gray-700"
                    >
                      <FaUserEdit className="ml-2 text-blue-500" />
                      <span>پروفایل کاربری</span>
                    </Link>
                    <Link
                      href="/change-password"
                      className="flex items-center px-4 py-3 hover:bg-blue-50 text-gray-700"
                    >
                      <FaKey className="ml-2 text-blue-500" />
                      <span>تغییر رمز عبور</span>
                    </Link>
                    <Link
                      href="/User_admin_profile/My-Orders"
                      className="flex items-center px-4 py-3 hover:bg-blue-50 text-gray-700"
                    >
                      <FaBoxOpen className="ml-2 text-blue-500" />
                      <span>سفارش‌های من</span>
                    </Link>
                    <Link
                      href="/my-favorites"
                      className="flex items-center px-4 py-3 hover:bg-blue-50 text-gray-700"
                    >
                      <FaHeart className="ml-2 text-blue-500" />
                      <span>علاقه‌مندی‌ها</span>
                    </Link>

                    {session?.user?.isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 hover:bg-red-50 text-red-600 font-semibold"
                      >
                        <FaUserShield className="ml-2" />
                        <span>پنل مدیریت</span>
                      </Link>
                    )}

                    <div className="border-t border-gray-100">
                      <LogoutButton className="w-full text-left flex items-center px-4 py-3 hover:bg-red-50 text-gray-700">
                        <FaSignOutAlt className="ml-2 text-red-500" />
                        <span>خروج از حساب</span>
                      </LogoutButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* منوی دسکتاپ */}
      <nav className="hidden lg:block border-t bg-gradient-to-r from-dark-75 to-gray-60 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-10">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  width={80}
                  height={20}
                  baseColor="#E5E7EB"
                  highlightColor="#F3F4F6"
                />
              ))
            : categories.map((cat, idx) => (
                <motion.div
                  key={cat._id}
                  className="relative group"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-[#2b2d2e] hover:text-blue-600 transition-colors font-medium"
                  >
                    {cat.title}
                  </Link>
                </motion.div>
              ))}
        </div>
      </nav>

      {/* منوی موبایل */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t border-gray-200 block lg:hidden z-50">
        <nav className="flex justify-around items-center h-16 text-gray-600 text-xs sm:text-sm">
          <div className="flex flex-col items-center hover:text-red-500 cursor-pointer">
            <FaUser className="text-lg sm:text-xl mb-1" />
            <span>دیجی‌کالای من</span>
          </div>

          <div className="flex flex-col items-center hover:text-red-500 cursor-pointer">
            <MdApps className="text-lg sm:text-xl mb-1" />
            <span>مگنت</span>
          </div>

          <div className="relative flex flex-col items-center hover:text-red-500 cursor-pointer">
            <FaShoppingCart className="text-lg sm:text-xl mb-1" />
            <span className="absolute -top-1 right-2 bg-red-500 text-white text-xs w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
            <span>سبد خرید</span>
          </div>

          <div className="flex flex-col items-center hover:text-red-500 cursor-pointer">
            <FaThLarge className="text-lg sm:text-xl mb-1" />
            <span>دسته‌بندی</span>
          </div>

          <div className="flex flex-col items-center text-black font-bold cursor-pointer">
            <FaHome className="text-lg sm:text-xl mb-1" />
            <span>خانه</span>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
