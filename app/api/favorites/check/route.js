import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/app/utils/db";
import Favorite from "@/app/modls/favorites/favorites";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// اضافه کردن متد GET برای حل خطای 405
export async function GET(request) {
  try {
    await connect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, isFavorite: false },
        { status: 200 }
      );
    }
    
    // دریافت productId از پارامترهای URL
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "شناسه محصول الزامی است" },
        { status: 400 }
      );
    }
    
    const userId = session.user.id;
    
    // بررسی وجود محصول در لیست علاقه‌مندی‌ها
    const existingFavorite = await Favorite.findOne({ userId, productId });
    
    return NextResponse.json({ 
      success: true, 
      isFavorite: !!existingFavorite
    });
  } catch (error) {
    console.error("خطا در بررسی وضعیت علاقه‌مندی:", error);
    return NextResponse.json(
      { success: false, message: "خطا در بررسی وضعیت علاقه‌مندی" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, isFavorite: false },
        { status: 200 }
      );
    }
    
    const userId = session.user.id;
    const data = await request.json();
    const { productId } = data;
    
    if (!productId) {
      return NextResponse.json(
        { success: false, message: "شناسه محصول الزامی است" },
        { status: 400 }
      );
    }
    
    // بررسی وجود محصول در لیست علاقه‌مندی‌ها
    const existingFavorite = await Favorite.findOne({ userId, productId });
    
    return NextResponse.json({ 
      success: true, 
      isFavorite: !!existingFavorite
    });
  } catch (error) {
    console.error("خطا در بررسی وضعیت علاقه‌مندی:", error);
    return NextResponse.json(
      { success: false, message: "خطا در بررسی وضعیت علاقه‌مندی" },
      { status: 500 }
    );
  }
}