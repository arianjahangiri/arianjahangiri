"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [imageProfile, setImageProfile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState(1);
  const [resendTimer, setResendTimer] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const router = useRouter();

  // Timer for OTP resend functionality
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Alert auto-hide effect
  useEffect(() => {
    if (error || success) {
      setShowAlert(true);
      const timer = setTimeout(() => setShowAlert(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageProfile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (name.trim().length < 3 || name.trim().length > 30) {
      return setError("نام و نام خانوادگی باید بین 3 تا 30 کاراکتر باشد.");
    }

    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return setError("شماره تلفن وارد شده معتبر نیست.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, type: "register" }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        return setError(data.message || "خطا سمت سرور");
      }

      setSuccess("کد تایید برای شما ارسال شد.");
      setStep(2);
      setResendTimer(120);
    } catch {
      setError("مشکل در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and register
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      return setError("کد باید ۶ رقمی باشد.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("code", otp);
    if (imageProfile) formData.append("Image_profile", imageProfile);

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (!res.ok) {
        return setError(data.message || "ثبت‌نام با خطا مواجه شد");
      }

      setSuccess("ثبت‌نام موفقیت آمیز بود! به صفحه اصلی منتقل می‌شوید...");
      setTimeout(() => router.push("/"), 2000);
    } catch {
      setError("مشکل در اتصال به سرور");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setOtp("");
    setError("");
    await handleSendOtp({ preventDefault: () => {} });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-300 rounded-full animate-float-delayed opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-pink-300 rounded-full animate-float-slow opacity-50"></div>
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-lg transform transition-all duration-500 ease-out animate-fadeInUp">
        
        {/* Register card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/25">
          
          {/* Header */}
          <div className="text-center mb-8 animate-slideDown">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-6 shadow-2xl animate-pulse-glow">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 animate-glow">
              {step === 1 ? "ثبت نام" : "تایید حساب"}
            </h1>
            <p className="text-gray-300 text-sm opacity-80">
              {step === 1 
                ? "اطلاعات خود را برای ایجاد حساب وارد کنید" 
                : "کد ارسال شده به شماره شما را وارد نمایید"}
            </p>

            {/* Progress indicator */}
            <div className="flex items-center justify-center mt-6 space-x-2">
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-purple-500 scale-110' : 'bg-gray-500'}`}></div>
              <div className={`w-8 h-1 rounded transition-all duration-300 ${step >= 2 ? 'bg-purple-500' : 'bg-gray-500'}`}></div>
              <div className={`w-3 h-3 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-purple-500 scale-110' : 'bg-gray-500'}`}></div>
            </div>
          </div>

          {/* Alert messages */}
          {(error || success) && (
            <div className={`mb-6 transform transition-all duration-500 ${showAlert ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 animate-shake">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/20 border border-green-400/30 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 animate-bounce-subtle">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-green-300 text-sm">{success}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Registration form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6 animate-slideInRight">
              
              {/* Profile image upload */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  تصویر پروفایل (اختیاری)
                </label>
                <div className="flex items-center justify-center">
                  <label className="relative cursor-pointer group">
                    <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-400 group-hover:border-purple-400 transition-all duration-300 flex items-center justify-center overflow-hidden bg-white/5 backdrop-blur-sm">
                      {imagePreview ? (
                        <img 
                          src={imagePreview} 
                          alt="پیش نمایش" 
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  نام و نام خانوادگی
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 focus:bg-white/10"
                    placeholder="علی احمدی"
                  />
                </div>
              </div>

              {/* Phone input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  شماره موبایل
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-purple-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 backdrop-blur-sm hover:bg-white/10 focus:bg-white/10"
                    placeholder="09123456789"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 hover:from-purple-700 hover:via-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>در حال ارسال کد...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>ارسال کد تایید</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </button>
            </form>
          )}

          {/* Step 2: OTP verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-slideInLeft">
              
              {/* User info display */}
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="پروفایل" 
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-400"
                    />
                  )}
                  <div>
                    <p className="text-white font-semibold">{name}</p>
                    <p className="text-gray-300 text-sm" dir="ltr">{phone}</p>
                  </div>
                </div>
              </div>

              {/* OTP input */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-200">
                  کد تایید 6 رقمی
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-green-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="6"
                    className="w-full pr-12 pl-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400 text-center text-2xl font-mono tracking-wider backdrop-blur-sm hover:bg-white/10 focus:bg-white/10"
                    placeholder="123456"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 hover:from-green-700 hover:via-emerald-600 hover:to-teal-600 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>در حال تایید...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>تایید و ثبت نام</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Back to step 1 */}
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2 text-gray-300 hover:text-white text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 group"
              >
                <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span>ویرایش اطلاعات</span>
              </button>

              {/* Resend OTP */}
              <div className="text-center pt-4 border-t border-white/10">
                {resendTimer > 0 ? (
                  <div className="text-gray-400 text-sm flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>ارسال مجدد کد در {resendTimer} ثانیه</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-purple-400 hover:text-purple-300 text-sm font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ارسال مجدد کد تایید
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-gradient-to-r from-transparent via-indigo-900 to-transparent text-gray-300 text-sm">
                یا
              </span>
            </div>
          </div>

          {/* Login link */}
          <div className="text-center animate-fadeIn">
            <p className="text-gray-300 text-sm">
              قبلاً ثبت نام کرده‌اید؟{" "}
              <Link 
                href="/auth/login"
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-bold hover:from-purple-300 hover:to-pink-300 transition-all duration-200 transform hover:scale-105 inline-block"
              >
                وارد شوید
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        @keyframes glow {
          0%, 100% { 
            text-shadow: 0 0 5px rgba(168, 85, 247, 0.5);
          }
          50% { 
            text-shadow: 0 0 20px rgba(168, 85, 247, 0.8);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
          }
          50% { 
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.8);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
        .animate-slideDown { animation: slideDown 0.5s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.5s ease-out; }
        .animate-slideInLeft { animation: slideInLeft 0.5s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out; }
        .animate-bounce-subtle { animation: bounce-subtle 1s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
