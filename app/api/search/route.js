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

    // جستجو محصولات بر اساس نام
    const searchResults = await product
      .find({
        name: { $regex: query, $options: "i" },
      })
      .populate({
        path: "category",
        model: "categories",
      });

    // اضافه کردن محصولاتی که دسته‌بندی آن‌ها شامل عبارت جستجو باشد
    const categoryResults = await product
      .find({})
      .populate({
        path: "category",
        model: "categories",
      });

    const filteredCategoryResults = categoryResults.filter(
      (item) =>
        item.category &&
        item.category.title.toLowerCase().includes(query.toLowerCase())
    );

    // ادغام نتایج بدون تکرار
    const finalResults = [
      ...searchResults,
      ...filteredCategoryResults.filter(
        (item) => !searchResults.some((p) => p._id.toString() === item._id.toString())
      ),
    ];

    return NextResponse.json(finalResults, { status: 200 });
  } catch (error) {
    console.error("خطا در جستجو:", error);
    return NextResponse.json(
      { error: "خطایی در جستجو رخ داد" },
      { status: 500 }
    );
  }
}
