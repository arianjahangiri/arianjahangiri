"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import NavSection from "./navSection/nav";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "پنل ادمین",
  description: "Admin panel for managing products and categories",
};

export default function RootLayout({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-gray-800 p-4">
          {loading ? (
            <div className="space-y-4">
              <Skeleton height={40} borderRadius={8} />
              <Skeleton height={40} borderRadius={8} />
              <Skeleton height={40} borderRadius={8} />
            </div>
          ) : (
            <NavSection />
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-gray-950 p-4 md:p-8 rounded-t-3xl md:rounded-l-3xl overflow-auto">
          {loading ? (
            <div className="space-y-6">
              <Skeleton height={50} width="50%" />
              <Skeleton count={6} height={40} />
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
