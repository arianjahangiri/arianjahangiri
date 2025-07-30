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
    const code = data.get("code");
    const email = data.get("email"); // ✅ گرفتن ایمیل
    const file = data.get("Image_profile");

    // بررسی فیلدها
    if (
      !name ||
      !phone ||
      !code ||
      !email ||
      !file ||
      typeof file === "string"
    ) {
      return NextResponse.json(
        { message: "همه فیلدها از جمله ایمیل و تصویر الزامی هستند" },
        { status: 400 }
      );
    }

    // بررسی ساده ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "ایمیل وارد شده معتبر نیست" },
        { status: 400 }
      );
    }

    // بررسی صحت کد تایید
    const otp = await Otp.findOne({ phone, code });
    if (!otp || otp.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "کد تایید معتبر نیست یا منقضی شده" },
        { status: 400 }
      );
    }

    // آپلود تصویر
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = await put(`profile_images/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
      token: BLOB_TOKEN,
    });

    // ثبت کاربر
    const newUser = await users.create({
      name,
      phone,
      email, // ✅ ذخیره ایمیل
      Image_profile: blob.url,
      isAdmin: false,
      isActive: true,
    });

    // حذف OTP
    await Otp.deleteOne({ phone });

    return NextResponse.json(
      { message: "ثبت نام موفق بود", user: newUser },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json(
      { message: err.message || "خطا در سرور" },
      { status: 500 }
    );
  }
}
