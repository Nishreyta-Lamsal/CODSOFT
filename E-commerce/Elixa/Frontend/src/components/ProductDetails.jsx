import React, { useState, useEffect, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ProductCardComponent from "./ProductCardComponent";

const ProductDetails = () => {
  const { backendUrl, token, isAuthenticated, logout } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false); 

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/admin/get-product/${id}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch product: ${response.statusText}`);
        }
        const responseData = await response.json();
        setProduct(responseData.data);
        setLoading(false);

        if (responseData.data) {
          const normalizedCategory = responseData.data.category.toLowerCase();
          fetchRelatedProducts(normalizedCategory);
        }
      } catch (err) {
        setError(err.message);
        toast.error(`Error loading product: ${err.message}`);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, backendUrl]);

  const fetchRelatedProducts = useCallback(
    async (category) => {
      setRelatedLoading(true);
      try {
        const response = await fetch(
          `${backendUrl}/api/admin/get-products?category=${encodeURIComponent(
            category
          )}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch related products: ${response.statusText}`
          );
        }
        const responseData = await response.json();
        console.log("Related products API response:", responseData);
        const related = Array.isArray(responseData.data)
          ? responseData.data
              .filter(
                (p) =>
                  p._id !== id &&
                  p.category.toLowerCase() === category.toLowerCase()
              )
              .slice(0, 4)
          : [];
        console.log("Filtered related products:", related);
        setRelatedProducts(related);
      } catch (err) {
        console.error("Error fetching related products:", err);
        toast.error("Failed to load related products");
      } finally {
        setRelatedLoading(false);
      }
    },
    [backendUrl, id]
  );

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated || !token) {
      toast.error("Please log in to add items to your cart");
      navigate("/login");
      return;
    }

    console.log("Token sent in request:", token);
    setIsAddingToCart(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/cart-add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          quantity,
        }),
      });

      const responseData = await response.json();

      if (response.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        logout();
        navigate("/login");
        return;
      }

      if (responseData.success) {
        toast.success(`${quantity} ${product.name} added to cart`);
        navigate("/cart");
      } else {
        toast.error(responseData.message || "Failed to add product to cart");
      }
    } catch (error) {
      toast.error("An error occurred while adding to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
        <div className="text-2xl font-serif text-red-600">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#4B3832] transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
        <div className="text-2xl font-serif text-[#4B3832]">
          Product not found
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#4B3832] transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F2] min-h-screen">
      <div className="relative h-16 overflow-hidden bg-[#745d46]"></div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer position="bottom-right" />

        <div className="max-w-7xl mx-auto mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-[#4B3832] hover:text-[#D4AF37]"
                >
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-[#4B3832] mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <Link
                    to="/product"
                    className="ml-1 text-sm font-medium text-[#4B3832] hover:text-[#D4AF37] md:ml-2"
                  >
                    Products
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-[#4B3832] mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-[#D4AF37] md:ml-2">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="space-y-4">
              <div className="relative overflow-hidden h-96 bg-gray-100 rounded-lg">
                <img
                  src={`http://localhost:5000${
                    product.images?.[selectedImage] || product.image
                  }`}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                <div className="absolute top-2 right-2 bg-[#D4AF37] text-white text-xs px-2 py-1 rounded">
                  {product.category}
                </div>
              </div>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 bg-gray-100 rounded overflow-hidden ${
                        selectedImage === index ? "ring-2 ring-[#D4AF37]" : ""
                      }`}
                    >
                      <img
                        src={`http://localhost:5000${img}`}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl font-serif font-bold text-[#4B3832] mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-4">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < (product.rating || 4)
                          ? "fill-current"
                          : "fill-none stroke-current"
                      }`}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        strokeWidth="1"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">
                  ({product.reviews?.length || 0} reviews)
                </span>
              </div>

              <div className="text-2xl font-serif text-[#D4AF37] font-bold mb-6">
                ${product.price}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {product.details && (
                <div className="mb-6">
                  <h3 className="font-serif font-semibold text-[#4B3832] mb-2">
                    Product Details
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    {product.details.split("\n").map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#4B3832] mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="w-16 py-1 text-center border-t border-b border-gray-300"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button
                  onClick={addToCart}
                  disabled={
                    isAddingToCart ||
                    (product.quantity !== undefined &&
                      product.quantity < quantity) ||
                    !product.isAvailable
                  }
                  className={`px-6 py-3 bg-[#D4AF37] text-white rounded hover:bg-[#4B3832] transition flex-1 ${
                    isAddingToCart ||
                    (product.quantity !== undefined &&
                      product.quantity < quantity) ||
                    !product.isAvailable
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto mt-16">
          <h2 className="text-2xl font-serif font-bold text-[#4B3832] mb-8">
            You May Also Like
          </h2>
          {relatedLoading ? (
            <div className="text-center text-[#4B3832]">
              Loading related products...
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCardComponent
                  key={product._id}
                  _id={product._id}
                  image={product.image}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  description={product.description}
                  backendUrl={backendUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-[#4B3832]">
              No related products found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
