import express from "express";
import {loginUser, registerUser, verifyEmail } from "../controllers/userController.js";
import { authUser } from "../authentication/authUser.js";
import { addToCart, removeFromCart, updateCart, viewCart } from "../controllers/cartController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/verify/:token", verifyEmail);
userRouter.post("/login", loginUser);
userRouter.post("/cart-add", authUser, addToCart);
userRouter.delete("/cart-remove", authUser, removeFromCart);
userRouter.get("/cart-view", authUser, viewCart);
userRouter.put("/cart-update", authUser, updateCart);

export default userRouter;
