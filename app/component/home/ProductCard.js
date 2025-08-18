// components/ProductCard.jsx
"use client";

import { useCart } from "@/app/context/cartContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useCallback } from "react";

// Format price in Iranian Rial
const formatPrice = (value) => {
  const number = Number(value || 0);
  try {
    return new Intl.NumberFormat("fa-IR").format(number);
  } catch {
    return number.toLocaleString("fa-IR");
  }
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Determine product availability
  const isAvailable = typeof product?.stock === "number" ? product.stock > 0 : true;
  
  // Calculate discount and final price
  const discountPercentage = Number(product?.discount || 0);
  const basePrice = Number(product?.price || 0);
  const finalPrice = discountPercentage > 0 
    ? Math.max(0, basePrice - (basePrice * discountPercentage) / 100) 
    : basePrice;

  // Handle add to cart functionality
  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    if (!product?._id || !isAvailable || isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(String(product._id), 1);
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, isAvailable, isAddingToCart, addToCart]);

  // Toggle favorite status
  const toggleFavorite = useCallback((e) => {
    e.preventDefault();
    setIsFavorite(prev => !prev);
    // Here you would typically make an API call to update the server
  }, []);

  return (
    <article 
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
      aria-label={`محصول ${product?.name || "نام محصول"}`}
    >
      {/* Product Image Container */}
      <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
        <Link 
          href={`/products/${product?._id}`} 
          className="block h-full w-full"
        >
          <Image
            src={imageError ? "/images/placeholder.png" : product?.imageUrl || "/images/placeholder.png"}
            alt={product?.name || "product"}
            width={600}
            height={600}
            onError={() => setImageError(true)}
            className="h-full w-full object-contain p-4 transition-transform duration-700 group-hover:scale-105"
            priority={false}
          />
        </Link>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-pulse">
            {discountPercentage}% تخفیف
          </span>
        )}

        {/* Stock Status */}
        <span
          className={`absolute left-3 top-3 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-md ${
            isAvailable 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-rose-100 text-rose-700"
          }`}
        >
          {isAvailable ? "موجود در انبار" : "ناموجود"}
        </span>

        {/* Hover Actions */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-6 items-center justify-center gap-3 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAddingToCart}
            title={isAvailable ? "افزودن به سبد خرید" : "ناموجود"}
            className={`pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition-all duration-300 hover:bg-blue-600 hover:text-white ${
              !isAvailable ? "cursor-not-allowed opacity-60 hover:bg-white hover:text-gray-700" : ""
            }`}
            aria-label={isAvailable ? "افزودن به سبد خرید" : "ناموجود"}
          >
            <i className={`fa ${isAddingToCart ? "fa-spinner fa-spin" : "fa-cart-plus"}`} aria-hidden="true" />
          </button>

          <button
            onClick={toggleFavorite}
            title={isFavorite ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
            className={`pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all duration-300 ${
              isFavorite ? "text-rose-600 hover:bg-rose-50" : "text-gray-700 hover:bg-rose-50 hover:text-rose-600"
            }`}
            aria-label={isFavorite ? "حذف از علاقه‌مندی" : "افزودن به علاقه‌مندی"}
          >
            <i className={`fa ${isFavorite ? "fa-heart" : "fa-heart-o"}`} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <Link href={`/products/${product?._id}`} className="block">
            <h3 className="line-clamp-2 text-base font-bold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
              {product?.name || "نام محصول"}
            </h3>
          </Link>
          
          {product?.category && (
            <p className="mt-1 text-sm text-gray-500">
              {product.category}
            </p>
          )}
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          {discountPercentage > 0 && (
            <div className="mb-1 flex items-center">
              <span className="text-sm text-gray-400 line-through ltr:ml-1">
                {formatPrice(basePrice)}
              </span>
              <span className="text-xs text-gray-400">تومان</span>
            </div>
          )}
          
          <div className="flex items-center">
            <span className={`text-lg font-bold ${discountPercentage > 0 ? "text-emerald-600" : "text-gray-800"}`}>
              {formatPrice(finalPrice)}
            </span>
            <span className="mr-1 text-sm text-gray-600">تومان</span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!isAvailable || isAddingToCart}
            className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !isAvailable ? "cursor-not-allowed opacity-60" : ""
            }`}
            aria-label={isAvailable ? "افزودن به سبد خرید" : "ناموجود"}
          >
            <i className={`fa ${isAddingToCart ? "fa-spinner fa-spin" : "fa-cart-plus"}`} aria-hidden="true" />
            {isAvailable ? (isAddingToCart ? "در حال افزودن..." : "افزودن به سبد") : "ناموجود"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
