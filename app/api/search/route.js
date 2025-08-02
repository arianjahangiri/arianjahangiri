import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "پارامتر جستجو الزامی است" },
        { status: 400 }
      );
    }

    // مرحله ۱: جستجو در نام محصول
    const productsByName = await product
      .find({
        name: { $regex: query, $options: "i" }, // insensitive
      })
      .populate("category");

    // مرحله ۲: همه محصولات برای فیلتر دسته‌بندی
    const allProducts = await product.find({}).populate("category");

    // فیلتر محصولاتی که دسته‌بندی شامل عبارت جستجو باشد
    const productsByCategory = allProducts.filter(
      (item) =>
        item.category &&
        item.category.title &&
        item.category.title.toLowerCase().includes(query.toLowerCase())
    );

    // ادغام نتایج بدون تکرار
    const mergedResults = [
      ...productsByName,
      ...productsByCategory.filter(
        (item) =>
          !productsByName.some((p) => p._id.toString() === item._id.toString())
      ),
    ];

    return NextResponse.json(mergedResults, { status: 200 });
  } catch (error) {
    console.error("خطا در جستجو:", error);
    return NextResponse.json(
      { error: "خطایی در جستجو رخ داد" },
      { status: 500 }
    );
  }
}
