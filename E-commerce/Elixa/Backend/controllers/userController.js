import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      image,
      address,
      gender,
      dob,
      phone,
    } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.json({
        success: false,
        message: "Name, email, password, and confirm password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    if (password !== confirmPassword) {
      return res.json({ success: false, message: "Passwords do not match" });
    }

    if (
      phone &&
      !validator.isMobilePhone(phone, "any", { strictMode: false })
    ) {
      return res.json({
        success: false,
        message: "Enter a valid phone number",
      });
    }

    if (
      dob &&
      !validator.isDate(dob, { format: "YYYY-MM-DD", strictMode: true })
    ) {
      return res.json({
        success: false,
        message: "Enter a valid date of birth (YYYY-MM-DD)",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
      image: image || undefined,
      address: address || { line1: "", line2: "" },
      gender: gender || "Not Selected",
      dob: dob || "Not Selected",
      phone: phone || "0000000000",
    });

    await newUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("BACKEND_URL:", process.env.BACKEND_URL);

    const verificationLink = `${process.env.BACKEND_URL}/api/user/verify/${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Elixa - Verify Your Email",
      html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  background-color: #e9ecef;
                  margin: 0;
                  padding: 0;
                  line-height: 1.5;
                }
                .container {
                  max-width: 580px;
                  margin: 20px auto;
                  background-color: #ffffff;
                  border-radius: 8px;
                  overflow: hidden;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                  background-color: #000000;
                  color: #ffffff;
                  padding: 30px 20px;
                  text-align: center;
                }
                .header h1 {
                  margin: 0;
                  font-size: 24px;
                  font-weight: 500;
                }
                .content {
                  padding: 25px;
                  text-align: center;
                  color: #212529;
                }
                .content p {
                  font-size: 15px;
                  margin: 0 0 15px;
                }
                .button {
                  display: inline-block;
                  padding: 12px 25px;
                  background-color: #000000;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 20px;
                  font-size: 15px;
                  font-weight: 500;
                  transition: transform 0.2s ease;
                }
                .footer {
                  background-color: #f1f3f5;
                  text-align: center;
                  font-size: 11px;
                  color: #495057;
                  padding: 15px;
                }
                .footer a {
                  color: #000000;
                  text-decoration: none;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Welcome, ${name}!</h1>
                </div>
                <div class="content">
                  <p>Thanks for joining Elixa!</p>
                  <p>Please verify your email by clicking below:</p>
                  <a href="${verificationLink}" 
                      class="button" 
                      style="display:inline-block; padding:12px 25px; background-color:#000000; color:#ffffff; text-decoration:none; border-radius:20px; font-size:15px; font-weight:500;">
                      Verify Email
                      </a>
                </div>
                <div class="footer">
                  <p>Ignore this email if you didn’t sign up.</p>
                  <p>© ${new Date().getFullYear()} Elixa. All rights reserved.</p>
                </div>
              </div>
            </body>
            </html>
          `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "User registered. Verify the link sent to your email to login.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await userModel.findOne({ verificationToken: token });

    if (!user) {
      const errorUrl = `${
        process.env.FRONTEND_URL
      }/login?error=${encodeURIComponent("Invalid or expired token")}`;
      return res.redirect(errorUrl);
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const successUrl = `${process.env.FRONTEND_URL}login?verified=true`;
    return res.redirect(successUrl);
  } catch (error) {
    const errorUrl = `${
      process.env.FRONTEND_URL
    }login?error=${encodeURIComponent("Server error during verification")}`;
    return res.redirect(errorUrl);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.isVerified) {
      return res.json({ success: false, message: "Please verify your email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export {registerUser, verifyEmail, loginUser };