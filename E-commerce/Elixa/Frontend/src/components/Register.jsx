import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login from "../assets/profile.jpg";
import bgImg from "../assets/bg-image1.jpg";
import { Link } from "react-router-dom";

const Register = () => {
  const { backendUrl } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    image: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          phone: "",
          dob: "",
          gender: "",
          address: "",
          image: "",
        });
      } else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      toast.error("Failed to connect to the server. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="w-full max-w-full sm:max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row border-1 border-gray-200">
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center bg-white bg-opacity-90">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            ELIXA
          </h1>
          <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-4">
            Register
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">
            Choose from 20+ products across 5+ categories
          </p>
          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-brown-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-brown-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-brown-500 text-sm sm:text-base"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs sm:text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-brown-500 text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#4B3832] text-white py-2 px-4 rounded-full hover:bg-[#3A1C1A] transition-colors flex items-center justify-center text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : null}
              {isLoading ? "Registering..." : "Register"}
            </button>
            <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#4B3832] underline hover:text-[#3A1C1A] transition-colors"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${login})` }}
        ></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
