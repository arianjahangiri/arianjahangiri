"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductGallery from "./ProductGallery";

const Productdetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const { id } = useParams();
  const productId = Array.isArray(id) ? id[0] : id;

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrMsg("");
      const res = await fetch(
        `https://arianjahangiri.vercel.app/api/product/${productId}`
      );
      if (!res.ok) throw new Error("خطا در بارگذاری محصولات");

      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      setErrMsg(error.message || "خطای ناشناخته");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const images = Array.isArray(data?.images)
    ? data.images.filter(Boolean)
    : data?.imageUrl
    ? [data.imageUrl]
    : [];

  const activeImage =
    images.length > 0 ? images[Math.min(activeIdx, images.length - 1)] : "";

  return (
    <section className="bg-white p-4 rounded-xl shadow-md mb-6">
      {/* لودینگ اسکلت */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="w-full h-72 bg-gray-200 rounded-xl" />
          <div className="w-1/2 h-5 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="w-full h-4 bg-gray-200 rounded" />
            <div className="w-5/6 h-4 bg-gray-200 rounded" />
            <div className="w-2/3 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      )}

      {!loading && errMsg && (
        <div className="p-3 rounded-lg bg-red-100 text-red-700">{errMsg}</div>
      )}

      {!loading && !errMsg && (
        <>
          {/* هدر با تصویر */}
          <section className="mb-4">
            <div className="relative rounded-xl overflow-hidden h-72 bg-gray-50 flex items-center justify-center">
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={data?.name || "Product"}
                  fill
                  sizes="100vw"
                  className="object-contain bg-gray-50"
                />
              ) : (
                <span className="text-gray-400">بدون تصویر</span>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                <h2 className="text-lg font-semibold">{data?.name}</h2>
                <p className="text-sm text-gray-300">
                  گارانتی اصالت و سلامت فیزیکی کالا
                </p>
              </div>
            </div>

            {/* بندانگشتی‌ها */}
            <ProductGallery poroductId={data?._id} />
          </section>

          {/* اطلاعات محصول */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <i className="fa fa-store-alt" />
                کالا موجود در انبار
              </div>

              <p className="text-gray-600 text-sm leading-relaxed">
                {data?.description ||
                  "توضیحاتی برای این محصول ثبت نشده است."}
              </p>
            </div>

            <div className="border rounded-xl p-4 flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 border border-red-500 text-red-500 rounded-lg py-2 hover:bg-red-50 transition">
                <i className="fa fa-heart" />
                افزودن به علاقه‌مندی
              </button>

              {typeof data?.price !== "undefined" && (
                <div>
                  <div className="text-gray-500 text-sm mb-1">قیمت</div>
                  <div className="text-xl font-bold">
                    {Number(data?.price || 0).toLocaleString("fa-IR")} تومان
                  </div>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </section>
  );
};

export default Productdetails;
