// server/server.ts

import path from "path";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes";

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

// List of allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.204:3000",
  "http://172.16.109.61:3000",
  "https://blogwebapp.monagy.com", // Vercel frontend
  "https://blogwebapp-dev.onrender.com", // Render backend
];

// Default CORS middleware (strict)
app.use((req, res, next) => {
  if (req.path === "/ping") {
    // ✅ Relaxed CORS for uptime pings only
    cors({ origin: "*" })(req, res, next);
  } else {
    // 🔒 Strict CORS for app requests
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })(req, res, next);
  }
});

// Middleware
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected!");
});

// ✅ Ping route for uptime monitoring
app.get("/ping", (req, res) => {
  console.log("🔁 /ping hit at", new Date().toISOString());
  res.status(200).send("pong");
});

// Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
