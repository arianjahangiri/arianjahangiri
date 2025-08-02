"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const SearchPage = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      fetchResults(query);
    }
  }, [query]);

  const fetchResults = async (q) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) {
        throw new Error("خطا در دریافت نتایج");
      }
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error("خطا:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        نتایج جستجو برای: <span className="text-blue-600">{query}</span>
      </h1>

      {loading && <p className="text-gray-500">در حال جستجو...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">هیچ محصولی یافت نشد</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {results.map((item) => (
          <div
            key={item._id}
            className="p-4 border rounded-lg shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">{item.name}</h2>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded mt-2"
              />
            )}
            <p className="mt-2 text-gray-600">{item.price} تومان</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
