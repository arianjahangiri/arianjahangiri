import { put } from "@vercel/blob";
import Otp from "@/app/modls/Otp/Otp";
import users from "@/app/modls/User/users";
import connect from "@/app/utils/db";

export async function POST(req) {
  await connect();

  try {
    const data = await req.formData();
    const name = data.get("name");
    const phone = data.get("phone");
    const email = data.get("email");
    const code = data.get("code");
    const file = data.get("Image_profile");

    if (!name || !phone || !code || !file|| !email) {
      return new Response(JSON.stringify({ message: "همه فیلدها الزامی هستند" }), {
        status: 400,
      });
    }

    const otp = await Otp.findOne({ phone, code });
    if (!otp || otp.expiresAt < new Date()) {
      return new Response(JSON.stringify({ message: "کد تایید معتبر نیست" }), {
        status: 400,
      });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const blobRes = await put(file.name, fileBuffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN, // مطمئن شو این تو env ست شده باشه
    });

    const newUser = await users.create({
      name,
      email,
      phone,
      Image_profile: blobRes.url,
      isAdmin: false,
      isActive: true,
    });

    await Otp.deleteOne({ phone });

    return new Response(
      JSON.stringify({ message: "ثبت نام موفق بود", user: newUser }),
      { status: 201 }
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}
