"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const delayDebounce = setTimeout(() => {
        fetchSuggestions(searchQuery);
      }, 400);

      return () => clearTimeout(delayDebounce);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const fetchSuggestions = async (q) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("خطا در دریافت پیشنهادات");
      const data = await res.json();
      setSuggestions(data.slice(0, 6)); // فقط ۶ تا پیشنهاد اول را نشان بده
    } catch (error) {
      console.error("خطا:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      router.push(`/component/home/searchpage?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSuggestionClick = (name) => {
    router.push(`/component/home/searchpage?q=${encodeURIComponent(name)}`);
    setSuggestions([]);
    setSearchQuery(name);
  };

  return (
    <div className="relative sm:hidden w-full max-w-md mx-auto mt-6">
      <form onSubmit={handleSearch}>
        <motion.div
          className={`relative transition-all duration-300 ease-in-out ${
            searchFocused
              ? "ring-2 ring-blue-500 shadow-lg"
              : "ring-1 shadow-md bg-white ring-gray-200"
          } rounded-full`}
          layout
        >
          {/* آیکن جستجو */}
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <FaSearch
              className={`h-5 w-5 transition-colors ${
                searchFocused ? "text-blue-500" : "text-gray-400"
              }`}
            />
          </div>

          {/* فیلد جستجو */}
          <input
            type="text"
            placeholder="جستجو محصولات..."
            className="w-full pr-10 pl-5 py-2.5 border-0 bg-transparent focus:outline-none rounded-full placeholder-gray-400 text-gray-700"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 200)} // کمی تاخیر برای انتخاب پیشنهاد
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* دکمه پاک کردن */}
          {searchQuery && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery("")}
              aria-label="پاک کردن جستجو"
            >
              ✕
            </motion.button>
          )}
        </motion.div>
      </form>

      {/* نمایش پیشنهادات */}
      <AnimatePresence>
        {searchFocused && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto"
          >
            {loading && (
              <li className="p-3 text-gray-500 text-center">در حال جستجو...</li>
            )}
            {!loading &&
              suggestions.map((item) => (
                <li
                  key={item._id}
                  className="p-3 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => handleSuggestionClick(item.name)}
                >
                  {item.name}
                </li>
              ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
