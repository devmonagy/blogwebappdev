import express, { Request, Response, Application } from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { Server as SocketIoServer } from "socket.io";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes";
import Post from "./models/Post";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

const io = new SocketIoServer(server, {
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

connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        [
          "http://localhost:3000",
          "http://192.168.1.204:3000",
          "http://172.16.109.61:3000",
          "https://blogwebapp.monagy.com",
          "https://blogwebapp-dev.onrender.com",
        ].includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.options("/socket.io/*", cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, MongoDB is connected!");
});

app.get("/ping", (req: Request, res: Response) => {
  console.log("🔁 /ping hit at", new Date().toISOString());
  res.status(200).send("pong");
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("sendClap", async ({ postId, userId }) => {
    try {
      const post = await Post.findById(postId);
      if (!post) {
        console.error("❌ Post not found");
        socket.emit("error", "Post not found");
        return;
      }

      const userClapRecord = post.userClaps.find(
        (uc) => uc.userId.toString() === userId
      );

      if (userClapRecord) {
        if (userClapRecord.count < 50) {
          userClapRecord.count += 1;
          post.claps += 1;
        } else {
          socket.emit("error", "Max claps reached");
          return;
        }
      } else {
        post.userClaps.push({ userId, count: 1 });
        post.claps += 1;
      }

      await post.save();
      io.emit("clapUpdated", {
        postId,
        claps: post.claps,
        userId,
        userClaps: userClapRecord ? userClapRecord.count : 0,
      });
    } catch (err) {
      console.error("❌ Error handling clap:", err);
      socket.emit("error", "Error processing clap");
    }
  });

  socket.on("disconnect", () => {
    console.log("👋 Client disconnected:", socket.id);
  });
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
