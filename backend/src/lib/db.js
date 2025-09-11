import mongoose from "mongoose";


export const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || process.env.MONGODB_URI;
    if (!mongoUrl) {
      throw new Error("MongoDB connection string not set in environment variables (MONGO_URL or MONGODB_URI)");
    }
    const conn = await mongoose.connect(mongoUrl);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
};
