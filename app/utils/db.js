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
    mongoose.set("strictQuery", true); // جلوگیری از Warning های MongoDB
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("✅ MongoDB Connected Successfully");
        return mongoose;
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
