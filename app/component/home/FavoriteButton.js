"use client";

import React, { useState, useEffect } from "react";
import { useFavorites } from "@/app/hooks/useFavorites";
import { useSession } from "next-auth/react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const FavoriteButton = ({ productId, className = "", size = "1em" }) => {
  const { data: session } = useSession();
  const { checkIsFavorite, toggleFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // بررسی وضعیت اولیه علاقه‌مندی
  useEffect(() => {
    const checkInitialState = async () => {
      if (session?.user && productId) {
        const result = await checkIsFavorite(productId);
        setIsFavorite(result);
      }
    };
    
    checkInitialState();
  }, [productId, session, checkIsFavorite]);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await toggleFavorite(productId);
      if (result !== null) {
        setIsFavorite(result);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className={`transition-all duration-200 ${
        isLoading ? "opacity-50" : "hover:scale-110"
      } ${className}`}
      disabled={isLoading}
      title={isFavorite ? "حذف از علاقه‌مندی‌ها" : "افزودن به علاقه‌مندی‌ها"}
    >
      {isFavorite ? (
        <FaHeart className="text-red-500" size={size} />
      ) : (
        <FaRegHeart className="text-red-500" size={size} />
      )}
    </button>
  );
};

export default FavoriteButton;