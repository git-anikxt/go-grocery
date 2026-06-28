import shopkeeperModel from "../models/shopkeeperModel.js";
import itemModel from "../models/itemModel.js";

//get shopkeeper details
const getShopkeeperDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const shopkeeper = await shopkeeperModel.findById(id);
    if (shopkeeper) {
      return res.json({ success: true, shopkeeper });
    } else {
      return res.json({
        success: false,
        message: "Can not find the shopkeeper",
      });
    }
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

//get items of shopkeeper
const getShopkeeperItems = async (req, res) => {
  const { id } = req.params;

  try {
    const items = await itemModel.find({ userId: id });
    return res.json({ success: true, items });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

export { getShopkeeperDetails, getShopkeeperItems };
