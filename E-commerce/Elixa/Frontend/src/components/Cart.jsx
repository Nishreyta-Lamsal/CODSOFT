import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";

const Cart = () => {
  const { backendUrl, setCart } = useContext(AppContext);
  const [cart, setLocalCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view your cart.");
        toast.error("Please log in to view your cart");
        setLoading(false);
        return;
      }

      if (!backendUrl) {
        throw new Error("Backend URL not configured");
      }

      const response = await fetch(`${backendUrl}/api/user/cart-view`, {
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
        setLocalCart(data.cart);
        setCart(data.cart);
      } else {
        setError(data.message || "Failed to fetch cart");
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch cart";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to update your cart");
        return;
      }

      const response = await fetch(`${backendUrl}/api/user/cart-update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
      }

      if (data.success) {
        setLocalCart(data.cart);
        setCart(data.cart);
        toast.success("Item quantity updated");
      } else {
        toast.error(data.message || "Failed to update cart");
      }
    } catch (err) {
      const errorMessage = err.message.includes("Insufficient stock")
        ? "Insufficient stock for requested quantity"
        : err.message || "Failed to update cart";
      toast.error(errorMessage);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to remove this item from your cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#D4AF37",
        cancelButtonColor: "#4B3832",
        confirmButtonText: "Yes, remove it!",
        cancelButtonText: "Cancel",
      });

      if (!result.isConfirmed) {
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        toast.error("Please log in to remove items from your cart");
        return;
      }

      const response = await fetch(`${backendUrl}/api/user/cart-remove`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setLocalCart(data.cart);
        setCart(data.cart);
        toast.success("Item removed from cart");
      } else {
        setError(data.message || "Failed to remove item");
        toast.error(data.message || "Failed to remove item");
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to remove item";
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleCheckout = async () => {
    if (paymentLoading) return;
    try {
      setPaymentLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to proceed to checkout");
        setPaymentLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }

      const profileRes = await fetch(`${backendUrl}/api/user/get-profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const profileData = await profileRes.json();

      if (
        !profileRes.ok ||
        !profileData.success ||
        !profileData.user?.address ||
        !profileData.user?.phone
      ) {
        toast.warning(
          "Please enter your address and phone number before checking out."
        );
        setPaymentLoading(false);
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
        return;
      }

      const { address, phone } = profileData.user;
      if ((!address.line1 && !address.line2) || phone === "0000000000") {
        toast.warning(
          "Please provide your shipping address and phone number before checkout."
        );
        setPaymentLoading(false);
        setTimeout(() => {
          navigate("/profile");
        }, 3000);
        return;
      }

      if (!cart || !cart._id || !cart.totalPrice) {
        toast.error("Invalid cart or no items to checkout");
        setPaymentLoading(false);
        return;
      }

      const response = await fetch(`${backendUrl}/api/user/payment/initiate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId: cart._id,
          amount: cart.totalPrice,
          orderId: `Order_${cart._id}`,
          orderName: `Cart Order ${cart._id}`,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.payment?.paymentUrl) {
          window.location.href = data.payment.paymentUrl;
        } else {
          toast.error("Payment URL not provided");
        }
      } else if (data.message === "Payment already initiated for this cart") {
        if (data.payment?.paymentUrl) {
          toast.info(
            "A payment is already pending for this cart. Redirecting..."
          );
          window.location.href = data.payment.paymentUrl;
        } else {
          toast.error("Existing payment found, but no payment URL available");
        }
      } else {
        throw new Error(data.message || "Payment initiation failed");
      }
    } catch (error) {
      toast.error(error.message || "Payment initiation failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyPayment = async (pidx) => {
    try {
      setIsVerifying(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to verify payment");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        return;
      }

      const response = await fetch(`${backendUrl}/api/user/payment/verify`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.cart?.status === "purchased") {
          toast.success("Payment successful! Order confirmed.");
          setLocalCart(null);
          setCart(null);
          navigate("/order-confirmation");
        } else {
          toast.info(
            `Payment is still ${
              data.cart?.status || "pending"
            }. Your cart remains active.`
          );
          setLocalCart(data.cart || cart);
          setCart(data.cart || cart);
        }
      } else {
        toast.error(data.message || "Payment verification failed");
      }
    } catch (error) {
      toast.error(`Payment verification failed: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const pidx = queryParams.get("pidx");
    if (pidx && !isVerifying) {
      verifyPayment(pidx);
    }
  }, [location.search]);

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
                    Shopping Cart
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-serif font-bold text-[#4B3832] mb-8">
            Your Shopping Cart
          </h1>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-2xl font-serif text-[#4B3832]">
                Loading your cart...
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {cart && cart.items.length > 0 ? (
                <>
                  {cart.items.map((item) => (
                    <div
                      key={item.product._id}
                      className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-sm border border-[#e8e1d9]"
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
                      <div className="w-full md:w-1/4 flex flex-col items-end mt-4 md:mt-0">
                        <div className="flex items-center mb-4">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 bg-gray-100">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                            className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-lg font-serif font-semibold text-[#4B3832] mb-4">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Remove Item
                        </button>
                      </div>
                    </div>
                  ))}

                  <div className="bg-white p-6 rounded-lg shadow-sm border border-[#e8e1d9] mt-8">
                    <h3 className="text-xl font-serif font-semibold text-[#4B3832] mb-6">
                      Order Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-gray-600">
                        <span>
                          {cart.items.length}{" "}
                          {cart.items.length === 1 ? "item" : "items"} (
                          {cart.items.reduce(
                            (total, item) => total + item.quantity,
                            0
                          )}{" "}
                          quantity total)
                        </span>
                        <span>${cart.totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Estimated Shipping</span>
                        <span className="text-[#D4AF37]">Free</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Estimated Taxes</span>
                        <span>$0.00</span>
                      </div>
                      <div className="border-t border-[#e8e1d9] pt-4 flex justify-between items-center">
                        <span className="text-lg font-serif font-semibold text-[#4B3832]">
                          Total
                        </span>
                        <span className="text-xl font-serif font-bold text-[#D4AF37]">
                          ${cart.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/product"
                        className="px-6 py-3 border border-[#4B3832] text-[#4B3832] rounded hover:bg-[#4B3832] hover:text-white transition text-center"
                      >
                        Continue Shopping
                      </Link>
                      <button
                        onClick={handleCheckout}
                        disabled={paymentLoading}
                        className="px-6 py-3 bg-[#D4AF37] text-white rounded hover:bg-[#4B3832] transition text-center disabled:opacity-50 flex items-center justify-center"
                      >
                        {paymentLoading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Proceed to Checkout"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-[#e8e1d9]">
                  <h2 className="text-2xl font-serif text-[#4B3832] mb-4">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {error
                      ? error
                      : "Looks like you haven't added anything to your cart yet"}
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

export default Cart;
