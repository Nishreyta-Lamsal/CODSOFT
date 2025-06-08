import express from "express";
import {loginUser, registerUser, verifyEmail } from "../controllers/userController.js";
import { authUser } from "../authentication/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.get("/verify/:token", verifyEmail);
userRouter.post("/login", loginUser);

export default userRouter;
