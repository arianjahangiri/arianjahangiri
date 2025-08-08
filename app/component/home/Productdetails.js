"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProductView } from '@/app/hooks/useProductView';
import { useCart } from '@/app/context/cartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { viewCount } = useProductView(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/product/${id}`);
        if (!response.ok) {
          throw new Error('خطا در دریافت اطلاعات محصول');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('خطا در دریافت اطلاعات محصول:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">در حال بارگذاری...</span>
          </div>
          <p className="mt-2">در حال بارگذاری اطلاعات محصول...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-danger" role="alert">
          محصول مورد نظر یافت نشد!
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount > 0
    ? product.price - (product.price * (product.discount / 100))
    : product.price;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* تصویر محصول */}
          <div className="flex justify-center items-center">
            <div className="max-w-md">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>

          {/* اطلاعات محصول */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500 flex items-center">
                <i className="fa fa-eye ml-1"></i>
                {viewCount} بازدید
              </span>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* قیمت و تخفیف */}
            <div className="mb-6">
              {product.discount > 0 ? (
                <div>
                  <span className="line-through text-gray-500 text-lg ml-2">
                    {product.price.toLocaleString()} تومان
                  </span>
                  <span className="text-red-600 font-bold text-xl">
                    {discountedPrice.toLocaleString()} تومان
                  </span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full mr-2">
                    {product.discount}% تخفیف
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold">
                  {product.price.toLocaleString()} تومان
                </span>
              )}
            </div>

            {/* موجودی */}
            <div className="mb-6">
              <span className="text-gray-700">
                وضعیت: {' '}
                {product.stock > 0 ? (
                  <span className="text-green-600 font-semibold">موجود در انبار</span>
                ) : (
                  <span className="text-red-600 font-semibold">ناموجود</span>
                )}
              </span>
              {product.stock > 0 && (
                <span className="block mt-2 text-sm text-gray-500">
                  تنها {product.stock} عدد در انبار باقی مانده است
                </span>
              )}
            </div>

            {/* دکمه خرید */}
            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`w-full py-3 rounded-lg font-bold text-white ${
                  product.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'افزودن به سبد خرید' : 'ناموجود'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;