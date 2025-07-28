import { join } from "path";
import { writeFile } from "fs/promises";
import product from "@/app/modls/catgory/product";
import connect from "@/app/utils/db";
 
  
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

    if (!file) {
      return new Response(JSON.stringify({ message: "آپلود تصویر الزامی می‌باشد" }), { status: 400 });
    }

    const name = data.get("name");
    const discount = data.get("discount");
    const description = data.get("description");
    const price = parseFloat(data.get("price"));
    const stock = parseInt(data.get("stock"));
    const category = data.get("category");

    if (!name || !description || isNaN(price) || isNaN(stock)  || isNaN(discount)  || !category) {
      return new Response(JSON.stringify({ message: "تمامی فیلدها الزامی می‌باشند" }), { status: 400 });
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

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public/uploads");
    const filePath = join(uploadDir, file.name);

    await writeFile(filePath, buffer);

    await connect();
 
    const newProduct = await product.create({
      name,
      description,
      price,
      stock,
      discount,
      category,
      imageUrl: `/uploads/${file.name}`,
    });

    return new Response(JSON.stringify(newProduct), { status: 201 });

  } catch (error) {
    return new Response(JSON.stringify({ message: error.message }), { status: 500 });
  }
}
