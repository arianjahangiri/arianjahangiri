"use client";

import { useCart } from "@/app/context/cartContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback } from "react";

const formatPrice = (value) => {
  const number = Number(value || 0);
  try {
    return new Intl.NumberFormat("fa-IR").format(number);
  } catch {
    return number.toLocaleString("fa-IR");
  }
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAvailable = typeof product?.stock === "number" ? product.stock > 0 : true;

  const discountPercentage = Number(product?.discount || 0);
  const basePrice = Number(product?.price || 0);
  const finalPrice =
    discountPercentage > 0
      ? Math.max(0, basePrice - (basePrice * discountPercentage) / 100)
      : basePrice;

  const handleAddToCart = useCallback(
    async (e) => {
      e.preventDefault();
      if (!product?._id || !isAvailable || isAddingToCart) return;

      setIsAddingToCart(true);
      try {
        await addToCart(String(product._id), 1);
      } finally {
        setIsAddingToCart(false);
      }
    },
    [product, isAvailable, isAddingToCart, addToCart]
  );

  const toggleFavorite = useCallback((e) => {
    e.preventDefault();
    setIsFavorite((prev) => !prev);
  }, []);

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
      aria-label={`محصول ${product?.name || "نام محصول"}`}
    >
      {/* تصویر محصول */}
      <div className="relative aspect-square sm:h-64 w-full bg-gray-100 overflow-hidden">
        <Link href={`/product/${product?._id}`} className="block h-full w-full">
          <Image
            src={
              imageError
                ? "/images/placeholder.png"
                : product?.imageUrl || "/images/placeholder.png"
            }
            alt={product?.name || "product"}
            width={600}
            height={600}
            onError={() => setImageError(true)}
            className="h-full w-full object-contain p-3 sm:p-4 transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {discountPercentage > 0 && (
          <span className="absolute right-2 sm:right-3 top-2 sm:top-3 rounded-full bg-rose-500 px-3 py-1 text-[10px] sm:text-xs font-bold text-white shadow-lg animate-pulse">
            {discountPercentage}% تخفیف
          </span>
        )}

        <span
          className={`absolute left-2 sm:left-3 top-2 sm:top-3 rounded-lg px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold shadow-md ${
            isAvailable
              ? "bg-emerald-100 text-emerald-700"
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isAvailable ? "موجود" : "ناموجود"}
        </span>

        {/* آیکون‌ها روی هاور (فقط دسکتاپ) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-6 items-center justify-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAddingToCart}
            title={isAvailable ? "افزودن به سبد خرید" : "ناموجود"}
            className={`pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all duration-300 hover:bg-blue-600 hover:text-white ${
              !isAvailable
                ? "cursor-not-allowed opacity-60 hover:bg-white hover:text-gray-700"
                : ""
            }`}
          >
            <i
              className={`fa ${
                isAddingToCart ? "fa-spinner fa-spin" : "fa-cart-plus"
              }`}
            />
          </button>

          <button
            onClick={toggleFavorite}
            className={`pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 ${
              isFavorite
                ? "text-rose-600 hover:bg-rose-50"
                : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
            }`}
          >
            <i className={`fa ${isFavorite ? "fa-heart" : "fa-heart-o"}`} />
          </button>
        </div>
      </div>

      {/* اطلاعات محصول */}
      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <div className="mb-2">
          <Link href={`/product/${product?._id}`} className="block">
            <h3 className="line-clamp-2 text-sm sm:text-base font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
              {product?.name || "نام محصول"}
            </h3>
          </Link>
          {product?.category && (
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              {product.category}
            </p>
          )}
        </div>

        {/* قیمت */}
        <div className="mt-auto">
          {discountPercentage > 0 && (
            <div className="mb-1 flex items-center">
              <span className="text-xs sm:text-sm text-gray-400 line-through ltr:ml-1">
                {formatPrice(basePrice)}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400">تومان</span>
            </div>
          )}

          <div className="flex items-center">
            <span
              className={`text-sm sm:text-lg font-bold ${
                discountPercentage > 0
                  ? "text-emerald-600"
                  : "text-gray-800"
              }`}
            >
              {formatPrice(finalPrice)}
            </span>
            <span className="mr-1 text-xs sm:text-sm text-gray-600">تومان</span>
          </div>

          {/* دکمه افزودن به سبد خرید (همیشه قابل دیدن در موبایل) */}
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAddingToCart}
            className={`mt-3 sm:mt-4 flex w-full items-center justify-center gap-2 rounded-lg sm:rounded-xl bg-blue-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !isAvailable ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            <i
              className={`fa ${
                isAddingToCart ? "fa-spinner fa-spin" : "fa-cart-plus"
              }`}
            />
            {isAvailable
              ? isAddingToCart
                ? "در حال افزودن..."
                : "افزودن به سبد"
              : "ناموجود"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
