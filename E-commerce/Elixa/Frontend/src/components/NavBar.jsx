import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FiShoppingCart } from "react-icons/fi";
import profileimg from "../assets/profileimg.jpg";

const NavBar = () => {
  const { user, isAuthenticated, logout } = useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`px-[7.4rem] py-4 flex justify-between items-center fixed top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled ? "bg-white" : "bg-transparent"
      }`}
    >
      <Link
        to="/"
        className={`text-2xl font-bold ${
          isScrolled ? "text-[#2a2b1e]" : "text-white"
        }`}
      >
        ELIXA
      </Link>

      <div className="flex items-center space-x-8">
        <ul className="hidden md:flex space-x-8">
          <li>
            <Link
              to="/"
              className={`text-sm ${
                isScrolled ? "text-[#2a2b1e]" : "text-white"
              } hover:text-gray-300 transition-colors`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/product"
              className={`text-sm ${
                isScrolled ? "text-[#2a2b1e]" : "text-white"
              } hover:text-gray-300 transition-colors`}
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={`text-sm ${
                isScrolled ? "text-[#2a2b1e]" : "text-white"
              } hover:text-gray-300 transition-colors`}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`text-sm ${
                isScrolled ? "text-[#2a2b1e]" : "text-white"
              } hover:text-gray-300 transition-colors`}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Auth/Cart Section */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link
                to="/cart"
                className={`relative p-2 ${
                  isScrolled ? "text-[#2a2b1e]" : "text-white"
                } hover:text-[#4B3832] transition-colors`}
              >
                <FiShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-[#4B3832] text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={profileimg}
                    alt="User Profile"
                    className="w-7 h-7 rounded-full object-cover border-2 border-white"
                    onError={(e) => {
                      console.error(
                        "Failed to load profile image:",
                        profileimg
                      );
                      e.target.style.display = "none";
                    }}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl z-50 overflow-hidden transition-all duration-300 ease-in-out">
                    <div className="py-2">
                      <div className="px-4 py-3 text-sm text-gray-900 border-b border-gray-200">
                        <p className="font-semibold text-base">
                          Hi, {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-300 transition-colors duration-200 transform hover:scale-105"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-300 transition-colors duration-200 transform hover:scale-105"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/cart"
                        className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-300 transition-colors duration-200 transform hover:scale-105 md:hidden"
                        onClick={() => setDropdownOpen(false)}
                      >
                        My Cart
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-300 transition-colors duration-200 border-t border-gray-200 transform hover:scale-105"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="w-full text-sm bg-[#4B3832] text-white py-1.5 px-4 rounded-lg hover:bg-[#3A1C1A] transition-colors flex items-center justify-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
