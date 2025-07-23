import connect from "@/app/utils/db";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
import { existsSync, mkdir } from "fs"; // اینجا اضافه شده
 
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
export async function PUT(request, { params }) {
  const { id } = params;
  const data = await request.formData();

  const name = data.get("name");
  const UrlLink = data.get("UrlLink");
  const file = data.get("image");

  if (!name || name.trim() === "")
    return new Response(JSON.stringify({ message: "نام محصول الزامی است" }), { status: 400 });

  if (name.length < 3 || name.length > 30)
    return new Response(JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }), { status: 400 });

  try {
    await connect();
    const brand = await Brand.findById(id);
    if (!brand)
      return new Response(JSON.stringify({ message: "محصول یافت نشد" }), { status: 404 });

    let imageUrl = brand.imageUrl;

    if (file && typeof file.name === "string") {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public/uploads");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const filePath = join(uploadDir, file.name);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${file.name}`;

      // حذف عکس قبلی
      if (brand.imageUrl?.startsWith("/uploads/")) {
        const oldPath = join(process.cwd(), "public", brand.imageUrl);
        await unlink(oldPath).catch(() => console.log("خطا در حذف تصویر قبلی"));
      }
    }

    const updated = await Brand.findByIdAndUpdate(
      id,
      { name, UrlLink, imageUrl },
      { new: true }
    );

    return new Response(JSON.stringify(updated), { status: 200 });

  } catch (err) {
    console.error("خطا در PUT:", err);
    return new Response(JSON.stringify({ message: "خطا در ویرایش" }), { status: 500 });
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
