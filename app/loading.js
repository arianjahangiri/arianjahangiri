const Loading = () => {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="relative flex justify-center items-center">
          <div className="w-24 h-24 border-8 border-t-transparent border-white rounded-full animate-spin"></div>
          <span className="absolute text-2xl font-bold">🔄</span>
        </div>
        <p className="mt-6 text-2xl font-extrabold animate-pulse">لطفاً منتظر بمانید...</p>
      </div>
    );
  };
  
  export default Loading;