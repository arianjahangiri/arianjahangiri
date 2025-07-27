 
 import connect from "@/app/utils/db";
 import { join } from "path";
 import { writeFile, mkdir } from "fs/promises";
 import { existsSync } from "fs";
 import { NextResponse } from "next/server";
import ProductGallery from "@/app/modls/ProductGallery/ProductGallery";
import product from "@/app/modls/catgory/product";
 
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ProductID = searchParams.get("ProductID");

  if (!ProductID) {
    console.error("ProductID is missing in the request");
    return NextResponse.json({ error: "خطا در گرفتن ProductID" }, { status: 400 });
  }

  await connect();
  try {
   
   
 
    const productGallery = await ProductGallery.find({ ProductID })
   
 
    if (!productGallery || productGallery.length === 0) {
      console.warn("No product gallery found for ProductID:", ProductID);
    }

    return new Response(JSON.stringify(productGallery), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching product gallery:", error);
    return new Response(JSON.stringify({ error: error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


 
 
export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("ProductID");
  try {
    const data = await request.formData();
    const file = data.get("imageUrl");
    const name = data.get("name");
    const ProductID = data.get("ProductID");
    console.log(ProductID+"111111111111111111111");

    // اعتبارسنجی فیلدها
    if (!file) {
      return NextResponse.json({
        success: false,
        message: "آپلود تصویر الزامی می‌باشد",
      }, { status: 400 });
    }

    if (!name || typeof name !== "string" || name.trim() === "" || name.length < 3 || name.length > 30) {
      return NextResponse.json({
        success: false,
        message: "نام محصول باید بین ۳ تا ۳۰ کاراکتر باشد",
      }, { status: 400 });
    }

    if (!ProductID   ) {
      return NextResponse.json({
        success: false,
        message: "شناسه محصول نامعتبر است",
      }, { status: 400 });
    }
 
    // تبدیل فایل به buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // مسیر ذخیره‌سازی
    const uploadDir = join(process.cwd(), "public/uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = join(uploadDir, file.name);

    // اتصال به دیتابیس
    await connect();

    // ذخیره در دیتابیس
    const newGallery = await ProductGallery.create({
      name,
      ProductID,
      imageUrl: `/uploads/${file.name}`,
    });

    // بعد از ذخیره موفق دیتابیس، فایل ذخیره میشه
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      message: "گالری محصول با موفقیت ایجاد شد",
      data: newGallery,
    }, { status: 201 });

  } catch (error) {
    console.error("خطا در آپلود تصویر:", error);
    return NextResponse.json({
      success: false,
      message: "مشکلی در سرور رخ داده است",
      error: error.message,
    }, { status: 500 });
  }
}
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const ProductID = searchParams.get("ProductID");
  
  await connect();
  try {
    const deletedproductGallery = await ProductGallery.findByIdAndDelete(ProductID);

    if (!deletedproductGallery) {
      return new Response(JSON.stringify({ error: " عکس  پیدا نشد!" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: " عکس  با موفقیت حذف شد!" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "خطا در حذف عکس " }), {
      status: 500,
    });
  }
}
 