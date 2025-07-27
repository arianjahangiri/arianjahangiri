 
import connect from "@/app/utils/db";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { NextResponse } from "next/server";
import Ads from "@/app/modls/AdesSection/Ads";

// GET: گرفتن تمام اسلایدشوها
export async function GET(req) {
  await connect();

  try {
    const Adses = await Ads.find({});
    return new Response(JSON.stringify(Adses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching slideshows:", error);
    return new Response(
      JSON.stringify({ error: "خطا در دریافت اسلایدشوها" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// POST: افزودن اسلایدشو جدید
export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("imageUrl");
    const name = data.get("name");
    const UrlLink = data.get("UrlLink");

    if (!file) {
      return NextResponse.json({
        success: false,
        message: "آپلود تصویر الزامی می‌باشد",
      });
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return new Response(
        JSON.stringify({ message: "نام محصول الزامی می‌باشد" }),
        { status: 400 }
      );
    }

    if (name.length < 3 || name.length > 30) {
      return new Response(
        JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }),
        { status: 400 }
      );
    }

    // اگر UrlLink موجود نیست، از یک مقدار پیش‌فرض استفاده کنید
    const validUrlLink = UrlLink ? UrlLink : null;

    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // مسیر ذخیره‌سازی فایل
    const uploadDir = join(process.cwd(), "public/uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // مسیر ذخیره‌سازی فایل + نام فایل
    const filePath = join(uploadDir, file.name);
    
    // ذخیره فایل در مسیر مشخص شده
    await writeFile(filePath, buffer);

    // اتصال به دیتابیس
    await connect();

    // ذخیره در دیتابیس
    const Asdes = await Ads.create({
      name,
      UrlLink: validUrlLink, // ذخیره UrlLink فقط اگر موجود باشد
      imageUrl: `/uploads/${file.name}`, // مسیر فایل ذخیره‌شده
    });

    return new Response(JSON.stringify(Asdes), { status: 200 });
  } catch (error) {
    console.error("Error uploading slideshow:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
