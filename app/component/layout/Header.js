"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUserEdit,
  FaSignOutAlt,
  FaBoxOpen,
  FaKey,
  FaRegUser,
  FaUserShield,
  FaHome,
  FaThLarge,
  FaUser,
  FaSearch,
  FaChevronDown,
  FaStar,
  FaFire,
} from "react-icons/fa";
import { FiHeart, FiShoppingBag, FiBell, FiGift } from "react-icons/fi";
import { HiOutlineMenuAlt3, HiSparkles } from "react-icons/hi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { getCategories } from "../../home/lib/getCategories";
import LogoutButton from "@/app/commponent/auth/LogoutButton";
import { useCart } from "@/app/context/cartContext";
import SearchBar from "./sercha-bar/serachbar";

// Enhanced Animation Variants
const menuVariants = {
  closed: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      mass: 0.8
    }
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      mass: 0.8,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const menuItemVariants = {
  closed: {
    x: 50,
    opacity: 0
  },
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const dropdownVariants = {
  closed: {
    opacity: 0,
    y: -20,
    scale: 0.9,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const overlayVariants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

const logoVariants = {
  initial: { scale: 1, rotate: 0 },
  hover: { 
    scale: 1.1, 
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  },
  tap: { scale: 0.95 }
};

const cartBadgeVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 15
    }
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const profileMenuRef = useRef(null);
  const categoriesMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const headerRef = useRef(null);

  const { data: session, status } = useSession();
  const { cart } = useCart();

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const isAuthenticated = status === "authenticated";
  const isAdmin = isAuthenticated && session?.user?.isAdmin;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch categories with loading animation
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
        const data = await getCategories();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
      if (categoriesMenuRef.current && !categoriesMenuRef.current.contains(event.target)) {
        setCategoriesMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle body scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("overflow-hidden", "fixed", "w-full");
    } else {
      document.body.classList.remove("overflow-hidden", "fixed", "w-full");
    }
    
    return () => {
      document.body.classList.remove("overflow-hidden", "fixed", "w-full");
    };
  }, [mobileMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        setProfileMenuOpen(false);
        setCategoriesMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleProfileToggle = useCallback(() => {
    setProfileMenuOpen(prev => !prev);
    setCategoriesMenuOpen(false);
  }, []);

  const handleCategoriesToggle = useCallback(() => {
    setCategoriesMenuOpen(prev => !prev);
    setProfileMenuOpen(false);
  }, []);

  return (
    <>
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, #3b82f6 0%, transparent 70%)`,
            left: `${mousePosition.x * 0.02}%`,
            top: `${mousePosition.y * 0.02}%`
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-5"
          style={{
            background: `radial-gradient(circle, #8b5cf6 0%, transparent 70%)`,
            right: `${mousePosition.x * 0.015}%`,
            bottom: `${mousePosition.y * 0.015}%`
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Enhanced Header */}
      <motion.header
        ref={headerRef}
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-2xl border-b border-gray-700/50 shadow-2xl shadow-blue-500/10' 
            : 'bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 backdrop-blur-xl border-b border-gray-800/30'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50 animate-pulse" />
        
        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
          {/* Main header row */}
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Left section - Menu & Logo */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Enhanced Mobile menu button */}
              <motion.button
                onClick={handleMenuToggle}
                className="lg:hidden relative p-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-300 backdrop-blur-sm border border-gray-700/50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="فتح منوی اصلی"
              >
                <motion.div
                  animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <HiOutlineMenuAlt3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </motion.div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-20 transition-opacity duration-300" />
              </motion.button>

              {/* Enhanced Logo */}
              <Link href="/" className="flex items-center">
                <motion.div
                  variants={logoVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="relative group"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 blur-xl transition-all duration-300" />
                  <Image
                    src="/images/brand/ChatGPT Image Jul 28, 2025, 11_30_02 PM.png"
                    alt="لوگو فروشگاه"
                    width={120}
                    height={48}
                    className="h-8 sm:h-10 lg:h-14 w-auto relative z-10 drop-shadow-2xl"
                    priority
                  />
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </Link>
            </div>

            {/* Enhanced Center section - Desktop search */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-4 xl:mx-8">
              <motion.div
                className={`relative transition-all duration-500 ${
                  searchFocused 
                    ? 'transform scale-105 drop-shadow-2xl' 
                    : 'transform scale-100'
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                <SearchBar
                  variant="dark"
                  size="md"
                  placeholder="جستجو در بیش از 10,000 محصول..."
                  className="w-full relative z-10 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                />
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  animate={{ rotate: searchFocused ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FaSearch className="w-4 h-4 text-gray-400" />
                </motion.div>
              </motion.div>
            </div>

            {/* Enhanced Right section - Actions */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 flex-shrink-0">
              {/* Notifications - New Feature */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:flex relative p-3 rounded-xl bg-gradient-to-r from-orange-600/20 to-red-600/20 hover:from-orange-600/30 hover:to-red-600/30 transition-all duration-300 backdrop-blur-sm border border-gray-700/50"
              >
                <FiBell className="w-5 h-5 text-orange-400" />
                <motion.span
                  className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity
                  }}
                />
              </motion.button>

              {/* Enhanced Admin panel */}
              {isAdmin && (
                <Link href="/admin" className="hidden lg:block">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(239, 68, 68, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-medium shadow-lg shadow-red-500/25 transition-all duration-300 text-sm relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    <FaUserShield className="w-4 h-4 relative z-10" />
                    <span className="hidden xl:inline relative z-10">پنل ادمین</span>
                    <HiSparkles className="w-3 h-3 relative z-10" />
                  </motion.button>
                </Link>
              )}

              {/* Enhanced Cart */}
              <Link href="/Cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 transition-all duration-300 backdrop-blur-sm border border-gray-700/50 group"
                  aria-label={`سبد خرید - ${totalItems} آیتم`}
                >
                  <motion.div
                    animate={{ rotate: totalItems > 0 ? [0, -10, 10, 0] : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaShoppingCart className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                  </motion.div>
                  
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.span
                        variants={cartBadgeVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="absolute -top-2 -right-2 min-w-[22px] h-[22px] bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg px-1 border-2 border-gray-900"
                      >
                        {totalItems > 99 ? "99+" : totalItems}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </motion.button>
              </Link>

              {/* Enhanced Favorites */}
              <Link href="/favorites" className="hidden sm:block">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-3 rounded-xl bg-gradient-to-r from-pink-600/20 to-rose-600/20 hover:from-pink-600/30 hover:to-rose-600/30 transition-all duration-300 backdrop-blur-sm border border-gray-700/50 group"
                  aria-label="علاقه‌مندی‌ها"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FiHeart className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
                  </motion.div>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </motion.button>
              </Link>

              {/* Enhanced User menu */}
              {isAuthenticated ? (
                <div className="relative" ref={profileMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProfileToggle}
                    className="flex items-center gap-2 p-1 sm:p-2 rounded-xl bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 transition-all duration-300 backdrop-blur-sm border border-gray-700/50 group"
                    aria-label="منوی کاربری"
                  >
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden">
                      {/* Animated border */}
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-0.5 rounded-xl overflow-hidden">
                        {session?.user?.Image_profile ? (
                          <Image
                            src={session.user.Image_profile}
                            alt="تصویر پروفایل"
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <FaRegUser className="text-white text-sm sm:text-base" />
                          </div>
                        )}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: profileMenuOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FaChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                    </motion.div>
                  </motion.button>

                  {/* Enhanced Profile dropdown */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="absolute left-0 rtl:right-0 mt-3 w-80 bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden z-50"
                      >
                        {/* Enhanced Profile header */}
                        <div className="relative p-6 bg-gradient-to-r from-emerald-600 to-teal-600 overflow-hidden">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                            animate={{ x: [-100, 400] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          />
                          <div className="relative flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white/30 shadow-xl">
                              {session?.user?.Image_profile ? (
                                <Image
                                  src={session.user.Image_profile}
                                  alt="تصویر پروفایل"
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                                  <FaRegUser className="text-white text-2xl" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="font-bold text-white text-lg truncate mb-1"
                              >
                                {session.user.name || "کاربر گرامی"}
                              </motion.p>
                              <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-sm text-emerald-100 truncate"
                              >
                                {session.user.email}
                              </motion.p>
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-1 mt-2"
                              >
                                <FaStar className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs text-emerald-100">کاربر VIP</span>
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Menu items */}
                        <div className="p-3">
                          {[
                            { href: "/my-profile", icon: FaUserEdit, label: "پروفایل کاربری", color: "blue" },
                            { href: "/change-password", icon: FaKey, label: "تغییر رمز عبور", color: "purple" },
                            { href: "/User_admin_profile/My-Orders", icon: FaBoxOpen, label: "سفارش‌های من", color: "orange" },
                            ...(isAdmin ? [{ href: "/admin", icon: FaUserShield, label: "پنل مدیریت", color: "red" }] : [])
                          ].map((item, index) => (
                            <motion.div
                              key={item.href}
                              variants={menuItemVariants}
                              initial="closed"
                              animate="open"
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={item.href}
                                onClick={() => setProfileMenuOpen(false)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-${item.color}-500/10 transition-all duration-300 group mb-1`}
                              >
                                <div className={`p-2 rounded-xl bg-${item.color}-500/20 group-hover:bg-${item.color}-500/30 transition-colors`}>
                                  <item.icon className={`w-4 h-4 text-${item.color}-400 group-hover:text-${item.color}-300`} />
                                </div>
                                <span className="text-gray-300 group-hover:text-white font-medium">{item.label}</span>
                              </Link>
                            </motion.div>
                          ))}

                          <div className="border-t border-gray-700/50 mt-3 pt-3">
                            <LogoutButton className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-500/10 transition-all duration-300 group w-full">
                              <div className="p-2 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                                <FaSignOutAlt className="w-4 h-4 text-red-400" />
                              </div>
                              <span className="text-gray-300 group-hover:text-red-400 font-medium">خروج از حساب</span>
                            </LogoutButton>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Enhanced Guest user buttons */
                <div className="hidden sm:flex items-center gap-2">
                  <Link href="/auth/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-xl font-medium transition-all duration-300 text-sm backdrop-blur-sm"
                    >
                      ورود
                    </motion.button>
                  </Link>
                  <Link href="/auth/register">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 text-sm relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <span className="relative z-10">ثبت‌نام</span>
                    </motion.button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Mobile search bar */}
          <motion.div
            className="lg:hidden pb-3 pt-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="relative">
              <SearchBar
                variant="dark"
                size="sm"
                placeholder="جستجو در محصولات..."
                className="w-full bg-gray-800/50 border-gray-700/50 backdrop-blur-sm"
              />
              <motion.div
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <FaSearch className="w-4 h-4 text-gray-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Desktop categories navigation */}
          <nav className="hidden lg:block border-t border-gray-700/30">
            <div className="flex items-center justify-center gap-2 py-4 overflow-x-auto">
              {/* Enhanced Categories dropdown */}
              <div className="relative flex-shrink-0" ref={categoriesMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCategoriesToggle}
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-medium shadow-lg shadow-blue-500/25 whitespace-nowrap relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <FaThLarge className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">دسته‌بندی‌ها</span>
                  <motion.div
                    animate={{ rotate: categoriesMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10"
                  >
                    <FaChevronDown className="w-3 h-3" />
                  </motion.div>
                  <FaFire className="w-3 h-3 text-orange-300 relative z-10" />
                </motion.button>

                <AnimatePresence>
                  {categoriesMenuOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      className="absolute top-full mt-3 w-80 bg-gray-900/95 backdrop-blur-2xl border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden z-50"
                    >
                      <div className="p-4 max-h-96 overflow-y-auto custom-scrollbar">
                        <div className="mb-3">
                          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <FaThLarge className="w-3 h-3" />
                            دسته‌بندی محصولات
                          </h3>
                        </div>
                        
                        {loading ? (
                          <div className="space-y-3">
                            {[...Array(6)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                <Skeleton
                                  height={48}
                                  baseColor="#1f2937"
                                  highlightColor="#374151"
                                  className="rounded-2xl"
                                />
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {categories.map((category, index) => (
                              <motion.div
                                key={category._id}
                                variants={menuItemVariants}
                                initial="closed"
                                animate="open"
                                transition={{ delay: index * 0.05 }}
                              >
                                <Link
                                  href={`/category/${category.slug}`}
                                  onClick={() => setCategoriesMenuOpen(false)}
                                  className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-500/10 transition-all duration-300 group"
                                >
                                  <div className="p-2 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                                    <FaThLarge className="w-3 h-3 text-blue-400 group-hover:text-blue-300" />
                                  </div>
                                  <span className="text-gray-300 group-hover:text-white font-medium flex-1">
                                    {category.title}
                                  </span>
                                  <FaChevronDown className="w-3 h-3 text-gray-500 rotate-[-90deg] group-hover:text-blue-400 transition-colors" />
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Enhanced Direct category links */}
              <div className="flex items-center gap-3 overflow-x-auto flex-1 px-4">
                {!loading && categories.slice(0, 6).map((category, index) => (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0"
                  >
                    <Link
                      href={`/category/${category.slug}`}
                      className="relative px-4 py-2 text-gray-300 hover:text-white rounded-xl font-medium transition-all duration-300 whitespace-nowrap group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="relative z-10">{category.title}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Enhanced Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Enhanced Overlay */}
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 lg:hidden"
              onClick={handleMenuClose}
            />

            {/* Enhanced Sidebar */}
            <motion.aside
              ref={mobileMenuRef}
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 rtl:left-0 h-full w-96 max-w-[90vw] bg-gray-900/98 backdrop-blur-3xl border-l border-gray-700/50 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Enhanced Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 z-10 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                  animate={{ x: [-100, 500] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
                <div className="relative flex items-center justify-between">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xl font-bold text-white flex items-center gap-2"
                  >
                    <HiSparkles className="w-5 h-5" />
                    منوی اصلی
                  </motion.h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleMenuClose}
                    className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                    aria-label="بستن منو"
                  >
                    <FaTimes className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
              </div>

              {/* Enhanced User info */}
              {isAuthenticated && (
                <motion.div
                  variants={menuItemVariants}
                  className="p-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/50 to-gray-900/50"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="absolute inset-1 rounded-xl overflow-hidden">
                        {session?.user?.Image_profile ? (
                          <Image
                            src={session.user.Image_profile}
                            alt="تصویر پروفایل"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <FaRegUser className="text-white text-xl" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-bold text-white text-lg truncate mb-1"
                      >
                        {session.user.name || "کاربر گرامی"}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-sm text-gray-300 truncate mb-2"
                      >
                        {session.user.email}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-1"
                      >
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-emerald-400 font-medium">عضو VIP</span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { href: "/my-profile", icon: FaUserEdit, label: "پروفایل", color: "blue" },
                      { href: "/User_admin_profile/My-Orders", icon: FaBoxOpen, label: "سفارش‌ها", color: "orange" },
                      { href: "/favorites", icon: FiHeart, label: "علاقه‌مندی‌ها", color: "pink" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.href}
                        variants={menuItemVariants}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={handleMenuClose}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-${item.color}-500/10 transition-all duration-300 group`}
                        >
                          <div className={`p-2 rounded-xl bg-${item.color}-500/20 group-hover:bg-${item.color}-500/30 transition-colors`}>
                            <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                          </div>
                          <span className="text-gray-300 group-hover:text-white font-medium">{item.label}</span>
                        </Link>
                      </motion.div>
                    ))}

                    {isAdmin && (
                      <motion.div variants={menuItemVariants}>
                        <Link
                          href="/admin"
                          onClick={handleMenuClose}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 transition-all duration-300 group"
                        >
                          <div className="p-2 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                            <FaUserShield className="w-4 h-4 text-red-400" />
                          </div>
                          <span className="text-gray-300 group-hover:text-white font-medium">پنل ادمین</span>
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Enhanced Categories */}
              <div className="p-6">
                <motion.h3
                  variants={menuItemVariants}
                  className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2"
                >
                  <FaThLarge className="w-3 h-3" />
                  دسته‌بندی محصولات
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <FaFire className="w-3 h-3 text-orange-400" />
                  </motion.div>
                </motion.h3>
                
                <div className="space-y-2">
                  {loading ? (
                    [...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Skeleton
                          height={52}
                          baseColor="#1f2937"
                          highlightColor="#374151"
                          className="rounded-2xl"
                        />
                      </motion.div>
                    ))
                  ) : (
                    categories.map((category, index) => (
                      <motion.div
                        key={category._id}
                        variants={menuItemVariants}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={`/category/${category.slug}`}
                          onClick={handleMenuClose}
                          className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-blue-500/10 transition-all duration-300 group"
                        >
                          <div className="p-2 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                            <FaThLarge className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                          </div>
                          <span className="text-gray-300 group-hover:text-white font-medium truncate flex-1">
                            {category.title}
                          </span>
                          <FaChevronDown className="w-3 h-3 text-gray-500 rotate-[-90deg] group-hover:text-blue-400 transition-colors" />
                        </Link>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Enhanced Auth buttons for guests */}
              {!isAuthenticated && (
                <motion.div
                  variants={menuItemVariants}
                  className="p-6 space-y-4"
                >
                  <Link href="/auth/login" onClick={handleMenuClose}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 border-2 border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm"
                    >
                      ورود به حساب
                    </motion.button>
                  </Link>
                  <Link href="/auth/register" onClick={handleMenuClose}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-medium shadow-lg shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <span className="relative z-10">ثبت‌نام رایگان</span>
                    </motion.button>
                  </Link>
                </motion.div>
              )}

              {/* Enhanced Logout */}
              {isAuthenticated && (
                <motion.div
                  variants={menuItemVariants}
                  className="p-6 border-t border-gray-700/50"
                >
                  <LogoutButton className="flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-red-500/10 transition-all duration-300 group w-full">
                    <div className="p-2 rounded-xl bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
                      <FaSignOutAlt className="w-4 h-4 text-red-400" />
                    </div>
                    <span className="text-gray-300 group-hover:text-red-400 font-medium">خروج از حساب</span>
                  </LogoutButton>
                </motion.div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Enhanced Bottom navigation - Mobile only */}
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-3xl border-t border-gray-700/50 z-40 lg:hidden safe-area-pb"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
      >
        <div className="grid grid-cols-5 h-16 relative">
          {/* Animated background indicator */}
          <motion.div
            className="absolute top-0 w-1/5 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{ x: "0%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          
          {[
            { href: "/", icon: FaHome, label: "خانه", active: true },
            { href: "/component/layout/menuecategories", icon: FaThLarge, label: "دسته‌ها" },
            { href: "/Cart", icon: FiShoppingBag, label: "سبد", badge: totalItems },
            { href: "/favorites", icon: FiHeart, label: "علاقه‌مندی" },
            { href: isAuthenticated ? "/my-profile" : "/auth/login", icon: FaUser, label: isAuthenticated ? "پروفایل" : "ورود", image: isAuthenticated ? session?.user?.Image_profile : null }
          ].map((item, index) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`flex flex-col items-center justify-center gap-1 h-full transition-all duration-300 relative ${
                  item.active ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                }`}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt="پروفایل"
                      width={20}
                      height={20}
                      className="w-5 h-5 rounded-full object-cover ring-2 ring-emerald-400"
                    />
                  ) : (
                    <item.icon className="w-5 h-5" />
                  )}
                  
                  {item.badge && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center border border-gray-900"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </motion.span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
                
                {item.active && (
                  <motion.div
                    className="absolute top-0 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    layoutId="activeTab"
                  />
                )}
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.nav>

      {/* Enhanced Custom styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 10px;
          border: 2px solid #1f2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%);
        }
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }
        .touch-manipulation {
          touch-action: manipulation;
        }
        
        /* Enhanced gradient animations */
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        
        /* Enhanced background patterns */
        .bg-mesh {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
        }
        
        /* Smooth transitions for all elements */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Enhanced focus states for accessibility */
        button:focus-visible,
        a:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 8px;
        }
        
        /* Loading states */
        .loading-shimmer {
          background: linear-gradient(90deg, 
            rgba(31, 41, 55, 0.4) 0%, 
            rgba(55, 65, 81, 0.6) 50%, 
            rgba(31, 41, 55, 0.4) 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </>
  );
};

export default Header;
