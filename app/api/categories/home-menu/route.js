 
import categories from "@/app/modls/categories-menu/categories";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connect();
  try {
    const categorie = await categories.find({});
    return NextResponse.json(categorie, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "مشکلی در دریافت دسته‌بندی‌ها رخ داده" }, { status: 500 });
  }
}

export async function POST(request) {
  await connect();
  try {
    const { title, menu_dropdown } = await request.json();
    const newCategory = new categories({ title, menu_dropdown });
    await newCategory.save();
    return new NextResponse(JSON.stringify(newCategory), { status: 201 });
  } catch (err) {
    return new NextResponse("خطا در ایجاد دسته‌بندی: " + err.message, { status: 500 });
  }
}
