import path from "path"; // Import path module
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Define the allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000", // Your local frontend address
  "http://192.168.1.204:3000", // Your local network IP, replace with actual IP if different
];

// Use CORS middleware to enable requests from the allowed origins
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Enable credentials if needed
  })
);

app.use(express.json()); // Middleware to parse JSON requests

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Example route to test the server
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected!");
});

// Authentication routes
app.use("/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
