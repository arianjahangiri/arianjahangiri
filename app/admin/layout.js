 

import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.min.css';
 
import NavSection from "./navSection/nav";
 
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "پنل ادمین ",
  description: "Admin panel for managing products and categories",
};

 

export default function RootLayout({ children }) {
  return (
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
      <div className="flex min-h-screen">
        
        {/* Sidebar */}
  <NavSection/>

        {/* Main content */}
        <main className="flex-1 bg-gray-950 p-8 overflow-auto rounded-l-3xl">
          {children}
        </main>
      </div>
    </div>
  );
}
