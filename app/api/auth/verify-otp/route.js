import { Buffer } from "buffer";
import Otp from "@/app/modls/Otp/Otp";
import users from "@/app/modls/User/users";
import connect from "@/app/utils/db";
import { put } from "@vercel/blob";

export async function POST(req) {
  await connect();

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ message: "نوع درخواست باید multipart/form-data باشد." }),
        { status: 400 }
      );
    }

    const data = await req.formData();
    const name = data.get("name");
    const phone = data.get("phone");
    const code = data.get("code");
    const email = data.get("email");
    const file = data.get("Image_profile");

    if (!name || !phone || !code || !file || !email) {
      return new Response(
        JSON.stringify({ message: "همه فیلدها از جمله ایمیل الزامی هستند" }),
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ message: "ایمیل وارد شده معتبر نیست" }),
        { status: 400 }
      );
    }

    const otp = await Otp.findOne({ phone, code });
    if (!otp || otp.expiresAt < new Date()) {
      return new Response(
        JSON.stringify({ message: "کد تایید معتبر نیست یا منقضی شده" }),
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = await put(`avatars/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    });

    const newUser = await users.create({
      name,
      phone,
      email,
      Image_profile: blob.url,
      isAdmin: false,
      isActive: true,
    });

    await Otp.deleteOne({ phone });

    return new Response(
      JSON.stringify({ message: "ثبت نام موفق بود", user: newUser }),
      { status: 201 }
    );
  } catch (err) {
    console.error("خطا:", err);
    return new Response(
      JSON.stringify({ message: err.message || "خطا در سرور" }),
      { status: 500 }
    );
  }
}
