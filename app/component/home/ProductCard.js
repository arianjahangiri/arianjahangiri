
"use client"
import Image from 'next/image'; // ✅ درست
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {
  return (
    <section className="item">
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
         
            <section className="product-image">
              <Link  className="product-link" href={`/component/products/${product._id}`}>
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={300}
                height={300}
              />


              
              </Link>
            </section>
            <section className="product-colors"></section>
            <section className="product-name">
              <h3>{product.name}</h3>
            </section>
            <section className="product-price-wrapper">
              <section className="product-price">{product.price}</section>
            </section>
          
        </section>
      </section>
    </section>
  );
};

export default ProductCard;
