import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1,
      },
    },
  ],
  discountPrice: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  finalPrice: {
    type: Number,
    required: true,
  },
  final_address: {
    type: String,
    default: " s ",
 
  }
  ,
  status: {
    type: String,
    required: true,

    enum: ["در انتظار  پرداخت  ", "درحال پردازش  ", "تکمیل شده  ", "لغو شده  "],
    default: "در انتظار  پرداخت  ",
  },

}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);