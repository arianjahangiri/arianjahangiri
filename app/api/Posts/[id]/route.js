import Shops from "@/app/modls/(shop)/modle";
import connect from "@/app/utils/db";

 

export async function GET(req, { params }) {
  await connect();
  const { id } = params;
  try {
    const shop = await Shops.findById(id);
    if (!shop) {
      return new Response(JSON.stringify({ error: "مغازه پیدا نشد!" }), { status: 404 });
    }
    return new Response(JSON.stringify(shop), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "خطا در دریافت مغازه" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connect();
  try {
    const { id } = params;
    const { title } = await req.json();
    const updatedShop = await Shops.findByIdAndUpdate(id, { title }, { new: true });

    if (!updatedShop) {
      return new Response(JSON.stringify({ error: "مغازه پیدا نشد!" }), { status: 404 });
    }
    return new Response(JSON.stringify(updatedShop), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "خطا در ویرایش مغازه" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connect();
  try {
    const { id } = params;
    const deletedShop = await Shops.findByIdAndDelete(id);
    if (!deletedShop) {
      return new Response(JSON.stringify({ error: "مغازه پیدا نشد!" }), { status: 404 });
    }
    return new Response(JSON.stringify({ message: "مغازه با موفقیت حذف شد!" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "خطا در حذف مغازه" }), { status: 500 });
  }
}
