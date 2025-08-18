"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, 
  FaTimes, 
  FaHistory, 
  FaFire, 
  FaShoppingBag, 
  FaStar,
  FaArrowLeft,
  FaFilter,
  FaMicrophone,
  FaCamera
} from "react-icons/fa";
import { 
  HiSparkles, 
  HiLightningBolt, 
  HiTrendingUp,
  HiGift,
  HiHeart
} from "react-icons/hi";
import { debounce } from "lodash";

// Enhanced Animation Variants
const searchContainerVariants = {
  idle: {
    scale: 1,
    boxShadow: "0 4px 20px rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(107, 114, 128, 0.3)"
  },
  focused: {
    scale: 1.02,
    boxShadow: "0 8px 40px rgba(59, 130, 246, 0.25)",
    borderColor: "rgba(59, 130, 246, 0.5)",
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  searching: {
    scale: 1.01,
    boxShadow: "0 6px 30px rgba(139, 92, 246, 0.2)",
    borderColor: "rgba(139, 92, 246, 0.4)"
  }
};

const suggestionContainerVariants = {
  hidden: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    filter: "blur(4px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    filter: "blur(2px)",
    transition: {
      duration: 0.2
    }
  }
};

const suggestionItemVariants = {
  hidden: { 
    opacity: 0, 
    x: -20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const inputGlowVariants = {
  idle: {
    boxShadow: "0 0 0 0 rgba(59, 130, 246, 0)"
  },
  focused: {
    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.2)"
  }
};

const floatingElementVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const SearchBar = ({
  variant = "default",
  size = "md",
  placeholder = "جستجو در بیش از 10,000 محصول...",
  showSuggestions = true,
  onSearch,
  onFocus,
  onBlur,
  className = "",
  disabled = false,
  showVoiceSearch = true,
  showImageSearch = true,
  showFilters = true
}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const [recentSearches] = useState([
    "گوشی موبایل سامسونگ",
    "لپ تاپ گیمینگ ایسوس", 
    "هدفون بی‌سیم سونی",
    "ساعت هوشمند اپل",
    "تبلت هوآوی",
    "کیبورد مکانیکی"
  ]);

  const [trendingSearches] = useState([
    { title: "آیفون ۱۵ پرو", trend: "+125%", hot: true },
    { title: "پلی استیشن ۵", trend: "+89%", hot: true },
    { title: "ایرپاد پرو", trend: "+67%", hot: false },
    { title: "مک بوک ایر", trend: "+45%", hot: false }
  ]);

  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const suggestionRefs = useRef([]);

  // Advanced debounced search with realistic simulation
  const debouncedSearch = useCallback(
    debounce(async (searchTerm) => {
      if (!searchTerm.trim() || !showSuggestions) return;
      
      setLoading(true);
      try {
        // Simulate realistic API delay
        await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 200));
        
        // Enhanced mock suggestions with more realistic data
        const categories = ["موبایل", "لپ‌تاپ", "هدفون", "ساعت", "تبلت", "کیبورد", "ماوس", "مانیتور"];
        const brands = ["سامسونگ", "اپل", "سونی", "ایسوس", "هوآوی", "شیائومی"];
        
        const mockSuggestions = Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          title: `${searchTerm} ${brands[Math.floor(Math.random() * brands.length)]}`,
          category: categories[Math.floor(Math.random() * categories.length)],
          popular: Math.random() > 0.7,
          discount: Math.random() > 0.6 ? Math.floor(Math.random() * 50) + 10 : null,
          new: Math.random() > 0.8,
          rating: Math.random() > 0.5 ? (4 + Math.random()).toFixed(1) : null,
          price: Math.floor(Math.random() * 5000000) + 500000,
          image: `/api/placeholder/40/40?text=${encodeURIComponent(searchTerm)}`
        }));
        
        setSuggestions(mockSuggestions);
      } catch (error) {
        console.error("Search error:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350),
    [showSuggestions]
  );

  // Mouse tracking for dynamic effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    if (isFocused) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [isFocused]);

  useEffect(() => {
    if (query) {
      debouncedSearch(query);
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, [query, debouncedSearch]);

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      const totalItems = (query ? suggestions.length : recentSearches.length);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => prev < totalItems - 1 ? prev + 1 : 0);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : totalItems - 1);
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            const item = query ? suggestions[selectedIndex] : { title: recentSearches[selectedIndex] };
            if (item) {
              handleSuggestionClick(item);
            }
          } else if (query.trim()) {
            handleSearch();
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
        case "Tab":
          if (selectedIndex >= 0) {
            e.preventDefault();
            const item = query ? suggestions[selectedIndex] : { title: recentSearches[selectedIndex] };
            if (item) {
              setQuery(item.title);
            }
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, suggestions, query, recentSearches]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll selected item
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [selectedIndex]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (showSuggestions) {
      setIsOpen(true);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(showSuggestions);
    onFocus?.();
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      onBlur?.();
    }, 200);
  };

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query.trim());
      setIsOpen(false);
      setSelectedIndex(-1);
      // Add to recent searches
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    onSearch?.(suggestion.title);
    setIsOpen(false);
    setSelectedIndex(-1);
    setIsFocused(false);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleVoiceSearch = () => {
    setIsVoiceActive(!isVoiceActive);
    // Voice search implementation would go here
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-10 text-sm";
      case "lg":
        return "h-16 text-lg";
      default:
        return "h-12 text-base";
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "dark":
        return "bg-gray-800/90 border-gray-600/50 text-white placeholder-gray-400";
      case "glass":
        return "bg-white/10 border-white/20 text-white placeholder-white/60 backdrop-blur-xl";
      default:
        return "bg-white border-gray-200 text-gray-900 placeholder-gray-500";
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <div ref={containerRef} className="relative w-full group">
      {/* Enhanced floating background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-32 h-32 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            top: "-20%",
            left: `${mousePosition.x * 0.1}%`,
          }}
          variants={floatingElementVariants}
          animate="animate"
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            bottom: "-20%",
            right: `${mousePosition.y * 0.1}%`,
          }}
          variants={floatingElementVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />
        <motion.div
          className="absolute w-16 h-16 rounded-full opacity-5"
          style={{
            background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
            top: "50%",
            right: `${mousePosition.x * 0.05}%`,
          }}
          variants={floatingElementVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
      </div>

      {/* Main search container */}
      <motion.div
        variants={searchContainerVariants}
        animate={isFocused ? "focused" : loading ? "searching" : "idle"}
        className="relative z-10"
      >
        <motion.div
          variants={inputGlowVariants}
          animate={isFocused ? "focused" : "idle"}
          className={`
            relative flex items-center rounded-2xl border-2 transition-all duration-300 overflow-hidden
            ${getSizeClasses()} ${getVariantClasses()} ${className}
            ${isFocused ? 'ring-4 ring-blue-500/20' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}
            backdrop-blur-sm
          `}
        >
          {/* Animated gradient border */}
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: `linear-gradient(${mousePosition.x * 3.6}deg, 
                rgba(59, 130, 246, 0.1) 0%, 
                rgba(139, 92, 246, 0.1) 50%, 
                rgba(59, 130, 246, 0.1) 100%)`
            }}
            animate={{
              background: isFocused ? [
                `linear-gradient(0deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)`,
                `linear-gradient(90deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)`,
                `linear-gradient(180deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)`,
                `linear-gradient(270deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)`,
                `linear-gradient(360deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)`
              ] : undefined
            }}
            transition={{ duration: 3, repeat: isFocused ? Infinity : 0 }}
          />

          {/* Search icon with enhanced animation */}
          <div className="flex items-center justify-center w-12 relative z-10">
            <motion.div
              animate={{ 
                rotate: loading ? 360 : 0,
                scale: loading ? [1, 0.8, 1] : isFocused ? 1.1 : 1,
                color: isFocused ? "#3b82f6" : undefined
              }}
              transition={{ 
                rotate: { duration: 1, repeat: loading ? Infinity : 0, ease: "linear" },
                scale: { duration: 0.3 },
                color: { duration: 0.3 }
              }}
            >
              <FaSearch className={`w-4 h-4 transition-colors duration-300 ${
                variant === "dark" || variant === "glass" 
                  ? isFocused ? "text-blue-400" : "text-gray-400"
                  : isFocused ? "text-blue-500" : "text-gray-500"
              }`} />
            </motion.div>
          </div>

          {/* Enhanced input field */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            dir="rtl"
            className={`
              flex-1 bg-transparent outline-none pr-2 pl-2 relative z-10
              ${disabled ? 'cursor-not-allowed' : ''}
              placeholder:transition-colors placeholder:duration-300
              ${isFocused ? 'placeholder:text-blue-400/60' : ''}
            `}
            autoComplete="off"
            spellCheck="false"
          />

          {/* Enhanced action buttons */}
          <div className="flex items-center gap-1 pl-2 relative z-10">
            {/* Voice search button */}
            {showVoiceSearch && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleVoiceSearch}
                className={`
                  p-2 rounded-xl transition-all duration-300
                  ${isVoiceActive 
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30" 
                    : variant === "dark" || variant === "glass"
                      ? "hover:bg-white/10 text-gray-400 hover:text-gray-300"
                      : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  }
                `}
                title="جستجوی صوتی"
              >
                <motion.div
                  animate={isVoiceActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isVoiceActive ? Infinity : 0 }}
                >
                  <FaMicrophone className="w-3 h-3" />
                </motion.div>
              </motion.button>
            )}

            {/* Image search button */}
            {showImageSearch && (
              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  p-2 rounded-xl transition-all duration-300
                  ${variant === "dark" || variant === "glass"
                    ? "hover:bg-white/10 text-gray-400 hover:text-gray-300"
                    : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  }
                `}
                title="جستجو با عکس"
              >
                <FaCamera className="w-3 h-3" />
              </motion.button>
            )}

            {/* Filters button */}
            {showFilters && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`
                  p-2 rounded-xl transition-all duration-300
                  ${variant === "dark" || variant === "glass"
                    ? "hover:bg-white/10 text-gray-400 hover:text-gray-300"
                    : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                  }
                `}
                title="فیلترها"
              >
                <FaFilter className="w-3 h-3" />
              </motion.button>
            )}

            {/* Loading indicator */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="flex items-center justify-center w-8 h-8"
                >
                  <motion.div
                    className="w-4 h-4 border-2 rounded-full"
                    style={{
                      borderColor: variant === "dark" ? "#3b82f6" : "#3b82f6",
                      borderTopColor: "transparent"
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clear button */}
            <AnimatePresence>
              {query && !loading && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className={`
                    p-1.5 rounded-full transition-all duration-300
                    ${variant === "dark" || variant === "glass"
                      ? "hover:bg-white/10 text-gray-400 hover:text-gray-300"
                      : "hover:bg-gray-100 text-gray-400 hover:text-gray-600"
                    }
                  `}
                  title="پاک کردن"
                >
                  <FaTimes className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Enhanced search button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 8px 25px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={!query.trim() || disabled}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all duration-300 relative overflow-hidden
                ${query.trim() && !disabled
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  : variant === "dark" || variant === "glass"
                    ? "bg-gray-700/50 text-gray-500"
                    : "bg-gray-100 text-gray-400"
                }
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {query.trim() && !disabled && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                جستجو
                <FaArrowLeft className="w-3 h-3" />
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced suggestions dropdown */}
        <AnimatePresence>
          {isOpen && showSuggestions && (
            <motion.div
              variants={suggestionContainerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`
                absolute top-full left-0 right-0 mt-3 rounded-2xl border shadow-2xl z-50 max-h-96 overflow-hidden
                ${variant === "dark" || variant === "glass"
                  ? "bg-gray-800/95 border-gray-600/50 backdrop-blur-xl"
                  : "bg-white/95 border-gray-200 backdrop-blur-xl"
                }
              `}
            >
              {/* Animated header gradient */}
              <motion.div
                className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />

              <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                {/* Trending searches */}
                {!query && (
                  <div className="mb-4">
                    <motion.div
                      variants={suggestionItemVariants}
                      className={`
                        flex items-center gap-2 text-xs font-medium mb-3 px-3 py-2
                        ${variant === "dark" || variant === "glass" ? "text-gray-400" : "text-gray-500"}
                      `}
                    >
                      <HiTrendingUp className="w-4 h-4 text-orange-500" />
                      <span>جستجوهای پرطرفدار</span>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <FaFire className="w-3 h-3 text-orange-500" />
                      </motion.div>
                    </motion.div>
                    {trendingSearches.map((trend, index) => (
                      <motion.button
                        key={trend.title}
                        ref={el => suggestionRefs.current[index] = el}
                        variants={suggestionItemVariants}
                        whileHover={{ x: 5, scale: 1.02 }}
                        onClick={() => handleSuggestionClick({ title: trend.title })}
                        className={`
                          w-full text-right px-3 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group
                          ${selectedIndex === index
                            ? variant === "dark" || variant === "glass"
                              ? "bg-blue-600/20 text-blue-300"
                              : "bg-blue-50 text-blue-600"
                            : variant === "dark" || variant === "glass"
                              ? "text-gray-300 hover:text-white hover:bg-gray-700/50"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }
                        `}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {trend.hot && (
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <FaFire className="w-3 h-3 text-orange-500" />
                              </motion.div>
                            )}
                            <span className="font-medium">{trend.title}</span>
                          </div>
                          <div className="text-xs mt-1 text-green-500">
                            {trend.trend} افزایش جستجو
                          </div>
                        </div>
                        <FaArrowLeft className={`
                          w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity
                          ${variant === "dark" || variant === "glass" ? "text-gray-400" : "text-gray-500"}
                        `} />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Recent searches */}
                {!query && recentSearches.length > 0 && (
                  <div className="mb-4">
                    <motion.div
                      variants={suggestionItemVariants}
                      className={`
                        flex items-center gap-2 text-xs font-medium mb-3 px-3 py-2
                        ${variant === "dark" || variant === "glass" ? "text-gray-400" : "text-gray-500"}
                      `}
                    >
                      <FaHistory className="w-3 h-3" />
                      <span>جستجوهای اخیر</span>
                    </motion.div>
                    {recentSearches.slice(0, 4).map((search, index) => (
                      <motion.button
                        key={search}
                        ref={el => suggestionRefs.current[index + trendingSearches.length] = el}
                        variants={suggestionItemVariants}
                        whileHover={{ x: 5 }}
                        onClick={() => handleSuggestionClick({ title: search })}
                        className={`
                          w-full text-right px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between group
                          ${selectedIndex === index + trendingSearches.length
                            ? variant === "dark" || variant === "glass"
                              ? "bg-blue-600/20 text-blue-300"
                              : "bg-blue-50 text-blue-600"
                            : variant === "dark" || variant === "glass"
                              ? "text-gray-300 hover:text-white hover:bg-gray-700/30"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                          }
                        `}
                      >
                        <span>{search}</span>
                        <FaArrowLeft className={`
                          w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity
                          ${variant === "dark" || variant === "glass" ? "text-gray-400" : "text-gray-500"}
                        `} />
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Search suggestions */}
                {query && suggestions.length > 0 && (
                  <div>
                    <motion.div
                      variants={suggestionItemVariants}
                      className={`
                        flex items-center gap-2 text-xs font-medium mb-3 px-3 py-2
                        ${variant === "dark" || variant === "glass" ? "text-gray-400" : "text-gray-500"}
                      `}
                    >
                      <HiSparkles className="w-3 h-3 text-blue-500" />
                      <span>پیشنهادات برای شما</span>
                      <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
                        {suggestions.length}
                      </span>
                    </motion.div>
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion.id}
                        ref={el => suggestionRefs.current[index] = el}
                        variants={suggestionItemVariants}
                        whileHover={{ x: 5, scale: 1.01 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`
                          w-full text-right px-3 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 group
                          ${selectedIndex === index
                            ? variant === "dark" || variant === "glass"
                              ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                              : "bg-blue-50 text-blue-600 border border-blue-200"
                            : variant === "dark" || variant === "glass"
                              ? "text-gray-300 hover:text-white hover:bg-gray-700/50 border border-transparent"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-transparent"
                          }
                        `}
                      >
                        {/* Product image placeholder */}
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center">
                          <FaShoppingBag className="w-4 h-4 text-gray-500" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {suggestion.popular && (
                              <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <FaFire className="w-3 h-3 text-orange-500" />
                              </motion.div>
                            )}
                            {suggestion.new && (
                              <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <HiLightningBolt className="w-3 h-3 text-green-500" />
                              </motion.div>
                            )}
                            <span className="font-medium truncate">{suggestion.title}</span>
                          </div>
                          
                          <div className={`
                            text-xs flex items-center gap-3 flex-wrap
                            ${variant === "dark" || variant === "glass" ? "text-gray-500" : "text-gray-400"}
                          `}>
                            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                              {suggestion.category}
                            </span>
                            
                            {suggestion.rating && (
                              <div className="flex items-center gap-1">
                                <FaStar className="w-2 h-2 text-yellow-500" />
                                <span className="text-yellow-600 font-medium">{suggestion.rating}</span>
                              </div>
                            )}
                            
                            {suggestion.discount && (
                              <motion.span
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="bg-red-500 text-white px-2 py-1 rounded-full font-medium"
                              >
                                {suggestion.discount}% تخفیف
                              </motion.span>
                            )}
                          </div>
                          
                          {suggestion.price && (
                            <div className="text-xs mt-1 font-medium text-blue-600">
                              {formatPrice(suggestion.price)}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <FaShoppingBag className={`
                            w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity
                            ${variant === "dark" || variant === "glass" ? "text-gray-400" : "text-gray-500"}
                          `} />
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                          >
                            <HiHeart className="w-3 h-3 text-white" />
                          </motion.div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* No results */}
                {query && !loading && suggestions.length === 0 && (
                  <motion.div
                    variants={suggestionItemVariants}
                    className={`
                      px-4 py-8 text-center
                      ${variant === "dark" || variant === "glass" ? "text-gray-400" : "text-gray-500"}
                    `}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="mb-4"
                    >
                      <FaSearch className="w-8 h-8 mx-auto opacity-30" />
                    </motion.div>
                    <div className="mb-2 font-medium">نتیجه‌ای یافت نشد</div>
                    <div className="text-xs mb-4">
                      برای "<span className="font-medium text-blue-500">{query}</span>" موردی یافت نشد
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm font-medium"
                      onClick={() => setQuery("")}
                    >
                      پاک کردن جستجو
                    </motion.button>
                  </motion.div>
                )}
              </div>

              {/* Enhanced footer */}
              <motion.div
                variants={suggestionItemVariants}
                className={`
                  border-t p-3 text-center text-xs
                  ${variant === "dark" || variant === "glass" 
                    ? "border-gray-700/50 text-gray-500" 
                    : "border-gray-200 text-gray-400"
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>جستجو در بیش از</span>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="font-bold text-blue-500"
                  >
                    10,000
                  </motion.span>
                  <span>محصول</span>
                  <HiGift className="w-3 h-3 text-purple-500" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default SearchBar;
