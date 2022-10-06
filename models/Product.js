const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    category: { type: String, required: true },
    size: { type: String },
    color: { type: String },
    price: { type: Number, required: true },
    avilableQty: { type: Number, required: true },
  },
  { timestamps: true }
);

/* both are same export method
  mongoose.models = {};
  export default mongoose.model("Product", ProductSchema);
*/
export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
