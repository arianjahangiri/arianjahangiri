"use client";

import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = () => {
  const [data, setData] = useState('');
  const route = useRouter();

  const fetchData = async () => {
    try {
      const res = await fetch(`/Posts`, {
        method: 'POST',
        body: JSON.stringify({
          title: data
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      route.push("/admin/post");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96">
        <h2 className="text-white text-2xl font-semibold mb-6 text-center">ویرایش پست</h2>

        <div className="mb-6">
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="p-3 w-full rounded-lg shadow-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="ویرایش عنوان"
          />
        </div>

        <button
          onClick={() => fetchData()}
          className="w-full bg-blue-500 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition-all duration-300"
        >
          ویرایش
        </button>
      </div>
    </div>
  );
};

export default page;
