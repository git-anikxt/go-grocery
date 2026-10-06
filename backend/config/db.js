import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGO;
  if (!mongoUri) {
    throw new Error("MONGO must be set to a MongoDB connection URI");
  }

  await mongoose.connect(mongoUri);
  console.log("DB Connected");
};
