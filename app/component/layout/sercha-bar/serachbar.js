"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";

export default function SearchBar({
  placeholder = "جستجو...",
  onSearch,
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <motion.div
      animate={focused ? { scale: 1.02 } : { scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`w-full max-w-xl rounded-xl border border-gray-300 dark:border-gray-700 
        bg-white dark:bg-gray-900 flex items-center px-3 py-2 shadow-sm 
        transition-all duration-300 ${className}`}
    >
      {/* آیکون سرچ */}
      <FaSearch
        className={`w-4 h-4 transition-colors duration-300 
          ${focused ? "text-blue-500" : "text-gray-400"}`}
      />

      {/* اینپوت */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        dir="rtl"
        className="flex-1 px-2 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 text-sm sm:text-base"
      />

      {/* دکمه پاک کردن */}
      <AnimatePresence>
        {query && (
          <motion.button
            key="clear"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="پاک کردن"
          >
            <FaTimes className="w-3 h-3 text-gray-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* دکمه جستجو */}
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={handleSearch}
        className={`ml-2 px-3 py-1.5 rounded-lg text-sm font-medium
          ${query
            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"}
        `}
        disabled={!query}
      >
        جستجو
      </motion.button>
    </motion.div>
  );
}
