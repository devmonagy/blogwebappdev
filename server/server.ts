import express, { Request, Response, Application } from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { Server as SocketIoServer } from "socket.io";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import postRoutes from "./routes/postRoutes";
import adminRoutes from "./routes/adminRoutes";
import commentRoutes from "./routes/commentRoutes";
import Post from "./models/Post";
import Comment from "./models/Comment";
import User from "./models/User";
import "./config/passport"; // ✅ Initialize Google OAuth strategy

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://192.168.1.204:3000",
  "http://172.16.109.61:3000",
  "https://blogwebapp.monagy.com",
  "https://blogwebapp-dev.onrender.com",
];

app.use(helmet());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "deny" }));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://res.cloudinary.com"],
      imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
      connectSrc: ["'self'", ...ALLOWED_ORIGINS, "https://api.cloudinary.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
    },
  })
);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  next();
});

const io = new SocketIoServer(server, {
  transports: ["websocket"],
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
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

// ✅ Add this route to return the current server time
app.get("/server-time", (req: Request, res: Response) => {
  res.json({ serverTime: new Date().toISOString() });
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

  // ✅ Real-time comment/reply with populated author
  socket.on(
    "newComment",
    async ({ postId, content, parentComment, userId }) => {
      try {
        const newComment = await Comment.create({
          post: postId,
          content,
          parentComment: parentComment || null,
          author: userId,
        });

        const populatedComment = await Comment.findById(newComment._id)
          .populate("author", "firstName lastName profilePicture")
          .lean();

        if (populatedComment) {
          io.emit("commentAdded", populatedComment);
        }
      } catch (error) {
        console.error("❌ Error posting comment:", error);
        socket.emit("error", "Failed to post comment.");
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("👋 Client disconnected:", socket.id);
  });
});

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);
app.use("/comments", commentRoutes);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
