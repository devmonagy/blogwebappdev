import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Suppress strictQuery warnings and ensure a stable query behavior
mongoose.set("strictQuery", true);

const connectDB = async (): Promise<void> => {
  try {
    // Connect to the database using the connection string from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB connected: ${conn.connection.host}`); // Logs the host for better debugging
  } catch (err) {
    if (err instanceof Error) {
      console.error("MongoDB connection error:", err.message); // Access `message` safely
    } else {
      console.error("MongoDB connection error:", err);
    }
    process.exit(1); // Exit the process if the database connection fails
  }
};

export default connectDB;
