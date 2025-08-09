import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI در env تعریف نشده است.");
}

// کش کردن اتصال در سطح Global برای جلوگیری از چند اتصال در محیط Dev
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    // ✅ اتصال قبلی را استفاده می‌کنیم
    return cached.conn;
  }

  if (!cached.promise) {
    // تنظیمات به‌روز بدون استفاده از گزینه‌های منسوخ‌شده
    mongoose.set("strictQuery", true); // جلوگیری از Warning های MongoDB

    cached.promise = mongoose
      .connect(MONGODB_URI) // بدون useNewUrlParser و useUnifiedTopology
      .then((mongooseInstance) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB Connection Failed:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;