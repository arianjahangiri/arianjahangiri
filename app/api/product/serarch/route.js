 
import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";
 

export async function GET(req) {
  await connect();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ message: "عبارت جستجو وارد نشده است" }, { status: 400 });
  }

  try {
    const regex = new RegExp(query, "i"); // جستجوی حساس‌نبود به حروف
    const products = await product.find({
      $or: [
        { name: { $regex: regex } },
        { description: { $regex: regex } }, // در صورت نیاز به جستجو در توضیحات
      ],
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در جستجو" }, { status: 500 });
  }
}
