import mongoose from "mongoose";
import orderModel from "../models/orderModel.js";

const viewOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user._id;

    const orders = await orderModel
      .find({ user: userId, status: "purchased" })
      .populate({
        path: "items.product",
        select: "name price description image",
      })
      .sort({ createdAt: -1 }); 

    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        message: "No purchased orders found",
        orders: [],
      });
    }

    res.json({
      success: true,
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    res.json({ success: false, message: "Server error" });
  }
};

export { viewOrders };
