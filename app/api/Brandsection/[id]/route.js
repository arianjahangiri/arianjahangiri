import connect from "@/app/utils/db";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import { existsSync, mkdir } from "fs"; // اینجا اضافه شده
 import { put } from "@vercel/blob";
import Brand from "@/app/modls/Brand/Brand";

// GET - گرفتن اطلاعات
export async function GET(req, { params }) {
  await connect();
  const { id } = params;

  try {
    const brand = await Brand.findById(id);
    return new Response(JSON.stringify(brand), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "خطا در دریافت اطلاعات" }), {
      status: 500,
    });
  }
}

// PUT - ویرایش محصول

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.formData();

  const name = data.get("name");
  const UrlLink = data.get("UrlLink");
  const file = data.get("image");

  if (!name || name.trim() === "")
    return NextResponse.json({ message: "نام برند الزامی است" }, { status: 400 });

  if (name.length < 3 || name.length > 30)
    return NextResponse.json({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }, { status: 400 });

  try {
    await connect();
    const brand = await Brand.findById(id);
    if (!brand)
      return NextResponse.json({ message: "برند یافت نشد" }, { status: 404 });

    let imageUrl = brand.imageUrl;

    if (file && typeof file !== "string" && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const blob = await put(`brands/${Date.now()}-${file.name}`, buffer, {
        access: "public",
        contentType: file.type,
        token: BLOB_READ_WRITE_TOKEN, // <== حتما توکن اینجا ارسال شود
      });

      imageUrl = blob.url;

      // TODO: حذف تصویر قبلی از Vercel Blob نیاز به توکن دارد
    }

    const updated = await Brand.findByIdAndUpdate(
      id,
      { name, UrlLink, imageUrl },
      { new: true }
    );

    return NextResponse.json(updated, { status: 200 });

  } catch (err) {
    console.error("خطا در PUT:", err);
    return NextResponse.json({ message: "خطا در ویرایش" }, { status: 500 });
  }
}
// DELETE - حذف محصول
export async function DELETE(req, { params }) {
  await connect();
  const { id } = params;

  try {
    const deleted = await Brand.findByIdAndDelete(id);
    if (!deleted)
      return new Response(JSON.stringify({ error: "محصول یافت نشد" }), { status: 404 });

    return new Response(JSON.stringify({ message: "محصول حذف شد" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "خطا در حذف محصول" }), { status: 500 });
  }
}
