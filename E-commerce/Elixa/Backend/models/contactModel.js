import mongoose from "mongoose";
import validator from "validator";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      enum: {
        values: [
          "Product Inquiry",
          "Order Support",
          "Collaboration",
          "Other",
        ],
        message: "Invalid subject",
      },
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters long"],
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
