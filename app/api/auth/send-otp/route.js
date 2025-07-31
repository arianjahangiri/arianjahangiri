 
import Otp from "@/app/modls/Otp/Otp";
import users from "@/app/modls/User/users";
 
import connect from "@/app/utils/db";
import crypto from "crypto";

export async function POST(request) {
  await connect();

  try {
    const { phone, name, type } = await request.json();

    if (!type || !["register", "login"].includes(type)) {
      return new Response(
        JSON.stringify({ message: "نوع درخواست نامعتبر است." }),
        { status: 400 }
      );
    }

    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      return new Response(
        JSON.stringify({ message: "شماره تلفن وارد شده صحیح نیست." }),
        { status: 400 }
      );
    }

    if (type === "register") {
      if (!name || name.trim().length < 3 || name.trim().length > 30) {
        return new Response(
          JSON.stringify({
            message: "نام و نام خانوادگی باید بین 3 تا 30 کاراکتر باشد.",
          }),
          { status: 400 }
        );
      }

      const existingUser = await users.findOne({ phone }); // fixed 'User'
      if (existingUser) {
        return new Response(
          JSON.stringify({ message: "کاربری با این شماره  قبلا ثبت نام کرده است." }),
          { status: 400 }
        );
      }
    } else if (type === "login") {
      const user = await users.findOne({ phone });
      if (!user) {
        return new Response(
          JSON.stringify({ message: "کاربری با این شماره ثبت نام نکرده است." }),
          { status: 400 }
        );
      }
    }

    const otpCode = crypto.randomInt(100000, 999999).toString();

    await Otp.create({
      phone,
      code: otpCode,
      kind: type === "register" ? 1 : 2,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    return new Response(
      JSON.stringify({ message: "کد تایید برای شما ارسال شد." }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
