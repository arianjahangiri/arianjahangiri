"use client";

import DateObject from "react-date-object";

import React, { useEffect, useState } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FaTrash } from "react-icons/fa";



const Page = () => {
  const API_URL = "https://arianjahangiri.vercel.appi.vercel.app/api/comment";
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("خطا در بارگذاری نظرات");
      const jsonData = await res.json();
      setData(jsonData);
    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchUpdate = async (id, currentApproval) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproval: !currentApproval }),
      });
      if (!res.ok) throw new Error("خطا در به‌روزرسانی نظر");
      fetchData();
    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  const fetchDelete = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("خطا در حذف نظر");
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp || isNaN(new Date(timestamp))) return "نامعلوم";
    return new DateObject({
      date: timestamp,
      calendar: persian,
      locale: persian_fa,
    }).format("YYYY/MM/DD");
  };

  return (
    <div className="flex h-screen w-full bg-gray-800 text-white p-10">
      <div className="w-full mx-auto bg-gray-700 p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-100">مدیریت نظرات</h2>
        </div>

        {error && <div className="text-red-500 text-center py-4">{error}</div>}

        {loading ? (
          <div className="text-center py-6 text-lg text-gray-400">
            در حال بارگذاری...
          </div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="w-full border-collapse bg-gray-700 text-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-600 text-gray-200">
                  <th className="p-4 text-left">نام</th>
                  <th className="p-4 text-left">شماره تلفن</th>
                  <th className="p-4 text-left">محصول</th>
                  <th className="p-4">نظر</th>
                  <th className="p-4">تاریخ ثبت</th>
                  <th className="p-4">تایید شده</th>
                  <th className="p-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {data.map((comment) => (
                  <tr key={comment._id} className="border-b border-gray-600 hover:bg-gray-600 transition-all">
                    <td className="p-4">{comment.userId?.name || "کاربر ناشناس"}</td>
                    <td className="p-4">{comment.userId?.phone || "کاربر ناشناس"}</td>
                    <td className="p-4">{comment.productId?.name || "محصول ناشناس"}</td>
                    <td className="p-4">{comment.text}</td>
                    <td className="p-4">{formatDate(comment.updatedAt)}</td>
                    <td className="p-4 text-center">{comment.isApproval ? " بله" : " خیر"}</td>
                    <td className="p-4 text-center flex justify-center gap-3">
                      <button
                        onClick={() => fetchDelete(comment._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-lg flex items-center"
                      >
                        <FaTrash className="ml-2" /> حذف
                      </button>
                      <button
                        onClick={() => fetchUpdate(comment._id, comment.isApproval)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg flex items-center"
                      >
                   {  comment.isApproval ?"تایید":"تایید نشده "}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center text-lg">هیچ نظری وجود ندارد.</p>
        )}
      </div>
    </div>
  );
};

export default Page;
