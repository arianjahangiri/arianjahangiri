import comment from "@/app/modls/comment/comments";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";

 
 

 
export async function GET(req) {  
  await connect();  
  try {  
    const comments = await comment
    .find({})
    .populate("userId", "name phone")        // Only include name and phone from user
    .populate("productId", "name");          // Only include name from product
  
  
    return new Response(JSON.stringify(comments), {   
      status: 200,  
      headers: { "Content-Type": "application/json" },  
    });  
  } catch (error) {  
    console.error(error);  
    return new Response(JSON.stringify({ error: "Failed to fetch comments" }), {  
      status: 500,  
      headers: { "Content-Type": "application/json" },  
    });  
  }  
}


export async function POST(request) {
  try {
    await connect();

    const { text, userId, productId, isApproval } = await request.json();

    // اعتبارسنجی
    if (!text || !userId || !productId) {
      return new NextResponse(JSON.stringify({ error: "لطفاً همه فیلدها را پر کنید." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ایجاد نظر جدید
    const newComment = new comment({
      text,
      userId,
      productId,
      isApproval: isApproval ?? false, // اگر ارسال نشه، مقدار پیش‌فرض false
    });

    await newComment.save();

    return new NextResponse(JSON.stringify(newComment), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("خطا در ثبت نظر:", err.message);
    return new NextResponse(JSON.stringify({ error: "خطا در ثبت نظر کاربر" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}