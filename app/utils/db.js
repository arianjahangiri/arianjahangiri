import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("اتصال به دیتابیس پیدا نشد");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connect() {
  if (cached.conn) {
    console.log("استفاده از اتصال کش‌شده به دیتابیس");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("ایجاد اتصال جدید به دیتابیس");
    cached.promise = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .then((mongoose) => {
        console.log("اتصال به دیتابیس برقرار شد");
        return mongoose;
      })
      .catch((err) => {
        console.error("خطا در اتصال به دیتابیس:", err);
        cached.promise = null;
        throw err;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connect;
