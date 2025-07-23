import mongoose from "mongoose";

const SubmenuSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
  
    UrlLink: {
      type: Number,
      required: true,
    },
   
 
   
    
  },
  { timestamps: true }
);

export default mongoose.models.Submenu ||
  mongoose.model("Submenu", SubmenuSchema);
