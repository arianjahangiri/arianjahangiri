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
    imgSrc: "https://dkstatics-public.digikala.com/digikala-mega-menu/09a98a13c782e12a245930b4515d243b17734a33_1740299441.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
    link: "/landing/mobile/",
  },
  {
    name: "کالای دیجیتال",
    imgSrc: "https://dkstatics-public.digikala.com/digikala-mega-menu/151ec29bae111afd3b6a0e71cec5c4c26f1c3014_1740299456.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
    link: "/main/electronic-devices/",
  },
  {
    name: "خانه و آشپزخانه",
    imgSrc: "https://dkstatics-public.digikala.com/digikala-mega-menu/8a042388b93c5116604f35092a1fb35f8f0756be_1740299467.jpg?x-oss-process=image/resize,m_lfit,h_300,w_300/quality,q_80",
    link: "/main/home-and-kitchen/",
  },
  {
    name: "آرایشی بهداشتی",
    imgSrc: "http://trusttahvie.ir/Uploads/Public/images/b388e5f692804a9cb287bcb8f5b37fef.jpg",
    link: "/main/personal-appliance/",
  },
  {
    name: "خودرو و موتورسیکلت",
    imgSrc: "http://trusttahvie.ir/Uploads/Public/images/b388e5f692804a9cb287bcb8f5b37fef.jpg",
    link: "/main/vehicle/",
  },
  // اضافه کن اگر خواستی...
];

export default function CategorySlider() {
  return (
    <div className="container-2xl-w mb-9 mt-16 mx-auto lg:px-4 2xl:px-0">
      <div className="w-full py-3 lg:pt-4 lg:pb-10 flex flex-col items-center">
        <div className="mb-6 lg:mb-9 text-center">
          <h3 className="text-3xl font-semibold">خرید بر اساس دسته‌بندی</h3>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, Pagination, Grid]}
          spaceBetween={20}
          slidesPerView={3}
          grid={{
            rows: 2,
            fill: "row", // یا 'column' برای ترتیب ستونی
          }}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{
            clickable: true,
            className: "swiper-pagination-custom",
          }}
          loop={true}
          className="w-full px-2 sm:px-0"
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {categories.map((category, index) => (
            <SwiperSlide key={index}>
              <a
                href={category.link}
                className="flex flex-col items-center text-center p-2 hover:scale-105 transition-transform"
              >
                <div className="w-[90px] h-[90px] flex items-center justify-center">
                  <img
                    src={category.imgSrc}
                    alt={category.name}
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700 truncate w-full">
                  {category.name}
                </p>
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
