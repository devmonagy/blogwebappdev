import mongoose, { Schema, Document, Model } from "mongoose";

// Define user-specific clap tracking structure
interface IUserClap {
  userId: mongoose.Types.ObjectId;
  count: number;
}

// Define the Post interface that extends the Mongoose Document
interface IPost extends Document {
  title: string;
  category: string;
  content: string;
  imagePath?: string;
  author: mongoose.Types.ObjectId; // Reference to the User model
  claps: number; // Total clap count across all users
  userClaps: IUserClap[]; // Individual user claps per post
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Post schema
const PostSchema: Schema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
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
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    claps: {
      type: Number,
      default: 0,
    },
    userClaps: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        count: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Define the Post model
const Post: Model<IPost> = mongoose.model<IPost>("Post", PostSchema);

export default Post;
export { IPost };
