import categories from "@/app/modls/categories-menu/categories";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  await connect();

  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "شناسه دسته‌بندی مشخص نشده" }, { status: 400 });
  }

  try {
    const deleted = await categories.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "دسته‌بندی یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({ message: "دسته‌بندی با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "خطا در حذف دسته‌بندی: " + error.message }, { status: 500 });
  }
}