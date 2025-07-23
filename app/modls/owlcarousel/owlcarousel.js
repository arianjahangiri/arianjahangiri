import mongoose from "mongoose";  

const owlcarouselSchema = new mongoose.Schema(  
  {  
    name: {  
      type: String,  
      required: [true, "Slideshow name is required"],  
      trim: true,  
    },      UrlLink: {  
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

// Check if the model already exists, if not create it  
const owlcarousel = mongoose.models.owlcarousel || mongoose.model("owlcarousel", owlcarouselSchema);  

export default owlcarousel;  