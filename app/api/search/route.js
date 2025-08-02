import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "پارامتر جستجو الزامی است" }, { status: 400 });
    }

    // جستجو با regex (غیر حساس به حروف)
    const searchResults = await product.find({
      name: { $regex: query, $options: "i" },
    });

    return NextResponse.json(searchResults, { status: 200 });
  } catch (error) {
    console.error("خطا در جستجو:", error);
    return NextResponse.json({ error: "خطایی در جستجو رخ داد" }, { status: 500 });
  }
}
