export async function getslideshowImage() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/SlideShow`,
  
      {
     cache: "force-cache",
      }
    );
   
    if (!res.ok) {
      throw new Error("مشکلی در دریافت محصولات پربازدید رخ داده است");
    }
  
    return res.json();
  }
  