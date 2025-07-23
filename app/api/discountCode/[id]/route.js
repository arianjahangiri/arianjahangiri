  import discount from "@/app/modls/discountcode/discount";
import connect from "@/app/utils/db";

 

export async function GET(req, { params }) {  
    await connect();  
    const { id } = params;  
  
    try {  
      const discounts = await discount.findById(id);  
      console.log("Fetched shops:", discounts); 
      return new Response(JSON.stringify(discounts), {   
        status: 200,  
        headers: {  
          "Content-Type": "application/json",  
        },  
      });  
    } catch (error) {  
      console.error("Error fetching discounts:", error.message);  
      return new Response(JSON.stringify({ error: "Failed to fetch discounts" }), {  
        status: 500,  
        headers: {  
          "Content-Type": "application/json",  
        },  
      });  
    }  
  }
   

export async function PUT(req, { params }) {
  await connect();
  try {
    const { id } = params; 
    const { status, Translations, discountPercentage, discountcode } = await req.json(); 
      const formErrors = {};
        
        if (!discountcode || discountcode.length < 3) {  
          formErrors.discountcode = "کد تخفیف باید حداقل شامل ۳ کاراکتر باشد.";  
        }  
    
        if (!discountPercentage || discountPercentage <= 0 || discountPercentage > 100) {  
          formErrors.discountPercentage = "درصد تخفیف باید بین ۱ و ۱۰۰ باشد.";  
        }  
    
        if (status == null) {  
          formErrors.status = "وضعیت باید انتخاب شود.";  
        }  
    
        // Return errors if validation fails
        if (Object.keys(formErrors).length > 0) {
          return NextResponse.json({ errors: formErrors }, { status: 400 });
        }

    const updateddiscount = await discount.findByIdAndUpdate(
      id,
      { status, Translations, discountPercentage, discountcode },
      { new: true }
    );

    if (!updateddiscount) {
      return new Response(JSON.stringify({ error: "پست پیدا نشد!" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(updateddiscount), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "خطا در ویرایش پست" }), {
      status: 500,
    });
  }
}

 
export async function DELETE(req, { params }) {
  await connect();
  try {
    const { id } = params;  

    const deletedDicount = await discount.findByIdAndDelete(id);

    if (!deletedDicount) {
      return new Response(JSON.stringify({ error: "پست پیدا نشد!" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ message: "پست با موفقیت حذف شد!" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "خطا در حذف پست" }), {
      status: 500,
    });
  }
}
