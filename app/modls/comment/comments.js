import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product", 
      required: [true],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",  
      required: [true],
    },
    text: {
      type: String,
      required: [true, "text is required"],
      trim: true,
    },
    isApproval: {
      type: Boolean,
      default:false,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.comment ||
  mongoose.model("comment", commentSchema);
