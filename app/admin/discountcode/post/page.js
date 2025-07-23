"use client";

import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";

const DiscountPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to delete a discount code
  const deleteDiscount = async (id) => {
    try {
      await fetch(`http://localhost:3000/api/discountCode/${id}`, {
        method: "DELETE",
      });
      setDiscounts((prevDiscounts) => prevDiscounts.filter((discount) => discount._id !== id));
    } catch (error) {
      console.error(error.message);
    }
  };

  // Function to fetch discount codes from the server
  const loadDiscounts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/discountCode");
      if (!response.ok) throw new Error("Error loading discount codes");
      const data = await response.json();
      setDiscounts(data);
      setIsLoading(false);
    } catch (error) {
      console.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDiscounts(); // Load discounts on component mount
  }, []);

  // Function to format timestamps into a Persian date
  const formatDate = (timestamp) => {
    if (!timestamp) return "نامعلوم";
    return new DateObject({
      date: timestamp,
      calendar: persian,
      locale: persian_fa,
    }).format("YYYY/MM/DD");
  };

  // Navigate to the edit page for a discount
  const editDiscount = (id) => {
    router.push(`edit/${id}`);
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white p-10">
      {/*   div container with a gradient background */}
      <div className="flex-1 w-full flex flex-col items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-2xl p-8">
        
        {/* Button to create a new discount code */}
        <Link
          href="creat"
          className="bg-green-500 text-white px-6 py-3 rounded-full mb-8 text-xl font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
        >
          <FaPlus className="inline-block mr-2" /> ایجاد کد تخفیف جدید
        </Link>

        <div className="w-full overflow-x-auto bg-gray-800 p-4 rounded-lg shadow-md">
          {isLoading ? (
            // Loading animation while data is being fetched
            <div className="flex w-full justify-center items-center h-24">
              <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          ) : discounts.length > 0 ? (
            // Table displaying discount codes
            <table className="min-w-full text-center table-auto rounded-lg">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="px-6 py-3">وضعیت</th>
                  <th className="px-6 py-3">تاریخ</th>
                  <th className="px-6 py-3">درصد تخفیف</th>
                  <th className="px-6 py-3">کد تخفیف</th>
                  <th className="px-6 py-3">شناسه</th>
                  <th className="px-6 py-3">عملیات</th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 text-white">
                {discounts.map((discount) => (
                  <tr key={discount._id} className="hover:bg-gray-700 transition-all duration-200">
                    <td className="px-6 py-4">{discount.status ? "فعال" : "غیرفعال"}</td>
                    <td className="px-6 py-4">{formatDate(discount.Translations)}</td>
                    <td className="px-6 py-4">{`${discount.discountPercentage}%`}</td>
                    <td className="px-6 py-4">{discount.discountcode}</td>
                    <td className="px-6 py-4">{discount._id}</td>
                    <td className="px-6 py-4 flex justify-center space-x-4">
                      
                      {/* Delete button */}
                      <button
                        onClick={() => deleteDiscount(discount._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center"
                      >
                        <FaTrash className="mr-2" /> حذف
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => editDiscount(discount._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300 flex items-center"
                      >
                        <FaEdit className="mr-2" /> ویرایش
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Message when there are no discount codes
            <p className="text-gray-400 text-center text-xl">اطلاعاتی یافت نشد!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscountPage;
