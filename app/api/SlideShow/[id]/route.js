import owlcarousel from "@/app/modls/owlcarousel/owlcarousel";
import connect from "@/app/utils/db";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
 
import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  await connect();
  const { id } = params;

  try {
    const owlcarouseles = await owlcarousel.findById(id);
    console.log("owlcarousel:", owlcarouseles);

    return new Response(JSON.stringify(owlcarouseles), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching owlcarousel:", error.message);
    return new Response(JSON.stringify({ error: "Failed to fetch owlcarousel" }), {
      status: 500,
    });
  }
}
export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({
        success: false,
        message: "شناسه محصول معتبر نیست",
      });
    }

    const data = await request.formData();
    const name = data.get("name");
    const file = data.get("image");
    const UrlLink = data.get("UrlLink"); // گرفتن لینک از فرم

    await connect();

    const owlcarouselDoc = await owlcarousel.findById(id);
    if (!owlcarouselDoc) {
      return NextResponse.json({
        success: false,
        message: "محصول پیدا نشد",
      });
    }

    // بررسی نام
    if (!name || typeof name !== "string" || name.trim() === "") {
      return new Response(JSON.stringify({ message: "نام محصول الزامی میباشد" }), { status: 400 });
    }

    if (name.length < 3 || name.length > 30) {
      return new Response(JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ باشد" }), { status: 400 });
    }

    // مقدار پیش‌فرض برای تصویر
    let imageUrl = owlcarouselDoc.imageUrl;

    // اگر تصویر جدید فرستاده شده
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = join(process.cwd(), "public/uploads");
      const filePath = join(uploadDir, file.name);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${file.name}`;

      // حذف تصویر قبلی
      const oldFilePath = join(process.cwd(), "public", owlcarouselDoc.imageUrl);
      await unlink(oldFilePath).catch(() => console.log("حذف تصویر قبلی با خطا مواجه شد"));
    }

    // بروزرسانی داکیومنت با نام، عکس و UrlLink
    const updated = await owlcarousel.findByIdAndUpdate(
      id,
      {
        name,
        imageUrl,
        UrlLink, // 👈 اضافه کردن این فیلد به سند
      },
      { new: true }
    );

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.log("خطا:", error);
    return NextResponse.json({
      success: false,
      message: "خطا در ویرایش محصول",
    });
  }
}

export async function DELETE(req, { params }) {
  await connect();
  try {
    const { id } = params;  // دسترسی مستقیم به params

    const deletedowlcarousel = await owlcarousel.findByIdAndDelete(id);

    if (!deletedowlcarousel) {
      return new Response(JSON.stringify({ error: "پست پیدا نشد!" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "پست با موفقیت حذف شد!" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "خطا در حذف پست" }), {
      status: 500,
    });
  }
}
