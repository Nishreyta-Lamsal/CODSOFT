import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Order = () => {
  const { backendUrl } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchasedOrders();
  }, []);

  const fetchPurchasedOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your purchased orders.");
        toast.error("Please log in to view your purchased orders");
        setLoading(false);
        return;
      }

      if (!backendUrl) {
        throw new Error("Backend URL not configured");
      }

      const response = await fetch(`${backendUrl}/api/user/orders`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error("Received non-JSON response from server");
      }

      const data = await response.json();
      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to fetch purchased orders");
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch purchased orders";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F8F5F2] min-h-screen">
      <div className="relative h-16 overflow-hidden bg-[#745d46]"></div>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
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
                    Purchased Orders
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-[#4B3832] mb-8">
            Your Purchased Orders
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-2xl font-serif text-[#4B3832]">
                Loading your purchased orders...
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.length > 0 ? (
                <>
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white p-6 rounded-lg shadow-sm border border-[#e8e1d9]"
                    >
                      <h3 className="text-xl font-serif font-semibold text-[#4B3832] mb-4">
                        Order ID: {order._id}
                      </h3>
                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.product._id}
                            className="flex flex-col md:flex-row items-center border-b border-[#e8e1d9] pb-4"
                          >
                            <div className="w-full md:w-1/4 mb-4 md:mb-0">
                              <img
                                src={
                                  `${backendUrl}${item.product.image}` ||
                                  "/placeholder-image.jpg"
                                }
                                alt={item.product.name}
                                className="w-full h-48 object-contain rounded-lg"
                              />
                            </div>
                            <div className="w-full md:w-2/4 px-0 md:px-6">
                              <h2 className="text-xl font-serif font-semibold text-[#4B3832]">
                                {item.product.name}
                              </h2>
                              <p className="text-[#D4AF37] font-bold text-lg mt-2">
                                ${item.product.price.toFixed(2)}
                              </p>
                              <p className="text-gray-600 mt-2">
                                {item.product.description.substring(0, 100)}...
                              </p>
                            </div>
                            <div className="w-full md:w-1/4 flex flex-col items-end">
                              <p className="text-lg font-serif font-semibold text-[#4B3832]">
                                Quantity: {item.quantity}
                              </p>
                              <p className="text-lg font-serif font-semibold text-[#4B3832] mt-2">
                                $
                                {(item.product.price * item.quantity).toFixed(
                                  2
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-between items-center mt-4">
                          <h3 className="text-xl font-serif font-semibold text-[#4B3832]">
                            Order Total
                          </h3>
                          <h3 className="text-2xl font-serif font-bold text-[#D4AF37]">
                            ${order.totalPrice.toFixed(2)}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-6">
                    <Link
                      to="/product"
                      className="px-6 py-3 border border-[#4B3832] text-[#4B3832] rounded hover:bg-[#4B3832] hover:text-white transition text-center"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </>
              ) : (
                <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-[#e8e1d9]">
                  <h2 className="text-2xl font-serif text-[#4B3832] mb-4">
                    No purchased orders
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {error ? error : "You haven't made any purchases yet."}
                  </p>
                  <Link
                    to="/product"
                    className="px-6 py-3 bg-[#D4AF37] text-white rounded hover:bg-[#4B3832] transition inline-block"
                  >
                    Browse Products
                  </Link>
                  {error && (
                    <Link
                      to="/login"
                      className="ml-4 px-6 py-3 border border-[#4B3832] text-[#4B3832] rounded hover:bg-[#4B3832] hover:text-white transition inline-block"
                    >
                      Go to Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Order;
