"use client";

import Link from "next/link";
import React, { useState } from "react";
 
import { motion } from "framer-motion";
import { 
  FaEye, 
  FaCartPlus, 
  FaSearch, 
  FaTags, 
  FaBoxOpen, 
  FaBoxes
} from "react-icons/fa";
 
import FavoriteButton from "./FavoriteButton";
import { useCart } from "@/app/context/cartContext";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  
  const discountedPrice = product.discount > 0
    ? product.price - product.price * (product.discount / 100)
    : product.price;

  const stockStatus = product.stock > 0 ? product.stock : "ناموجود";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)", 
        y: -5,
        transition: { duration: 0.3 }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden product-card-image-container">
        {/* تصویر محصول با افکت زوم در هنگام هاور */}
        <Link href={`/component/products/${product._id}`}>
          <div className="h-[250px] overflow-hidden bg-gray-50">
            <img
              src={product.imageUrl}
              alt={product.name}
              className={`w-full h-full object-contain p-4 transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
            />
          </div>
        </Link>

        {/* نشانگر تخفیف */}
        {product.discount > 0 && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              {product.discount}% تخفیف
            </div>
          </div>
        )}

        {/* نمایش موجودی */}
        <div className="absolute bottom-2 left-2">
          <div className={`
            text-xs font-semibold px-2 py-1 rounded-lg 
            flex items-center gap-1 shadow-sm
            ${stockStatus 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'}
          `}>
            {stockStatus 
              ? <><FaBoxOpen size={12} className="ml-1" /> موجود</> 
              : <><FaBoxes size={12} className="ml-1" /> ناموجود</>}
          </div>
        </div>

        {/* نشانگر بازدید */}
        <div className="absolute bottom-2 right-2">
          <div className="bg-white bg-opacity-90 flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-600 shadow-sm">
            <FaEye className="text-blue-500" />
            <span>{product.views?.toLocaleString() || 0}</span>
          </div>
        </div>

        {/* منوی کشویی در هنگام هاور */}
        <div 
          className={`
            absolute w-full py-2 px-3 flex justify-center gap-2 
            transition-all duration-300 bg-gradient-to-t from-black/70 to-transparent
            ${isHovered ? 'bottom-0 opacity-100' : 'bottom-[-50px] opacity-0'}
          `}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="افزودن به سبد خرید"
            className={`
              p-2 rounded-full shadow-lg bg-white 
              hover:bg-blue-500 hover:text-white
              transition-all duration-300
              ${!stockStatus && 'opacity-60 cursor-not-allowed'}
            `}
            onClick={handleAddToCart}
            disabled={!stockStatus}
          >
            <FaCartPlus size={16} />
          </motion.button>
          
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full shadow-lg bg-white hover:bg-red-50 transition-all duration-300"
          >
            <FavoriteButton productId={product._id} size={16} />
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="نمایش جزئیات"
            className="p-2 rounded-full shadow-lg bg-white hover:bg-yellow-500 hover:text-white transition-all duration-300"
          >
            <Link href={`/component/products/${product._id}`}>
              <FaSearch size={16} />
            </Link>
          </motion.button>
        </div>
      </div>

      {/* اطلاعات محصول */}
      <div className="p-4 flex-1 flex flex-col">
        <Link 
          href={`/component/products/${product._id}`}
          className="block text-center mb-3"
        >
          <h3 className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {product.category && (
          <div className="mb-3 text-center">
            <Link 
              href={`/category/${product.category.slug}`}
              className="text-xs inline-flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors"
            >
              <FaTags size={10} />
              <span>{product.category.title}</span>
            </Link>
          </div>
        )}

        {/* نمایش قیمت */}
        <div className="mt-auto">
          <div className="flex flex-col items-center gap-1">
            {product.discount > 0 && (
              <span className="line-through text-gray-400 text-sm">
                {product.price.toLocaleString()} تومان
              </span>
            )}
            
            <div className="flex items-center justify-center gap-1">
              <span className={`
                font-bold text-lg
                ${product.discount > 0 ? 'text-green-600' : 'text-gray-800'}
              `}>
                {discountedPrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">تومان</span>
            </div>
          </div>

          {/* دکمه خرید */}
          <button
            onClick={handleAddToCart}
            disabled={!stockStatus}
            className={`
              w-full mt-3 py-2 rounded-lg transition-all duration-300
              font-medium text-sm flex items-center justify-center gap-2
              ${stockStatus
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
            `}
          >
            <FaCartPlus />
            {stockStatus ? 'افزودن به سبد خرید' : 'ناموجود'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;