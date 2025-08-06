export async function getProduct({id}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/${id}`,
    { next: { revalidate: 60 },
      cache: "force-cache",

    }
  );
 
  if (!res.ok) {
    throw new Error("مشکلی در دریافت محصولات پربازدید رخ داده است");
  }

  return res.json();
}
