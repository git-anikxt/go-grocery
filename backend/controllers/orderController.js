import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import crypto from "crypto";
import { instance } from "../server.js";
// Placing User Order for Frontend
const placeOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid order amount" });
    }
    if (!process.env.RAZORPAY_API_KEY || !process.env.RAZORPAY_API_SECRET) {
      return res.status(503).json({ success: false, message: "Razorpay is not configured" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      orderId: order.id,
    });
    await newOrder.save();

    res.json({ success: true, order, key: process.env.RAZORPAY_API_KEY });
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    res.status(502).json({ success: false, message: "Unable to create payment order" });
  }
};

// Listing Order for Admin panel
const listOrders = async (req, res) => {
  const { userId } = req.body;
  try {
    const orders = await orderModel.find({ "items.userId": userId });
    const storeOrders = orders
      .map((order) => {
        const filteredItems = order.items.filter(
          (item) => item.userId === userId
        );
        return {
          ...order._doc,
          items: filteredItems,
        };
      })
      .filter((order) => order.items.length > 0);
    res.json({ success: true, data: storeOrders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// User Orders for Frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  console.log(req.body);
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  try {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification details" });
    }

    const order = await orderModel.findOne({ orderId: razorpay_order_id });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const expected = Buffer.from(expectedSignature, "hex");
    const received = Buffer.from(razorpay_signature, "hex");
    if (
      expected.length !== received.length ||
      !crypto.timingSafeEqual(expected, received)
    ) {
      return res.status(400).json({ success: false, message: "Payment signature is invalid" });
    }

    order.payment = true;
    await order.save();
    await userModel.findByIdAndUpdate(order.userId, { cartData: {} });
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to verify Razorpay payment:", error);
    res.status(500).json({ success: false, message: "Unable to verify payment" });
  }
};
const cancelPayment = async (req, res) => {
  const { orderId } = req.body;
  try {
    const result = await orderModel.deleteOne({ orderId: orderId });
    if (result.deletedCount > 0) {
      res
        .status(200)
        .send({ success: true, message: "Order deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Order not found" });
    }
  } catch (error) {
    console.error("Failed to cancel payment order:", error);
    res.status(500).json({ success: false, message: "Unable to cancel payment" });
  }
};

export {
  placeOrder,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
  cancelPayment,
};
