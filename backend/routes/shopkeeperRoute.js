import express from "express";
import {
  shopkeeperSignup,
  addItem,
  listItems,
  removeFood,
  shopkeeperSignin,
  shopkeeperList,
} from "../controllers/shopkeeperController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";
const shopkeeperRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

shopkeeperRouter.post("/signup", upload.single("image"), shopkeeperSignup);
shopkeeperRouter.post("/signin", shopkeeperSignin);
shopkeeperRouter.get("/list", authMiddleware, listItems);
shopkeeperRouter.post("/shopkeeperList", shopkeeperList);
shopkeeperRouter.post(
  "/addItem",
  upload.single("image"),
  authMiddleware,
  addItem
);
shopkeeperRouter.post("/remove", removeFood);

export default shopkeeperRouter;
