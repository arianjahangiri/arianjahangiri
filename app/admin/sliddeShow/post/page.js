"use client";

 
import { getslideshowImage } from "@/app/home/lib/owlcarousel/getslideshowImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
 
  const route = useRouter();

  const fetchDel = async (id) => {
    if (!window.confirm("آیا از حذف این محصول مطمئن هستید؟")) return;
    try {
        await fetch(`https://arianjahangiri.vercel.app/api/SlideShow/${id}`, {

        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error(error.message);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const jsonData = await getslideshowImage();
      
      if (!jsonData) throw new Error("داده‌ای دریافت نشد!");
  
      setData(jsonData);
    } catch (error) {
      console.error("خطا در fetchData:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
 
    <div className="container-fluid bg-dark text-white min-vh-100 py-4 px-3">

    {/* لودینگ */}
    {loading && (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-primary" style={{ width: "4rem", height: "4rem" }} role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>
    )}
  
    {/* دکمه افزودن اسلایدشو */}
    <div className="mb-3 d-flex justify-content-end">
      <Link href="/admin/sliddeShow/add" className="btn btn-warning d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>
        <FaPlus />
      </Link>
    </div>
  
    {/* جدول اسلایدشوها */}
    <div className="table-responsive bg-secondary rounded p-3 shadow">
      {loading ? (
        <p className="text-center text-light fs-5">در حال بارگذاری...</p>
      ) : (
        <table className="table table-dark table-hover table-bordered align-middle text-center">
          <thead>
            <tr>
              <th>نام</th>
              <th>لینک</th>
              <th>تصویر</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {data.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td className="text-break">{product.UrlLink}</td>
                <td>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="img-thumbnail"
                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                  />
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Link
                      href={`/admin/sliddeShow/Edite/${product._id}`}
                      className="btn btn-warning d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => fetchDel(product._id)}
                      className="btn btn-danger d-flex align-items-center justify-content-center"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
  
 
  );
};

export default Page;
