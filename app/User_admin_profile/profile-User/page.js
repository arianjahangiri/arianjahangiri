"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaUserEdit, FaTrashAlt, FaCamera } from "react-icons/fa";

const AccountSettings = () => {
  const { data: session, status } = useSession();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  

  async function updateUser() {
    await fetch("/api/User", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone   }),
    });
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        در حال بارگذاری...
      </div>
    );
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <FaUserEdit className="text-blue-500" /> تنظیمات حساب کاربری
        </h1>

        <div className="flex items-center gap-6 mb-8 flex-col sm:flex-row text-center sm:text-left">
          <div className="relative group w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
            <img
              src={user?.Image_profile || "/images/default-user.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
              <button className="text-white text-xs bg-blue-600 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-blue-700">
                <FaCamera /> تغییر
              </button>
              <button className="text-white text-xs bg-red-500 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-red-600">
                <FaTrashAlt /> حذف
              </button>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user?.name || "نام کاربر"}</h2>
          
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block mb-1 font-medium">نام و نام خانوادگی</label>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              defaultValue={user?.name || ""}
              placeholder="مثلاً علی رضایی"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        
          <div>
            <label className="block mb-1 font-medium">شماره موبایل</label>
            <input
              type="tel"
              onChange={(e) => setPhone(e.target.value)}
              defaultValue={user?.phone || ""}
              placeholder="مثلاً 09123456789"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={updateUser}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
            >
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
