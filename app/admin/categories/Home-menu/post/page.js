"use client";

import DateObject from "react-date-object";

import React, { useEffect, useState } from "react";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

const Page = () => {
  const API_URL = "https://arianjahangiri.vercel.app/api/categories/home-menu";
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

  const fetchDELETE = async (id) => {
    if (!window.confirm("آیا از حذف این گزینه مطمئن هستید؟")) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "خطا در حذف نظرات");
      }
      await fetchData(); // رفرش لیست بعد از حذف
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-800 text-white p-10">
      <div className="w-full mx-auto bg-gray-700 p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-100">مدیریت نظرات</h2>
          <Link
            href="/admin/categories/Home-menu/Creat"
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
          >
            ساخت منو
          </Link>
        </div>

        {error && (
          <div className="text-red-500 text-center py-4 font-semibold">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-6 text-lg text-gray-400">در حال بارگذاری...</div>
        ) : data.length > 0 ? (
          <div className="overflow-x-auto rounded-xl shadow-lg">
            <table className="w-full text-sm text-left text-gray-200">
              <thead className="text-xs text-gray-100 uppercase bg-gray-600">
                <tr>
                  <th scope="col" className="px-6 py-4 text-center">نام</th>
                  <th scope="col" className="px-6 py-4 text-center">منوی دارپ‌داون</th>
                  <th scope="col" className="px-6 py-4 text-center">لینک زیرمنو</th>
                  <th scope="col" className="px-6 py-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {data.map((comment) => (
                  <tr
                    key={comment._id}
                    className="bg-gray-700 border-b border-gray-600 hover:bg-gray-600 transition duration-300"
                  >
                    <td className="px-6 py-4 text-center font-medium text-white whitespace-nowrap">
                      {comment.title}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {comment.menu_dropdown?.text || "ندارد"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {comment.menu_dropdown?.LinkUrl || "ندارد"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => fetchDELETE(comment._id)}
                        className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition"
                        title="حذف گزینه"
                      >
                        <FaTrash className="ml-1" />
                        حذف
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
