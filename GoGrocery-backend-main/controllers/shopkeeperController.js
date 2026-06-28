import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import shopkeeperModel from "../models/shopkeeperModel.js";
import itemModel from "../models/itemModel.js";
import fs from "fs";

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//shopkeeper login
const shopkeeperSignin = async (req, res) => {
  const { contactNo, password } = req.body;
  try {
    const shopkeeper = await shopkeeperModel.findOne({ contactNo });

    if (!shopkeeper) {
      return res.json({ success: false, message: "Shopkeeper does not exist" });
    }

    const isMatch = await bcrypt.compare(password, shopkeeper.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = createToken(shopkeeper._id);
    res.json({ success: true, token });
  } catch (error) {}
};
// shopkeeper signup
const shopkeeperSignup = async (req, res) => {
  let image_filename = `${req.file.filename}`;

  const {
    shopkeeperName,
    shopName,
    contactNo,
    category,
    shopAddress,
    pincode,
    openTime,
    closeTime,
    gstno,
    password,
  } = req.body;
  try {
    const exists = await shopkeeperModel.findOne({ contactNo });
    if (exists) {
      return res.json({
        success: false,
        message: "shopkeeper already exists",
      });
    }

    // validating contact no format & strong password
    if (contactNo.length < 10) {
      return res.json({
        success: false,
        message: "Please enter a valid contact no",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter a strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
    const hashedPassword = await bcrypt.hash(password, salt);

    const newshopkeeper = new shopkeeperModel({
      shopkeeperName,
      shopName,
      contactNo,
      category,
      shopAddress,
      pincode,
      openTime,
      closeTime,
      gstno,
      password: hashedPassword,
      image: image_filename,
    });

    const shopkeeper = await newshopkeeper.save();
    const token = createToken(shopkeeper._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all shopkeeper list
const shopkeeperList = async (req, res) => {
  const { postalCode } = req.body;
  try {
    const shopkeepers = await shopkeeperModel.find({ pincode: postalCode });
    res.json({ success: true, shopkeepers: shopkeepers });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// all items list for a shopkeeper
const listItems = async (req, res) => {
  const { userId } = req.body;
  try {
    const items = await itemModel.find({ userId: userId });
    res.json({ success: true, items: items });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// add food
const addItem = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const { userId } = req.body;
  const shopkeeper = await shopkeeperModel.findById(userId);
  const item = new itemModel({
    userId: userId,
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: shopkeeper.category,
    image: image_filename,
    discount: req.body.discount,
  });
  try {
    await item.save();
    res.json({ success: true, message: "Item Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// delete food
const removeFood = async (req, res) => {
  try {
    const item = await itemModel.findById(req.body.id);
    fs.unlink(`uploads/${item.image}`, () => {});

    await itemModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Item Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export {
  listItems,
  addItem,
  removeFood,
  shopkeeperList,
  shopkeeperSignup,
  shopkeeperSignin,
};
