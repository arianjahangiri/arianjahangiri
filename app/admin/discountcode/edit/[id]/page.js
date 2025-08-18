"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SlCalender } from "react-icons/sl";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FaPercent, FaTag } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";

const EditDiscountPage = () => {
  // State hooks for managing discount details
    const [status, setStatus] = useState("");
    const [data, setData] = useState("");
    const [Translations, setTranslations] = useState(null);
    const [discountPercentage, setDiscountPercentage] = useState("");
    const [discountcode, setDiscountCode] = useState("");
    

  // Router and ID for fetching and updating the discount
  const router = useRouter();
  const { id } = useParams();

  // Fetch the discount data from the backend
  const fetchDiscountData = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/discountCode/${id}`);
      if (!res.ok) throw new Error("Failed to load data");
      const jsonData = await res.json();
      setData(jsonData);

      setStatus(jsonData.status);  // Set the status from the fetched data
      setTranslations(jsonData.Translations);
      setDiscountPercentage(jsonData.discountPercentage);
      setDiscountCode(jsonData.discountcode);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchDiscountData();
  }, []);

  // Function to handle the update of the discount data
  const updateDiscountData = async () => {
    if (discountcode.length < 3) {
      alert("کد تخفیف باید حداقل شامل 3 کاراکتر باشد.");
     

      return;
    }
    if (discountPercentage <= 0) {
      alert("درصد تخفیف باید بین 1 و 100 باشد.");
      return;
    }

    try {
      // Update the discount information on the server
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/discountCode/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status, Translations, discountPercentage, discountcode }),
        headers: { "Content-Type": "application/json" },
      });

      alert("Edit successful!");
      router.push("/admin/discountcode/post");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">ویرایش کد تخفیف</h2>

        {/* Discount code input */}
        <div className="mb-4">
          <label className="text-gray-300 block mb-2 flex items-center gap-2">
            <FaTag className="text-yellow-400" /> کد تخفیف
          </label>
          <input
            type="text"
            value={discountcode}
            onChange={(e) => setDiscountCode(e.target.value)}
            className="p-3 w-full rounded-md shadow bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="لطفاً کد تخفیف را وارد کنید"
          />
        </div>

        {/* Expiry date picker */}
        <div className="mb-4">
          <label className="text-gray-300 block mb-2 flex items-center gap-2">
            <SlCalender className="text-green-400" /> تاریخ انقضا
          </label>
          <DatePicker
            calendar={persian}
            minDate={new Date()}
            locale={persian_fa}
            value={Translations}
            onChange={(date) => setTranslations(date?.toDate().getTime())}
            className="w-full bg-gray-700 text-white p-3 rounded-md"
          />
        </div>

        {/* Discount rate input */}
        <div className="mb-4">
          <label className="text-gray-300 block mb-2 flex items-center gap-2">
            <FaPercent className="text-blue-400" /> درصد تخفیف
          </label>
          <input
            type="number"
            value={discountPercentage }
            onChange={(e) => setDiscountPercentage(Number(e.target.value))}
            className="p-3 w-full rounded-md shadow bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="لطفاً درصد تخفیف را وارد کنید"
          />
        </div>

        {/* Discount status radio buttons */}
        <div className="mb-4">
          <label className="text-gray-300 block mb-2">وضعیت</label>
          <div className="flex gap-4">
            <label className="flex items-center text-gray-300 cursor-pointer">
              <input
                type="radio"
                checked={status === true}
                onChange={() => setStatus(true)}
                className="w-5 h-5 mr-2 cursor-pointer"
              />
              فعال
            </label>

            <label className="flex items-center text-gray-300 cursor-pointer">
              <input
                type="radio"
                checked={status === false}
                onChange={() => setStatus(false)}
                className="w-5 h-5 mr-2 cursor-pointer"
              />
              غیرفعال
            </label>
          </div>
        </div>

        {/* Update button */}
        <button
          onClick={updateDiscountData}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        >
          ویرایش
        </button>
      </div>
    </div>
  );
};

export default EditDiscountPage;
