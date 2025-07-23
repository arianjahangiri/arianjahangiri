export async function getAdsImage() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/AdsSection`,
      { 
        // cache: "force-cache",
      }
    );
  
    if (!res.ok) {
      throw new Error("مشکلی در دریافت دسته بندی رخ داده است");
    }
  
    return res.json();
  }
  