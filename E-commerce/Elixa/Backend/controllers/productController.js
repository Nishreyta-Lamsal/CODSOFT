import mongoose from "mongoose";
import productModel from "../models/productModel.js";

// Add a new product
const addProduct = async (req, res) => {
  try {
    const { name, description, category, price, quantity, isAvailable } =
      req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!name || !description || !category || !price || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newProduct = new productModel({
      name,
      image,
      description,
      category,
      price,
      quantity,
      isAvailable: isAvailable === "true" || isAvailable === true,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add product",
    });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update product",
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete product",
    });
  }
};

const getAllProducts = async (req, res) => {
    try {
      const products = await productModel.find({});
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch products",
      });
    }
  };

  
export { addProduct, updateProduct, deleteProduct, getAllProducts };
