"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";

const EditPostPage = () => {
  const [data, setData] = useState("");
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://arianjahangiri.vercel.appi.verce/.ippi.vercel.app/Posts/${id}`);
        if (!res.ok) throw new Error("خطا در بارگذاری پست‌ها");

        const jsonData = await res.json();
        setData(jsonData.title);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (id) fetchData();
  }, [id]); // اضافه کردن `id` به dependencies

  const updatePost = async () => {
    try {
      const res = await fetch(`https://arianjahangiri.vercel.appi.verce/.ippi.vercel.app/Posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data }),
      });

      if (!res.ok) throw new Error("خطا در ویرایش پست‌ها");

      router.push("/admin/post");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-96">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center flex items-center justify-center gap-2">
          <FiEdit3 className="text-blue-400" /> ویرایش پست
        </h2>

        <input
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="w-full p-4 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="عنوان جدید را وارد کنید..."
        />

        <button
          onClick={updatePost}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          <FiEdit3 /> ذخیره تغییرات
        </button>
      </div>
    </div>
  );
};

export default EditPostPage;
