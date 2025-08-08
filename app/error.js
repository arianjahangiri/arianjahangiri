"use client";

export default function GlobalError({ error, reset }) {
  console.error("GlobalError:", error);
  return (
    <html>
      <body style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1>خطا در بارگذاری صفحه</h1>
        <p style={{ color: "#666" }}>
          مشکلی در رندر سمت‌سرور رخ داده است.
        </p>
        {/* اگر Next.js digest دارد، نمایش بده */}
        {"digest" in (error || {}) && (
          <p style={{ direction: "ltr" }}>digest: {error.digest}</p>
        )}
        <button onClick={() => reset()} style={{ marginTop: 12 }}>
          تلاش مجدد
        </button>
      </body>
    </html>
  );
}