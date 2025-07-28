"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  const discountedPrice =
    product.discount > 0
      ? product.price - product.price * (product.discount / 100)
      : product.price;

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full">
      <div className="relative">
        {/* آیکن‌ها */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <button
            title="افزودن به سبد خرید"
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            <i className="fa fa-cart-plus text-gray-600"></i>
          </button>
          <button
            title="افزودن به علاقه‌مندی"
            className="bg-white p-2 rounded-full shadow hover:bg-gray-100"
          >
            <i className="fa fa-heart text-red-500"></i>
          </button>
        </div>

        {/* تصویر محصول */}
        <Link href={`/component/products/${product._id}`} className="block">
   <img
  src={product.imageUrl}
  alt={product.name}
  className="w-full h-[250px] object-contain p-4"
/>
        </Link>
      </div>

      {/* اطلاعات محصول */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {product.name}
        </h3>

        <div className="flex justify-center items-center gap-2">
          <span
            className={`text-sm ${
              product.discount > 0
                ? "line-through text-gray-400"
                : "text-gray-800 font-bold"
            }`}
          >
            {product.price.toLocaleString()} تومان
          </span>

          {product.discount > 0 && (
            <span className="text-green-600 font-bold text-md">
              {discountedPrice.toLocaleString()} تومان
            </span>
          )}
        </div>

        {product.discount > 0 && (
          <div className="mt-2">
            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
              {product.discount}% تخفیف
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
