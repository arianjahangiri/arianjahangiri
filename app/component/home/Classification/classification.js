"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import { useEffect, useState } from "react";

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
      <div className="text-center mb-10 gap-[40px]">
        {loading && <p className="text-gray-500 text-sm">در حال بارگذاری...</p>}
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
          خرید بر اساس دسته‌بندی
        </h3>
      </div>

      {error && !loading && <p className="text-red-600 text-center">{error}</p>}

      {!error && !loading && (
        <Swiper
          modules={[Navigation, Autoplay, Pagination, Grid]}
          spaceBetween={8}
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
          className="w-full gap-[40px] "
        >
          {data.map((category) => (
            <SwiperSlide  className="gap-[40px]" key={category._id}>
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
    </div>
  );
}
