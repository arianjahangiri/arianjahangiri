
"use client"
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useEffect } from 'react';
 

const Productdetails = ({id}) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
 
      const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch( `https://arianjahangiri.vercel.app/api/product/${id}` );
      if (!res.ok) throw new Error("خطا در بارگذاری محصولات");

      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);

      // اسکرول به پایین پس از بارگذاری داده‌ها
      tableRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    } catch (error) {
      console.error(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

    return (
      
               <section className="content-wrapper bg-white p-3 rounded-2 mb-4">

{/* <!-- start vontent header --> */}
<section className="content-header mb-3">
      <Image
                  src={data.imageUrl}
                  alt={data.name}
                  width={400}
                  height={100}
                  className="w-100 h-72 rounded"
                />
    <section className="d-flex justify-content-between align-items-center">
        <h2 className="content-header-title content-header-title-small">
            {data.name}
        </h2>
        <section className="content-header-link">
            {/* <!--<a href="#">مشاهده همه</a>--> */}
        </section>
    </section>
</section>
<section className="product-info">

   
    <p><i className="fa fa-shield-alt cart-product-selected-warranty me-1"></i> <span> گارانتی اصالت و سلامت فیزیکی کالا</span></p>
    <p><i className="fa fa-store-alt cart-product-selected-store me-1"></i> <span>کالا موجود در انبار</span></p>
    <p><a className="btn btn-light  btn-sm text-decoration-none" href="#"><i className="fa fa-heart text-danger"></i> افزودن به علاقه مندی</a></p>
  
    <p className="mb-3 mt-5">
        <i className="fa fa-info-circle me-1"></i>

{data.description}
    </p>
</section>
</section>

 
    );
};

export default Productdetails;