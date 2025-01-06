import mongoose, { Schema, Document, Model } from "mongoose";

// Define the Post interface that extends the Mongoose Document
interface IPost extends Document {
  title: string;
  category: string;
  content: string;
  imagePath?: string;
  author: mongoose.Types.ObjectId; // Reference to the User model
  createdAt?: Date; // Automatically added by timestamps
  updatedAt?: Date; // Automatically added by timestamps
}

// Define the Post schema
const PostSchema: Schema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Removes leading/trailing whitespace
    },
    category: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String, // Optional field for image paths
    },
    author: {
      type: mongoose.Schema.Types.ObjectId, // References the User model
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

// Define the Post model
const Post: Model<IPost> = mongoose.model<IPost>("Post", PostSchema);

export default Post;
export { IPost };
