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

// ✅ Enforce polling-only transport for Render compatibility
const io = new socketIo.Server(server, {
  transports: ["polling"],
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

connectDB()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.204:3000",
  "http://172.16.109.61:3000",
  "https://blogwebapp.monagy.com",
  "https://blogwebapp-dev.onrender.com",
];

app.use((req, res, next) => {
  if (req.path === "/ping") {
    cors({ origin: "*" })(req, res, next);
  } else {
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

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, MongoDB is connected!");
});

app.get("/ping", (req, res) => {
  console.log("🔁 /ping hit at", new Date().toISOString());
  res.status(200).send("pong");
});

// ✅ Ensure socket.io upgrade path works properly (important for Render)
app.use("/socket.io", (req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("sendClap", async ({ postId, userId }) => {
    console.log(`Clap from user ${userId} for post ${postId}`);

    try {
      const post = await Post.findById(postId);
      if (!post) {
        console.error("Post not found for clapping");
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
          console.warn("User reached max claps for this post");
          return;
        }
      } else {
        post.userClaps.push({ userId, count: 1 });
        post.claps += 1;
      }

      await post.save();

      const updatedUserClapRecord = post.userClaps.find(
        (uc: any) => uc.userId.toString() === userId
      );

      io.emit("clapUpdated", {
        postId,
        claps: post.claps,
        userId,
        userClaps: updatedUserClapRecord?.count || 0,
      });
    } catch (error) {
      console.error("Error updating claps:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
  });
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
