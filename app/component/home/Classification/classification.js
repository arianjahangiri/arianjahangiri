"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CategorySlider() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const swiperRef = useRef(null);

  // Fetch category data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/CategorySlider");
        if (!res.ok) {
          throw new Error("خطا در دریافت داده‌ها");
        }
        const dataJson = await res.json();
        setData(dataJson);
      } catch (err) {
        setError(err.message || "خطای ناشناخته");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 rounded-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Premium Title Section */}
        <div className="text-center mb-16 space-y-8">
          {/* Main Icon */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full shadow-2xl flex items-center justify-center transform hover:scale-110 transition-all duration-700">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {/* Rotating ring */}
              <div className="absolute inset-0 border-4 border-white/30 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
            </div>
          </div>
          
          {/* Title and Description */}
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black bg-gradient-to-r from-gray-800 via-blue-600 to-purple-700 bg-clip-text text-transparent leading-tight">
              مجموعه فرش‌های منحصربه‌فرد
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-xl sm:text-2xl text-gray-700 leading-relaxed font-semibold">
                از سنتی تا مدرن، از دستباف تا ماشینی
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text font-bold">
                  بهترین کیفیت، مناسب‌ترین قیمت، خدمات درجه یک
                </span>
              </p>
            </div>
          </div>
          
          {/* Elegant Divider */}
          <div className="flex items-center justify-center space-x-6 mt-12 space-x-reverse">
            <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-blue-600 rounded-full"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse shadow-lg"></div>
            <div className="w-40 h-1 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-full shadow-lg"></div>
            <div className="w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full animate-pulse delay-500 shadow-lg"></div>
            <div className="w-20 h-0.5 bg-gradient-to-r from-pink-600 via-purple-400 to-transparent rounded-full"></div>
          </div>
        </div>

        {/* Error Message */}
        {error && !loading && (
          <div className="max-w-2xl mx-auto mb-16 p-8 bg-red-50/90 backdrop-blur-sm border-2 border-red-200 rounded-3xl shadow-2xl">
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800 mb-2">خطا در بارگذاری دسته‌بندی‌ها</h3>
                <p className="text-red-700 text-lg">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-12">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-12">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <Skeleton
                      circle
                      width={140}
                      height={140}
                      baseColor="#f1f5f9"
                      highlightColor="#ffffff"
                      className="shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200/40 to-purple-200/40 animate-pulse"></div>
                  </div>
                  <Skeleton
                    width={120}
                    height={24}
                    baseColor="#f1f5f9"
                    highlightColor="#ffffff"
                    className="rounded-2xl"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Swiper */}
        {!error && !loading && data.length > 0 && (
          <div className="relative">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Autoplay, Pagination]}
              spaceBetween={40}
              slidesPerView={2}
              navigation={{
                nextEl: '.carpet-next',
                prevEl: '.carpet-prev',
              }}
              autoplay={{ 
                delay: 5000, 
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{ 
                clickable: true,
                dynamicBullets: true,
                bulletClass: 'carpet-bullet',
                bulletActiveClass: 'carpet-bullet-active'
              }}
              loop={data.length > 3}
              grabCursor={true}
              centeredSlides={false}
              breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 20 },
                480: { slidesPerView: 2, spaceBetween: 24 },
                640: { slidesPerView: 3, spaceBetween: 28 },
                768: { slidesPerView: 3, spaceBetween: 32 },
                1024: { slidesPerView: 4, spaceBetween: 36 },
                1280: { slidesPerView: 5, spaceBetween: 40 },
                1536: { slidesPerView: 6, spaceBetween: 44 },
              }}
              className="carpet-category-swiper !pb-20"
            >
              {data.map((category, index) => (
                <SwiperSlide key={category._id}>
                  <div className="group cursor-pointer transform transition-all duration-700 hover:scale-105">
                    <a
                      href={category.UrlLink}
                      className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white/60 backdrop-blur-md hover:bg-white/90 transition-all duration-700 hover:shadow-2xl hover:-translate-y-4 border-2 border-white/40 hover:border-blue-200/50"
                    >
                      {/* Category Image Container */}
                      <div className="relative mb-8">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40">
                          {/* Outer effects */}
                          <div className="absolute -inset-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-1000"></div>
                          <div className="absolute -inset-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-all duration-700"></div>
                          
                          {/* Main circle */}
                          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white group-hover:border-blue-300 transition-all duration-700 group-hover:shadow-3xl">
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-14 h-14 sm:w-16 sm:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 object-contain transition-all duration-700 group-hover:scale-125 group-hover:rotate-12"
                              loading="lazy"
                            />
                            
                            {/* Inner glow effect */}
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-blue-100/0 to-purple-100/0 group-hover:via-blue-100/40 group-hover:to-purple-100/40 transition-all duration-1000"></div>
                          </div>
                          
                          {/* Floating particles */}
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-bounce delay-100"></div>
                          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-900 animate-bounce delay-300"></div>
                          <div className="absolute top-1/2 -right-3 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-800 animate-bounce delay-500"></div>
                        </div>
                      </div>

                      {/* Category Name and Effects */}
                      <div className="space-y-4 w-full">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-500 line-clamp-2 leading-tight">
                          {category.name}
                        </h3>
                        
                        {/* Animated underlines */}
                        <div className="relative space-y-1">
                          <div className="w-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 group-hover:w-full transition-all duration-700 mx-auto rounded-full"></div>
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-3/4 transition-all duration-900 delay-200 rounded-full"></div>
                        </div>
                        
                        {/* Call to action */}
                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-700 delay-300">
                          <p className="text-sm text-gray-600 font-medium">مشاهده محصولات</p>
                          <div className="mt-2 flex items-center justify-center space-x-2 space-x-reverse">
                            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-400"></div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Buttons */}
            <div className="carpet-prev absolute top-1/2 -right-12 z-20 w-20 h-20 bg-gradient-to-r from-white via-blue-50 to-white backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:from-blue-50 hover:via-purple-50 hover:to-blue-50 hover:shadow-3xl transition-all duration-700 group border-3 border-white/60 hover:border-blue-300">
              <svg className="w-7 h-7 text-gray-700 group-hover:text-blue-600 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            
            <div className="carpet-next absolute top-1/2 -left-12 z-20 w-20 h-20 bg-gradient-to-r from-white via-purple-50 to-white backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:from-purple-50 hover:via-blue-50 hover:to-purple-50 hover:shadow-3xl transition-all duration-700 group border-3 border-white/60 hover:border-purple-300">
              <svg className="w-7 h-7 text-gray-700 group-hover:text-purple-600 transition-colors duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {!error && !loading && data.length === 0 && (
          <div className="text-center py-24">
            <div className="relative inline-flex items-center justify-center w-40 h-40 bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 rounded-full mx-auto mb-12 shadow-2xl">
              <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <div className="absolute -inset-6 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-2xl"></div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-6">مجموعه‌های جدید در راه است</h3>
            <p className="text-gray-600 text-xl leading-relaxed max-w-lg mx-auto">به زودی دسته‌بندی‌های بیشتر و متنوع‌تری از فرش‌های منحصربه‌فرد اضافه خواهند شد</p>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .carpet-category-swiper .swiper-pagination {
          bottom: 0 !important;
          text-align: center;
        }
        
        .carpet-bullet {
          width: 14px !important;
          height: 14px !important;
          margin: 0 8px !important;
          border-radius: 50% !important;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
          opacity: 0.4 !important;
          transition: all 0.5s ease !important;
          cursor: pointer !important;
          border: 2px solid white !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }
        
        .carpet-bullet-active {
          width: 40px !important;
          border-radius: 20px !important;
          background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899) !important;
          opacity: 1 !important;
          transform: scale(1.3) !important;
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5) !important;
        }
        
        .carpet-category-swiper .swiper-slide {
          height: auto !important;
          display: flex !important;
          align-items: stretch !important;
        }
        
        .carpet-category-swiper .swiper-slide > div {
          width: 100% !important;
          height: 100% !important;
        }

        @media (max-width: 1024px) {
          .carpet-prev,
          .carpet-next {
            display: none;
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-12px) rotate(120deg); 
          }
          66% { 
            transform: translateY(-6px) rotate(240deg); 
          }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        /* RTL Support */
        [dir="rtl"] .carpet-prev {
          right: auto !important;
          left: -48px !important;
        }

        [dir="rtl"] .carpet-next {
          left: auto !important;
          right: -48px !important;
        }

        /* Enhanced responsiveness */
        @media (max-width: 640px) {
          .carpet-category-swiper {
            padding-bottom: 4rem !important;
          }
        }

        @media (max-width: 480px) {
          .carpet-category-swiper .swiper-slide > div > a {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </section>
  );
}
