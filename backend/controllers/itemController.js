import itemModel from "../models/itemModel.js";
import shopkeeperModel from "../models/shopkeeperModel.js";

const getAllItems = async (req, res) => {
  try {
    const items = await itemModel.find({});
    return res.json({ success: true, items });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// update item
const updateItem = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  const { name, description, price, discount } = req.body;
  const updateData = { name, description, price, discount };
  if (req.file) {
    updateData.image = `${req.file.filename}`;
  }
  const shopkeeper = await shopkeeperModel.findById(userId);
  if (!shopkeeper) {
    return res.json({ success: false, message: "Shopkeeper does not exist." });
  }
  try {
    const item = await itemModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!item) {
      return res.json({ success: false, message: "Item not found.", item });
    }
    return res.json({ success: true, message: "Item updated.", item });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { getAllItems, updateItem };
