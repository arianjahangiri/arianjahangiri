"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/app/context/cartContext';
import { useSession } from 'next-auth/react';
import Cookies from 'js-cookie';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';


// آیکون‌ها
import { 
  FaEye, FaCartPlus, FaStar, FaRegStar, FaCheck, FaTimes, 
  FaShippingFast, FaBox, FaCreditCard, FaExchangeAlt, FaStore,
  FaAngleLeft, FaAngleRight, FaShare, FaBell, FaHeart, FaRegHeart,
  FaChevronDown, FaChevronUp, FaThumbsUp, FaRegThumbsUp, FaThumbsDown,
     FaInfoCircle, FaClock, FaUser
} from 'react-icons/fa';

 
import Relatedporoduct from '../../home/Relatedporoduct';
import Comments from '../../home/commentesProduct/Commentes';
import FavoriteButton from '../../home/FavoriteButton';

// کامپوننت امتیازدهی
const RatingStars = ({ rating, size = "sm" }) => {
  const stars = [];
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className={`${sizeClass[size]} text-yellow-400`} />);
    } else {
      stars.push(<FaRegStar key={i} className={`${sizeClass[size]} text-gray-300`} />);
    }
  }
  
  return <div className="flex">{stars}</div>;
};

// تب‌های محصول
const ProductTabs = ({ product, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'features', label: 'ویژگی‌ها' },
    { id: 'specs', label: 'مشخصات' },
    { id: 'comments', label: 'نظرات کاربران' },
    { id: 'questions', label: 'پرسش و پاسخ' },
  ];

  return (
    <div className="mb-4 border-b">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-medium whitespace-nowrap transition-all
              ${activeTab === tab.id 
                ? 'text-red-500 border-b-2 border-red-500' 
                : 'text-gray-600 hover:text-gray-900'}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// بخش ویژگی‌های محصول
 
// بخش مشخصات فنی محصول
 
// بخش نظرات کاربران
 

// کامپوننت اصلی صفحه محصول
const ProductDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('features');
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const thumbnailRef = useRef(null);

  useEffect(() => {
    if (!id) {
      router.push('/404');
      return;
    }

    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/404');
            return;
          }
          throw new Error('خطا در دریافت اطلاعات محصول');
        }
        
        const data = await response.json();
        setProduct(data);
        setViewCount(data.views || 0);
        
        // بررسی کوکی برای ثبت بازدید
        handleProductView(data._id);
      } catch (error) {
        console.error('خطا در دریافت اطلاعات محصول:', error);
        toast.error('مشکلی در بارگذاری اطلاعات محصول رخ داد');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id, router]);

  // افزایش تعداد بازدید
  const handleProductView = async (productId) => {
    try {
      // بررسی آیا قبلاً این محصول را دیده است
      const viewedProducts = Cookies.get('viewed_products') 
        ? JSON.parse(Cookies.get('viewed_products')) 
        : [];
      
      // اگر محصول قبلاً دیده نشده، افزایش بازدید
      if (!viewedProducts.includes(productId)) {
        // افزودن به لیست محصولات دیده شده
        viewedProducts.push(productId);
        
        // ذخیره در کوکی
        Cookies.set('viewed_products', JSON.stringify(viewedProducts), { 
          expires: 30,
          sameSite: 'strict'
        });
        
        // ثبت بازدید در سرور
        const response = await fetch(`/api/product/${productId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setViewCount(data.views);
          }
        }
      }
    } catch (error) {
      console.error('خطا در ثبت بازدید محصول:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // اضافه کردن وضعیت loading برای جلوگیری از کلیک‌های متعدد
    setIsAddingToCart(true);
    
    try {
      // اطمینان از اینکه شناسه محصول درست است
      const productToAdd = {
        ...product,
        _id: product._id, // اطمینان از وجود ID
      };
      
      addToCart(productToAdd);
      toast.success('محصول به سبد خرید اضافه شد');
    } catch (error) {
      console.error("خطا در افزودن به سبد خرید:", error);
      toast.error("مشکلی در افزودن محصول به سبد خرید رخ داد");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // تصاویر نمونه برای گالری (در پروژه واقعی از API دریافت می‌شود)
  const productImages = [
    { id: 1, src: product?.imageUrl || '/placeholder.jpg' },
    { id: 2, src: 'https://dkstatics-public.digikala.com/digikala-products/ec9a962187e1f82cc47e7a148ef18974ba8c03a4_1656428037.jpg' },
    { id: 3, src: 'https://dkstatics-public.digikala.com/digikala-products/073800b3b3e6c0c2bae5e9550e50a975f1d987d0_1656428052.jpg' },
    { id: 4, src: 'https://dkstatics-public.digikala.com/digikala-products/8d4c7b0ea0e9b36038e20bb0d7120c0d7c2f177b_1656428069.jpg' }
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">در حال بارگذاری اطلاعات محصول...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-10 px-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-3">محصول مورد نظر یافت نشد!</h2>
          <p className="mb-5">محصول مورد نظر شما در سیستم موجود نمی‌باشد یا حذف شده است.</p>
          <button 
            onClick={() => router.push('/')} 
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  const discountedPrice = product.discount > 0
    ? product.price - (product.price * (product.discount / 100))
    : product.price;

  return (
    <div className="container mx-auto py-6 px-4">
      {/* مسیر دسترسی */}
      <div className="flex items-center text-xs text-gray-500 mb-4 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-blue-600 transition">فروشگاه</Link>
        <FaAngleLeft className="mx-1" />
        
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug || '#'}`} className="hover:text-blue-600 transition">
              {product.category.title || 'دسته‌بندی'}
            </Link>
            <FaAngleLeft className="mx-1" />
          </>
        )}
        
        <span className="text-gray-700 truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* بخش اصلی محصول */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-5">
          {/* بخش گالری تصاویر - ستون اول */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="relative h-[350px] md:h-[450px] bg-white rounded-lg overflow-hidden border mb-4">
                <img
                  src={productImages[selectedImage].src}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                
                {/* نشانگر تخفیف */}
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    {product.discount}% تخفیف
                  </div>
                )}
              </div>
              
              {/* گالری تصاویر کوچک */}
              <div className="relative">
                <div 
                  className="flex gap-2 overflow-x-auto py-2 scrollbar-hide"
                  ref={thumbnailRef}
                >
                  {productImages.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 border-2 rounded-md overflow-hidden
                        ${selectedImage === index ? 'border-blue-500' : 'border-gray-200'}
                      `}
                    >
                      <img 
                        src={image.src} 
                        alt={`تصویر ${index + 1}`}
                        className="w-full h-full object-contain" 
                      />
                    </button>
                  ))}
                </div>
                
                {/* دکمه‌های اسکرول */}
                <button 
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white"
                  onClick={() => thumbnailRef.current.scrollBy({ left: -100, behavior: 'smooth' })}
                >
                  <FaAngleRight className="text-gray-700" />
                </button>
                
                <button 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white/80 p-1 rounded-full shadow-md hover:bg-white"
                  onClick={() => thumbnailRef.current.scrollBy({ left: 100, behavior: 'smooth' })}
                >
                  <FaAngleLeft className="text-gray-700" />
                </button>
              </div>
              
              {/* دکمه‌های اشتراک‌گذاری و... */}
              <div className="flex justify-center gap-6 mt-6 text-gray-500">
                <button className="flex flex-col items-center text-xs hover:text-blue-500 transition">
                  <FaShare className="mb-1 text-lg" />
                  <span>اشتراک‌گذاری</span>
                </button>
                
                <button className="flex flex-col items-center text-xs hover:text-blue-500 transition">
                  <FaBell className="mb-1 text-lg" />
                  <span>اطلاع‌رسانی</span>
                </button>
                
                <button className="flex flex-col items-center text-xs hover:text-red-500 transition">
                  <FavoriteButton productId={product._id} size={20} />
                  <span className="mt-1">علاقه‌مندی</span>
                </button>
              </div>
            </div>
          </div>

          {/* بخش اطلاعات محصول - ستون وسط */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold mb-2 leading-relaxed">{product.name}</h1>
              
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <span>برند: {product.brand || 'نامشخص'}</span>
                <span className="block w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>کد محصول: {product._id.substring(product._id.length - 8)}</span>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <RatingStars rating={4} size="md" />
                <span className="text-sm text-blue-500">(۱۲۰ دیدگاه)</span>
                <span className="text-sm text-gray-500 flex items-center">
                  <FaEye className="ml-1" />
                  {viewCount} بازدید
                </span>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-bold text-lg mb-3">ویژگی‌های برجسته</h3>
                <ul className="space-y-2 pr-5 list-disc marker:text-gray-400">
                  <li>گارانتی اصالت و سلامت فیزیکی کالا</li>
                  <li>{product.description}</li>
                  <li>کیفیت ساخت عالی</li>
                  <li>قابلیت استفاده آسان</li>
                </ul>
              </div>
            </div>
            
            {/* انتخاب رنگ */}
            <div className="border-t border-gray-200 py-4">
              <div className="mb-3 flex justify-between">
                <span className="font-bold">رنگ‌بندی:</span>
                <span className="text-sm text-blue-500">+ ۵ رنگ دیگر</span>
              </div>
              
              <div className="flex gap-3">
                <button className="relative w-12 h-12 rounded-full border-2 border-blue-500 p-0.5">
                  <span className="block w-full h-full rounded-full bg-black"></span>
                  <span className="absolute bottom-[-20px] right-1/2 transform translate-x-1/2 text-xs whitespace-nowrap">مشکی</span>
                </button>
                
                <button className="relative w-12 h-12 rounded-full border-2 border-gray-200 p-0.5">
                  <span className="block w-full h-full rounded-full bg-white"></span>
                  <span className="absolute bottom-[-20px] right-1/2 transform translate-x-1/2 text-xs whitespace-nowrap">سفید</span>
                </button>
                
                <button className="relative w-12 h-12 rounded-full border-2 border-gray-200 p-0.5">
                  <span className="block w-full h-full rounded-full bg-blue-500"></span>
                  <span className="absolute bottom-[-20px] right-1/2 transform translate-x-1/2 text-xs whitespace-nowrap">آبی</span>
                </button>
                
                <button className="relative w-12 h-12 rounded-full border-2 border-gray-200 p-0.5">
                  <span className="block w-full h-full rounded-full bg-red-500"></span>
                  <span className="absolute bottom-[-20px] right-1/2 transform translate-x-1/2 text-xs whitespace-nowrap">قرمز</span>
                </button>
              </div>
            </div>
            
            {/* بخش فروشنده */}
            <div className="bg-gray-50 rounded-lg p-4 mt-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <FaStore className="text-blue-500" size={20} />
                </div>
                <div>
                  <h4 className="font-bold">فروشنده: فروشگاه رسمی</h4>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <div className="flex items-center text-green-600">
                      <FaCheck className="ml-1" size={12} />
                      <span>گارانتی اصالت</span>
                    </div>
                    <span className="block w-1 h-1 bg-gray-300 rounded-full"></span>
                    <div className="flex items-center text-green-600">
                      <FaCheck className="ml-1" size={12} />
                      <span>موجود در انبار</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* بخش قیمت و خرید - ستون سوم */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white rounded-xl border p-4">
              <h3 className="font-bold text-lg border-b pb-3 mb-4">قیمت و خرید</h3>
              
              {/* قیمت و تخفیف */}
              <div className="mb-6">
                {product.discount > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">قیمت اصلی:</span>
                      <span className="line-through text-gray-400">
                        {product.price.toLocaleString()} تومان
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500">قیمت با تخفیف:</span>
                        <span className="mr-2 bg-red-500 text-white text-xs rounded-xl px-2 py-0.5">
                          {product.discount}٪
                        </span>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        {discountedPrice.toLocaleString()} تومان
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">قیمت:</span>
                    <span className="text-xl font-bold">
                      {product.price.toLocaleString()} تومان
                    </span>
                  </div>
                )}
              </div>
              
              {/* وضعیت موجودی */}
              <div className="mb-6">
                <div className={`
                  flex items-center py-2 px-3 rounded-lg
                  ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}
                `}>
                  {product.stock > 0 ? (
                    <>
                      <FaCheck className="ml-2" />
                      <span>موجود در انبار - {product.stock} عدد</span>
                    </>
                  ) : (
                    <>
                      <FaTimes className="ml-2" />
                      <span>ناموجود</span>
                    </>
                  )}
                </div>
              </div>
              
              {/* دکمه خرید */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || isAddingToCart}
                className={`
                  w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-lg
                  ${product.stock > 0 && !isAddingToCart
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'}
                  transition mb-4
                `}
              >
                <FaCartPlus />
                <span>
                  {isAddingToCart ? 'در حال افزودن...' : 'افزودن به سبد خرید'}
                </span>
              </button>
              
              {/* مزایای خرید */}
              <div className="border-t pt-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaShippingFast className="ml-2 text-blue-500" />
                    <span>ارسال سریع</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaBox className="ml-2 text-blue-500" />
                    <span>بسته‌بندی زیبا</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaCreditCard className="ml-2 text-blue-500" />
                    <span>پرداخت امن</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaExchangeAlt className="ml-2 text-blue-500" />
                    <span>ضمانت بازگشت</span>
                  </div>
                </div>
              </div>
              
              {/* بخش اطلاع‌رسانی */}
              <div className="mt-6 bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center text-sm text-blue-700">
                  <FaInfoCircle className="ml-2" />
                  <p>هزینه ارسال برای سفارش‌های بالای ۵۰۰ هزار تومان رایگان است</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* بخش تب‌بندی اطلاعات تکمیلی */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-5 mb-8">
        <ProductTabs product={product} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="mt-2">

          {activeTab === 'comments' && <Comments />}
          {activeTab === 'questions' && (
            <div className="py-8 text-center text-gray-500">
              <p>در حال حاضر پرسش و پاسخی برای این محصول ثبت نشده است</p>
            </div>
          )}
        </div>
      </div>

      {/* محصولات مشابه */}
      <Relatedporoduct/>
    </div>
  );
};

export default ProductDetailPage;