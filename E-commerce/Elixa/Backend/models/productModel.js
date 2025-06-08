import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 0 },
  isAvailable: { type: Boolean, default: true },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
