"use client";

import { useCart } from "@/app/context/cartContext";
import React, { useState } from "react";
import Skeleton from "react-loading-skeleton";

const AddToCartButton = ({ productId }) => {
  const { addToCart, error } = useCart();

  // Local state for loading and error handling
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Handle Add To Cart action
  const handleAddToCart = async () => {
    setLoading(true);
    setLocalError(null);

    try {
      await addToCart(productId, 1);

      // If there's an error from context, set it locally
      if (error) {
        setLocalError(error);
      }
    } catch (err) {
      setLocalError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Button or Skeleton Loader */}
      {loading ? (
        <Skeleton
          height={45}
          width={200}
          baseColor="#e5e7eb"
          highlightColor="#f3f4f6"
          className="rounded-lg"
        />
      ) : (
        <button
          disabled={loading}
          onClick={handleAddToCart}
          className={`w-full md:w-auto px-3 py-2 rounded-lg text-white font-semibold transition duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          افزودن به سبد خرید
        </button>
      )}

      {/* Error Message */}
      {localError && (
        <p className="text-red-600 text-sm mt-3">{localError}</p>
      )}
    </div>
  );
};

export default AddToCartButton;
