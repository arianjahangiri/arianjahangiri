import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    discountcode: {
      type: String,
      required: [true, "discountcode is required"],
      unique: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: true, 
      min: [1," discount percentage must be greater than 0"],
      max:[100," discount percentage must be less than or equal to 100"],

    },
    Translations: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
   
    
  },
  { timestamps: true }
);

export default mongoose.models.discount ||
  mongoose.model("discount", discountSchema);
