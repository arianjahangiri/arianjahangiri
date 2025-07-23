import Shops from "@/app/modls/(shop)/modle";
import connect from "@/app/utils/db";

 
 
 
 
 

 

export async function GET(req) {  
  await connect();  
  try {  
    const shops = await Shops.find({});  
    console.log("Fetched shops:", shops);  
    return new Response(JSON.stringify(shops), {   
      status: 200,  
      headers: {  
        "Content-Type": "application/json",  
      },  
    });  
  } catch (error) {  
    console.error("Error fetching shops:", error.message);  
    return new Response(JSON.stringify({ error: "Failed to fetch shops" }), {  
      status: 500,  
      headers: {  
        "Content-Type": "application/json",  
      },  
    });  
  }  
}
export const POST = async (request) => {  
  try {  
    await connect();  
    const {  title } = await request.json();  
    const newShops = new Shops({ title });  
    await newShops.save();  
    return new NextResponse(JSON.stringify(newShops), { status: 201 });  
  } catch (err) {   
    return new NextResponse("خطا در ایجاد پست: " + err.message, { status: 500 });  
  }  
};  
 
 