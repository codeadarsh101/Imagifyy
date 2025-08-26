import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ DB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

export default connectDB;
