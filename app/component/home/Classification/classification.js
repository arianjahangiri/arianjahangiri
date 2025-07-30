"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";

const categories = [
  {
    name: "موبایل",
    imgSrc:
      "https://dkstatics-public.digikala.com/digikala-mega-menu/09a98a13c782e12a245930b4515d243b17734a33_1740299441.jpg",
    link: "/landing/mobile/",
  },
  {
    name: "کالای دیجیتال",
    imgSrc:
      "https://dkstatics-public.digikala.com/digikala-mega-menu/151ec29bae111afd3b6a0e71cec5c4c26f1c3014_1740299456.jpg",
    link: "/main/electronic-devices/",
  },
  {
    name: "خانه و آشپزخانه",
    imgSrc:
      "https://dkstatics-public.digikala.com/digikala-mega-menu/8a042388b93c5116604f35092a1fb35f8f0756be_1740299467.jpg",
    link: "/main/home-and-kitchen/",
  },
  {
    name: "آرایشی بهداشتی",
    imgSrc:
      "https://dkstatics-public.digikala.com/digikala-mega-menu/8a042388b93c5116604f35092a1fb35f8f0756be_1740299467.jpg",
    link: "/main/personal-appliance/",
  },
  {
    name: "خودرو و موتورسیکلت",
    imgSrc:
      "https://dkstatics-public.digikala.com/digikala-mega-menu/8a042388b93c5116604f35092a1fb35f8f0756be_1740299467.jpg",
    link: "/main/vehicle/",
  },
];

export default function CategorySlider() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12">
      <div className="text-center mb-10">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
          خرید بر اساس دسته‌بندی
        </h3>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination, Grid]}
        spaceBetween={12}
        slidesPerView={2}
        grid={{
          rows: 2,
          fill: "row",
        }}
        navigation
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        breakpoints={{
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
        className="w-full"
      >
        {categories.map((category, index) => (
          <SwiperSlide key={index}>
            <a
              href={category.link}
              className="flex flex-col items-center text-center p-2 hover:scale-105 transition-transform"
            >
              <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] flex items-center justify-center">
                <img
                  src={category.imgSrc}
                  alt={category.name}
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <p className="mt-2 text-xs sm:text-sm font-medium text-gray-700 truncate w-full">
                {category.name}
              </p>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
