"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/cartContext';
import { FaEye, FaCartPlus, FaStar, FaRegStar, FaCheck, FaTimes, FaBox } from 'react-icons/fa';
import FavoriteButton from '@/app/components/FavoriteButton';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) {
      router.push('/404');
      return;
    }

    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/404');
            return;
          }
          throw new Error('خطا در دریافت اطلاعات محصول');
        }
        
        const data = await response.json();
        setProduct(data);
        setViewCount(data.views || 0);
        
        // بررسی کوکی برای ثبت بازدید
        handleProductView(data._id);
      } catch (error) {
        console.error('خطا در دریافت اطلاعات محصول:', error);
        toast.error('مشکلی در بارگذاری اطلاعات محصول رخ داد');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, router]);

  // افزایش تعداد بازدید
  const handleProductView = async (productId) => {
    try {
      // بررسی آیا قبلاً این محصول را دیده است
      const viewedProducts = Cookies.get('viewed_products') 
        ? JSON.parse(Cookies.get('viewed_products')) 
        : [];
      
      // اگر محصول قبلاً دیده نشده، افزایش بازدید
      if (!viewedProducts.includes(productId)) {
        // افزودن به لیست محصولات دیده شده
        viewedProducts.push(productId);
        
        // ذخیره در کوکی
        Cookies.set('viewed_products', JSON.stringify(viewedProducts), { 
          expires: 30,
          sameSite: 'strict'
        });
        
        // ثبت بازدید در سرور
        const response = await fetch(`/api/products/${productId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setViewCount(data.views);
          }
        }
      }
    } catch (error) {
      console.error('خطا در ثبت بازدید محصول:', error);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success('محصول به سبد خرید اضافه شد');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">محصول مورد نظر یافت نشد!</h2>
          <p className="mb-4">محصول مورد نظر شما در سیستم موجود نمی‌باشد یا حذف شده است.</p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount > 0
    ? product.price - (product.price * (product.discount / 100))
    : product.price;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* تصویر محصول */}
          <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-w-full h-auto max-h-[400px] object-contain"
              />
              
              {/* نشانگر تخفیف */}
              {product.discount > 0 && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {product.discount}% تخفیف
                </div>
              )}
            </div>
          </div>

          {/* اطلاعات محصول */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>
            
            {/* دسته بندی */}
            {product.category && (
              <div className="mb-4">
                <span className="text-sm text-gray-500">
                  دسته‌بندی: {product.category.title}
                </span>
              </div>
            )}
            
            {/* تعداد بازدید */}
            <div className="flex items-center mb-4 text-gray-500 text-sm">
              <FaEye className="ml-1" />
              <span>{viewCount} بازدید</span>
            </div>
            
            {/* توضیحات محصول */}
            <div className="mb-6 text-gray-700">
              <p className="leading-relaxed">{product.description}</p>
            </div>
            
            {/* قیمت و تخفیف */}
            <div className="mb-6">
              {product.discount > 0 ? (
                <div className="flex flex-col">
                  <div className="flex items-center mb-2">
                    <span className="line-through text-gray-400 text-lg ml-2">
                      {product.price.toLocaleString()} تومان
                    </span>
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                      {product.discount}% تخفیف
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {discountedPrice.toLocaleString()} تومان
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold">
                  {product.price.toLocaleString()} تومان
                </span>
              )}
            </div>
            
            {/* وضعیت موجودی */}
            <div className="mb-6 flex items-center">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <FaCheck className="ml-1" />
                  <span>موجود در انبار ({product.stock} عدد)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <FaTimes className="ml-1" />
                  <span>ناموجود</span>
                </div>
              )}
            </div>
            
            {/* دکمه‌های عملیات */}
            <div className="flex gap-4 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`
                  flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-bold flex-grow
                  ${product.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'}
                  transition
                `}
              >
                <FaCartPlus />
                <span>افزودن به سبد خرید</span>
              </button>
              
              <div className="flex items-center justify-center bg-white border border-red-200 p-3 rounded-lg hover:bg-red-50 transition">
                <FavoriteButton productId={product._id} size={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;