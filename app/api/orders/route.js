import connect from "@/app/utils/db";
import { authOptions } from "../auth/[...nextauth]/route";
import Order from "@/app/modls/order/Order";
 
import { NextResponse } from "next/server";
import product from "@/app/modls/catgory/product";
import { getServerSession } from "next-auth";
import Cart from "@/app/modls/cart/Cart";

export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession({ req, ...authOptions });
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }
    const Orders = await Order.find({ user: session.user.id })
      .populate("items.product", "name imageUrl price")
      .sort({ createdAt: -1 });
    return NextResponse.json(Orders);
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
  }
 
 
export async function POST(req) {
  try {
    await connect();
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "لطفا وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }
     const {final_address} = await req.json();

    const cart = await Cart.findOne({ user: session.user.id }).populate("items.product");

    if (!cart) {
      return NextResponse.json(
        { error: "سبد خرید شما خالی است" },
        { status: 400 }
      );
    }


    // محاسبه مجموع قیمت‌ها چون در مدل Cart فیلد finalPrice و totalPrice نداریم
    const totalPrice = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);


    const finalPrice = totalPrice - (cart.discountPrice || 0);

    const newOrder = await Order.create({
      user: session.user.id,
      items: cart.items,
   final_address,

      totalPrice,
      finalPrice,
      discountPrice: cart.discountPrice || 0,
      status: "تکمیل شده  ",
    });
 
    return NextResponse.json({
      message: "سفارش شما با موفقیت ثبت شد",
      orderId: newOrder._id,
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: error.message || "خطا در ثبت سفارش" },
      { status: 500 }
    );
  }
}
