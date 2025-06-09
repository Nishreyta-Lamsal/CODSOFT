import React, { useState } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const ContactUs = () => {
  const { backendUrl } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic frontend validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("All fields are required", {
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)
    ) {
      toast.error("Invalid email address", {
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    if (
      ![
        "Product Inquiry",
        "Order Support",
        "Collaboration",
        "Other",
      ].includes(formData.subject)
    ) {
      toast.error("Please select a valid subject", {
        autoClose: 3000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message, {
          autoClose: 3000,
        });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.message || "Failed to submit message", {
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("Server error, please try again later", {
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8F5F2]">
      <div className="relative h-16 overflow-hidden bg-[#745d46]"></div>

      <div className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-serif text-[#4B3832] mb-8 relative">
              <span className="absolute -left-4 top-0 h-full w-1 bg-[#D4AF37]"></span>
              Get In Touch
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Have questions about our collections, need styling advice, or want
              to explore collaboration opportunities? Fill out the form and our
              team will get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="text-[#D4AF37] mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4B3832]">
                    Email Us
                  </h3>
                  <p className="text-gray-600"> support@elixa.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-[#D4AF37] mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4B3832]">Call Us</h3>
                  <p className="text-gray-600">+977 9872625244</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-[#D4AF37] mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif text-lg text-[#4B3832]">
                    Visit Us
                  </h3>
                  <p className="text-gray-600">Baluwatar, Kathmandu</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-lg shadow-lg border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition"
                  placeholder="Enter your name"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition"
                  disabled={isSubmitting}
                >
                  <option value="">Select a subject</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition"
                  placeholder="Your message here..."
                  disabled={isSubmitting}
                ></textarea>
              </div>
              <div className="flex justify-center items-center">
                <button
                  type="submit"
                  className={`px-6 py-3 border border-[#4B3832] rounded bg-[#4B3832] hover:bg-[#342622] text-white text-center transition duration-300 transform hover:scale-105 ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
};

export default ContactUs;
