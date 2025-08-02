"use client";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const SearchBar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim().length > 0) {
      router.push(`/component/searchpage?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative w-full max-w-md mx-auto mt-6"
    >
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
          onBlur={() => setSearchFocused(false)}
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
  );
};

export default SearchBar;
