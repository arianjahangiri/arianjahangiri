"use client";
 
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import ProductGallery from "./ProductGallery";

const Productdetails = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const prams = useParams();

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrMsg("");
      const res = await fetch(
        `https://arianjahangiri.vercel.app/api/product/${prams.id}`
      );
      if (!res.ok) throw new Error("خطا در بارگذاری محصولات");

      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);

      // اسکرول به پایین پس از بارگذاری داده‌ها
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } catch (error) {
      console.error(error.message);
      setErrMsg(error.message || "خطای ناشناخته");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // گالری ساده: اگر images آرایه بود استفاده می‌شود، وگرنه از imageUrl تکی
  const images = Array.isArray(data?.images)
    ? data.images.filter(Boolean)
    : data?.imageUrl
    ? [data.imageUrl]
    : [];

  const activeImage =
    images.length > 0 ? images[Math.min(activeIdx, images.length - 1)] : "";

  return (
    <section className="content-wrapper bg-white p-3 rounded-2 mb-4 shadow-sm">
      {/* لودینگ اسکلتی ساده */}
      {loading && (
        <div>
          <div className="placeholder-glow mb-3">
            <span className="placeholder col-12 rounded-3" style={{ height: 280, display: "block" }} />
          </div>
          <div className="placeholder-glow mb-2">
            <span className="placeholder col-6 rounded-2" />
          </div>
          <div className="placeholder-glow">
            <span className="placeholder col-12 rounded-2" />
            <span className="placeholder col-10 rounded-2" />
            <span className="placeholder col-8 rounded-2" />
          </div>
        </div>
      )}

      {!loading && errMsg && (
        <div className="alert alert-danger mb-3">{errMsg}</div>
      )}

      {!loading && !errMsg && (
        <>
          {/* هدر با تصویر بزرگ و عنوان */}
          <section className="content-header mb-4">
            <div className="position-relative rounded-3 overflow-hidden mb-3" style={{ minHeight: 280 }}>
              {activeImage ? (
                <Image
                  src={activeImage}
                  alt={data?.name || "Selected Product"}
                  fill
                  sizes="100vw"
                  className="w-100 h-100 object-fit-contain bg-light"
                />
              ) : (
                <div className="w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                  <span className="text-muted">بدون تصویر</span>
                </div>
              )}

              {/* نوار عنوان روی تصویر */}
              <div
                className="position-absolute bottom-0 start-0 end-0 p-3"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.5) 100%)",
                  color: "#fff",
                }}
              >
                <h2 className="h5 mb-1">{data?.name}</h2>
                <div className="small text-white-50">
                  گارانتی اصالت و سلامت فیزیکی کالا
                </div>
              </div>
            </div>

            {/* بندانگشتی‌های گالری (در صورت وجود چند تصویر) */}
         <ProductGallery   id={data?._id} />
          </section>

          {/* بدنه اطلاعات محصول */}
          <section className="product-info">
            <div className="row g-3">
              <div className="col-12 col-lg-8">
                <div className="mb-3">
                  <i className="fa fa-store-alt cart-product-selected-store me-2 text-success" />
                  <span className="fw-medium">کالا موجود در انبار</span>
                </div>

                <p className="mb-3">
                  <i className="fa fa-info-circle me-2 text-secondary" />
                  <span className="text-secondary">
                    {data?.description || "توضیحاتی برای این محصول ثبت نشده است."}
                  </span>
                </p>
              </div>

              <div className="col-12 col-lg-4">
                <div className="border rounded-3 p-3 h-100">
                  <div className="d-flex flex-column gap-2">
                    <a
                      className="btn btn-outline-danger btn-sm text-decoration-none"
                      href="#"
                    >
                      <i className="fa fa-heart me-2" />
                      افزودن به علاقه‌مندی
                    </a>

                    {/* اگر قیمت داشت نمایش شکیل‌تر */}
                    {typeof data?.price !== "undefined" && (
                      <div className="mt-2">
                        <div className="text-muted small mb-1">قیمت</div>
                        <div className="h4 m-0 fw-bold">
                          {Number(data?.price || 0).toLocaleString("fa-IR")} تومان
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </section>
  );
};

export default Productdetails;