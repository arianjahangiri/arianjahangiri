import connect from "@/app/utils/db";
import Ads from "@/app/modls/AdesSection/Ads";
import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";

// [GET] دریافت یک تبلیغ با آیدی
export async function GET(req, { params }) {
  await connect();
  const { id } = params;

  try {
    const ad = await Ads.findById(id);
    if (!ad) {
      return NextResponse.json({ message: "تبلیغ پیدا نشد" }, { status: 404 });
    }
    return NextResponse.json(ad, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "خطا در دریافت تبلیغ" }, { status: 500 });
  }
}

// [PUT] ویرایش تبلیغ + آپلود به Blob
export async function PUT(request, { params }) {
  await connect();
  const { id } = params;

  try {
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

    // اگر فایل جدید داده شده
    if (file && typeof file.name === "string") {
      const buffer = Buffer.from(await file.arrayBuffer());

      // حذف تصویر قبلی از Blob
      if (ad.imageUrl?.startsWith("https://")) {
        const oldBlobPath = new URL(ad.imageUrl).pathname.slice(1);
        try {
          await del(oldBlobPath);
        } catch (err) {
          console.warn("خطا در حذف تصویر قبلی از Blob:", err);
        }
      }

      // آپلود تصویر جدید
      const blob = await put(`ads/${Date.now()}-${file.name}`, buffer, {
        access: "public",
        contentType: file.type,
      });

      imageUrl = blob.url;
    }

    // بروزرسانی تبلیغ
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

// [DELETE] حذف تبلیغ و تصویر Blob
export async function DELETE(req, { params }) {
  await connect();
  const { id } = params;

  try {
    const deleted = await Ads.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "تبلیغ پیدا نشد" }, { status: 404 });
    }

    if (deleted.imageUrl?.startsWith("https://")) {
      const blobPath = new URL(deleted.imageUrl).pathname.slice(1);
      try {
        await del(blobPath);
      } catch (err) {
        console.warn("حذف تصویر از Blob شکست خورد:", err);
      }
    }

    return NextResponse.json({ message: "تبلیغ با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "خطا در حذف تبلیغ" }, { status: 500 });
  }
}
