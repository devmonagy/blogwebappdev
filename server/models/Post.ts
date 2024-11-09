// server/models/Post.ts
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Post", postSchema);
