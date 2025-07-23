import ProductGallery from "@/app/modls/ProductGallery/ProductGallery";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  await connect();

  try {
    // اطمینان از این که params به درستی دسترسی داده شده
    const { id } = await params;

    const ProductGalleryes = await ProductGallery.findById(id);

    if (!ProductGalleryes) {
      return new Response(JSON.stringify({ error: "محصول پیدا نشد!" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(ProductGalleryes), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "خطا در دریافت محصول" }), {
      status: 500,
    });
  }
}



export async function PUT(request,{params}) {
    try {
      const { id } = await params
 
      if (!id) {
        return NextResponse.json(
          { success: false, message: "شناسه محصول معتبر نیست" },
          { status: 400 }
        );
      }
  
      const formData = await request.formData();
      const name = formData.get("name");
      const ProductID = formData.get("ProductID");
      const file = formData.get("imageUrl");
  
      if (!name || typeof name !== "string" || name.trim().length < 3 || name.trim().length > 30) {
        return NextResponse.json(
          { success: false, message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" },
          { status: 400 }
        );
      }
  
      await connect();
      const existingProductGallery = await ProductGallery.findById(id);
      if (!existingProductGallery) {
        return NextResponse.json(
          { success: false, message: "محصول یافت نشد"  },
          { status: 404 }
        );
      }
  
      let imageUrl = existingProductGallery.imageUrl;
      if (file && file.name) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadDir = join(process.cwd(), "public/uploads");
        await mkdir(uploadDir, { recursive: true });
        const filename = `${Date.now()}_${file.name}`;
        const newPath = join(uploadDir, filename);
        await writeFile(newPath, buffer);
        imageUrl = `/uploads/${filename}`;
  
        const oldImagePath = join(process.cwd(), "public", existingProductGallery.imageUrl);
        fs.unlink(oldImagePath, (err) => {
          if (err) console.warn("خطا در حذف تصویر قبلی:", err.message);
        });
      }
  
      const updatedProductGallery = await ProductGallery.findByIdAndUpdate(
        id,
        { name: name.trim(), ProductID, imageUrl },
        { new: true }
      );
  
      return NextResponse.json({ success: true, ProductGallery: updatedProductGallery }, { status: 200 });
    } catch (error) {
      console.error("خطا در ویرایش محصول:", error);
      return NextResponse.json(
        { success: false, message: "خطا در ویرایش محصول" },
        { status: 500 }
      );
    }
  }
  