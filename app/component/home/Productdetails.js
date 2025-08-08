"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Productdetails = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://arianjahangiri.vercel.app/api/product");
      if (!res.ok) throw new Error("خطا در بارگذاری محصولات");
      const jsonData = await res.json();
      setData(jsonData[0]); // اولین محصول برای نمایش جزئیات
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <section className="w-full max-w-3xl mx-auto bg-white p-4 rounded-2xl shadow-md">
      <section className="mb-4">
        {loading ? (
          <Skeleton height={280} borderRadius={12} />
        ) : (
          <Image
            src={data?.imageUrl}
            alt={data?.name}
            width={500}
            height={300}
            className="w-full h-72 rounded-lg object-cover"
          />
        )}
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">
          {loading ? <Skeleton width={200} /> : data?.name}
        </h2>
        <p>{loading ? <Skeleton width={150} /> : `قیمت: ${data?.price} تومان`}</p>
        <p>
          {loading ? <Skeleton width={180} /> : `دسته‌بندی: ${data?.category.title}`}
        </p>
        <p>{loading ? <Skeleton count={3} /> : data?.description}</p>
        <button className="bg-blue-500 text-white py-2 px-4 rounded-lg w-32">
          {loading ? <Skeleton width={80} /> : "افزودن به سبد"}
        </button>
      </section>
    </section>
  );
};

export default Productdetails;
