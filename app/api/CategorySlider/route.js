 
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { NextResponse } from "next/server";
 
import CategorySlider from "@/app/modls/CategorySlider/CategorySlider";
import { put } from "@vercel/blob";
import connect from "@/app/utils/db";
 
 
 
// GET: گرفتن تمام اسلایدشوها
export async function GET(req) {
  await connect();
 
  try {
    const categoryslider = await CategorySlider.find({});
    return new Response(JSON.stringify(categoryslider), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching categoryslider:", error);
    return new Response(
      JSON.stringify({ error: "خطا در دریافت  اسلایدر های دسته بندی " }),
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
      return new Response(JSON.stringify({ message: "آپلود تصویر الزامی است" }), { status: 400 });
    }

    if (!name || typeof name !== "string" || name.trim() === "") {
      return new Response(JSON.stringify({ message: "نام محصول الزامی است" }), { status: 400 });
    }

    if (name.length < 3 || name.length > 30) {
      return new Response(JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }), { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // آپلود فایل روی Vercel Blob
    const blob = await put(`slider/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    });

    await connect();

    const newSlider = await CategorySlider.create({
      name,
      UrlLink: UrlLink || null,
      imageUrl: blob.url, // لینک آنلاین تصویر
    });

    return new Response(JSON.stringify(newSlider), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}