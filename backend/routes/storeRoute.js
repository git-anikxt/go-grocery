import express from "express";
import {
  getShopkeeperDetails,
  getShopkeeperItems,
} from "../controllers/storeController.js";
import { get } from "mongoose";
const storeRouter = express.Router();

storeRouter.get("/:id", getShopkeeperDetails);
storeRouter.get("/storeItem/:id", getShopkeeperItems);

export default storeRouter;
