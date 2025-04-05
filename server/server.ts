// server/server.ts

import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import custom database connection function and route handlers
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes"; // Import admin routes

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// Allowed CORS origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.204:3000",
  "http://172.16.109.61:3000",
  "https://blogwebapp.monagy.com",
];

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected!");
});

// ✅ Ping route for uptime checks (log each ping)
app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

// API Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
