import owlcarousel from "@/app/modls/owlcarousel/owlcarousel";
import connect from "@/app/utils/db";
import { join } from "path";
import { writeFile, unlink } from "fs/promises";
 import { put } from "@vercel/blob";
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
}const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه محصول معتبر نیست" },
        { status: 400 }
      );
    }

    const data = await request.formData();
    const name = data.get("name");
    const file = data.get("image");
    const UrlLink = data.get("UrlLink");

    if (!name || typeof name !== "string" || name.trim().length < 3 || name.trim().length > 30) {
      return NextResponse.json(
        { success: false, message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" },
        { status: 400 }
      );
    }

    await connect();

    const owlcarouselDoc = await owlcarousel.findById(id);
    if (!owlcarouselDoc) {
      return NextResponse.json(
        { success: false, message: "محصول پیدا نشد" },
        { status: 404 }
      );
    }

    let imageUrl = owlcarouselDoc.imageUrl;

    if (file && typeof file !== "string" && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const blob = await put(`owl-carousel/${Date.now()}-${file.name}`, buffer, {
        access: "public",
        contentType: file.type,
        token: BLOB_READ_WRITE_TOKEN, // اضافه کردن توکن
      });
      imageUrl = blob.url;
    }

    const updated = await owlcarousel.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        imageUrl,
        UrlLink,
      },
      { new: true }
    );

    return NextResponse.json(updated, { status: 200 });

  } catch (error) {
    console.error("خطا:", error);
    return NextResponse.json(
      {
        success: false,
        message: "خطا در ویرایش محصول",
        error: error.message,
      },
      { status: 500 }
    );
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
