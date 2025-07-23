export async function setslideshowImage({ formData, id }) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/SlideShow/${id}`,
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
