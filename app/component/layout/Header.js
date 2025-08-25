"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMapPin,
  FiMenu,
  FiX,
  FiChevronRight,
  FiPercent,
  FiTruck,
  FiGift,
  FiCreditCard,
  FiSmartphone,
  FiMonitor,
  FiHome,
  FiShoppingBag,
  FiStar,
  FiHeart,
  FiHeadphones,
  FiWatch,
  FiCamera,
  FiCpu,
  FiHardDrive,
  FiPrinter,
  FiSpeaker,
  FiTablet,
  FiBluetooth,
  FiWifi,
  FiTv,
  FiActivity,
} from "react-icons/fi";
import { BiSupport } from "react-icons/bi";
import { AiOutlineFire } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { RiStore2Line } from "react-icons/ri";

// دیتای دسته‌بندی‌ها
const categories = [
  {
    id: 1,
    title: "موبایل",
    icon: <FiSmartphone />,
    href: "/mobile",
    color: "text-blue-600",
    subCategories: [
      {
        title: "برندهای مختلف موبایل",
        items: [
          { name: "اپل", href: "/mobile/apple", count: 156 },
          { name: "سامسونگ", href: "/mobile/samsung", count: 243 },
          { name: "شیائومی", href: "/mobile/xiaomi", count: 189 },
          { name: "هوآوی", href: "/mobile/huawei", count: 87 },
          { name: "نوکیا", href: "/mobile/nokia", count: 45 },
          { name: "آنر", href: "/mobile/honor", count: 67 },
          { name: "وان پلاس", href: "/mobile/oneplus", count: 34 },
          { name: "ریلمی", href: "/mobile/realme", count: 56 },
        ]
      },
      {
        title: "لوازم جانبی موبایل",
        items: [
          { name: "قاب و کاور", href: "/mobile/case", hot: true },
          { name: "محافظ صفحه نمایش", href: "/mobile/screen-protector" },
          { name: "پاوربانک", href: "/mobile/powerbank" },
          { name: "کابل و شارژر", href: "/mobile/charger" },
          { name: "هولدر و پایه", href: "/mobile/holder" },
          { name: "هندزفری و هدفون", href: "/mobile/headphone", new: true },
        ]
      },
      {
        title: "گوشی بر اساس قیمت",
        items: [
          { name: "تا ۵ میلیون تومان", href: "/mobile/under-5m" },
          { name: "۵ تا ۱۰ میلیون", href: "/mobile/5-10m" },
          { name: "۱۰ تا ۱۵ میلیون", href: "/mobile/10-15m" },
          { name: "۱۵ تا ۲۰ میلیون", href: "/mobile/15-20m" },
          { name: "بالای ۲۰ میلیون", href: "/mobile/over-20m" },
        ]
      },
      {
        title: "گوشی بر اساس کاربری",
        items: [
          { name: "گیمینگ", href: "/mobile/gaming", hot: true },
          { name: "عکاسی", href: "/mobile/photography" },
          { name: "اقتصادی", href: "/mobile/budget" },
          { name: "5G", href: "/mobile/5g", new: true },
          { name: "دو سیم کارت", href: "/mobile/dual-sim" },
        ]
      }
    ],
    featured: [
      {
        title: "iPhone 15 Pro Max",
        price: "72,500,000",
        oldPrice: "75,000,000",
        discount: 3,
        image: "/products/iphone15.jpg"
      },
      {
        title: "Samsung Galaxy S24 Ultra",
        price: "54,990,000",
        oldPrice: "59,000,000", 
        discount: 7,
        image: "/products/s24ultra.jpg"
      }
    ]
  },
  {
    id: 2,
    title: "کالای دیجیتال",
    icon: <FiMonitor />,
    href: "/digital",
    color: "text-purple-600",
    subCategories: [
      {
        title: "لپ تاپ و الترابوک",
        items: [
          { name: "لپ تاپ ایسوس", href: "/laptop/asus" },
          { name: "لپ تاپ اچ پی", href: "/laptop/hp" },
          { name: "لپ تاپ دل", href: "/laptop/dell" },
          { name: "لپ تاپ لنوو", href: "/laptop/lenovo" },
          { name: "لپ تاپ اپل", href: "/laptop/apple", hot: true },
          { name: "لپ تاپ ایسر", href: "/laptop/acer" },
          { name: "لپ تاپ ام اس آی", href: "/laptop/msi" },
        ]
      },
      {
        title: "کامپیوتر و تجهیزات",
        items: [
          { name: "کیس اسمبل شده", href: "/pc/assembled" },
          { name: "قطعات کامپیوتر", href: "/pc/parts" },
          { name: "مانیتور", href: "/pc/monitor", new: true },
          { name: "کیبورد و ماوس", href: "/pc/keyboard-mouse" },
          { name: "وبکم و میکروفون", href: "/pc/webcam" },
        ]
      }
    ]
  },
  {
    id: 3,
    title: "خانه و آشپزخانه",
    icon: <FiHome />,
    href: "/home",
    color: "text-orange-600",
  },
  {
    id: 4,
    title: "مد و پوشاک",
    icon: <FiShoppingBag />,
    href: "/fashion",
    color: "text-pink-600",
    badge: "۷۰٪ تخفیف"
  },
  {
    id: 5,
    title: "سوپرمارکت",
    icon: <RiStore2Line />,
    href: "/supermarket",
    color: "text-green-600",
  },
  {
    id: 6,
    title: "کتاب و لوازم تحریر",
    icon: <FiActivity />,
    href: "/books",
    color: "text-yellow-600",
  },
  {
    id: 7,
    title: "ورزش و سفر",
    icon: <TbTruckDelivery />,
    href: "/sport",
    color: "text-red-600",
  }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const megaMenuRef = useRef(null);
  const categoryMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target) &&
          categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setIsMegaMenuOpen(false);
        setActiveCategory(null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Header Wrapper */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}>
        {/* Top Header */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-16 lg:h-[72px]">
              {/* Right Section */}
              <div className="flex items-center gap-4 lg:gap-6">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="lg:hidden p-2 -ml-2"
                >
                  <FiMenu className="w-6 h-6" />
                </button>

                {/* Logo */}
                <Link href="/" className="flex-shrink-0">
                  <div className="text-[#ef4056] font-bold text-xl lg:text-2xl">
                    digikala
                  </div>
                </Link>

                {/* Search Box - Desktop */}
                <div className="hidden lg:block flex-1 max-w-[600px]">
                  <div className="relative">
                    <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="جستجو"
                      className="w-full bg-gray-100 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Left Section */}
              <div className="flex items-center gap-2 lg:gap-4">
                {/* Search Button - Mobile */}
                <button className="lg:hidden p-2">
                
                
                
                  <FiSearch className="w-6 h-6" />
                </button>

                {/* Login */}
                <Link
                  href="/login"
                  className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 lg:px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  <FiUser className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm font-medium">ورود | ثبت‌نام</span>
                </Link>

                {/* Cart */}
                <Link href="/cart" className="relative p-2">
                  <FiShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ef4056] text-white text-xs rounded-full flex items-center justify-center">
                    ۳
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Header - Navigation */}
        <div className="hidden lg:block border-b border-gray-100">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="flex items-center justify-between h-10">
              {/* Right Navigation */}
              <nav className="flex items-center">
                {/* دسته‌بندی کالاها */}
                <div className="relative" ref={categoryMenuRef}>
                  <button
                    onMouseEnter={() => setIsMegaMenuOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <FiMenu className="w-4 h-4" />
                    <span>دسته‌بندی کالاها</span>
                  </button>
                </div>

                <div className="w-px h-4 bg-gray-300 mx-2"></div>

                {/* Quick Links */}
                <Link href="/amazing" className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <AiOutlineFire className="w-4 h-4 text-orange-500" />
                  <span>شگفت‌انگیزها</span>
                </Link>

                <Link href="/supermarket" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  سوپرمارکت
                </Link>

                <Link href="/gift-card" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  کارت هدیه
                </Link>

                <Link href="/best-selling" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  پرفروش‌ترین‌ها
                </Link>

                <Link href="/discounts" className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <FiPercent className="w-4 h-4" />
                  <span>تخفیف‌ها و پیشنهادها</span>
                </Link>

                <div className="w-px h-4 bg-gray-300 mx-2"></div>

                <Link href="/faq" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  سوالی دارید؟
                </Link>

                <Link href="/seller" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  در دیجی‌کالا بفروشید!
                </Link>
              </nav>

              {/* Location */}
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <FiMapPin className="w-4 h-4" />
                <span>لطفا شهر خود را انتخاب کنید</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu */}
        <AnimatePresence>
          {isMegaMenuOpen && (
            <motion.div
              ref={megaMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              onMouseLeave={() => {
                setIsMegaMenuOpen(false);
                setActiveCategory(null);
              }}
              className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 hidden lg:block"
            >
              <div className="container mx-auto px-4 lg:px-6">
                <div className="flex">
                  {/* Categories List */}
                  <div className="w-64 bg-gray-50 py-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onMouseEnter={() => setActiveCategory(category)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-white transition-colors ${
                          activeCategory?.id === category.id ? "bg-white text-[#ef4056]" : "text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`text-lg ${category.color || "text-gray-600"}`}>
                            {category.icon}
                          </span>
                          <span>{category.title}</span>
                        </div>
                        {category.badge && (
                          <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                            {category.badge}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Category Content */}
                  {activeCategory && activeCategory.subCategories && (
                    <div className="flex-1 flex">
                      <div className="flex-1 p-6">
                        <div className="grid grid-cols-4 gap-8">
                          {activeCategory.subCategories.map((subCat, index) => (
                            <div key={index}>
                              <h3 className="font-medium text-gray-900 mb-3">
                                {subCat.title}
                              </h3>
                              <ul className="space-y-2">
                                {subCat.items.map((item, idx) => (
                                  <li key={idx}>
                                    <Link
                                      href={item.href}
                                      className="text-sm text-gray-600 hover:text-[#ef4056] transition-colors flex items-center gap-2"
                                    >
                                      <span>{item.name}</span>
                                      {item.count && (
                                        <span className="text-xs text-gray-400">({item.count})</span>
                                      )}
                                      {item.hot && (
                                        <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded">
                                          داغ
                                        </span>
                                      )}
                                      {item.new && (
                                        <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                                          جدید
                                        </span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Featured Products */}
                      {activeCategory.featured && (
                        <div className="w-80 bg-gray-50 p-6 border-r">
                          <h3 className="font-medium text-gray-900 mb-4">پیشنهاد ویژه</h3>
                          <div className="space-y-4">
                            {activeCategory.featured.map((product, idx) => (
                              <Link
                                key={idx}
                                href="/product"
                                className="flex gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
                              >
                                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {product.title}
                                  </h4>
                                  <div className="mt-2 flex items-center gap-2">
                                    {product.discount > 0 && (
                                      <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                                        {product.discount}٪
                                      </span>
                                    )}
                                    <span className="text-sm font-bold">
                                      {product.price} تومان
                                    </span>
                                  </div>
                                  {product.oldPrice && (
                                    <span className="text-xs text-gray-400 line-through">
                                      {product.oldPrice}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white z-50 overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
                <div className="text-[#ef4056] font-bold text-xl">digikala</div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="p-4">
                {/* Login */}
                <Link
                  href="/login"
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4"
                >
                  <div className="flex items-center gap-3">
                    <FiUser className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">ورود به حساب کاربری</span>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                {/* Main Categories */}
                <div className="space-y-1 mb-6">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={category.href}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-lg ${category.color}`}>
                          {category.icon}
                        </span>
                        <span className="text-sm">{category.title}</span>
                      </div>
                      {category.badge && (
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                          {category.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-1">
                  <Link
                    href="/amazing"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <AiOutlineFire className="w-5 h-5 text-orange-500" />
                    <span className="text-sm">شگفت‌انگیزها</span>
                  </Link>

                  <Link
                    href="/best-selling"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FiStar className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm">پرفروش‌ترین‌ها</span>
                  </Link>

                  <Link
                    href="/gift-card"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <FiGift className="w-5 h-5 text-purple-500" />
                    <span className="text-sm">کارت هدیه</span>
                  </Link>
                </div>

                <div className="border-t mt-6 pt-4 space-y-1">
                  <Link
                    href="/faq"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <BiSupport className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">سوالی دارید؟</span>
                  </Link>

                  <Link
                    href="/seller"
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <RiStore2Line className="w-5 h-5 text-gray-600" />
                    <span className="text-sm">در دیجی‌کالا بفروشید!</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-[112px]"></div>
    </>
  );
}
