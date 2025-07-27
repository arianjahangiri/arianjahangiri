 
import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
 
import { NextResponse } from "next/server";

export async function GET() {
  await connect();

  try {
    const featuredProducts = await product.find({}).populate({
      path: "categories", // نام فیلد در مدل Product

      
    })
      .sort({ views: -1 })
      .limit(8)
      .select("name price imageUrl category views");

    return NextResponse.json(featuredProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "مشکلی در دریافت محصولات پربازدید رخ داده است" + error.message,
      },
      { status: 500 }
    );
  }
}
