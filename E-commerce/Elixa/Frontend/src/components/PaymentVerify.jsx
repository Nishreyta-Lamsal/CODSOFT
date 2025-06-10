import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";

const PaymentVerify = () => {
  const { backendUrl } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const query = new URLSearchParams(location.search);
      const pidx = query.get("pidx");

      if (!pidx) {
        console.error("No pidx found in URL");
        setError("Invalid payment details");
        setLoading(false);
        return;
      }

      const maxRetries = 10; 
      const retryDelay = 2000; 
      let attempt = 0;

      const attemptVerification = async () => {
        try {
          const response = await fetch(
            `${backendUrl}/api/user/payment/verify`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({ pidx }),
            }
          );

          const data = await response.json();

          if (response.ok && data.success) {
            setPaymentDetails(data.payment);
            setLoading(false);
          } else if (
            data.message === "Payment verification is already in progress" &&
            attempt < maxRetries
          ) {
            // If verification is in progress, retry after a delay
            attempt++;
            console.log(
              `Verification in progress, retrying (${attempt}/${maxRetries})...`
            );
            setTimeout(attemptVerification, retryDelay);
          } else {
            console.error("Payment verification failed:", data.message);
            setError(data.message || "Payment verification failed");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          if (attempt < maxRetries) {
            attempt++;
            console.log(
              `Error occurred, retrying (${attempt}/${maxRetries})...`
            );
            setTimeout(attemptVerification, retryDelay);
          } else {
            setError("Failed to verify payment. Please try again.");
            setLoading(false);
          }
        }
      };

      attemptVerification();
    };

    verifyPayment();
  }, [location, backendUrl]);

  if (loading) {
    return (
      <div className="bg-[#F8F5F2] min-h-screen">
        <div className="relative h-16 overflow-hidden bg-[#745d46]"></div>
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-white py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <svg
              className="w-12 h-12 text-[#D4AF37] animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
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
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            <p className="mt-4 text-lg text-[#4B3832] font-serif">
              Verifying payment...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8F5F2] min-h-screen">
      <div className="relative h-16 overflow-hidden bg-[#745d46]"></div>
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-white py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-100 text-center"
        >
          {error ? (
            <>
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h2 className="text-2xl font-serif font-bold text-[#4B3832] mb-4">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 border border-[#4B3832] rounded bg-[#4B3832] hover:bg-[#342622] text-white text-center transition duration-300 transform hover:scale-105"
              >
                Return to Home
              </button>
            </>
          ) : (
            <>
              <svg
                className="w-16 h-16 text-[#D4AF37] mx-auto mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-2xl font-serif font-bold text-[#4B3832] mb-4">
                Payment Successful!
              </h2>
              <div className="text-left mb-6 space-y-3">
                <p className="text-gray-700">
                  <span className="font-medium text-[#4B3832]">
                    Payment ID (pidx):
                  </span>{" "}
                  <span className="text-gray-600">{paymentDetails.pidx}</span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-[#4B3832]">
                    Transaction ID:
                  </span>{" "}
                  <span className="text-gray-600">
                    {paymentDetails.transactionId || "N/A"}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-[#4B3832]">
                    Payable Amount:
                  </span>{" "}
                  <span className="text-gray-600">
                    NPR{" "}
                    {paymentDetails.amount
                      ? (paymentDetails.amount / 100).toFixed(2)
                      : "N/A"}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-medium text-[#4B3832]">Status:</span>{" "}
                  <span className="text-gray-600">
                    {paymentDetails.paymentStatus}
                  </span>
                </p>
              </div>
              <button
                onClick={() => navigate("/orders")}
                className="px-6 py-3 border border-[#4B3832] rounded bg-[#4B3832] hover:bg-[#342622] text-white text-center transition duration-300 transform hover:scale-105"
              >
                Navigate to Orders
              </button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentVerify;
