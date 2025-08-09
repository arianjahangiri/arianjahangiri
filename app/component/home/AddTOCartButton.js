"use client";

import { useCart } from "@/app/context/cartContext";
import React, { useState, useEffect } from "react";

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
    <section>
      <button disabled={loading} onClick={handleAddToCart} className="btn btn-danger d-block">
        {loading ? "درحال افزودن ..." : "افزودن به سبد خرید"}
      </button>
      {localError && <p className="text-danger text-lg m-3">{localError}</p>}
    </section>
  );
};

export default AddToCartButton;