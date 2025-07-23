 

import connect from "@/app/utils/db";
import { NextResponse } from "next/server";
 import Users from "@/app/modls/User/users";

// دریافت تمام کاربران
export async function GET() {
  await connect();
  try {
    const users = await Users.find({});
    
    

    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return new NextResponse(JSON.stringify({ error: "خطا در دریافت کاربران" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// ایجاد کاربر جدید
export async function POST(request) {
  try {
    await connect();
    const { name, phone,   status } = await request.json();

    // اعتبارسنجی ورودی‌ها
    if (!name || !phone) {
      return new NextResponse(JSON.stringify({ error: "لطفاً همه فیلدها را پر کنید." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // مقدار پیش‌فرض برای status
    const newUser = new Users({ name, phone , status: status || false });
    await newUser.save();

    return new NextResponse(JSON.stringify(newUser), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("خطا در ایجاد کاربر:", err.message);
    return new NextResponse(JSON.stringify({ error: "خطا در ایجاد کاربر" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
