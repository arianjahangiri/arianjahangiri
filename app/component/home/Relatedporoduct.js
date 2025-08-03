"use client";

import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const RelatedProduct = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // شبیه‌سازی درخواست API
    const timer = setTimeout(() => {
      setData([
        {
          id: 1,
          name: "پکیج آموزش خطاطی و خوشنویسی با کد 624",
          price: "115,000 تومان",
          image: "assets/images/products/3.jpg",
          colors: ["yellow", "green", "white", "blue", "red"],
        },
      ]);
      setLoading(false);
    }, 2000); // 2 ثانیه برای تست لودینگ

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="mb-4">
      <section className="container-xxl">
        <section className="row">
          <section className="col">
            <section className="content-wrapper bg-white p-3 rounded-2">
              {/* Header */}
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>کالاهای مرتبط</span>
                  </h2>
                </section>
              </section>

              {/* Content */}
              <section className="lazyload-wrapper">
                <section className="lazyload light-owl-nav owl-carousel owl-theme">
                  {loading ? (
                    // ✅ اسکلتون با انیمیشن Fade-In
                    <div className="animate-fade-in">
                      <Skeleton height={200} width={200} borderRadius="8px" />
                      <Skeleton width={180} height={20} className="mt-2" />
                      <Skeleton width={100} height={15} />
                      <div className="d-flex gap-2 mt-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            circle
                            width={20}
                            height={20}
                            baseColor="#e0e0e0"
                            highlightColor="#f5f5f5"
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    data.map((item) => (
                      <section className="item animate-fade-in" key={item.id}>
                        <section className="lazyload-item-wrapper">
                          <section className="product">
                            <section className="product-add-to-cart">
                              <a
                                href="#"
                                data-bs-toggle="tooltip"
                                data-bs-placement="left"
                                title="افزودن به سبد خرید"
                              >
                                <i className="fa fa-cart-plus"></i>
                              </a>
                            </section>
                            <section className="product-add-to-favorite">
                              <a
                                href="#"
                                data-bs-toggle="tooltip"
                                data-bs-placement="left"
                                title="افزودن به علاقه مندی"
                              >
                                <i className="fa fa-heart"></i>
                              </a>
                            </section>
                            <a className="product-link" href="#">
                              <section className="product-image">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="img-fluid"
                                />
                              </section>
                              <section className="product-name">
                                <h3>{item.name}</h3>
                              </section>
                              <section className="product-price-wrapper">
                                <section className="product-price">
                                  {item.price}
                                </section>
                              </section>
                              <section className="product-colors">
                                {item.colors.map((color, i) => (
                                  <section
                                    key={i}
                                    className="product-colors-item"
                                    style={{ backgroundColor: color }}
                                  ></section>
                                ))}
                              </section>
                            </a>
                          </section>
                        </section>
                      </section>
                    ))
                  )}
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>

      {/* ✅ استایل انیمیشن */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default RelatedProduct;
