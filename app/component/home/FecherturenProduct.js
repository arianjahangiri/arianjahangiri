// components/FeaturedProducts.jsx
"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
 
import { Link } from "lucide-react";
import { getFeaturedProducts } from "@/app/home/lib/getFeaturedProducts";
 
// Featured Products Component
const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch featured products
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getFeaturedProducts();
        
        if (!Array.isArray(data)) {
          throw new Error("داده‌های دریافتی معتبر نیستند");
        }
        
        // Transform data to match ProductCard expectations
        const transformedProducts = data.map((product) => ({
          _id: product._id,
          name: product.title || "نام محصول",
          price: product.price || 0,
          discount: product.discount || 0,
          stock: product.stock !== undefined ? product.stock : 10,
          imageUrl: product.imageUrl || "/images/placeholder.png",
          category: product.menu_dropdown?.name || product.menu_dropdown || "دسته‌بندی نشده",
        }));
        
        setProducts(transformedProducts);
      } catch (err) {
        setError(err);
        console.error("Error fetching featured products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Create loading skeleton for better UX
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(5)].map((_, index) => (
        <div 
          key={`skeleton-${index}`} 
          className="animate-pulse bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden"
        >
          <div className="h-64 bg-gray-200 rounded-b-3xl"></div>
          <div className="p-5">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full mt-4"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state UI
  const renderError = () => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <i className="fa fa-exclamation-circle text-red-500 text-2xl" aria-hidden="true"></i>
        </div>
        <div className="mr-3">
          <p className="text-sm text-red-700 font-medium">
            خطایی در بارگذاری محصولات رخ داده است
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    </div>
  );

  // Main UI
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            پربازدیدترین محصولات
          </h2>
          <p className="text-gray-600 max-w-2xl">
            محصولاتی که بیشترین بازدید را در ماه گذشته داشته‌اند
          </p>
        </div>

        {/* Tabs for Filtering */}
        <div className="mb-8 overflow-x-auto">
          <div className="inline-flex space-x-2 space-x-reverse">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              همه دسته‌ها
            </button>
            <button
              onClick={() => setActiveTab("electronics")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "electronics" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              الکترونیکی
            </button>
            <button
              onClick={() => setActiveTab("fashion")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "fashion" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              مد و پوشاک
            </button>
            <button
              onClick={() => setActiveTab("home")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "home" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              خانه و آشپزخانه
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="relative">
          {isLoading ? (
            renderSkeleton()
          ) : error ? (
            renderError()
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products
                .filter(product => activeTab === "all" || product.category === activeTab)
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              }
            </div>
          )}
        </div>

        {/* View All Button */}
        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-600 font-medium shadow-sm hover:shadow-md transition-shadow"
          >
            مشاهده همه محصولات
            <i className="fa fa-arrow-left" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
