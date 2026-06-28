import mongoose from "mongoose";

const shopkeeperSchema = {
  shopkeeperName: { type: String, required: true },
  shopName: { type: String, required: true },
  contactNo: { type: String, required: true },
  category: { type: String, required: true },
  shopAddress: { type: String, required: true },
  pincode: { type: String, required: true },
  openTime: { type: String, required: true },
  closeTime: { type: String, required: true },
  gstno: { type: String, required: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
};

const shopkeeperModel =
  mongoose.models.shopkeeper || mongoose.model("shopkeeper", shopkeeperSchema);

export default shopkeeperModel;
