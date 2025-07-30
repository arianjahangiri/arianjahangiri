import connect from "@/app/utils/db";
import Brand from "@/app/modls/Brand/Brand";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { error } from "jquery";

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// 📌 GET - دریافت یک برند با آیدی
export async function GET(req, { params }) {
  await connect();
  const { id } = params;

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ message: "برند یافت نشد" }, { status: 404 });
    }

    return NextResponse.json(brand, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "خطا در دریافت اطلاعات برند" }, { status: 500 });
  }
}

// 📌 PUT - ویرایش برند + آپلود تصویر جدید
export async function PUT(request, { params }) {
  await connect();
  const { id } = params;
  const data = await request.formData();

  const name = data.get("name");
  const UrlLink = data.get("UrlLink");
  const file = data.get("image");

  // ✔️ اعتبارسنجی
  if (!name || name.trim() === "") {
    return NextResponse.json({ message: "نام برند الزامی است" }, { status: 400 });
  }

  if (name.length < 3 || name.length > 30) {
    return NextResponse.json({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }, { status: 400 });
  }

  try {
    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ message: "برند یافت نشد" }, { status: 404 });
    }

    let imageUrl = brand.imageUrl;

    // ✔️ اگر تصویر جدیدی فرستاده شده، آن را آپلود کن
    if (file && typeof file !== "string" && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const blob = await put(`brands/${Date.now()}-${file.name}`, buffer, {
        access: "public",
        contentType: file.type,
        token: BLOB_READ_WRITE_TOKEN, // توکن الزامی برای نوشتن
      });

      imageUrl = blob.url;

      // TODO: اگر نیاز بود، تصویر قبلی را هم حذف کن (در آینده)
    }

    const updated = await Brand.findByIdAndUpdate(
      id,
      { name, UrlLink, imageUrl },
      { new: true }
    );

    return NextResponse.json(updated, { status: 200 });

  } catch (err) {
    console.error("خطا در ویرایش برند:", err);
    return NextResponse.json({ message: "خطا در ویرایش برند" }, { status: 500 });
  }
}

// 📌 DELETE - حذف برند
export async function DELETE(req, { params }) {
  await connect();
  const { id } = await params;

  try {
    const deleted = await Ads.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ message: "تبلیغ یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ message: "تبلیغ با موفقیت حذف شد",  }, { status: 200 });

  } catch (err) {
    console.error("خطا در حذف تبلیغ:", err);
    return NextResponse.json({ message: "خطا در حذف تبلیغ" ,err}, { status: 500 });
  }
}
