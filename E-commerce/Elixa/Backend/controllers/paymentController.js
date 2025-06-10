import axios from "axios";
import cartModel from "../models/cartModel.js";
import PaymentModel from "../models/paymentModel.js";

const initiatePayment = async (req, res) => {
  try {
    const { cartId, amount } = req.body;

    if (!cartId || !amount) {
      return res.json({
        success: false,
        message: "Cart ID and amount are required",
      });
    }

    const cart = await cartModel.findById(cartId).populate("user");
    if (!cart || cart.status !== "active") {
      return res.json({ success: false, message: "Invalid or inactive cart" });
    }

    if (!req.user || req.user._id.toString() !== cart.user._id.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized access to cart",
      });
    }

    // Check for existing pending payment for this cart
    const existingPayment = await PaymentModel.findOne({
      cart: cartId,
      paymentStatus: "pending",
    });

    if (existingPayment) {
      return res.json({
        success: true,
        message: "Payment already initiated for this cart",
        payment: {
          _id: existingPayment._id,
          pidx: existingPayment.pidx,
          paymentUrl:
            existingPayment.paymentUrl ||
            `https://a.khalti.com/?pidx=${existingPayment.pidx}`,
          createdAt: existingPayment.createdAt,
        },
      });
    }

    const orderId = `ORDER_${cart._id}_${Date.now()}`;

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: `${process.env.FRONTEND_URL}payment/verify`,
        website_url: `${process.env.FRONTEND_URL}/`,
        amount: amount * 100,
        purchase_order_id: orderId,
        purchase_order_name: `Order_${cart._id}`,
        customer_info: {
          name: req.user.name || "Customer",
          email: req.user.email || "customer@example.com",
          phone: req.user.phone || "9800000000",
        },
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    const payment = new PaymentModel({
      user: req.user._id,
      cart: cart._id,
      amount: amount,
      pidx: response.data.pidx,
      paymentUrl: response.data.payment_url,
      paymentStatus: "pending",
    });
    await payment.save();

    cart.status = "pending";
    await cart.save();

    res.json({
      success: true,
      message: "Payment initiated successfully",
      payment: {
        _id: payment._id,
        pidx: payment.pidx,
        paymentUrl: response.data.payment_url,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    console.error("Error initiating payment:", error);
    res.json({ success: false, message: "Payment initiation failed" });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      return res.json({ success: false, message: "pidx is required" });
    }

    const payment = await PaymentModel.findOne({ pidx }).populate("cart");
    if (!payment) {
      return res.json({ success: false, message: "Payment not found" });
    }

    if (!req.user || req.user._id.toString() !== payment.user.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized access to payment",
      });
    }

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    const cart = await cartModel.findById(payment.cart);
    if (!cart) {
      return res.json({ success: false, message: "Cart not found" });
    }

    if (response.data.status === "Completed") {
      payment.paymentStatus = "completed";
      payment.transactionId = response.data.transaction_id;
      payment.paidAt = new Date();
      await payment.save();

      cart.status = "purchased";
      await cart.save();

      res.json({
        success: true,
        message: "Payment verified successfully",
        payment: {
          _id: payment._id,
          pidx: payment.pidx,
          paymentStatus: payment.paymentStatus,
          transactionId: payment.transactionId,
          paidAt: payment.paidAt,
          amount: payment.amount * 100,
        },
      });
    } else if (response.data.status === "Pending") {
      res.json({ success: false, message: "Payment is still pending" });
    } else {
      payment.paymentStatus = "failed";
      await payment.save();

      cart.status = "active";
      await cart.save();

      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.json({ success: false, message: "Payment verification failed" });
  }
};

export { initiatePayment, verifyPayment };
