"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  // State variables for form inputs
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [LinkUrl, setLinkUrl] = useState("");
 
  const [error, setError] = useState("");

  const router = useRouter();

  // Function to validate form inputs
  const validateInputs = () => {
    if (!title ) {
      setError("تمامی فیلدها باید پر شوند.");
      return false;
    }

    // Regular expressions for input validation
  

    setError(""); 
    return true;
  };

  // Function to send data to the backend
  const fetchData = async () => {
    if (!validateInputs()) {
      return;
    }

    try {
      const res = await fetch("https://arianjahangiri.vercel.appi.vercel.app/api/categories/home-menu", {
        method: "POST",
      body: JSON.stringify({
  title,
  menu_dropdown: [
    {
      text: text,
      LinkUrl: LinkUrl,
    },
  ],
}),

        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("خطایی در ارسال داده رخ داده است.");
      }

      // Redirect to the user management page after successful submission
      router.push("/admin");

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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 w-full rounded-lg border border-l-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="عنوان منو را وارد کنید"
          />
        </div>

        {/* Email input field */}
        <div className="mb-4">
          <input
            type="email"
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="عنوان زیر منو را وارد کنید "
          />
        </div>
        
<div></div>
        {/* Phone number input field */}
        <div className="mb-4">
          <input
            type="text"
            required
            value={LinkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="p-3 w-full rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
            placeholder="شماره تلفن"
          />
        </div>

 
        <button
          onClick={fetchData}
          className="w-full bg-blue-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        >
     ساخت 
        </button>
      </div>
    </div>
  );
};

export default Page;
