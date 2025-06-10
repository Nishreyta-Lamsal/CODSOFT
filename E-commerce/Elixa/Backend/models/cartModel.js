import mongoose from "mongoose";
import orderModel from "./orderModel.js";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "active", "purchased", "cancelled"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre("save", async function (next) {
  if (this.isModified("status") && this.status === "purchased") {
    try {
      const order = new orderModel({
        user: this.user,
        cart: this._id,
        items: this.items,
        totalPrice: this.totalPrice,
        status: "purchased",
      });
      await order.save();
    } catch (error) {
      return next(error); 
    }
  }
  next();
});

const cartModel = mongoose.models.cart || mongoose.model("cart", cartSchema);

export default cartModel;
