import mongoose from "mongoose";
import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";
import { authUser } from "../authentication/authUser.js";

const addToCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    if (!product.isAvailable || product.quantity < quantity) {
      return res.json({
        success: false,
        message: "Product is not available or insufficient stock",
      });
    }

    let cart = await cartModel.findOne({ user: userId, status: "pending" });
    if (!cart) {
      cart = new cartModel({ user: userId, items: [], totalPrice: 0 });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    product.quantity -= quantity;
    if (product.quantity === 0) {
      product.isAvailable = false;
    }
    await product.save();

    const products = await productModel.find({
      _id: { $in: cart.items.map((item) => item.product) },
    });
    cart.totalPrice = cart.items.reduce((total, item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString()
      );
      return total + product.price * item.quantity;
    }, 0);

    await cart.save();

    const populatedCart = await cartModel
      .findById(cart._id)
      .populate("items.product");

    res.json({
      success: true,
      message: "Product added to cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.json({ success: false, message: "Server error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }

    const cart = await cartModel.findOne({ user: userId, status: "pending" });
    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.json({ success: false, message: "Product not in cart" });
    }

    const removedQuantity = cart.items[itemIndex].quantity;
    cart.items.splice(itemIndex, 1);

    const product = await productModel.findById(productId);
    if (product) {
      product.quantity += removedQuantity;
      product.isAvailable = true;
      await product.save();
    }

    if (cart.items.length > 0) {
      const products = await productModel.find({
        _id: { $in: cart.items.map((item) => item.product) },
      });
      cart.totalPrice = cart.items.reduce((total, item) => {
        const product = products.find(
          (p) => p._id.toString() === item.product.toString()
        );
        return total + product.price * item.quantity;
      }, 0);
    } else {
      cart.totalPrice = 0;
    }

    await cart.save();

    const populatedCart = await cartModel
      .findById(cart._id)
      .populate("items.product");

    res.json({
      success: true,
      message: "Product removed from cart",
      cart: populatedCart,
    });
  } catch (error) {
    res.json({ success: false, message: "Server error" });
  }
};

const viewCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user._id;

    const cart = await cartModel
      .findOne({ user: userId, status: "pending" })
      .populate("items.product");

    if (!cart) {
      return res.json({
        success: true,
        message: "No pending cart found",
        cart: { items: [], totalPrice: 0 },
      });
    }

    res.json({ success: true, message: "Cart retrieved successfully", cart });
  } catch (error) {
    res.json({ success: false, message: "Server error" });
  }
};

const updateCart = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    const userId = req.user._id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.json({ success: false, message: "Product ID is required" });
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const cart = await cartModel.findOne({ user: userId, status: "pending" });
    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.json({ success: false, message: "Product not in cart" });
    }

    const oldQuantity = cart.items[itemIndex].quantity;
    const quantityDifference = quantity - oldQuantity;

    if (quantityDifference > 0 && product.quantity < quantityDifference) {
      return res.json({
        success: false,
        message: "Insufficient stock for requested quantity",
      });
    }

    product.quantity -= quantityDifference;
    if (product.quantity === 0) {
      product.isAvailable = false;
    } else {
      product.isAvailable = true;
    }
    await product.save();

    cart.items[itemIndex].quantity = quantity;

    const products = await productModel.find({
      _id: { $in: cart.items.map((item) => item.product) },
    });
    cart.totalPrice = cart.items.reduce((total, item) => {
      const product = products.find(
        (p) => p._id.toString() === item.product.toString()
      );
      return total + product.price * item.quantity;
    }, 0);

    await cart.save();

    const populatedCart = await cartModel
      .findById(cart._id)
      .populate("items.product");

    res.json({
      success: true,
      message: "Cart updated successfully",
      cart: populatedCart,
    });
  } catch (error) {
    res.json({ success: false, message: "Server error" });
  }
};

export { addToCart, removeFromCart, viewCart, updateCart };
