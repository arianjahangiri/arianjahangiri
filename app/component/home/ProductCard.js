"use client";

import { useCart } from "@/app/context/cartContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
 

const rial = (v) => {
  const n = Number(v || 0);
  try {
    return new Intl.NumberFormat("fa-IR").format(n);
  } catch {
    return n.toLocaleString("fa-IR");
  }
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [fav, setFav] = useState(false);
  const [adding, setAdding] = useState(false);

  const hasStock = typeof product?.stock === "number" ? product.stock > 0 : true;
  const discount = Number(product?.discount || 0);
  const price = Number(product?.price || 0);
  const discountedPrice = discount > 0 ? Math.max(0, price - (price * discount) / 100) : price;

  const handleAddToCart = async (e) => {
    e?.preventDefault?.();
    if (!product?._id || !hasStock || adding) return;
    setAdding(true);
    try {
      await addToCart(String(product._id), 1);
    } finally {
      setAdding(false);
    }
  };

  const toggleFav = (e) => {
    e?.preventDefault?.();
    setFav((s) => !s);
    // اگر خواستی این را به سرور هم بفرستی، اینجا درخواست API بزن.
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* تصویر */}
      <div className="relative h-56 w-full bg-gray-50">
        <Link href={`/component/products/${product?._id}`} className="block h-full w-full">
          <Image
            src={product?.imageUrl || "/placeholder.png"}
            alt={product?.name || "product"}
            width={600}
            height={600}
            priority={false}
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* بج تخفیف */}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-md">
            {discount}% تخفیف
          </span>
        )}

        {/* وضعیت موجودی */}
        <span
          className={`absolute left-3 top-3 rounded-lg px-2 py-1 text-xs font-semibold shadow-sm ${
            hasStock ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
          }`}
        >
          {hasStock ? "موجود" : "ناموجود"}
        </span>

        {/* اکشن‌های هاور */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-4 items-center justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={!hasStock || adding}
            title={hasStock ? "افزودن به سبد خرید" : "ناموجود"}
            className={`pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-colors hover:bg-blue-600 hover:text-white ${
              !hasStock ? "cursor-not-allowed opacity-60 hover:bg-white hover:text-gray-700" : ""
            }`}
          >
            <i className={`fa ${adding ? "fa-spinner fa-spin" : "fa-cart-plus"}`} aria-hidden="true" />
          </button>

          <button
            onClick={toggleFav}
            title={fav ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
            className={`pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-colors ${
              fav ? "text-rose-600 hover:bg-rose-50" : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
            }`}
          >
            <i className={`fa ${fav ? "fa-heart" : "fa-heart-o"}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* بدنه کارت */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/component/products/${product?._id}`} className="mb-2 block">
          <h3 className="line-clamp-2 text-base font-bold text-gray-800 transition-colors hover:text-blue-600">
            {product?.name || "نام محصول"}
          </h3>
        </Link>

        {/* قیمت */}
        <div className="mt-auto">
          {discount > 0 && (
            <div className="mb-1 text-sm text-gray-400 line-through">{rial(price)} تومان</div>
          )}
          <div className="flex items-center justify-start gap-1">
            <span className={`text-lg font-bold ${discount > 0 ? "text-emerald-600" : "text-gray-800"}`}>
              {rial(discountedPrice)}
            </span>
            <span className="text-sm text-gray-600">تومان</span>
          </div>

          {/* دکمه اصلی افزودن به سبد */}
          <button
            onClick={handleAddToCart}
            disabled={!hasStock || adding}
            className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
              hasStock
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-200 text-gray-500"
            }`}
          >
            <i className={`fa ${adding ? "fa-spinner fa-spin" : "fa-cart-plus"}`} aria-hidden="true" />
            {hasStock ? (adding ? "در حال افزودن..." : "افزودن به سبد خرید") : "ناموجود"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;