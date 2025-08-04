"use client";  
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getCategories } from "../../home/lib/getCategories";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaUserEdit,
  FaHeart,
  FaSignOutAlt,
  FaBoxOpen,
  FaKey,
  FaChevronDown,
  FaRegUser,
  FaUserShield,  // آیکون ادمین
} from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "@/app/commponent/auth/LogoutButton";
import { useCart } from "@/app/context/cartContext";
import SearchBar from "./sercha-bar/serachbar";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart } = useCart();
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="w-full shadow-sm z-50 sticky top-0 border-b bg-white border-gray-100">
      {/* هدر اصلی */}
      <div className="max-w-7xl mx-auto h-[109px] flex items-center justify-between px-4 py-3">
        {/* لوگو و منوی همبرگری */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
            >
              <Image 
                src="/images/brand/ChatGPT Image Jul 28, 2025, 11_30_02 PM.png" 
                alt="Logo" 
                width={108} 
                height={101} 
                priority 
                className="hover:opacity-90 transition-opacity"
              />
            </motion.div>
          </Link>
          <button 
            className="lg:hidden text-xl p-2 rounded-full transition-colors hover:bg-gray-100 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <FaBars />
          </button>
        </div>

        {/* نوار جستجو */}
       <SearchBar/>

        {/* آیکون‌ها و پروفایل */}
        <div className="flex items-center gap-4">
          {/* دکمه ادمین */}
    {status === "authenticated" && session?.user?.isAdmin && (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="hidden md:flex text-xl p-2 rounded-full transition-colors hover:bg-gray-100 text-red-600 cursor-pointer"
  >
    <Link href="/admin" aria-label="پنل مدیریت" className="flex items-center gap-1">
      <FaUserShield />
      <span className="hidden sm:inline text-sm font-medium">ادمین</span>
    </Link>
  </motion.div>
)}


          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative"
          >
            <Link href="/Cart" className="text-xl p-2 rounded-full transition-colors flex items-center hover:bg-gray-100 text-gray-700">
              <FaShoppingCart className="text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </motion.div>

          {status !== "authenticated" ? (
            <div className="hidden md:flex gap-2">
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
            <div className="relative ">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="cursor-pointer   "
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
                    className={`absolute mt-2 w-56 shadow-xl rounded-lg z-50 overflow-hidden ${
                      isMobile ? "left-0" : "right-0"
                    } bg-white border-gray-100 border`}
                  >
                    <div className="p-3 border-b border-gray-100 bg-gray-50">
                      <p className="font-semibold truncate text-gray-800">
                        {session.user.name || "کاربر"}
                      </p>
                      <p className="text-xs truncate text-gray-500">
                        {session.user.email}
                      </p>
                    </div>
                    
                    <Link href="/my-profile" className="flex items-center px-4 py-3 transition-colors hover:bg-blue-50 text-gray-700">
                      <FaUserEdit className="ml-2 text-blue-500" />
                      <span>پروفایل کاربری</span>
                    </Link>
                    <Link href="/change-password" className="flex items-center px-4 py-3 transition-colors hover:bg-blue-50 text-gray-700">
                      <FaKey className="ml-2 text-blue-500" />
                      <span>تغییر رمز عبور</span>
                    </Link>
                    <Link href="/User_admin_profile/My-Orders" className="flex items-center px-4 py-3 transition-colors hover:bg-blue-50 text-gray-700">
                      <FaBoxOpen className="ml-2 text-blue-500" />
                      <span>سفارش‌های من</span>
                    </Link>
                    <Link href="/my-favorites" className="flex items-center px-4 py-3 transition-colors hover:bg-blue-50 text-gray-700">
                      <FaHeart className="ml-2 text-blue-500" />
                      <span>علاقه‌مندی‌ها</span>
                    </Link>

                    {/* اگر ادمین هست باز هم توی منوی پروفایل دکمه ادمین بزار */}
                    {session?.user?.isAdmin && (
                      <Link href="/admin" className="flex items-center px-4 py-3 transition-colors hover:bg-red-50 text-red-600 font-semibold">
                        <FaUserShield className="ml-2" />
                        <span>پنل مدیریت</span>
                      </Link>
                    )}
                    
                    <div className="border-t border-gray-100">
                      <LogoutButton className="w-full text-left flex items-center px-4 py-3 transition-colors hover:bg-red-50 text-gray-700">
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
                <Skeleton key={i} width={80} height={20} baseColor="#E5E7EB" highlightColor="#F3F4F6" />
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
                      className="text-[#2b2d2e] decoration-white hover:text-blue-600 transition-colors font-medium"
                    >
                      {cat.title}
                    </Link>
               
                </motion.div>
              ))}
        </div>
      </nav>

      {/* منوی موبایل */}
      <AnimatePresence> 
        {mobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            <motion.div
              className="fixed right-0 top-0 w-80 h-full shadow-xl p-4 overflow-y-auto z-50 flex flex-col bg-white"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">منوی اصلی</h2>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full transition-colors hover:bg-gray-100 text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>

              {/* جستجو موبایل */}
              <div className="relative mb-6">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="جستجو محصولات..." 
                  className="w-full pl-10 pr-4 py-2 rounded-full focus:outline-none bg-white text-gray-700 border-gray-200 focus:ring-blue-500 border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* دسته‌بندی‌ها */}
              <div className="space-y-1 flex-1 overflow-y-auto">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} height={40} baseColor="#E5E7EB" highlightColor="#F3F4F6" className="mb-2" />
                    ))
                  : categories.map((cat) => (
                      <div key={cat._id} className="mb-2">
                        <div className="font-medium flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100 text-gray-700">
                          <Link 
                            href={`/category/${cat.slug}`} 
                            className="flex-1"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {cat.title}
                          </Link>
                          {cat.menu_dropdown?.length > 0 && (
                            <FaChevronDown className="text-xs text-gray-400" />
                          )}
                        </div>
                        {Array.isArray(cat.menu_dropdown) && cat.menu_dropdown.length > 0 && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.2 }}
                            className="pl-4 overflow-hidden"
                          >
                            {cat.menu_dropdown.map(
                              (item, i) =>
                                item.text &&
                                item.LinkUrl && (
                                  <Link
                                    key={i}
                                    href={item.LinkUrl}
                                    className="block p-2 text-sm rounded transition-colors text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {item.text}
                                  </Link>
                                )
                            )}
                          </motion.div>
                        )}
                      </div>
                    ))}
              </div>

              {/* بخش احراز هویت موبایل */}
              <div className="mt-auto pt-4 border-t border-gray-200">
                {status !== "authenticated" ? (
                  <div className="flex flex-col gap-3">
                    <Link href="/auth/login">
                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 rounded-lg transition-colors font-medium border border-blue-500 text-blue-500 !text-center hover:bg-blue-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        ورود به حساب
                      </motion.button>
                    </Link>
                    <Link href="/auth/register">
                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-2.5 rounded-lg text-white transition-colors font-medium shadow-sm bg-gradient-to-r  !text-center from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        ثبت‌ نام جدید
                      </motion.button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <div className="w-10 h-10 rounded-full border flex items-center justify-center bg-blue-100 border-blue-200 text-blue-500">
                        <FaRegUser />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {session.user.name || "کاربر"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.user.email}
                        </p>
                      </div>
                    </div>

                    {/* دکمه ادمین در منوی موبایل */}
                    {session?.user?.isAdmin && (
                      <Link 
                        href="/admin"
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg transition-colors font-semibold text-red-600 border border-red-600 hover:bg-red-50"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <FaUserShield />
                        <span>پنل مدیریت</span>
                      </Link>
                    )}

                    <LogoutButton 
                      className="w-full py-2.5 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 bg-red-50 text-red-500 hover:bg-red-100"
                    >
                      <FaSignOutAlt />
                      <span>خروج از حساب</span>
                    </LogoutButton>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
