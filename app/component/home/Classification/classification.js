"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination, Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/grid";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";

 

export default function CategorySlider() {
const [data,setdata]=useState([]);
const [loading,setloading]=useState(true);
const [erore,seterore]=useState("");
 
useEffect (()=>{
 const fetchdata= async()=>{
 
   try {
const res = await fetch("/api/CategorySlider")
const dataJson = await res.json();
setdata(dataJson);
if(!res){
  seterore("ارور خطا در دریافت  اطلاعات ")
}
   }catch(erore){
   seterore(erore)
   }finally{
setloading(false)
   }
 }
fetchdata()
},[])




  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12">
      <div className="text-center mb-10">
        {loading && <Spinner/>}
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
        {data&& data.map((category, index) => (
          <SwiperSlide key={index}>
            <a
              href={category.UrlLink}
              className="flex flex-col items-center text-center p-2 hover:scale-105 transition-transform"
            >
              <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] md:w-[90px] md:h-[90px] flex items-center justify-center">
                <img
                  src={category.imageUrl}
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
        {erore&& <p className="text-red-600 ">{erore}</p>}
      </Swiper>
    </div>
  );
}
