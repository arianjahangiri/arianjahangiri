import categories from "@/app/modls/categories-menu/categories";
import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "پارامتر جستجو الزامی است" }, { status: 400 });
    }

    // ابتدا دسته‌بندی‌هایی که با کوئری مطابقت دارند را پیدا می‌کنیم
    const matchingCategories = await categories.find({
      title: { $regex: query, $options: "i" }
    });

    // استخراج ObjectId دسته‌بندی‌ها
    const categoryIds = matchingCategories.map(category => category._id);

    // جستجو برای محصولات که یا نامشان با کوئری مطابقت دارد یا در دسته‌بندی‌های مطابقت دار قرار دارند
    const searchResults = await product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $in: categoryIds } }
      ]
    }).populate({
      path: "category",
      model: "categories"
    }).lean();

    // حذف تکراری‌ها در صورتی که محصولی هم در نام و هم در دسته‌بندی مطابقت داشته باشد
    const uniqueResults = [];
    const seenIds = new Set();
    
    searchResults.forEach(result => {
      if (!seenIds.has(result._id.toString())) {
        seenIds.add(result._id.toString());
        uniqueResults.push(result);
      }
    });
 
    return NextResponse.json(uniqueResults, { status: 200 });
  } catch (error) {
    console.error("خطا در جستجو:", error);
    return NextResponse.json({ error: "خطایی در جستجو رخ داد" }, { status: 500 });
  }
  }
