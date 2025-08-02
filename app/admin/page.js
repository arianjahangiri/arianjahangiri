import React from 'react';

const Page = () => {
  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-8 rounded-2xl shadow-2xl max-w-3xl mx-auto mt-10 text-center">
      <h1 className="text-4xl font-extrabold text-white mb-4">
        خوش آمدید به <span className="text-blue-500">پنل مدیریت</span>
      </h1>
      <p className="text-lg text-gray-300 leading-relaxed mb-6">
        از این بخش می‌توانید <span className="text-blue-400 font-semibold">محصولات</span>، 
        <span className="text-blue-400 font-semibold"> دسته‌بندی‌ها</span>، 
        <span className="text-blue-400 font-semibold"> کامنت‌ها</span>، 
        <span className="text-blue-400 font-semibold"> برندها</span>، 
        <span className="text-blue-400 font-semibold"> کدهای تخفیف</span> و 
        <span className="text-blue-400 font-semibold"> بنرهای تبلیغاتی</span> را مدیریت کنید.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-xl p-4 w-40 shadow-md">
          <span className="block text-blue-400 text-xl mb-2">📦</span>
          <p className="text-white">مدیریت محصولات</p>
        </div>
        <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-xl p-4 w-40 shadow-md">
          <span className="block text-blue-400 text-xl mb-2">📂</span>
          <p className="text-white">دسته‌بندی‌ها</p>
        </div>
        <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-xl p-4 w-40 shadow-md">
          <span className="block text-blue-400 text-xl mb-2">💬</span>
          <p className="text-white">کامنت‌ها</p>
        </div>
        <div className="bg-gray-800 hover:bg-gray-700 transition-all duration-300 rounded-xl p-4 w-40 shadow-md">
          <span className="block text-blue-400 text-xl mb-2">🏷️</span>
          <p className="text-white">کدهای تخفیف</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
