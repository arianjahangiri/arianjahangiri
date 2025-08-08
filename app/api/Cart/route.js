import connect from "@/app/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import Product from "@/app/modls/catgory/product";
import Cart from "@/app/modls/cart/Cart";

 
export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    let cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
    if (!cart) {
      cart = new Cart({
        user: session.user.id,
        items: [],
      });
      await cart.save();
    }
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching cart items" }, { status: 500 });
  }
}

 
export async function POST(req) {
  try {
    await connect();
    const session = await get
    ServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "لطفا وارد شوید " }, { status: 401 });
    }
    const { productId, quantity } = await req.json();
    if (!productId || isNaN(quantity) || quantity === 0) { // فقط صفر را رد کن
      return NextResponse.json({ error: " مقادیر نامعتبر است " }, { status: 400 });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد" }, { status: 404 });
    }
    let cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      cart = new Cart({ user: session.user.id, items: [] });
    }
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity <= 0) {
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
      } else {
        existingItem.quantity = newQuantity;
        
      }
    } else {
      cart.items.push({ product: productId, quantity   });
    }
    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: "خطایی در اضافه کردن به سبد خرید پیش آمده است" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connect();
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "لطفا وارد شوید " }, { status: 401 });
    }
    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "مقدار نامعتبر است" }, { status: 400 });
    }
    let cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json({ error: "سبد خرید یافت نشد" }, { status: 404 });
    }
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    return NextResponse.json(cart);
  } catch (error) {
    return NextResponse.json({ error: " خطایی در حذف از سبد خرید پیش امده است " }, { status: 500 });
  }
}