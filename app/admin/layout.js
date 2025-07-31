 

import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
import Link from "next/link";
import {
  FaBan, FaBox, FaGamepad, FaIndustry, FaInfoCircle, FaList, FaModx,
  FaSlidersH, FaTag, FaUser
} from "react-icons/fa";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing products and categories",
};

const navLinks = [
  { href: "/admin/product/post", icon: FaBox, label: "محصولات" },
  { href: "/categories", icon: FaList, label: "دسته‌بندی‌ها" },
  { href: "/admin/comment/post", icon: FaInfoCircle, label: "کامنت‌ها" },
  { href: "/admin/game", icon: FaGamepad, label: "بازی"},
  { href: "/admin/Brand/post", icon: FaIndustry, label: "برندها" },
  { href: "/admin/discountcode/post", icon: FaTag, label: "کد تخفیف" },
  { href: "/admin/AdsSection/post", icon: FaBan, label: "بنر تبلیغات" },
  { href: "/admin/sliddeShow/post", icon: FaSlidersH, label: "اسلاید شو" },
  { href: "/admin/productList", icon: FaSlidersH, label: "انبار محصولات" },
  { href: "/admin/User/post", icon: FaUser, label: "کاربران" },
  { href: "/admin/categories/Home-menu/post", icon: FaModx, label: "گزینه‌های منو" },
];

export default function RootLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
        <aside className="w-64 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 p-6 shadow-xl">
          <h4 className="text-2xl font-bold text-white mb-10 border-b border-gray-700 pb-4">
            مدیریت فروشگاه
          </h4>
          <nav className="space-y-1">
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-gray-700/70 text-gray-300 hover:text-white no-underline"
              >
                <Icon className="text-lg text-gray-500 transition-colors duration-200 group-hover:text-white" />
                <span className="text-sm font-semibold tracking-wide">{label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-950 p-8 overflow-auto rounded-l-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}
