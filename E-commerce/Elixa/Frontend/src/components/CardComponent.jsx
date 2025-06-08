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
    <div className="w-full max-w-xs bg-white shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 border border-white">
      <div
        className="w-full h-52 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-600">{category}</p>
        </div>
        <p className="text-xl font-bold text-gray-900">${price.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className="w-full border-1 border-[#3A1C1A] text-[#3A1C1A] py-2 px-4 rounded-lg hover:bg-[#3A1C1A] hover:text-white transition-colors duration-200 font-medium"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default CardComponent;
