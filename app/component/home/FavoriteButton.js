"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-hot-toast";

const FavoriteButton = ({ productId, size = 16 }) => {
  const { data: session } = useSession();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // بررسی وضعیت اولیه علاقه‌مندی
  useEffect(() => {
    const checkInitialState = async () => {
      if (!productId || !session?.user || isInitialized) return;
      
      try {
        setIsLoading(true);
        // استفاده از GET به جای POST
        const response = await fetch(`/api/favorites/check?productId=${productId}`, {
          method: "GET",
          headers: {
            "Cache-Control": "no-cache"
          }
        });
        
        if (!response.ok) {
          throw new Error(`خطای HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        setIsFavorite(data.isFavorite);
        setIsInitialized(true);
      } catch (error) {
        console.error("خطا در بررسی وضعیت علاقه‌مندی:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkInitialState();
  }, [productId, session, isInitialized]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session?.user) {
      toast.error("لطفا ابتدا وارد حساب کاربری خود شوید");
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      
      if (!response.ok) {
        throw new Error(`خطای HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setIsFavorite(data.isFavorite);
        toast.success(data.isFavorite 
          ? "محصول به علاقه‌مندی‌ها اضافه شد" 
          : "محصول از علاقه‌مندی‌ها حذف شد");
      } else {
        toast.error(data.message || "مشکلی پیش آمد");
      }
    } catch (error) {
      console.error("خطا در تغییر وضعیت علاقه‌مندی:", error);
      toast.error("مشکلی در ارتباط با سرور رخ داد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
      className="focus:outline-none"
    >
      {isFavorite ? (
        <FaHeart 
          size={size} 
          className={`
            text-red-500 
            ${isLoading ? "opacity-50" : "hover:scale-110"}
            transition-all duration-200
          `} 
        />
      ) : (
        <FaRegHeart 
          size={size} 
          className={`
            text-red-500
            ${isLoading ? "opacity-50" : "hover:scale-110"}
            transition-all duration-200
          `} 
        />
      )}
    </button>
  );
};

export default FavoriteButton;