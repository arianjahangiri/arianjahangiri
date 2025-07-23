"use client";
import { createContext, useContext, useEffect, useState } from "react";

const cartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], discountPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateItem, setUpdateItem] = useState(null);

  // Fetch cart from API
  async function fetchCart() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/Cart");
      if (!res.ok) {
        setError("لطفا وارد حساب خود شوید");
        setCart({ items: [], discountPrice: 0 });
        return;
      }
      const data = await res.json();
      setCart(data && data.items ? data : { items: [], discountPrice: 0 });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  async function addToCart(productId, quantity = 1) {
    try {
      setUpdateItem(productId);
      setError(null);
      const res = await fetch("/api/Cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "مشکلی در اضافه کردن پیش آمده است");
        return;
      }
      await fetchCart();
    } catch (error) {
      setError("مشکلی در اضافه کردن پیش آمده است");
    } finally {
      setUpdateItem(null);
    }
  }

  async function decreaseQuantity(productId) {
    try {
      const item = cart.items.find((item) => item.product._id === productId);
      if (!item) {
        setError("محصولی برای کاهش تعداد پیدا نشد");
        return;
      }
      setUpdateItem(productId);
      if (item.quantity <= 1) {
        await removeFromCart(productId);
        return;
      }
      const res = await fetch("/api/Cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: -1 }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "مشکلی در کاهش تعداد پیش آمده است");
        return;
      }
      await fetchCart();
    } catch (error) {
      setError("مشکلی در کاهش تعداد پیش آمده است");
    } finally {
      setUpdateItem(null);
    }
  }

  async function increaseQuantity(productId) {
    try {
      const item = cart.items.find((item) => item.product._id === productId);
      if (!item || (item.product && item.quantity >= item.product.stock)) {
        setError("محصول موجود نیست");
        return;
      }
      setUpdateItem(productId);
      await addToCart(productId, 1);
      // fetchCart is already called in addToCart
    } catch (error) {
      setError("مشکلی در افزایش تعداد پیش آمده است");
    } finally {
      setUpdateItem(null);
    }
  }

  async function removeFromCart(productId) {
    try {
      setUpdateItem(productId);
      const res = await fetch("/api/Cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "مشکلی در حذف محصول پیش آمده است");
        return;
      }
      await fetchCart();
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdateItem(null);
    }
  }

  function clearCart() {
    setCart({ items: [], discountPrice: 0 });
  }

  return (
    <cartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
        loading,
        error,
        updateItem,
        increaseQuantity,
        decreaseQuantity,
      }}
    > 
      {children}
    </cartContext.Provider>
  );
}

export function useCart() {
  return useContext(cartContext);
}