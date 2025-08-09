"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  { src: "/images/footer/1.png", text: "تحویل اکسپرس", delay: 0.1 },
  { src: "/images/footer/2.png", text: "پرداخت در محل", delay: 0.2 },
  { src: "/images/footer/3.png", text: "پشتیبانی ۲۴ ساعته", delay: 0.3 },
  { src: "/images/footer/4.png", text: "۷ روز ضمانت بازگشت", delay: 0.4 },
  { src: "/images/footer/1.png", text: "ضمانت اصل بودن کالا", delay: 0.5 },
];

const links = [
  ["صفحه اصلی", "محصولات", "درباره ما", "تماس با ما"],
  ["سوالات متداول", "شرایط بازگشت", "حریم خصوصی", "قوانین سایت"],
  ["وبلاگ", "همکاری با ما", "گارانتی", "راهنمای خرید"]
];

const socialIcons = [
  { name: "instagram", color: "text-pink-500", hover: "hover:text-pink-600" },
  { name: "telegram", color: "text-blue-400", hover: "hover:text-blue-500" },
  { name: "whatsapp", color: "text-green-500", hover: "hover:text-green-600" },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-50 to-white border-t pt-12 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Features */}
        {/* Features */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-16 text-center">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center space-y-3 group"
            >
              <div className="p-3 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Image 
                  src={item.src} 
                  alt={item.text} 
                  width={40} 
                  height={40} 
                  className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <p className="text-sm  text-gray-700 transition-colors duration-300 group-hover:text-gray-900">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {links.map((column, colIdx) => (
            <motion.div 
              key={colIdx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: colIdx * 0.1 + 0.5, duration: 0.4 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              <h4 className="text-gray-800 mb-3 text-base font-bold border-b pb-2 border-gray-200">
                {colIdx === 0 ? "دسترسی سریع" : colIdx === 1 ? "خدمات مشتریان" : "اطلاعات بیشتر"}
              </h4>
              {column.map((link, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className="block px-2 py-1.5 text-gray-600 transition-all duration-200 ease-in-out hover:text-gray-900 hover:pr-3 hover:font-medium"
                >
                  {link}
                </Link>
              ))}
            </motion.div>
          ))}

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            viewport={{ once: true }}
            className="space-y-5"
          >
            <h4 className="text-gray-800 mb-3 text-base font-bold border-b pb-2 border-gray-200">
              شبکه‌های اجتماعی
            </h4>
            <div className="flex items-center gap-8 text-2xl">
              {socialIcons.map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`${icon.color} ${icon.hover} transition-all duration-300 hover:scale-125`}
                  aria-label={icon.name}
                >
                  <i className={`fab fa-${icon.name}`}></i>
                </a>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">عضویت در خبرنامه</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="ایمیل شما" 
                  className="px-3 py-2 text-sm border border-gray-300 rounded-r-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                />
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-l-lg transition-colors duration-300 text-sm">
                  ارسال
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Intro Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 bg-white p-6 rounded-xl shadow-sm"
        >
          <h3 className="font-extrabold text-xl mb-4 text-gray-900 flex items-center">
            <span className="ml-2">فروشگاه دیزاینو کالا</span>
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
              DN
            </span>
          </h3>
          <p className="leading-relaxed text-gray-700 text-[15px]">
            دیزاینو کالا با هدف ارائه‌ی بهترین تجربه‌ی خرید آنلاین، همواره تلاش می‌کند تا محصولاتی با کیفیت، خدمات سریع و پشتیبانی بی‌نظیر به مشتریان خود ارائه دهد. خریدی مطمئن، سریع و رضایت‌بخش را با ما تجربه کنید.
          </p>
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 pt-6 pb-8 text-center"
        >
          <div className="text-gray-500 text-xs tracking-tight mb-2">
            © {new Date().getFullYear()} تمامی حقوق این وبسایت متعلق به فروشگاه دیزاینو کالا می‌باشد.
          </div>
          <div className="flex justify-center space-x-4 space-x-reverse text-xs text-gray-400">
            <Link href="#" className="hover:text-gray-600 transition-colors">قوانین و مقررات</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">حریم خصوصی</Link>
            <Link href="#" className="hover:text-gray-600 transition-colors">سوالات متداول</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;