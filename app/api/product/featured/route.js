import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";
import categories from "@/app/modls/categories-menu/categories"; // فقط برای ثبت مدل، استفاده از آن لازم نیست

export async function GET() {
  await connect();

  try {
    const featuredProducts = await product.find({})
      .populate({
        path: "category", // باید دقیقا همین باشد
      })
      .sort({ views: -1 })
      .limit(8)
      .select("name price imageUrl category views");

    return NextResponse.json(featuredProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "مشکلی در دریافت محصولات پربازدید رخ داده است",
        detail: error.message,
      },
      { status: 500 }
    );
  }
}