import { writeFile } from "fs/promises";
import { join } from "path";
import Otp from "@/app/modls/Otp/Otp";
import users from "@/app/modls/User/users";
import connect from "@/app/utils/db";

export async function POST(req) {
  await connect();

  try {
    const data = await req.formData();
    const name = data.get("name");
    const phone = data.get("phone");
    const code = data.get("code");
    const email = data.get("email");  // اضافه کردن ایمیل
    const file = data.get("Image_profile");

    if (!name || !phone || !code || !file || !email) {
      return new Response(
        JSON.stringify({ message: "همه فیلدها از جمله ایمیل الزامی هستند" }),
        { status: 400 }
      );
    }

    // اعتبارسنجی ساده ایمیل
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = join(process.cwd(), "public/uploads");
    const filePath = join(uploadDir, file.name);

    await writeFile(filePath, buffer);

    const newUser = await users.create({
      name,
      phone,
      email,  // ذخیره ایمیل
      Image_profile: `/uploads/${file.name}`,
      isAdmin: false,
      isActive: true,
    });

    await Otp.deleteOne({ phone });

    return new Response(
      JSON.stringify({ message: "ثبت نام موفق بود", user: newUser }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "خطا در سرور" }),
      { status: 500 }
    );
  }
}
