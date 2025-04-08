import path from "path";
import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import socketIo from "socket.io";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes";
import Post from "./models/Post";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Use WebSocket only (polling removed)
const io = new socketIo.Server(server, {
  transports: ["websocket"],
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.1.204:3000",
      "http://172.16.109.61:3000",
      "https://blogwebapp.monagy.com",
      "https://blogwebapp-dev.onrender.com",
    ],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Global CORS middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.204:3000",
  "http://172.16.109.61:3000",
  "https://blogwebapp.monagy.com",
  "https://blogwebapp-dev.onrender.com",
];

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

app.use(express.json());

// ✅ Preflight support for Socket.IO
app.options("/socket.io/*", cors());

// ✅ Basic health check
app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected!");
});

app.get("/ping", (req, res) => {
  console.log("🔁 /ping hit at", new Date().toISOString());
  res.status(200).send("pong");
});

// ✅ Socket.IO connection
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("sendClap", async ({ postId, userId }) => {
    console.log(`👏 Clap from user ${userId} on post ${postId}`);
    try {
      const post = await Post.findById(postId);
      if (!post) {
        console.error("❌ Post not found");
        return;
      }

      const userClapRecord = post.userClaps.find(
        (uc: any) => uc.userId.toString() === userId
      );

      if (userClapRecord) {
        if (userClapRecord.count < 50) {
          userClapRecord.count += 1;
          post.claps += 1;
        } else {
          console.warn("⚠️ Max claps reached");
          return;
        }
      } else {
        post.userClaps.push({ userId, count: 1 });
        post.claps += 1;
      }

      await post.save();

      const updatedUserClap = post.userClaps.find(
        (uc: any) => uc.userId.toString() === userId
      );

      io.emit("clapUpdated", {
        postId,
        claps: post.claps,
        userId,
        userClaps: updatedUserClap?.count || 0,
      });
    } catch (err) {
      console.error("❌ Error handling clap:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("👋 Client disconnected:", socket.id);
  });
});

// ✅ Routes
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);

// ✅ Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
