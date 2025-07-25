import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: { 
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories", // اینجا باید با نام مدل شما یکسان باشد
      required: true,
    }, 
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.product ||
  mongoose.model("product", ProductSchema);
