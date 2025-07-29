 
import connect from "@/app/utils/db";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { NextResponse } from "next/server";
import Brand from "@/app/modls/Brand/Brand";
import { put } from "@vercel/blob";
 
 
 
// GET: گرفتن تمام اسلایدشوها
export async function GET(req) {
  await connect();
 
  try {
    const Brandes = await Brand.find({});
    return new Response(JSON.stringify(Brandes), {
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

    if (!file || typeof file === "string") {
      return NextResponse.json({
        success: false,
        message: "آپلود تصویر الزامی می‌باشد",
      }, { status: 400 });
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return new Response(
        JSON.stringify({ message: "نام برند الزامی می‌باشد" }),
        { status: 400 }
      );
    }

    if (name.length < 3 || name.length > 30) {
      return new Response(
        JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }),
        { status: 400 }
      );
    }

    const validUrlLink = UrlLink ? UrlLink : null;

    // تبدیل فایل به Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // آپلود تصویر روی Vercel Blob
    const blob = await put(`brands/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    });

    await connect();

    // ذخیره اطلاعات برند در دیتابیس
    const newBrand = await Brand.create({
      name,
      UrlLink: validUrlLink,
      imageUrl: blob.url, // لینک CDN Vercel Blob
    });

    return new Response(JSON.stringify(newBrand), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error uploading brand:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}