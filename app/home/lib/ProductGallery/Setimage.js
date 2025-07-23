export async function setImageGallery(formData, productId) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/ProductGallery?ProductID=${productId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  return res;
}
