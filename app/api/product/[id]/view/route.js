import { NextResponse } from "next/server";
import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";

export async function POST(request, { params }) {
  try {
    await connect();
    const { viewid } = params;

    if (!viewid) {
      return NextResponse.json(
        { success: false, message: "شناسه محصول معتبر نیست" },
        { status: 400 }
      );
    }

    // افزایش تعداد بازدید محصول
    const updatedProduct = await product.findByIdAndUpdate(
      viewid,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, message: "محصول یافت نشد" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "بازدید با موفقیت ثبت شد", 
        views: updatedProduct.views 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("خطا در ثبت بازدید:", error);
    return NextResponse.json(
      { success: false, message: "خطا در ثبت بازدید", error: error.message },
      { status: 500 }
    );
  }
}