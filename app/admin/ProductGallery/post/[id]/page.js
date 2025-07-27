"use client";  

import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";  
import Link from "next/link";  
import { useParams, useRouter } from "next/navigation";  
import React, { useEffect, useState, useRef } from "react";  
import { getImageGallery } from "@/app/home/lib/ProductGallery/GetImage";  

const Page = () => {  
  const [data, setData] = useState([]);  
  const [IdDelete, setIdDelete] = useState([]);  
  const [loading, setLoading] = useState(true);  
  const route = useRouter();  
  const params = useParams();  
  const productId = params.id;  

  const fetchDel = async (IdDelete) => {  
    if (!window.confirm("آیا از حذف این محصول مطمئن هستید؟")) return;  
    try {  
      await fetch(`http://localhost:3000/api/ProductGallery?ProductID=${IdDelete}`, {  
        method: "DELETE",  
      });  
      fetchData();  // داده‌ها را دوباره بارگذاری کنید  
    } catch (error) {  
      console.error("خطا در حذف:", error.message);  
      alert("خطا در حذف محصول");  
    }  
  };  

  const fetchData = async () => {  
    setLoading(true); // شروع بارگذاری  
    try {  
      const jsonData = await getImageGallery(productId);  
      setData(jsonData); // داده‌ها را بر اساس بازگشت مستقیم set کنید  
    } catch (error) {  
      console.error("خطا در fetchData:", error.message);  
      alert("خطا در دریافت داده‌ها");  
    } finally {  
      setLoading(false); // پایان بارگذاری  
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
  
      {/* دکمه افزودن پست جدید */}  
      <div className="mb-3 d-flex justify-content-end">  
        <Link href={`/admin/ProductGallery/add/${productId}`} className="btn btn-warning d-flex align-items-center justify-content-center" style={{ width: "40px", height: "40px" }}>  
          <FaPlus />  
        </Link>  
      </div>  
   
      {/* جدول */}  
      <div className="table-responsive bg-secondary rounded p-3 shadow">  
        {loading ? (  
          <p className="text-center text-light fs-5">در حال بارگذاری...</p>  
        ) : (  
          <table className="table table-dark table-hover table-bordered align-middle text-center">  
            <thead className="table-dark">  
              <tr>  
                <th scope="col">نام</th>  
                <th scope="col">تصویر</th>  
                <th scope="col">عملیات</th>  
              </tr>  
            </thead>  
            <tbody>  
              {data.map((product) => (  
                <tr key={product._id}>  
                  <td>{product.name}</td>  
                  <td>  
                    <img  
                      src={product.imageUrl}  
                      alt={product.name}  
                      className="img-thumbnail"  
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}  
                    />  
                  </td>  
                  <td>  
                    <div className="d-flex justify-content-center gap-2">  
                      <Link  
                        href={`/admin/ProductGallery/edite/${product._id}`}  
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