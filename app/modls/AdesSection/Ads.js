import mongoose from "mongoose";

const AdsSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "slideshow name is required"],
        trim: true,
      },
      UrlLink: {
        type: String,
       
        trim: true,
      },
    
      
      imageUrl: {
        type: String,
        required: true,
        trim: true,
      },
  },
  { timestamps: true }
);

export default mongoose.models.Adssection ||
  mongoose.model("Adssection", AdsSchema);
