import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CardComponent from "./CardComponent";
import { Link } from "react-router-dom";
import landingpage from "../assets/landingpage.png";
import bgImg from "../assets/bg-image1.jpg";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const HomePage = () => {
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const categories = ["Dress", "Tops", "Bottoms", "Outerwear"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (!backendUrl) {
          throw new Error("Backend URL not configured");
        }
        const response = await fetch(`${backendUrl}/api/admin/get-products`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const productsArray = Array.isArray(data.data)
          ? data.data.map((product) => ({
              ...product,
              id: product._id,
              image: `${backendUrl}${product.image}`,
            }))
          : [];
        setProducts(productsArray);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [backendUrl]);

  const getCategoryImage = (category) => {
    if (!Array.isArray(products) || products.length === 0) {
      return "https://via.placeholder.com/288x288";
    }
    const product = products.find((p) => p.category === category);
    return product ? product.image : "https://via.placeholder.com/288x288";
  };

  // Render static content even if there's an error
  return (
    <div className="bg-gray-100">
      <div className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img
          className="object-cover w-full h-full max-w-full opacity-90"
          style={{ imageRendering: "crisp-edges" }}
          src={landingpage}
          alt="Elixar fashion collection"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif tracking-tight">
              Where Style Meets Soul
            </h1>
            <div className="w-56 h-[2px] bg-[#D4AF37] mx-auto mb-10"></div>
            <motion.p
              className="text-lg md:text-xl mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Step into a world where fashion isn't just worn — it's felt. At
              Elixa, we blend timeless elegance with bold modern flair, creating
              clothing that speaks to your individuality.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Link
                to="/product"
                className="px-6 py-3 border border-[#4B3832] rounded bg-[#4B3832] hover:bg-[#342622] text-white text-center transition duration-300 transform hover:scale-105"
              >
                Discover Collections
              </Link>
            </motion.div>
          </motion.div>
          <motion.p
            className="absolute bottom-8 text-xl italic w-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Be iconic. <span className="font-bold">Be Elixa.</span>
          </motion.p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="max-w-8xl bg-white py-6 pt-16">
          <h2 className="text-3xl font-bold font-serif text-[#4B3832] mb-2 text-center relative">
            Shop By Category
          </h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-10"></div>
          <div className="flex flex-wrap justify-center gap-10">
            {categories.map((category) => (
              <Link
                key={category}
                to={`/product?category=${category}`}
                className="w-full sm:w-72 h-72 relative flex items-center"
              >
                <img
                  src={getCategoryImage(category)}
                  alt={`${category} category`}
                  className="w-full h-full object-contain rounded-lg shadow-md"
                />
                <div className="absolute inset-0 bg-black/60 bg-opacity-30 rounded-lg"></div>
                <p className="absolute text-3xl font-extrabold top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white z-10">
                  {category}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="py-12 sm:px-6 lg:px-[4.6rem] bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-8xl mx-12"
          >
            <h2 className="text-3xl font-bold font-serif text-[#4B3832] mb-2 text-center relative">
              Featured Products
            </h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-10"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
              {Array.isArray(products) && products.length > 0 ? (
                products.slice(0, 8).map((product) => (
                  <Link
                    key={product.id || product._id}
                    to={`/productdetails/${product.id || product._id}`}
                    className="block"
                  >
                    <CardComponent
                      image={product.image}
                      name={product.name}
                      category={product.category}
                      price={product.price}
                      className="cursor-pointer"
                    />
                  </Link>
                ))
              ) : (
                <p className="text-center col-span-full">
                  No products available at the moment.
                </p>
              )}
            </div>
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}
          </motion.div>
        </div>
      )}
      <div className="relative py-10 bg-[#4B3832] text-white">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img
          className="object-cover w-full h-full absolute inset-0 opacity-50"
          src={bgImg}
          alt="Join Our Family Background"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 max-w-4xl mx-auto text-center px-4"
        >
          <h2 className="text-2xl md:text-4xl font-bold font-serif mb-10 relative">
            Join Our Family
          </h2>
          <p className="text-lg md:text-lg mb-8 leading-relaxed">
            Become a part of our vibrant community that celebrates style,
            individuality, and creativity. Log in or sign up to unlock exclusive
            member benefits and personalize your Elixa experience.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3 border border-[#4B3832] rounded bg-[#4B3832] hover:bg-[#342622] text-white text-center transition duration-300 transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default HomePage;
