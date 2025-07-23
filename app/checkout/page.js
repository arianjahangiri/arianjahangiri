"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/cartContext";
 
import Link from "next/link";
import Image from "next/image";
import { includes } from "@/public/fontawesome/js/v4-shims";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState([]);
  const [final_address, setFinalAddress] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState(null);
  const [isDiscountApplied, setIsDiscountApplied] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await fetch("/api/User_address");
        if (!response.ok) throw new Error("خطا در دریافت آدرس‌ها");
        const data = await response.json();
        setAddress(data.address || []);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchAddress();

    if (cart && cart.discountPrice > 0) {
      setAppliedDiscount(cart.discountPrice);
      setIsDiscountApplied(true);
    }
  }, [cart]);

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <h1 className="text-center py-5 container-xxl">
          سبد خرید شما خالی است
        </h1>
        <Link href="/" className="btn btn-primary mt-3">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const payableAmount = totalPrice - appliedDiscount;

  const applyDiscount = async () => {
    if (isDiscountApplied) {
      setDiscountError("کد تخفیف قبلاً اعمال شده است");
      return;
    }

    if (!discountCode.trim()) {
      setDiscountError("کد تخفیف را وارد کنید");
      return;
    }

    setDiscountError(null);

    try {
      const res = await fetch("/api/discountCode/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discountcode: discountCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در اعمال کد تخفیف");

      setAppliedDiscount(data.discountPrice);
      setIsDiscountApplied(true);
    } catch (error) {
      setDiscountError(error.message || "خطا در اعمال کد تخفیف");
    }
  };

  const handleOrderSubmit = async () => {
    if (!final_address) {
      alert("لطفاً یک آدرس انتخاب کنید.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ final_address }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "خطا در ثبت سفارش");

      clearCart();
      alert("سفارش شما با موفقیت ثبت شد");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-body">
      <section className="mb-4">
        <section className="container-xxl">
          <section className="col">
            <section className="row mt-4">
              <section className="col-md-9">
                {/* بخش کد تخفیف */}
                <section className="bg-white p-3 rounded-2 mb-4">
                  <h2 className="mb-3">کد تخفیف</h2>

                  <input
                    type="text"
                    className="form-control mb-2"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    disabled={isDiscountApplied}
                    placeholder="کد تخفیف را وارد کنید"
                  />

                  <button
                    disabled={isDiscountApplied}
                    onClick={applyDiscount}
                    className="btn btn-primary"
                  >
                    اعمال کد
                  </button>

                  {discountError && (
                    <div className="text-danger mt-2">{discountError}</div>
                  )}
                </section>

                {/* نمایش محصولات */}
                {cart.items.map((item) => (
                  <div
                    key={item.product?._id || item._id}
                    className="flex items-center gap-6 border p-4 rounded-xl shadow mb-6 bg-white"
                  >
                    <div className="w-28 h-28 flex-shrink-0 flex items-center justify-center bg-gray-50 rounded-lg border">
                      {item.product?.imageUrl ? (
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name || "بدون نام"}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-xs">
                          تصویر ندارد
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col flex-1">
                      <h4 className="font-bold">{item.product?.name}</h4>
                      <div className="text-green-700 font-extrabold text-lg">
                        {item.product.price.toLocaleString()} تومان
                      </div>
                      <div className="text-xs text-gray-500">
                        تعداد: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}

                {/* انتخاب آدرس */}
                <div className="mb-4">
                  <h3 className="mb-2">انتخاب آدرس</h3>
           <select
  className="form-control"
  value={final_address}
  onChange={(e) => setFinalAddress(e.target.value)}
>
  <option value="">انتخاب کنید...</option>
  {address.map((adres, index) => (
    <option key={index} value={String(adres)}>
      {adres}
    </option>
  ))}
</select>

                </div>
              </section>

              {/* خلاصه سفارش */}
              <section className="col-md-3">
                <section className="bg-white p-3 rounded-2 shadow">
                  <p>قیمت کالاها: {totalPrice.toLocaleString()} تومان</p>
                  <p>تخفیف: {appliedDiscount.toLocaleString()} تومان</p>
                  <p className="fw-bold">
                    مبلغ قابل پرداخت: {payableAmount.toLocaleString()} تومان
                  </p>

                  <button
                    onClick={handleOrderSubmit}
                    disabled={loading}
                    className="btn btn-primary w-100 mt-3"
                  >
                    {loading ? "در حال پردازش..." : "پرداخت"}
                  </button>
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </main>
  );
}
