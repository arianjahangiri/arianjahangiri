import connect from "@/app/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import Product from "@/app/modls/catgory/product";
import Cart from "@/app/modls/cart/Cart";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
    if (!cart) {
      cart = new Cart({ user: session.user.id, items: [] });
      await cart.save();
    }
    return NextResponse.json(cart);
  } catch (err) {
    console.error("GET /api/Cart error:", err);
    return NextResponse.json({ error: "Error fetching cart items" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "لطفا وارد شوید " }, { status: 401 });
    }

    const body = await req.json();
    const productIdRaw = body?.productId;
    const quantity = Number(body?.quantity);

    // اگر کل آبجکت محصول به اشتباه ارسال شد، از _id بردار
    const productId =
      typeof productIdRaw === "object" && productIdRaw?._id
        ? String(productIdRaw._id).trim()
        : String(productIdRaw || "").trim();

    if (!productId || Number.isNaN(quantity) || quantity === 0) {
      return NextResponse.json({ error: " مقادیر نامعتبر است " }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "شناسه محصول نامعتبر است" }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }

    const pid = new mongoose.Types.ObjectId(productId);

    // ابتدا تلاش کن تعداد آیتم موجود را افزایش/کاهش دهی
    const incRes = await Cart.updateOne(
      { user: session.user.id, "items.product": pid },
      { $inc: { "items.$.quantity": quantity } }
    );

    if (incRes.matchedCount > 0) {
      // اگر تعداد به صفر/منفی رسید حذفش کن
      await Cart.updateOne(
        { user: session.user.id },
        { $pull: { items: { product: pid, quantity: { $lte: 0 } } } }
      );
    } else if (quantity > 0) {
      // آیتم نبود و quantity مثبت است: اضافه کن (upsert)
      await Cart.updateOne(
        { user: session.user.id },
        { $setOnInsert: { user: session.user.id }, $push: { items: { product: pid, quantity } } },
        { upsert: true }
      );
    }

    const cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
    return NextResponse.json(cart);
  } catch (err) {
    console.error("POST /api/Cart error:", err);
    return NextResponse.json({ error: "خطایی در اضافه کردن به سبد خرید پیش آمده است" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connect();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "لطفا وارد شوید " }, { status: 401 });
    }
    const { productId } = await req.json();
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json({ error: "مقدار نامعتبر است" }, { status: 400 });
    }
    await Cart.updateOne(
      { user: session.user.id },
      { $pull: { items: { product: new mongoose.Types.ObjectId(productId) } } }
    );
    const cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
    return NextResponse.json(cart);
  } catch (err) {
    console.error("DELETE /api/Cart error:", err);
    return NextResponse.json({ error: " خطایی در حذف از سبد خرید پیش امده است " }, { status: 500 });
  }
}