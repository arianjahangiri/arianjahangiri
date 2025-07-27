"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EditPostPage = () => {
  // State for storing form data
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    status: false,
  });

  // Individual states for each form field
  const [name, setName] = useState(data.name || ""); 
  const [email, setEmail] = useState(data.email || "");  
  const [phone, setPhone] = useState(data.phone || "");  
  const [status, setStatus] = useState(data.status || false);  
  const [error, setError] = useState(""); // Error message state
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    // Function to fetch user data based on the ID
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/User/${id}`);
        if (!res.ok) throw new Error("خطا در بارگذاری پست‌ها");

        const jsonData = await res.json();
        setData(jsonData);
        setName(jsonData.name || "");  
        setEmail(jsonData.email || "");  
        setPhone(jsonData.phone || "");  
        setStatus(jsonData.status || false);  
      } catch (error) {
        console.error(error.message);
      }
    };

    if (id) fetchData();
  }, [id]);

  // Function to validate form inputs
  const validateInputs = () => {
    if (!name || !email || !phone) {
      setError("تمامی فیلدها باید پر شوند.");
      return false;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!nameRegex.test(name)) {
      setError("لطفاً نام معتبر وارد کنید.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("لطفاً ایمیل معتبر وارد کنید.");
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setError("لطفاً شماره تلفن معتبر وارد کنید.");
      return false;
    }
    setError(""); // Clear error if all fields are valid
    return true;
  };

  // Function to update user data
  const updateUser = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/api/User/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, status }),
      });

      if (!res.ok) throw new Error("خطا در ویرایش پست‌ها");

      router.push("/admin/User/post"); // Redirect after successful update
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          ویرایش پست
        </h2>

        {error && (
          <div className="mb-4 bg-red-500 text-white p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Input field for Name */}
        <div className="mb-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 w-full rounded-lg border border-l-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="نام خود را وارد کنید"
          />
        </div>

        {/* Input field for Email */}
        <div className="mb-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="ایمیل خود را وارد کنید"
          />
        </div>

        {/* Input field for Phone */}
        <div className="mb-4">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="شماره تلفن"
          />
        </div>

        {/* Status toggle button */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-white font-medium">وضعیت کاربر:</span>
          <button
            onClick={() => setStatus(!status)}
            className={`px-5 py-2 rounded-lg font-medium shadow-md transition-all duration-300 border border-gray-600 ${
              status
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {status ? "ادمین" : "کاربر معمولی"}
          </button>
        </div>

        {/* Submit button to update user */}
        <button
          onClick={updateUser}
          className="w-full bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        >
          ویرایش
        </button>
      </div>
    </div>
  );
};

export default EditPostPage;
