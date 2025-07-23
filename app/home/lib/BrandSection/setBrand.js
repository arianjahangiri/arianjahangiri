export async function setBrandImage({ formData, id }) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/Brandsection/${id}`,
      { 
        method: "PUT",
        body: formData,
      }
    );

    if (!res.ok) {
      throw new Error("مشکلی در دریافت محصولات پربازدید رخ داده است");
    }

    return res.json();
}
