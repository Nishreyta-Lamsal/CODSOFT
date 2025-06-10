import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import login from "../assets/login.png";
import bgImg from "../assets/bg-image1.jpg";

const Login = () => {
  const { backendUrl, login: loginUser } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      toast.info("You are already logged in!", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/");
      }, 2000);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Login API response:", data);

      if (data.success) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 5000,
        });
        loginUser(data.user, data.token);
        navigate("/");
      } else {
        toast.error(data.message, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      toast.error("Failed to connect to the server. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get("verified");
    const error = params.get("error");

    if (verified === "true") {
      toast.success("Email verified successfully! Please log in.", {
        position: "top-right",
        autoClose: 5000,
      });
    } else if (error) {
      toast.error(decodeURIComponent(error), {
        position: "top-right",
        autoClose: 5000,
      });
    }
  }, [location.search]);

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
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-start">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
            ELIXA
          </h1>
          <h2 className="text-lg sm:text-xl font-medium text-gray-700 mb-3">
            Login
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mb-4">
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
            <button
              type="submit"
              className="w-full bg-[#4B3832] text-white py-2 px-4 rounded-full hover:bg-[#3A1C1A] transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              Login
            </button>
            <p className="text-xs sm:text-sm text-gray-500 mt-4 text-center">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#4B3832] underline hover:text-[#3A1C1A] transition-colors"
              >
                Register
              </Link>
            </p>
          </form>
        </div>
        <div
          className="hidden md:block md:w-1/2 bg-cover bg-center border-1 border-gray-200 bg-gray-200"
          style={{
            backgroundImage: login
              ? `url(${login})`
              : "url(https://via.placeholder.com/300)",
          }}
        ></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
