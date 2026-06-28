import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import shopkeeperRouter from "./routes/shopkeeperRoute.js";
import "dotenv/config";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import storeRouter from "./routes/storeRoute.js";
import itemRouter from "./routes/itemRoute.js";
import Razorpay from "razorpay";

// app config
const app = express();
const port = process.env.PORT;

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

// middlewares
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/user", userRouter);
app.use("/api/shopkeeper", shopkeeperRouter);
app.use("/images", express.static("uploads"));
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/store", storeRouter);
app.use("/api/item", itemRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
