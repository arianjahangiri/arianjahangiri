"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCategories } from "@/app/home/lib/getCategories";
import { FiMenu, FiX, FiHome, FiGrid, FiChevronLeft, FiLoader } from "react-icons/fi";

const SideMenu = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check screen size and redirect if it's laptop or larger
    const checkScreenSize = () => {
      if (window.innerWidth >= 1024) {
        router.push('/');
      }
    };

    // Initial check
    checkScreenSize();
    
    // Add listener for window resize
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [router]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("خطا در دریافت دسته‌ها:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 rtl">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMenu} 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
          <Link href="/" className="text-xl font-bold text-gray-800">
            فروشگاه
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link 
            href="/" 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <FiHome size={20} />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Responsive */}
        <aside 
          className={`bg-white shadow-md z-20 transition-all duration-300 ease-in-out fixed md:relative
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} 
            w-72 h-[calc(100vh-56px)] md:w-64 overflow-y-auto`}
        >
          <div className="p-5">
            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">دسته‌بندی‌ها</h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <FiLoader className="animate-spin mb-2" size={24} />
                <p>در حال بارگذاری...</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {categories.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">هیچ دسته‌بندی یافت نشد</p>
                ) : (
                  categories.map((cat) => (
                    <li key={cat._id}>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all group"
                      >
                        <div className="flex items-center">
                          <FiGrid className="ml-2 text-gray-400 group-hover:text-blue-500" />
                          <span>{cat.title}</span>
                        </div>
                        <FiChevronLeft className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
          
          {/* Footer of sidebar */}
          <div className="mt-auto p-4 border-t text-center text-sm text-gray-500">
            © ۱۴۰۴ تمامی حقوق محفوظ است
          </div>
        </aside>

        {/* Overlay for mobile when menu is open */}
        {isMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={toggleMenu}
            aria-hidden="true"
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h1 className="text-2xl font-bold mb-4">محتوای اصلی</h1>
              <p className="text-gray-600">
                این بخش برای نمایش محتوای اصلی صفحه است. در دستگاه‌های با صفحه بزرگ،
                کاربر به صفحه اصلی هدایت می‌شود.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                  <h3 className="text-lg font-semibold mb-2">عنوان محتوا {item}</h3>
                  <p className="text-gray-600 text-sm">
                    این یک متن نمونه است که برای نمایش در کارت محتوا استفاده می‌شود.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SideMenu;