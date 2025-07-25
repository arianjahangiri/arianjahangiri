"use client";  

import { useRouter } from "next/navigation";  
import React, { useState } from "react";  
import persian from "react-date-object/calendars/persian";  
import persian_fa from "react-date-object/locales/persian_fa";  
import DatePicker from "react-multi-date-picker";  
import DateObject from "react-date-object";  

const Page = () => {  
  // State hooks to store input values  
  const [status, setStatus] = useState();  
  const [Translations, setTranslations] = useState(null);  
  const [discountPercentage, setDiscountPercentage] = useState("");  
  const [discountcode, setDiscountCode] = useState("");  
  const [errors, setErrors] = useState({});  

  const route = useRouter();  

  // Function to handle form submission  
  const fetchData = async () => {  

    setErrors({});  

    // Validation for discount code and discount percentage  
    let formErrors = {};  
    if (discountcode.length < 3) {  
      formErrors.discountcode = "کد تخفیف باید حداقل شامل 3 کاراکتر باشد.";  
    }  
    if (discountPercentage <= 0 || discountPercentage > 100) {  
      formErrors.discountPercentage = "درصد تخفیف باید بین 1 و 100 باشد.";  
    }  
    if (status == null) {  
      formErrors.status = "وضعیت باید انتخاب شود.";  
    }  

    // If there are validation errors, stop form submission  
    if (Object.keys(formErrors).length > 0) {  
      setErrors(formErrors);  
      return;  
    }  

    try {  
      // Sending the form data to the server  
      await fetch("https://arianjahangiri.vercel.app/api/discountCode", {  
        method: "POST",  
        body: JSON.stringify({ status, Translations, discountPercentage, discountcode }),  
        headers: { "Content-Type": "application/json" },  
      });  
      route.push("/admin/discountcode/post");  
    } catch (error) {  
      console.error(error.message);  
    }  
  };  


  const disablePastDates = (date) => {  
    const today = new DateObject();  
    return date < today  
  };  

  return (  
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center px-4">  
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full">  
        <h2 className="text-white text-xl font-semibold mb-6 text-center">ساخت پست</h2>  

        {/* Discount code input */}  
        <div className="mb-4">  
          <label className="text-gray-300 block mb-2">کد تخفیف</label>  
          <input  
            type="text"  
            value={discountcode}  
            onChange={(e) => setDiscountCode(e.target.value)}  
            className={`p-3 w-full rounded-md shadow bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.discountcode ? 'border-red-500' : ''}`}  
            placeholder="کد تخفیف را وارد کنید"  
          />  
          {errors.discountcode && <p className="text-red-500 text-sm mt-2">{errors.discountcode}</p>}  
        </div>  

        {/* Date picker for expiration date */}  
        <div className="mb-4">  
          <label className="text-gray-300 block mb-2">تاریخ</label>  
          <DatePicker  
            calendar={persian}  
            locale={persian_fa}  
            onChange={(date) => setTranslations(date?.valueOf())}  
            className="w-full p-3 bg-gray-700 text-white rounded-md"  
            minDate={new Date()}  
          />  
        </div>  

        {/* Discount percentage input */}  
        <div className="mb-4">  
          <label className="text-gray-300 block mb-2">درصد تخفیف</label>  
          <input  
            type="number"  
            value={discountPercentage}  
            onChange={(e) => setDiscountPercentage(Math.min(100, Math.max(0, e.target.value)))}  
            className={`p-3 w-full rounded-md shadow bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 ${errors.discountPercentage ? 'border-red-500' : ''}`}  
            placeholder="درصد تخفیف را وارد کنید"  
          />  
          {errors.discountPercentage && <p className="text-red-500 text-sm mt-2">{errors.discountPercentage}</p>}  
        </div>  

        {/* Radio buttons for active/inactive status */}  
        <div className="mb-4">  
          <label className="text-gray-300 block mb-2">وضعیت</label>  
          <div className="flex gap-4">  
            <label className="flex items-center text-gray-300">  
              <input  
                type="radio"  
                checked={status === true}  
                onChange={() => setStatus(true)}  
                className="w-5 h-5 mr-2"  
              />  
              فعال  
            </label>  

            <label className="flex items-center text-gray-300">  
              <input  
                type="radio"  
                checked={status === false}  
                onChange={() => setStatus(false)}  
                className="w-5 h-5 mr-2"  
              />  
              غیرفعال  
            </label>  
          </div>  
          {errors.status && <p className="text-red-500 text-sm mt-2">{errors.status}</p>}  
        </div>  


        <button  
          onClick={fetchData}  
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition-all duration-300"  
        >  
          ساخت  
        </button>  
      </div>  
    </div>  
  );  
};  

export default Page;