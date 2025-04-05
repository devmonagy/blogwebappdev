// server/server.ts

// Import necessary Node.js modules and middleware
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import custom database connection function and route handlers
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes"; // Import admin routes

// Load environment variables from .env file
dotenv.config();

// Create an Express application
const app = express();
// Define the port on which the server will run. Default to 5000 if not specified in the environment
const PORT = process.env.PORT || 5000;

// Establish connection to MongoDB using the custom function
connectDB();

// Define the allowed origins for CORS (Cross-Origin Resource Sharing)
const allowedOrigins = [
  "http://localhost:3000", // Local dev
  "http://192.168.1.204:3000", // Local network dev
  "http://172.16.109.61:3000", // Office network dev
  "https://blogwebappdev.vercel.app", // Current deployed frontend on Vercel
];

// Apply CORS middleware to enable requests from allowed origins and support credentials
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman) or if origin is in the list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Add middleware to parse JSON bodies. This is necessary for handling JSON requests
app.use(express.json());

// Serve static files from the 'uploads' directory. Necessary for any uploaded files like images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Simple route to test if the server is running and connected to the database
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected!");
});

// Use authentication routes as specified in the authRoutes module
app.use("/auth", authRoutes);

// Use blog post routes as specified in the postRoutes module
app.use("/posts", postRoutes);

// Use admin routes for admin functionality
app.use("/admin", adminRoutes);

// Start the server on the specified port and log a message to the console
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
