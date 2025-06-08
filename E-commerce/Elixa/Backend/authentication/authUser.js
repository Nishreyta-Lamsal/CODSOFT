import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res.json({ success: false, message: "Email not verified" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.json({ success: false, message: "Invalid token" });
  }
};
