import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext } from "react";

const Products = () => {
  const { backendUrl } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortOption, setSortOption] = useState("featured");

  const categories = ["All", "Dress", "Tops", "Bottoms", "Outerwear"];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/admin/get-products`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const responseData = await response.json();
        const productsArray = Array.isArray(responseData.data)
          ? responseData.data
          : [];
        setProducts(productsArray);
        setFilteredProducts(productsArray);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        toast.error(`Error loading products: ${err.message}`);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters whenever they change
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default: // "featured" or default
        // Keep original order or implement your featured logic
        break;
    }

    setFilteredProducts(result);
  }, [searchQuery, selectedCategory, priceRange, sortOption, products]);

  const handlePriceChange = (e, index) => {
    const newPriceRange = [...priceRange];
    newPriceRange[index] = Number(e.target.value);
    setPriceRange(newPriceRange);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
        <div className="text-2xl font-serif text-[#4B3832]">
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F5F2]">
        <div className="text-2xl font-serif text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F2] min-h-screen">
      {/* Added the same div as in Contact Us */}
      <div className="relative h-16 overflow-hidden bg-[#745d46]"></div>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer position="bottom-right" />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#4B3832] mb-4">
            Our Collection
          </h1>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </motion.div>

        {/* Filters Section */}
        <div className="max-w-7xl mx-auto mb-12 bg-white p-6 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search Filter */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-[#4B3832] mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search products..."
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-[#4B3832] mb-1"
              >
                Category
              </label>
              <select
                id="category"
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-[#4B3832] mb-1">
                Price Range: ${priceRange[0]} - ${priceRange[1]}
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  min="0"
                  max={priceRange[1]}
                  placeholder="Min"
                  className="p-2 border border-gray-300 rounded focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 0)}
                />
                <input
                  type="number"
                  min={priceRange[0]}
                  max="1000"
                  placeholder="Max"
                  className="p-2 border border-gray-300 rounded focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 1)}
                />
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label
                htmlFor="sort"
                className="block text-sm font-medium text-[#4B3832] mb-1"
              >
                Sort By
              </label>
              <select
                id="sort"
                className="w-full p-2 border border-gray-300 rounded focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-serif text-[#4B3832]">
              No products found
            </h3>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setPriceRange([0, 1000]);
                setSearchQuery("");
                setSortOption("featured");
              }}
              className="mt-4 px-4 py-2 bg-[#D4AF37] text-white rounded hover:bg-[#4B3832] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition duration-500 hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 bg-[#D4AF37] text-white text-xs px-2 py-1 rounded">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg font-semibold text-[#4B3832] mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-serif text-[#D4AF37] font-bold">
                        ${product.price}
                      </span>
                      <button className="text-[#4B3832] hover:text-[#D4AF37] transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
