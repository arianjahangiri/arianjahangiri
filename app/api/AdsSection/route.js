import connect from "@/app/utils/db";
import { join } from "path";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { NextResponse } from "next/server";
import Ads from "@/app/modls/AdesSection/Ads";

export async function GET(req) {
  await connect();

  try {
    const Adses = await Ads.find({});
    return new Response(JSON.stringify(Adses), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("خطا در دریافت اسلایدشوها:", error);
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

    const validUrlLink = UrlLink ? UrlLink : null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public/uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, file.name);
    await writeFile(filePath, buffer);

    await connect();

    const Asdes = await Ads.create({
      name,
      UrlLink: validUrlLink,
      imageUrl: `/uploads/${file.name}`,
    });

    return new Response(JSON.stringify(Asdes), { status: 200 });
  } catch (error) {
    console.error("خطا در آپلود اسلایدشو:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
