import { join } from "path";
import { writeFile } from "fs/promises";
import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
import categories from "@/app/modls/categories-menu/categories";
 
 import { put } from "@vercel/blob";
export async function GET(req) {  
  await connect();  
  try {  
    const products = await product.find({}).populate({
      path: "category", // نام فیلد در مدل Product
      model: "categories" // نام مدل مورد نظر
    });  
    return new Response(JSON.stringify(products), {   
      status: 200,  
      headers: { "Content-Type": "application/json" },  
    });  
  } catch (error) {
    console.error("Error in GET:", error); // خطا را لاگ کنید
    return new Response(JSON.stringify({ error: error.message}), {  
      status: 500,  
      headers: { "Content-Type": "application/json" },  
    });  
  }  
}
export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("image");

    if (!file || typeof file === "string") {
      return new Response(JSON.stringify({ message: "آپلود تصویر الزامی است" }), { status: 400 });
    }

    const name = data.get("name");
    const discount = data.get("discount");
    const description = data.get("description");
    const price =data.get("price");
    const stock = data.get("stock");
    const category = data.get("category");

    if (!name || !description || isNaN(price) || isNaN(stock) || isNaN(discount) || !category) {
      return new Response(JSON.stringify({ message: "تمامی فیلدها الزامی هستند" }), { status: 400 });
    }

    if (name.length < 3 || name.length > 30) {
      return new Response(JSON.stringify({ message: "نام باید بین ۳ تا ۳۰ کاراکتر باشد" }), { status: 400 });
    }

    if (description.length < 3 || description.length > 200) {
      return new Response(JSON.stringify({ message: "توضیحات باید بین ۳ تا ۲۰۰ کاراکتر باشد" }), { status: 400 });
    }

    if (price <= 0 || stock < 0) {
      return new Response(JSON.stringify({ message: "قیمت و موجودی باید بیش از ۰ باشد" }), { status: 400 });
    }

    // تبدیل فایل به buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // آپلود به Vercel Blob
    const blob = await put(`products/${Date.now()}-${file.name}`, buffer, {
      access: "public",
      contentType: file.type,
    });
const discount_amount = (Number(price) * Number(discount)) / 100;
    await connect();
const finalPrice = price - discount;
    const newProduct = await product.create({
      name,
      description,
      price,
      stock,
      discount,
      discount_amount,
         finalPrice,
     
      category,
      imageUrl: blob.url, // آدرس تصویر در Vercel Blob
    });

    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Upload error:", error);
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}