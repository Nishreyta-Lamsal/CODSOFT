import React from "react";
import { Link } from "react-router-dom";

const ProductCardComponent = ({
  _id,
  image,
  name,
  category,
  price,
  description,
  backendUrl,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer">
      <Link to={`/productdetails/${_id}`}>
        <div className="relative overflow-hidden h-64">
          <img
            src={`${backendUrl}${image}`}
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
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {description || "No description available"}
          </p>
          <div className="flex justify-between items-center mt-3">
            <span className="font-serif text-[#D4AF37] font-bold">
              ${price}
            </span>
            <button className="text-[#4B3832] hover:text-[#D4AF37] transition cursor-pointer">
              View Details
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCardComponent;
