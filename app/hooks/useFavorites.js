"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

export const useFavorites = () => {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // دریافت لیست علاقه‌مندی‌ها
  const fetchFavorites = useCallback(async () => {
    if (!session?.user) {
      setFavorites([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/favorites");
      const data = await response.json();

      if (data.success) {
        setFavorites(data.favorites || []);
      } else {
        console.error("خطا در دریافت علاقه‌مندی‌ها:", data.message);
      }
    } catch (error) {
      console.error("خطا در دریافت علاقه‌مندی‌ها:", error);
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  // بررسی وضعیت علاقه‌مندی یک محصول
  const checkIsFavorite = useCallback(async (productId) => {
    if (!session?.user) return false;
    
    try {
      const response = await fetch("/api/favorites/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      
      const data = await response.json();
      return data.isFavorite;
    } catch (error) {
      console.error("خطا در بررسی وضعیت علاقه‌مندی:", error);
      return false;
    }
  }, [session]);

  // تغییر وضعیت علاقه‌مندی
  const toggleFavorite = useCallback(async (productId) => {
    if (!session?.user) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return false;
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      
      if (data.success) {
        // به‌روزرسانی لیست علاقه‌مندی‌ها
        fetchFavorites();
        
        if (data.isFavorite) {
          toast.success("محصول به علاقه‌مندی‌ها اضافه شد");
        } else {
          toast.success("محصول از علاقه‌مندی‌ها حذف شد");
        }
        
        return data.isFavorite;
      } else {
        toast.error(data.message || "مشکلی پیش آمد");
        return null;
      }
    } catch (error) {
      console.error("خطا در تغییر وضعیت علاقه‌مندی:", error);
      toast.error("مشکلی در ارتباط با سرور رخ داد");
      return null;
    }
  }, [session, fetchFavorites]);

  // دریافت اولیه لیست علاقه‌مندی‌ها
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    isLoading,
    checkIsFavorite,
    toggleFavorite,
    fetchFavorites,
  };
};