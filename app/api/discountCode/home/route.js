 
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
 
import Cart from "@/app/modls/cart/Cart";
import connect from "@/app/utils/db";
import discount from "@/app/modls/discountcode/discount";
 
 
export async function POST(req) {
  try {
    await connect();

    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "برای اعمال کد تخفیف باید وارد شوید" },
        { status: 401 }
      );
    }

    const { discountcode } = await req.json();

    if (!discountcode || discountcode.trim() === "") {
      return NextResponse.json(
        { error: "کد تخفیف را وارد کنید" },
        { status: 400 }
      );
    }

    const discountDoc = await discount.findOne({
      discountcode: discountcode.trim(),
      status: true,
    });

    if (!discountDoc) {
      return NextResponse.json(
        { error: "کد تخفیف وارد شده معتبر نیست" },
        { status: 400 }
      );
    }

    // فرض بر این که Translations یک timestamp است
    if (new Date() > new Date(Number(discountDoc.Translations))) {
      return NextResponse.json(
        { error: "کد تخفیف وارد شده منقضی شده است" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: "سبد خرید شما خالی است" },
        { status: 400 }
      );
    }

    const totalPrice = cart.items.reduce((total, item) => {
      return total + (item.product.price || 0) * item.quantity;
    }, 0);

    if (totalPrice === 0) {
      return NextResponse.json(
        { error: "سبد خرید شما خالی است" },
        { status: 400 }
      );
    }

    const discountAmount = (totalPrice * discountDoc.discountPercentage) / 100;

    cart.discountPrice = discountAmount;
    await cart.save();

    const updatedCart = await Cart.findOne({ user: session.user.id });

    return NextResponse.json({
      discountPercentage: discountDoc.discountPercentage,
      discountPrice: updatedCart.discountPrice,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "مشکلی در اعمال کد تخفیف پیش آمده است" },
      { status: 500 }
    );
  }
}