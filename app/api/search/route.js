import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // برقراری اتصال به دیتابیس
    await connect();
    
    // دریافت پارامتر جستجو از URL
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    // بررسی وجود پارامتر جستجو
    if (!query) {
      return NextResponse.json(
        { error: "پارامتر جستجو الزامی است" }, 
        { status: 400 }
      );
    }
    
    // جستجوی محصولات با حساسیت به حروف نداشتن (case-insensitive)
    const searchResults = await product.find({
      name: { $regex: query, $options: 'i' }
    });
    
    // برگرداندن نتایج جستجو
    return NextResponse.json(searchResults, { status: 200 });
  } catch (error) {
    console.error("خطا در جستجو:", error);
    return NextResponse.json(
      { error: "خطایی در جستجو رخ داد" }, 
      { status: 500 }
    );
  }
}
