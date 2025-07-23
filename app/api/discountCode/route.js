import discount from "@/app/modls/discountcode/discount";
import connect from "@/app/utils/db";
import { NextResponse } from "next/server";
 
export async function GET() {
  await connect();
  try {
    const discounts = await discount.find({});
    return NextResponse.json(discounts, { status: 200 });
  } catch (error) {
    console.error("  Error fetching discounts:", error.message);
    return NextResponse.json({ error: "Failed to fetch discounts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connect();
    const { status, Translations, discountPercentage, discountcode } = await request.json();

    // Input validation
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

    // Create a new discount entry
    const newDiscount = new discount({ status, Translations, discountPercentage, discountcode });

    await newDiscount.save();

    return NextResponse.json(newDiscount, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "خطا در ایجاد پست: " + err.message }, { status: 500 });
  }
}
