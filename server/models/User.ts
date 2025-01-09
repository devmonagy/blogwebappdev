// server/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

// Interface defining the User document structure
interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profilePicture: string;
  role: string; // Add role field
  createdAt: Date;
  updatedAt: Date;
}

// Helper function to get the default profile picture URL
const getDefaultProfilePictureUrl = (): string => {
  const backendUrl = process.env.BACKEND_URL || "http://192.168.1.204:5000";
  return `${backendUrl}/uploads/defaultImg.webp`;
};

// User schema definition
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profilePicture: {
      type: String,
      default: getDefaultProfilePictureUrl, // Use the helper function
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Allow only 'user' or 'admin'
      default: "user", // Default role
    },
  },
  { timestamps: true } // Include timestamps for createdAt and updatedAt
);

export default mongoose.model<IUser>("User", UserSchema);
