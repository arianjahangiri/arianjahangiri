import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connect from "@/app/utils/db";
import Favorite from "@/app/modls/favorites/favorites";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// دریافت لیست علاقه‌مندی‌های کاربر
export async function GET() {
  try {
    await connect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    const favorites = await Favorite.find({ userId })
      .populate({
        path: "productId",
        model: "product",
        select: "name price discount imageUrl stock"
      });
    
    const favoriteProducts = favorites.map(fav => fav.productId);
    
    return NextResponse.json({ success: true, favorites: favoriteProducts });
  } catch (error) {
    console.error("خطا در دریافت لیست علاقه‌مندی‌ها:", error);
    return NextResponse.json(
      { success: false, message: "خطا در دریافت لیست علاقه‌مندی‌ها" },
      { status: 500 }
    );
  }
}

// افزودن محصول به علاقه‌مندی‌ها
export async function POST(request) {
  try {
    await connect();
    
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
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
    
    // بررسی اینکه آیا قبلاً به علاقه‌مندی‌ها اضافه شده یا خیر
    const existingFavorite = await Favorite.findOne({ userId, productId });
    
    if (existingFavorite) {
      // اگر قبلاً اضافه شده، آن را حذف می‌کنیم
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return NextResponse.json({ 
        success: true, 
        message: "محصول از لیست علاقه‌مندی‌ها حذف شد",
        isFavorite: false
      });
    } else {
      // اگر قبلاً اضافه نشده، آن را اضافه می‌کنیم
      await Favorite.create({ userId, productId });
      return NextResponse.json({ 
        success: true, 
        message: "محصول به لیست علاقه‌مندی‌ها اضافه شد",
        isFavorite: true
      });
    }
  } catch (error) {
    console.error("خطا در تغییر وضعیت علاقه‌مندی:", error);
    return NextResponse.json(
      { success: false, message: "خطا در تغییر وضعیت علاقه‌مندی" },
      { status: 500 }
    );
  }
}