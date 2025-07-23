import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

 
  if (!token) {
    console.log("🔒 کاربر لاگین نکرده؛ هدایت به /auth/login");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

 
 

 
  if (!token.isAdmin) {
    console.log("🚫 دسترسی ادمین ندارد؛ هدایت به /unauthorize");
    return NextResponse.redirect(new URL("/unauthorize", req.url));
  }

 
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
