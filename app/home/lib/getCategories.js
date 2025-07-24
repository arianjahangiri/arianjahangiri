export async function getCategories() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/home-menu`,
    {
      cache: "no-cache",
    }
  );
 
  if (!res.ok) {
    throw new Error("مشکلی در دریافت دسته بندی رخ داده است");
  }

  return res.json();
}
