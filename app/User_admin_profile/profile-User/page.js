"use client";

import React, { useEffect, useState } from "react";

const EditUser = ({ id }) => {
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // فقط نمایش
  const [status, setStatus] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // بارگذاری اطلاعات کاربر
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/User/${id}`);
        if (!res.ok) throw new Error("خطا در بارگذاری اطلاعات کاربر");

        const jsonData = await res.json();
        setData(jsonData);
        setName(jsonData.name || "");
        setEmail(jsonData.email || "");
        setPhone(jsonData.phone || ""); // فقط برای نمایش
        setStatus(jsonData.status || false);
        setImageUrl(jsonData.image || "");
      } catch (error) {
        console.error(error.message);
        setMessage("خطا در بارگذاری اطلاعات");
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("status", status);
      if (file) {
        formData.append("image", file);
      }

      const res = await fetch(`/api/User/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("خطا در بروزرسانی اطلاعات");

      setMessage("اطلاعات با موفقیت بروزرسانی شد");
    } catch (error) {
      console.error(error);
      setMessage("خطا در بروزرسانی اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">ویرایش اطلاعات کاربر</h2>

      {message && (
        <p className={`mb-4 text-center ${message.includes("خطا") ? "text-red-500" : "text-green-600"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">نام:</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">ایمیل:</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-medium">شماره تلفن:</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 mt-1 bg-gray-100 text-gray-700"
            value={phone}
            readOnly
          />
        </div>

        <div>
          <label className="block font-medium">وضعیت فعال بودن:</label>
          <input
            type="checkbox"
            checked={status}
            onChange={(e) => setStatus(e.target.checked)}
            className="mt-2"
          />
        </div>

        <div>
          <label className="block font-medium">تصویر فعلی:</label>
          {imageUrl ? (
            <img src={imageUrl} alt="Profile" className="w-24 h-24 object-cover mt-2 rounded-full" />
          ) : (
            <p className="text-sm text-gray-500 mt-1">تصویری موجود نیست</p>
          )}
        </div>

        <div>
          <label className="block font-medium">آپلود تصویر جدید:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "در حال ارسال..." : "ذخیره تغییرات"}
        </button>
      </form>
    </div>
  );
};

export default EditUser;
