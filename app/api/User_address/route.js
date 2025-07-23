import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";
import Address from "@/app/modls/Address_User/Address";

export async function POST(req) {
  try {
    await connect();
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "لطفاً وارد حساب خود شوید" }, { status: 401 });
    }

    const { address } = await req.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json({ error: "آدرس معتبر وارد کنید" }, { status: 400 });
    }

    const existing = await Address.findOne({ user: session.user.id });

    if (existing) {
      if (existing.address.includes(address)) {
        return NextResponse.json({ error: "این آدرس قبلاً ثبت شده است." }, { status: 400 });
      }
      existing.address.push(address);
      await existing.save();
      return NextResponse.json(existing);
    } else {
      const newAddress = await Address.create({
        user: session.user.id,
        address: [address],
      });
      return NextResponse.json(newAddress);
    }
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connect();
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }

    const userAddress = await Address.findOne({ user: session.user.id });

    if (!userAddress) {
      return NextResponse.json({ address: [] });
    }

    return NextResponse.json({ address: userAddress.address || [] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function PUT(req) {
  try {
    await connect();
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }

    const { oldAddress, newAddress } = await req.json();

    if (!oldAddress || !newAddress || typeof oldAddress !== "string" || typeof newAddress !== "string") {
      return NextResponse.json({ error: "آدرس‌های معتبر وارد کنید" }, { status: 400 });
    }

    const existing = await Address.findOne({ user: session.user.id });

    if (!existing) {
      return NextResponse.json({ error: "آدرسی یافت نشد" }, { status: 404 });
    }

    const index = existing.address.indexOf(oldAddress);

    if (index === -1) {
      return NextResponse.json({ error: "آدرس مورد نظر وجود ندارد" }, { status: 404 });
    }

    existing.address[index] = newAddress;

    await existing.save();

    return NextResponse.json(existing);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connect();
    const session = await getServerSession({ req, ...authOptions });

    if (!session || !session.user) {
      return NextResponse.json({ error: "وارد حساب خود شوید" }, { status: 401 });
    }

    const { address } = await req.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json({ error: "آدرس معتبر وارد کنید" }, { status: 400 });
    }

    const existing = await Address.findOne({ user: session.user.id });

    if (!existing) {
      return NextResponse.json({ error: "آدرسی یافت نشد" }, { status: 404 });
    }

    existing.address = existing.address.filter(item => item !== address);

    await existing.save();

    return NextResponse.json(existing);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
