"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CategorySlider() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/CategorySlider");
        if (!res.ok) {
          setError("خطا در دریافت داده‌ها");
        } else {
          const dataJson = await res.json();
          setData(dataJson);
        }
      } catch (err) {
        setError(err.message || "خطای ناشناخته");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12">
      <div className="text-center mb-10">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
          خرید بر اساس دسته‌بندی
        </h3>
      </div>

      {error && !loading && <p className="text-red-600 text-center">{error}</p>}

      {loading && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 animate-fade-in">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center">
              <Skeleton
                circle
                width={86}
                height={86}
                baseColor="#e0e0e0"
                highlightColor="#f5f5f5"
              />
              <Skeleton
                width={70}
                height={12}
                className="mt-2"
                baseColor="#e0e0e0"
                highlightColor="#f5f5f5"
              />
            </div>
          ))}
        </div>
      )}

      {!error && !loading && (
        <Swiper
          modules={[Navigation, Autoplay, Pagination, Grid]}
          spaceBetween={40} // فاصله بین اسلایدها
          slidesPerView={4}
          grid={{ rows: 2, fill: "row" }}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          breakpoints={{
            320: { slidesPerView: 3 },
            480: { slidesPerView: 4 },
            640: { slidesPerView: 5 },
            768: { slidesPerView: 6 },
            1024: { slidesPerView: 7 },
            1280: { slidesPerView: 8 },
          }}
          className="w-full !space-x-reverse space-x-40  "
        >
          {data.map((category) => (
            <SwiperSlide spaceBetween={40}  className=" !gap-40" key={category._id}>
              <a
                href={category.UrlLink}
                className="flex flex-col items-center justify-center text-center p-2 hover:scale-105 transition-transform"
              >
                <div className="w-[86px] h-[86px] rounded-full bg-gray-100 shadow-sm flex items-center justify-center">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <p className="mt-2 text-[13px] sm:text-sm font-medium text-gray-800 truncate w-full">
                  {category.name}
                </p>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
