"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  // State variables for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  // Function to validate form inputs
  const validateInputs = () => {
    if (!name || !email || !phone) {
      setError("تمامی فیلدها باید پر شوند.");
      return false;
    }

    // Regular expressions for input validation
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

    setError(""); 
    return true;
  };

  // Function to send data to the backend
  const fetchData = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const res = await fetch("
        method: "POST",
        body: JSON.stringify({ name, email, phone, status }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("خطایی در ارسال داده رخ داده است.");
      }

      // Redirect to the user management page after successful submission
      router.push("/admin/User/post");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
        {/* Form title */}
        <h2 className="text-white text-3xl font-bold mb-6 text-center">
          ویرایش پست
        </h2>

        {/* Display error message if validation fails */}
        {error && (
          <div className="mb-4 bg-red-500 text-white p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Name input field */}
        <div className="mb-4">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 w-full rounded-lg border border-l-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="نام خود را وارد کنید"
          />
        </div>

        {/* Email input field */}
        <div className="mb-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="ایمیل خود را وارد کنید"
          />
        </div>

        {/* Phone number input field */}
        <div className="mb-4">
          <input
            type="text"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="شماره تلفن"
          />
        </div>

        {/* User status toggle button */}
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

        {/* Submit button */}
        <button
          onClick={fetchData}
          className="w-full bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        >
          ویرایش
        </button>
      </div>
    </div>
  );
};

export default Page;
