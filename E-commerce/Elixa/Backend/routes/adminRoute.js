import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../multer/multer.js";

const adminRouter = express.Router();

adminRouter.post("/add-product", upload.single("image"), addProduct);
adminRouter.put("/update-product/:id", upload.single("image"), updateProduct);
adminRouter.delete("/delete-product/:id", deleteProduct);
adminRouter.get("/get-products", getAllProducts);
adminRouter.get("/get-product/:id", getProductById);

export default adminRouter;
