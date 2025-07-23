import mongoose from "mongoose";  

const ShopSchema = new mongoose.Schema(  
  {  
    title: {  
      type: String,  
      required: true,  
    },  
  },  
  {  
    timestamps: true,  
  }  
);  

 
const Shops = mongoose.models.Shops || mongoose.model("Shops", ShopSchema);  

export default Shops; 