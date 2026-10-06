import express from "express";
import { getAllItems, updateItem } from "../controllers/itemController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";
//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

const itemRouter = express.Router();

itemRouter.get("/getAllItems", getAllItems);
itemRouter.put(
  "/updateItem/:id",
  upload.single("image"),
  authMiddleware,
  updateItem
);

export default itemRouter;
