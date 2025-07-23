"use client";

import Link from "next/link";
import { useCart } from "../context/cartContext";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, increaseQuantity, error,decreaseQuantity } = useCart();
  const [loadingItem, setLoadingItem] = useState(null);

  if (!cart || cart.items.length === 0) {
    return (
      <main id="main-body-one-col" className="main-body">
        <h1 className="text-center py-5 container-xxl ">سبد خرید شما خالی است</h1>
        <Link href="/" className="btn btn-primary mt-3 ">بازگشت به صفحه اصلی</Link>
      </main>
    );
  }

  return (
    <main id="main-body-one-col" className="main-body">
        {error&& <h3>{error}</h3>}
      {/* start cart */}
      <section className="mb-4">
        <section className="container-xxl">
          <section className="row">
            <section className="col">
              {/* start content header */}
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>سبد خرید شما</span>
                  </h2>
                  <section className="content-header-link">
   
                  </section>
                </section>
              </section>

              <section className="row mt-4">
                <section className="col-md-9 mb-3">
                  <section className="content-wrapper bg-white p-3 rounded-2">
 
                    {cart && cart.items.map(item => (
                      <section key={item._id} className="cart-item d-md-flex py-3">
                        <section className="cart-img align-self-start flex-shrink-1">
                          {item.product?.imageUrl
                            ? <img src={item.product.imageUrl} alt={item.product.name || item.name} width={100} height={100} />
                            : <span>تصویر موجود نیست </span>}
                        </section>
                        <section className="align-self-start w-100">
                          <p className="fw-bold">{item.product?.name || "اسم محصول نامشخص است "}</p>
                          <p>
                            <span style={{ backgroundColor: "#523e02" }} className="cart-product-selected-color me-1"></span>
                            <span> قهوه ای</span>
                          </p>
                          <p>
                            <i className="fa fa-store-alt cart-product-selected-store me-1"></i>
                            <span>کالا موجود در انبار</span>
                          </p>
                          <section>
                            <section className="cart-product-number d-inline-block ">
                              <button
                                type="button"
                                onClick={async () => {
                                  setLoadingItem(item.product?._id);
                                  await decreaseQuantity(item.product?._id);
                                  setLoadingItem(null);
                                }}
                                disabled={item.quantity <= 1 || loadingItem === item.product?._id}
                                className="cart-number-down"
                              >-</button>
                              <input
                                className=""
                                type="number"
                                min="1"
                                max="5"
                                step="1"
                                value={item.quantity}
                                readOnly
                              />
                              <button
                                className="cart-number-up"
                                type="button"
                                onClick={async () => {
                                  setLoadingItem(item.product?._id);
                                  await increaseQuantity(item.product?._id);
                                  setLoadingItem(null);
                                }}
                                disabled={item.quantity >= (item.product?.stock || 0) || loadingItem === item.product?._id}
                              >
                                {loadingItem === item.product?._id ? "..." : "+"}
                              </button>
                            </section>
                            <a
                              onClick={e => {
                                e.preventDefault();
                                removeFromCart(item.product?._id);
                              }}
                              className="text-decoration-none ms-4 cart-delete"
                              href="#"
                            >
                              <i className="fa fa-trash-alt"></i> حذف از سبد
                            </a>
                          </section>
                        </section>
                        <section className="align-self-end flex-shrink-1">
                          <section className="text-nowrap fw-bold">
                            {item.product?.price
                              ? `${item.product.price.toLocaleString()} تومان`
                              : ""}
                          </section>
                        </section>
                      </section>
                    ))}
                    
                  </section>
                  
                </section>
                 <section className="col-md-3">
                                <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
                                    <section className="d-flex justify-content-between align-items-center">
                                       <p className="text-muted">قیمت کالاها ({cart.items.length})</p>
                                        <p className="text-muted">  {cart.items.reduce((total, item) =>{
                                            return total + (item.product?.price || 0) * (item.quantity || 0);
                                        }, 0).toLocaleString()} تومان</p>
                                    </section>

                                   
                                    <section className="border-bottom mb-3"></section>
                                    <section className="d-flex justify-content-between align-items-center">
                                        <p className="text-muted">جمع سبد خرید</p>
                                        <p className="fw-bolder">  {cart.items.reduce((total, item) =>{
                                            return total + (item.product?.price || 0) * (item.quantity || 0);
                                        }, 0).toLocaleString()} تومان</p>
                                    </section>

                                  


                                    <section className="">
                                        <Link href="/checkout" className="btn btn-danger d-block">تکمیل فرآیند خرید</Link>
                                    </section>

                                </section>
                                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
      {/* end cart */}
    </main>
  );
}