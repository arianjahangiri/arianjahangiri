
"use client"
import Image from 'next/image'; // ✅ درست
import Link from "next/link";
import React from "react";

const ProductCard = ({ product }) => {


const discountedPrice = product.discount > 0 ? product.price - (product.price * (product.discount / 100)) : price;



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
              <section className={product.discount >0 ?"line-through decoration-red-500 " : ""}>{product.price}</section>
  

       {product.discount > 0 && (
        <div>
          <section className="product-price">{discountedPrice}</section>

          <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-1 rounded-full">
            {product.discount}٪ تخفیف
          </span>
        </div>
)}

            </section>
          
        </section>
      </section>
    </section>
  );
};

export default ProductCard;
