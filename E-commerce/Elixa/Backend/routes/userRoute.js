import express from "express";
import {getUserProfile, loginUser, registerUser, updateUserProfile, verifyEmail } from "../controllers/userController.js";
import { authUser } from "../authentication/authUser.js";
import { addToCart, removeFromCart, updateCart, viewCart } from "../controllers/cartController.js";
import upload from "../multer/multer.js";
import { createContact } from "../controllers/contactController.js";
import { initiatePayment, verifyPayment } from "../controllers/paymentController.js";
import { viewOrders } from "../controllers/orderController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/verify/:token", verifyEmail);
userRouter.post("/login", loginUser);
userRouter.post("/cart-add", authUser, addToCart);
userRouter.delete("/cart-remove", authUser, removeFromCart);
userRouter.get("/cart-view", authUser, viewCart);
userRouter.put("/cart-update", authUser, updateCart);
userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.put("/update-profile", authUser, upload.single("image"), updateUserProfile);
userRouter.post("/contact", createContact);
userRouter.post("/payment/initiate",authUser, initiatePayment);
userRouter.post("/payment/verify", authUser, verifyPayment);
userRouter.get("/orders", authUser, viewOrders);

export default userRouter;
