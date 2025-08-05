 
import React from 'react';
import ProductGallery from '../../home/ProductGallery';
import Productdetails from '../../home/Productdetails';
import Relatedporoduct from '../../home/Relatedporoduct';
import Commentes from '../../home/commentesProduct/Commentes';
import AddTOCartButton from '../../home/AddTOCartButton';

async function getProductData(id) {
  const res = await fetch(
    `https://arianjahangiri.vercel.app/api/product/${id}`,
    {
      next: { revalidate: 60 },
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    throw new Error("خطایی در دریافت اطلاعات");
  }

  return res.json();
}

const page = async ({ params }) => {
  const { id } = await params;
  const product = await getProductData(id);
  console.log(product);

  return (
    <div id="div-body-one-col" className="div-body">
      <section className="container-xxl">
        <section className="row">
          <section className="col-md-4">
            <ProductGallery id={id} />
          </section>
          <section className="col-md-5">
            <Productdetails id={id} />
          </section>
          <section className="col-md-3">
            <section className="content-wrapper bg-white p-3 rounded-2 cart-total-price">
              <section className="d-flex justify-content-between align-items-center">
                <p className="text-muted">قیمت کالا</p>
                <p className="text-muted">
                  {product.price.toLocaleString()} <span className="small">تومان</span>
                </p>
              </section>
                <section className="d-flex justify-content-between align-items-center">
                <p className="text-gray-500">    مقدار کم شده از قیمت </p>
                <p className="text-muted text-red-500">
                  {product.discount_amount.toLocaleString()} <span className="small">تومان</span>
                </p>
              </section>
             
              <section className="border-bottom mb-3"></section>
              <section className="d-flex justify-content-end align-items-center">
                <p className="fw-bolder">
                  {product.finalPrice.toLocaleString()} <span className="small">تومان</span>
                </p>
              </section>
              <AddTOCartButton productId={product._id} />
            </section>
          </section>
        </section>
        <Relatedporoduct />
        <Commentes />
        
      </section>
    </div>
  );
};

export default page;