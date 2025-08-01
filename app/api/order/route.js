 
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
 
import Cart from "@/app/modls/cart/Cart";
import Order from "@/app/modls/order/Order";
import { authOptions } from "../auth/[...nextauth]/route";
import connect from "@/app/utils/db";
import product from "@/app/modls/catgory/product";
 
export async function POST(req) {
  try {
    await connect();
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user) {
      return NextResponse.json({ error: "لطفا وارد حساب کاربری خود شوید" }, { status: 401 });
    }
    let cart = await Cart.findOne({ user: session.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "سبد خرید شما خالی است" }, { status: 400 });
    }
    const totalPrice = cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity || 0);
    }, 0);

    const discountPrice = cart.discountPrice || 0;
    const finalPrice = totalPrice - discountPrice;
    const newOrder = await Order.create({
      user: session.user.id,
      items: cart.items,
      finalPrice,
      totalPrice,
      discountPrice,
      status: "تکمیل شده  ",
    });
    await Cart.deleteOne({ user: session.user.id });
    return NextResponse.json({ message: "سفارش شما با موفقیت ثبت شد", orderId: newOrder._id });
  } catch (error) {
    return NextResponse.json({ error: error.message || "خطا در ثبت سفارش" }, { status: 500 });
  }
}