import mongoose from "mongoose";

const ProductGallerySchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, "slideshow name is required"],
        trim: true,
      },
   
      
         ProductID: {
            type: mongoose.Schema.Types.ObjectId,
            
            ref: "product",
        
          },
      imageUrl: {
        type: String,
        required: true,
        trim: true,
      },
  },
  { timestamps: true }
);

export default mongoose.models.ProductGallery ||
  mongoose.model("ProductGallery", ProductGallerySchema);
