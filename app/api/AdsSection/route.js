 
import { NextResponse } from "next/server";
 
import { put } from "@vercel/blob";
import connect from "@/app/utils/db";
import Ads from "@/app/modls/AdesSection/Ads";

// GET: گرفتن لیست اسلایدشوها
export async function GET() {
  await connect();

  try {
    const Adses = await Ads.find({});
    return NextResponse.json(Adses, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در دریافت اسلایدشوها" }, { status: 500 });
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
      return NextResponse.json({ success: false, message: "آپلود تصویر الزامی است" }, { status: 400 });
    }

    if (!name || name.trim() === "" || name.length < 3 || name.length > 30) {
      return NextResponse.json({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }, { status: 400 });
    }

    const validUrlLink = UrlLink && UrlLink.trim() !== "" ? UrlLink : null;
    const buffer = Buffer.from(await file.arrayBuffer());

    const blob = await put(`ads/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    });

    await connect();

    const newAd = await Ads.create({
      name,
      UrlLink: validUrlLink,
      imageUrl: blob.url,
    });

    return NextResponse.json(newAd, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
