import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
  
    phone: {
      type: String ,
      required: true,
    },
   
    isAdmin: {
      type: Boolean,
      default: false,
    },
         Image_profile: {
      type: String,
   
    },

    
  },
  { timestamps: true }
);

export default mongoose.models.users ||
  mongoose.model("users", UsersSchema);
