import React from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardComponent = ({
  image = "https://via.placeholder.com/300x200",
  name = "Product Name",
  category = "Category",
  price = 0,
}) => {
  const handleAddToCart = () => {
    toast.success(`${name} added to cart!`, {
      position: "top-right",
      autoClose: 3000,
      theme: "light",
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
      <div className="relative overflow-hidden h-64">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain transition duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-[#D4AF37] text-white text-xs px-2 py-1 rounded">
          {category}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-[#4B3832] mb-1">
          {name}
        </h3>
        <div className="flex justify-between items-center mt-3">
          <span className="font-serif text-[#D4AF37] font-bold">
            ${price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="text-[#4B3832] hover:text-[#D4AF37] transition cursor-pointer"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
