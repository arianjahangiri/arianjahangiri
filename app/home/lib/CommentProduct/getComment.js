export async function getComment(id) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/comment/${id}`,
      {  next: { revalidate: 200 },
   cache: "force-cache",
      }
    );
  
    if (!res.ok) {
      throw new Error("مشکلی در دریافت دسته بندی رخ داده است");
    }
  
    return res.json();
  }
  