import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import profileimg from "../assets/profileimg.jpg";

const NavBar = () => {
  const { user, isAuthenticated, logout, cart, backendUrl } =
    useContext(AppContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const cartItemCount =
    cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const profileImage = user?.image ? `${backendUrl}/${user.image}` : profileimg;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav
      className={`px-4 md:px-[7.4rem] py-4 flex justify-between items-center fixed top-0 z-50 w-full transition-colors duration-300 ${
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

      <div className="md:hidden flex items-center">
        <button onClick={toggleMobileMenu} className="focus:outline-none">
          {mobileMenuOpen ? (
            <FiX
              className={`w-6 h-6 ${
                isScrolled ? "text-[#2a2b1e]" : "text-white"
              }`}
            />
          ) : (
            <FiMenu
              className={`w-6 h-6 ${
                isScrolled ? "text-[#2a2b1e]" : "text-white"
              }`}
            />
          )}
        </button>
      </div>

      <div className="hidden md:flex items-center space-x-8">
        <ul className="flex space-x-8">
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
                  {cartItemCount}
                </span>
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <img
                    src={profileImage}
                    alt="User Profile"
                    className="w-7 h-7 rounded-full object-contain border-2 border-white"
                    onError={(e) => {
                      e.target.src = profileimg;
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
              className="text-sm bg-[#4B3832] text-white py-1.5 px-4 rounded-lg hover:bg-[#3A1C1A] transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-50">
          <ul className="flex flex-col items-center space-y-4 py-4">
            <li>
              <Link
                to="/"
                className="text-sm text-[#2a2b1e] hover:text-gray-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/product"
                className="text-sm text-[#2a2b1e] hover:text-gray-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-sm text-[#2a2b1e] hover:text-gray-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-sm text-[#2a2b1e] hover:text-gray-300 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/cart"
                    className="text-sm text-[#2a2b1e] hover:text-gray-300 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Cart
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="text-sm text-[#2a2b1e] hover:text-gray-300 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="text-sm text-[#2a2b1e] hover:text-gray-300 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-[#2a2b1e] hover:text-gray-300 transition-colors"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="text-sm bg-[#4B3832] text-white py-1.5 px-4 rounded-lg hover:bg-[#3A1C1A] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
