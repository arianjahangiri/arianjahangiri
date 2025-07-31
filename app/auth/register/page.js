import Otp from "@/app/modls/Otp/Otp";
import users from "@/app/modls/User/users";
import connect from "@/app/utils/db";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(req) {
  try {
    await connect();

    const data = await req.formData();
    const name = data.get("name");
    const phone = data.get("phone");
    const email = data.get("email");
    const code = data.get("code");
    const file = data.get("Image_profile");

    if (!name || !phone ||!email || !code || !file || typeof file === "string") {
      return NextResponse.json(
        { message: "همه فیلدها و تصویر الزامی هستند" },
        { status: 400 }
      );
    }

    const otp = await Otp.findOne({ phone, code });
    if (!otp || otp.expiresAt < new Date()) {
      return NextResponse.json({ message: "کد تایید معتبر نیست" }, { status: 400 });
    }

    // تبدیل فایل به Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // آپلود تصویر روی Vercel Blob
    const blob = await put(`profile_images/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
      token: BLOB_TOKEN,
    });

    // ساخت یوزر
    const newUser = await users.create({
      name,
      email,
      phone,
      Image_profile: blob.url, // لینک آنلاین تصویر
      isAdmin: false,
      isActive: true,
    });

    // حذف OTP بعد از استفاده
    await Otp.deleteOne({ phone });

    return NextResponse.json(
      { message: "ثبت نام موفق بود", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ message: err.message || "خطا در سرور" }, { status: 500 });
  }
}
