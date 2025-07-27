export async function setComment(text, productId, userId, isApproval) {
  const res = await fetch("https://arianjahangiri.vercel.app/api/comment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      productId,
      userId,
      isApproval,
    }),
  });

  if (!res.ok) {
    throw new Error("مشکلی در ساخت کامنت شما به وجود آمده است");
  }

  return res.json();
}
