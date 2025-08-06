import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },
  },
  { timestamps: true }
);

// ایجاد یک ایندکس ترکیبی برای جلوگیری از تکرار
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);

export default Favorite;