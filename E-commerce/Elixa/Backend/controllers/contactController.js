import Contact from "../models/contactModel.js";

const createContact = async (req, res) => {
  try {

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const validEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      email
    );
    if (!validEmail) {
      return res.json({ success: false, message: "Invalid email address" });
    }

    const validSubjects = [
      "Product Inquiry",
      "Order Support",
      "Collaboration",
      "Press",
      "Other",
    ];
    if (!validSubjects.includes(subject)) {
      return res.json({ success: false, message: "Invalid subject" });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      user: req.user ? req.user._id : null, 
    });

    await contact.save();

    res.json({
      success: true,
      message: "Contact message submitted successfully",
      contact: {
        _id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        createdAt: contact.createdAt,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.json({ success: false, message: errors.join(", ") });
    }
    res.json({ success: false, message: "Server error" });
  }
};

export { createContact };
