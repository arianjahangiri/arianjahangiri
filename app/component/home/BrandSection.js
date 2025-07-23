
"use client"
import { getBrandImage } from "@/app/home/lib/BrandSection/getBrand";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const BrandSection = () => {
 const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdsImage = async () => {
      try {
        const data = await getBrandImage();
        setData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdsImage();
  }, []);

  console.log(data);

  if (loading) {
    return <div>در حال بارگذاری...</div>; // نمایش وضعیت بارگذاری
  }

  return (
    <section className="brand-part mb-4 py-4">
      <section className="container-xxl">
        <section className="row">
          <section className="col">
            <section className="content-header">
              <section className="d-flex align-items-center">
                <h2 className="content-header-title">
                  <span>برندهای ویژه</span>
                </h2>
              </section>
            </section>
            <section className="brands-wrapper py-4">
              <section className="brands dark-owl-nav owl-carousel owl-theme">
                {data.map((brand) => {
                  return (
                    <section className="item" key={brand._id}>
                      <section className="brand-item">
                        <a href={brand.UrlLink}>
                          <Image
                            src={brand.imageUrl}
                            alt={brand.name}
                            width={150}
                            height={100}
                            priority
                            className="rounded-2"
                          />
                        </a>
                      </section>
                    </section>
                  );
                })}
              </section>
            </section>
          </section>
        </section>
      </section>
    </section>
  );
};

export default BrandSection;
