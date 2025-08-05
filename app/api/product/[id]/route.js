 
 
 
import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";
 
 import { put } from "@vercel/blob";

    

export async function GET(req, { params }) {
  await connect();

  try {
    // اطمینان از این که params به درستی دسترسی داده شده
    const { id } = await params;


    const products = await product.findById(id)  ;  
    ;

    if (!products) {
      return new Response(JSON.stringify({ error: "محصول پیدا نشد!" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "خطا در دریافت محصول" }), {
      status: 500,
    });
  }
}


const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function PUT(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "شناسه محصول معتبر نیست" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const discount = Number(formData.get("discount"));
    const category = formData.get("category");
    const file = formData.get("imageUrl");

    // اعتبارسنجی اولیه
    if (!name || !description || isNaN(price) || isNaN(stock) || isNaN(discount) || !category) {
      return NextResponse.json(
        { success: false, message: "تمامی فیلدها الزامی می‌باشند" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.trim().length < 3 || name.trim().length > 30) {
      return NextResponse.json(
        { success: false, message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" },
        { status: 400 }
      );
    }

    if (
      typeof description !== "string" ||
      description.trim().length < 3 ||
      description.trim().length > 200
    ) {
      return NextResponse.json(
        { success: false, message: "توضیحات باید بین ۳ تا ۲۰۰ کاراکتر باشد" },
        { status: 400 }
      );
    }

    if (price <= 0 || stock < 0) {
      return NextResponse.json(
        { success: false, message: "قیمت یا موجودی باید عددی معتبر باشد" },
        { status: 400 }
      );
    }

    await connect();

    const existingProduct = await product.findById(id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    let imageUrl = existingProduct.imageUrl;

    // آپلود فایل جدید در صورت ارسال
    if (file && typeof file !== "string" && file.name) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const blob = await put(
        `products/${Date.now()}-${file.name}`,
        buffer,
        {
          access: "public",
          contentType: file.type,
          token: BLOB_READ_WRITE_TOKEN,  // توکن حتما باید اضافه شود
        }
      );

      imageUrl = blob.url;

      // ⚠️ تصویر قبلی در Vercel Blob باقی می‌ماند
      // اگر بخواهید حذف کنید باید با توکن و API جداگانه اقدام کنید
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        description: description.trim(),
        price,
        stock,
        discount,
        category,
        imageUrl,
      },
      { new: true }
    );

    return NextResponse.json({ success: true, product: updatedProduct }, { status: 200 });

  } catch (error) {
    console.error("خطا در ویرایش محصول:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ویرایش محصول", error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req, { params }) {
  await connect();
  try {
        const { id } = await params;


    const deletedproduct = await product.findByIdAndDelete(id);

    if (!deletedproduct) {
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
