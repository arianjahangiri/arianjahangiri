import connect from "@/app/utils/db";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import { NextResponse } from "next/server";
import Ads from "@/app/modls/AdesSection/Ads";

export async function GET(req, { params }) {
  await connect();
  const { id } = params;

  try {
    const ad = await Ads.findById(id);
    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در دریافت تبلیغ" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    await connect();

    const data = await request.formData();
    const name = data.get("name");
    const UrlLink = data.get("UrlLink");
    const file = data.get("image");

    const ad = await Ads.findById(id);
    if (!ad) {
      return NextResponse.json({ message: "تبلیغ پیدا نشد" }, { status: 404 });
    }

    if (!name || name.length < 3 || name.length > 30) {
      return NextResponse.json({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }, { status: 400 });
    }

    let imageUrl = ad.imageUrl;

    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), "public/uploads");
      const filePath = join(uploadDir, file.name);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${file.name}`;

      // حذف تصویر قبلی
      if (ad.imageUrl) {
        const oldPath = join(process.cwd(), "public", ad.imageUrl);
        await unlink(oldPath).catch(() => console.warn("حذف تصویر قبلی ناموفق بود"));
      }
    }

    const updated = await Ads.findByIdAndUpdate(
      id,
      { name, UrlLink, imageUrl },
      { new: true }
    );

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "خطا در ویرایش تبلیغ" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connect();
  try {
    const { id } = params;
    const deleted = await Ads.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "تبلیغ پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json({ message: "تبلیغ با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در حذف تبلیغ" }, { status: 500 });
  }
}
