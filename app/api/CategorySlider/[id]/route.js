 
import CategorySlider from "@/app/modls/CategorySlider/CategorySlider";
import connect from "@/app/utils/db";
 
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  try {
    await connect();

    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "شناسه معتبر نیست" }, { status: 400 });
    }

    // 1. پیدا کردن اسلایدر برای به‌دست آوردن URL تصویر
    const slider = await CategorySlider.findById(id);
    if (!slider) {
      return NextResponse.json({ message: "اسلایدر یافت نشد" }, { status: 404 });
    }

    const imageUrl = slider.image; // فرض بر اینه که فیلد image وجود داره و آدرس blob رو نگه می‌داره

    // 2. حذف از دیتابیس
    const deleted = await CategorySlider.findByIdAndDelete(id);

    // 3. حذف فایل blob از Vercel
    if (imageUrl) {
      const blobUrl = new URL(imageUrl);
      const blobPath = blobUrl.pathname; // مثلاً: "/my-app/slider/12345.png"

      await del(blobPath, {
        token: BLOB_READ_WRITE_TOKEN,
      });
    }

    return NextResponse.json({ message: "اسلایدر و تصویر با موفقیت حذف شدند", deleted }, { status: 200 });

  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ message: "خطا در حذف اسلایدر" }, { status: 500 });
  }
}
const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;  // توکن رو از ENV می‌گیریم

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ message: "شناسه معتبر نیست" }, { status: 400 });
    }

    await connect();

    const data = await request.formData();
    const name = data.get("name");
    const UrlLink = data.get("UrlLink");
    const file = data.get("imageUrl");

    const slider = await CategorySlider.findById(id);
    if (!slider) {
      return NextResponse.json({ message: "اسلایدر یافت نشد" }, { status: 404 });
    }

    if (!name || typeof name !== "string" || name.trim().length < 3 || name.trim().length > 30) {
      return NextResponse.json({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }, { status: 400 });
    }

    let imageUrl = slider.imageUrl;

    if (file && typeof file !== "string" && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const blob = await put(
        `slider/${Date.now()}-${file.name}`,
        buffer,
        {
          access: "public",
          contentType: file.type,
          token: BLOB_READ_WRITE_TOKEN,   // <<< اینجا حتما توکن رو وارد کن
        }
      );

      imageUrl = blob.url;

      // ⚠️ حذف تصویر قبلی نیاز به توکن داره که اینجا انجام نشده
    }

    const updatedSlider = await CategorySlider.findByIdAndUpdate(
      id,
      { name: name.trim(), UrlLink: UrlLink || null, imageUrl },
      { new: true }
    );

    return NextResponse.json(updatedSlider, { status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "خطا در ویرایش اسلایدر" }, { status: 500 });
  }
}