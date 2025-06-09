import express from "express";
import {getUserProfile, loginUser, registerUser, updateUserProfile, verifyEmail } from "../controllers/userController.js";
import { authUser } from "../authentication/authUser.js";
import { addToCart, removeFromCart, updateCart, viewCart } from "../controllers/cartController.js";
import upload from "../multer/multer.js";
import { createContact } from "../controllers/contactController.js";

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

export default userRouter;
