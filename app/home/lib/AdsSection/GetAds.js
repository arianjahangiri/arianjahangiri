export async function getAdsImage() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/AdsSection`,
      { 
         next: { revalidate: 200 }, // کش به مدت 300 ثانیه (5 دقیقه)
   cache: "force-cache",
      }
    );
  
    if (!res.ok) {
      throw new Error("مشکلی در دریافت دسته بندی رخ داده است");
    }
  
    return res.json();
  }
  