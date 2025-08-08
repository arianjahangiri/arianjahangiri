"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getFeaturedProducts } from "@/app/home/lib/getFeaturedProducts";
 

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getFeaturedProducts();
        if (!Array.isArray(data)) {
          throw new Error("داده های دریافتی معتبر نمیباشند");
        }
        setProducts(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      $(".feature-owl-carousel").owlCarousel({
        items: 4,
        loop: true,
        autoplay: true,
        rtl: true,
        responsive: {
          0: { items: 1 },
          576: { items: 2 },
          768: { items: 3 },
          992: { items: 4 },
          992: { items: 5 },
        },
      });
    }
  }, [products]);

  if (loading) return <div>در حال بارگذاری...</div>;
  if (error) return <div>خطا در بارگذاری داده ها</div>;

  return (
    <section className="mb-3">
      <section className="container-xxl">
        <section className="row">
          <section className="col">
            <section className="content-wrapper bg-white p-3 rounded-2">
              <section className="content-header">
                <section className="d-flex justify-content-between align-items-center">
                  <h2 className="content-header-title">
                    <span>پربازدیدترین کالاها</span>
                  </h2>
                  <section className="content-header-link">
                    <a href="#">مشاهده همه</a>
                  </section>
                </section>
              </section>
              <section className="lazyload-wrapper">
                <section className="lazyload light-owl-nav feature-owl-carousel owl-carousel owl-theme">
                  {products.map((product) => {
                    return (
                  
 
                    <ProductCard loading={loading?true:false} key={product._id} product={product} />);
                  })}
                </section>
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default FeaturedProducts;
