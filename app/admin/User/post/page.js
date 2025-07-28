"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState([]);  
  const [statusNew, setStatusNew] = useState(null);  
  const [IDEdite, setIdEdite] = useState(""); 
  const [loading, setLoading] = useState(true);   
  const router = useRouter();

  // Fetch user data from the server
  const fetchData = async () => {
    try {
      const res = await fetch("https://arianjahangiri.vercel.appi.vercel.app/api/User");
      if (!res.ok) throw new Error("خطا در بارگیری کاربران");
      const jsonData = await res.json();
      setData(jsonData);
      setLoading(false);   
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the page loads
  }, []);

  // Update the user's status in the database
  const updateUser = async () => {
    if (!IDEdite) return; // If no user ID, exit

    try {
      const res = await fetch(`https://arianjahangiri.vercel.appi.vercel.app/api/User/${IDEdite}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: statusNew }), // Send the new status
      });

      if (!res.ok) throw new Error("خطا در به‌روزرسانی کاربر");

      fetchData(); // Refresh the data after updating
      setIdEdite(""); // Clear the edit ID
    } catch (error) {
      console.error("Error updating:", error.message);
    }
  };

  // Navigate to the user creation page
  const createUser = () => {
    router.push("/admin/User/create");
  };

  // Handle user deletion
  const handleDelete = async (id) => {
    try {
      await fetch(`https://arianjahangiri.vercel.appi.vercel.app/api/User/${id}`, { method: "DELETE" });
      setData((prevData) => prevData.filter((user) => user._id !== id)); // Remove the deleted user from the list
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Navigate to the user edit page
  const handleEdit = (id) => {
    router.push(`/admin/User/edite/${id}`);
  };

  return (
<div className="w-full p-6 bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 min-h-screen">
  {/* دکمه ایجاد کاربر */}
  <div className="flex justify-end mb-6">
    <button
      onClick={createUser}
      className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all"
    >
      ایجاد کاربر
    </button>
  </div>

  {/* جعبه محتوا */}
  <div className="bg-gray-850 rounded-2xl shadow-xl p-6 border border-gray-700">
    {loading ? (
      // اسپینر بارگذاری
      <div className="flex justify-center items-center h-96">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    ) : (
      <div className="overflow-x-auto max-h-[32rem] rounded-lg">
        <table className="min-w-full table-auto bg-gray-900 text-sm text-white">
          <thead className="sticky top-0 bg-gray-800 text-gray-400 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-right">نام</th>
              <th className="px-6 py-3 text-right">ایمیل</th>
              <th className="px-6 py-3 text-right">تلفن</th>
              <th className="px-6 py-3 text-right">وضعیت</th>
              <th className="px-6 py-3 text-right">عملیات</th>
              <th className="px-6 py-3 text-right">شناسه</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((user) => (
              <tr key={user._id} className="hover:bg-gray-800 transition-colors">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => {
                      setStatusNew(!user.isAdmin);
                      setIdEdite(user._id);
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all ${
                      user.isAdmin
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    {user.isAdmin ? "ادمین" : "کاربر عادی"}
                  </button>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(user._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-xs"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-md text-xs"
                  >
                    حذف
                  </button>
                </td>
                <td className="px-6 py-4 text-xs text-gray-400">{user._id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}

    {/* دکمه ذخیره وضعیت */}
    {IDEdite && (
      <div className="mt-6 flex justify-end">
        <button
          onClick={updateUser}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium shadow-lg transition-all"
        >
          ذخیره تغییرات وضعیت
        </button>
      </div>
    )}
  </div>
</div>

  );
};

export default Page;
