import owlcarousel from "@/app/modls/owlcarousel/owlcarousel";
import connect from "@/app/utils/db";

import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connect();

  try {
    const slideshows = await owlcarousel.find({});
    return new Response(JSON.stringify(slideshows), {
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

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("imageUrl");
    const name = data.get("name");
    const UrlLink = data.get("UrlLink");

    // اعتبارسنجی
    if (!file || typeof file === "string") {
      return NextResponse.json({
        success: false,
        message: "آپلود تصویر الزامی می‌باشد",
      }, { status: 400 });
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

    // تبدیل فایل به buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // آپلود به Vercel Blob
    const blob = await put(`owl-carousel/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    });

    // اتصال به دیتابیس و ذخیره سند
    await connect();

    const product = await owlcarousel.create({
      name,
      UrlLink,
      imageUrl: blob.url, // لینک مستقیم تصویر روی CDN
    });

    return new Response(JSON.stringify(product), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error uploading slideshow:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
