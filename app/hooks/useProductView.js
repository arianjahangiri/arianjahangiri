"use client";

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

export const useProductView = (productId) => {
  const [hasViewed, setHasViewed] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    
    const trackProductView = async () => {
      try {
        setLoading(true);
        
        // بررسی کوکی برای دیدن اینکه آیا کاربر قبلاً این محصول را مشاهده کرده است
        const viewedProducts = Cookies.get('viewed_products') 
          ? JSON.parse(Cookies.get('viewed_products')) 
          : [];
        
        // اگر محصول قبلاً دیده نشده، افزایش تعداد بازدید را انجام می‌دهیم
        if (!viewedProducts.includes(productId)) {
          // افزودن به لیست محصولات دیده شده
          viewedProducts.push(productId);
          
          // ذخیره‌سازی در کوکی با مدت زمان انقضای 30 روز
          Cookies.set('viewed_products', JSON.stringify(viewedProducts), { 
            expires: 30,
            sameSite: 'strict'
          });
          
          // ارسال درخواست به API برای افزایش تعداد بازدید
          const response = await fetch(`/api/products/${productId}/view`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          const data = await response.json();
          
          if (data.success) {
            setViewCount(data.views);
            setHasViewed(true);
          }
        } else {
          setHasViewed(true);
          
          // دریافت تعداد بازدید فعلی بدون افزایش آن
          const response = await fetch(`/api/products/${productId}`, {
            method: 'GET'
          });
          
          const productData = await response.json();
          setViewCount(productData.views || 0);
        }
      } catch (error) {
        console.error("خطا در ثبت بازدید محصول:", error);
      } finally {
        setLoading(false);
      }
    };

    trackProductView();
  }, [productId]);

  return { hasViewed, viewCount, loading };
};