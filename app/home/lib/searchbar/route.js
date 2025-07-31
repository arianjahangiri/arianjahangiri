export async function getSearchResults(query) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/product/search?q=${query}`);
  if (!res.ok) {
    throw new Error("خطا در دریافت نتایج جستجو");
  }
  return res.json();
}