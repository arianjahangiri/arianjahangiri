export default function HelloLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4 animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <span className="absolute inset-0 flex items-center justify-center text-blue-500 font-bold text-xl">👋</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-lg font-medium animate-pulse">
          سلام! در حال بارگذاری...
        </p>
      </div>
    </div>
  );
}
