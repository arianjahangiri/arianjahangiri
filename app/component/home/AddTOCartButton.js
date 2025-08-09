"use client";

import { useCart } from "@/app/context/cartContext";
import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AddToCartButton = ({ productId }) => {
  const { addToCart, error } = useCart();
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (error) setLocalError(error);
  }, [error]);

  const handleAddToCart = async (e) => {
    e?.preventDefault?.();
    if (!productId) return;
    setLoading(true);
    setLocalError(null);
    await addToCart(String(productId), 1);
    setLoading(false);
  };

  return (
    <section className="p-3 rounded-3 border bg-white shadow-sm" aria-busy={loading}>
      {/* هدر کوچک */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="fw-semibold text-dark">خرید سریع</span>
        <span className={`badge ${loading ? "bg-secondary" : "bg-success"} rounded-pill`}>
          {loading ? "در حال افزودن" : "آماده"}
        </span>
      </div>

      {/* اسکلتون لودینگ دکمه */}
      {loading ? (
        <div className="w-100">
          <Skeleton height={40} borderRadius={12} className="mb-2" />
          <Skeleton width={"60%"} height={12} borderRadius={8} />
        </div>
      ) : (
        <button
          disabled={loading}
          onClick={handleAddToCart}
          className="btn btn-danger d-block w-100 shadow-sm rounded-3"
        >
          <span className="d-inline-flex align-items-center gap-2">
            <i className="fa fa-cart-plus" aria-hidden="true" />
            <span>افزودن به سبد خرید</span>
          </span>
        </button>
      )}

      {/* پیام خطا */}
      {localError && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mt-3 mb-0" role="alert">
          <i className="fa fa-exclamation-triangle" aria-hidden="true" />
          <div className="flex-grow-1">{localError}</div>
        </div>
      )}
    </section>
  );
};

export default AddToCartButton;