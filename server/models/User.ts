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
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Set your Cloudinary-hosted default image here
const getDefaultProfilePictureUrl = (): string => {
  return "https://res.cloudinary.com/dqdix32m5/image/upload/v1743881926/UserProfilePics/1743881923775-mo.png";
  // You can use the public image link or asset URL — just make sure it's direct-access.
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
      default: getDefaultProfilePictureUrl, // ✅ Use Cloudinary-hosted default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
