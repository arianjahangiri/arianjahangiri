import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
 
    title: {
      type:String ,
      required: true,
    },      menu_dropdown: [
      {
        text:    { type: String, default: "" ,   required: true, },
        LinkUrl: { type: String, default: "" ,   required: true,},
      },

    ],
  },
  { timestamps: true }
);
// export default mongoose.models.CategoriesMenu || mongoose.model("CategoriesMenu", categorySchema);
// ...existing code...
export default mongoose.models.categories || mongoose.model("categories", CategorySchema);