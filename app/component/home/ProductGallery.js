"use client";

import { getImageGallery } from "@/app/home/lib/ProductGallery/GetImage";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductGallery = ({ id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const jsonData = await getImageGallery(id);
        if (isMounted) {
          setData(jsonData);
          if (jsonData.length > 0) {
            setSelectedImage(jsonData[0].imageUrl);
          }
        }
      } catch (error) {
        console.error("خطا در fetchData:", error.message);
        alert("خطا در دریافت داده‌ها");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <section className="w-full md:w-1/3 p-4">
      <section className="bg-white shadow rounded-2xl p-4">
        <section className="product-gallery">
          <section className="product-gallery-selected-image mb-4">
            {loading ? (
              <Skeleton key="skeleton" height={400} borderRadius={12} />
            ) : (
              <Image
                key={selectedImage} // جلوگیری از رندر اشتباه
                src={selectedImage}
                alt="Selected Product"
                width={500}
                height={500}
                className="w-full rounded-xl object-cover"
              />
            )}
          </section>
          <section className="product-gallery-thumbs flex gap-3 flex-wrap">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={`thumb-${i}`} width={80} height={80} borderRadius={8} />
                ))
              : data.map((img) => (
                  <Image
                    key={img.imageUrl}
                    src={img.imageUrl}
                    alt={`Thumbnail ${img.name}`}
                    width={100}
                    height={100}
                    className={`w-20 h-20 rounded-lg border cursor-pointer object-cover ${
                      selectedImage === img.imageUrl
                        ? "border-blue-500"
                        : "border-gray-300"
                    }`}
                    onClick={() => setSelectedImage(img.imageUrl)}
                  />
                ))}
          </section>
        </section>
      </section>
    </section>
  );
};

export default ProductGallery;
