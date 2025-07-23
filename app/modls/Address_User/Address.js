 
import mongoose from "mongoose";

const UserAddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
 
  address:[ {
    type: String,
    required: true,
  }],
}, { timestamps: true });

export default mongoose.models.UserAddress || mongoose.model("UserAddress", UserAddressSchema);
