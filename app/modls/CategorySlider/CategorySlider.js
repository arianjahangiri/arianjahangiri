import mongoose from "mongoose";

const CategorySliderSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "CategorySlider name is required"],
        trim: true,
      },
      UrlLink: {
        type: String,
          required: [true, "CategorySlider UrlLink is required"],
        trim: true,
      },
    
      
      imageUrl: {
        type: String,
           required: [true, "imageUrl UrlLink is required"],
   
        trim: true,
      },
  },
  { timestamps: true }
);

export default mongoose.models.CategorySlider ||
  mongoose.model("CategorySlider", CategorySliderSchema);
