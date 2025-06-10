import axios from "axios";
import cartModel from "../models/cartModel.js";
import PaymentModel from "../models/paymentModel.js";
import orderModel from "../models/orderModel.js";
import mongoose from "mongoose";

const processingPidx = new Set();

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
  const { pidx } = req.body;

  if (!pidx) {
    return res.json({ success: false, message: "pidx is required" });
  }

  console.log(
    `[${new Date().toISOString()}] Attempt to verify payment for pidx: ${pidx}`
  );

  if (processingPidx.has(pidx)) {
    console.log(
      `[${new Date().toISOString()}] pidx ${pidx} is already being processed`
    );
    return res.json({
      success: false,
      message: "Payment verification is already in progress",
    });
  }

  processingPidx.add(pidx);

  const maxRetries = 3;
  let attempt = 0;

  try {
    while (attempt < maxRetries) {
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        console.log(
          `[${new Date().toISOString()}] Attempt ${
            attempt + 1
          }: Verifying payment for pidx: ${pidx}`
        );

        const payment = await PaymentModel.findOne({ pidx })
          .populate("cart")
          .session(session);
        if (!payment) {
          await session.abortTransaction();
          return res.json({ success: false, message: "Payment not found" });
        }

        if (!req.user || req.user._id.toString() !== payment.user.toString()) {
          await session.abortTransaction();
          return res.json({
            success: false,
            message: "Unauthorized access to payment",
          });
        }

        if (payment.paymentStatus === "completed") {
          const existingOrder = await orderModel
            .findOne({ cart: payment.cart._id })
            .session(session);
          await session.commitTransaction();
          console.log(
            `[${new Date().toISOString()}] Payment already processed for pidx: ${pidx}`
          );
          return res.json({
            success: true,
            message: "Payment already verified",
            payment: {
              _id: payment._id,
              pidx: payment.pidx,
              paymentStatus: payment.paymentStatus,
              transactionId: payment.transactionId,
              paidAt: payment.paidAt,
              amount: payment.amount * 100,
            },
            order: {
              _id: existingOrder._id,
              user: existingOrder.user,
              cart: existingOrder.cart,
              totalPrice: existingOrder.totalPrice,
              status: existingOrder.status,
              createdAt: existingOrder.createdAt,
            },
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

        const cart = await cartModel
          .findById(payment.cart)
          .populate("items.product")
          .session(session);
        if (!cart) {
          await session.abortTransaction();
          return res.json({ success: false, message: "Cart not found" });
        }

        if (response.data.status === "Completed") {
          payment.paymentStatus = "completed";
          payment.transactionId = response.data.transaction_id;
          payment.paidAt = new Date();
          await payment.save({ session });

          cart.status = "purchased";
          await cart.save({ session });

          let order = await orderModel
            .findOne({ cart: cart._id })
            .session(session);
          if (!order) {
            order = new orderModel({
              user: req.user._id,
              cart: cart._id,
              items: cart.items.map((item) => ({
                product: item.product._id,
                quantity: item.quantity,
              })),
              totalPrice: payment.amount,
              status: "purchased",
            });
            await order.save({ session });
          }

          await session.commitTransaction();
          console.log(
            `[${new Date().toISOString()}] Payment verified and order processed for pidx: ${pidx}`
          );
          return res.json({
            success: true,
            message: order
              ? "Payment verified successfully"
              : "Payment verified and order created successfully",
            payment: {
              _id: payment._id,
              pidx: payment.pidx,
              paymentStatus: payment.paymentStatus,
              transactionId: payment.transactionId,
              paidAt: payment.paidAt,
              amount: payment.amount * 100,
            },
            order: {
              _id: order._id,
              user: order.user,
              cart: order.cart,
              totalPrice: order.totalPrice,
              status: order.status,
              createdAt: order.createdAt,
            },
          });
        } else if (response.data.status === "Pending") {
          await session.abortTransaction();
          return res.json({
            success: false,
            message: "Payment is still pending",
          });
        } else {
          payment.paymentStatus = "failed";
          await payment.save({ session });

          cart.status = "active";
          await cart.save({ session });

          await session.commitTransaction();
          return res.json({ success: false, message: "Payment failed" });
        }
      } catch (error) {
        await session.abortTransaction();
        console.error(
          `[${new Date().toISOString()}] Attempt ${
            attempt + 1
          } failed for pidx: ${pidx}`,
          error
        );

        if (
          error.errorLabelSet?.has("TransientTransactionError") &&
          attempt < maxRetries - 1
        ) {
          attempt++;
          console.log(
            `[${new Date().toISOString()}] Retrying transaction for pidx: ${pidx}, attempt ${
              attempt + 1
            }`
          );
          continue;
        }
        throw error; 
      } finally {
        session.endSession();
      }
    }
  } catch (error) {
    console.error(
      `[${new Date().toISOString()}] Verification failed for pidx: ${pidx}`,
      error
    );
    if (error.code === 11000) {
      const payment = await PaymentModel.findOne({ pidx });
      if (!payment) {
        return res.json({
          success: false,
          message: "Payment not found after duplicate key error",
        });
      }
      const existingOrder = await orderModel.findOne({ cart: payment.cart });
      console.log(
        `[${new Date().toISOString()}] Duplicate order prevented for pidx: ${pidx}`
      );
      return res.json({
        success: true,
        message: "Payment verified successfully, order already exists",
        payment: {
          _id: payment._id,
          pidx: payment.pidx,
          paymentStatus: payment.paymentStatus,
          transactionId: payment.transactionId,
          paidAt: payment.paidAt,
          amount: payment.amount * 100,
        },
        order: {
          _id: existingOrder._id,
          user: existingOrder.user,
          cart: existingOrder.cart,
          totalPrice: existingOrder.totalPrice,
          status: existingOrder.status,
          createdAt: existingOrder.createdAt,
        },
      });
    }

    return res.json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  } finally {
    processingPidx.delete(pidx); 
  }
};

export { initiatePayment, verifyPayment };
