// server/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

// Interface defining the User document structure
interface IUser extends Document {
  username?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  profilePicture?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Default profile image (Cloudinary-hosted)
const getDefaultProfilePictureUrl = (): string => {
  return "https://res.cloudinary.com/dqdix32m5/image/upload/v1744499838/user_v0drnu.png";
};

// User schema definition
const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: false,
      trim: true,
      unique: true,
      sparse: true, // ✅ Allows multiple null usernames
    },
    firstName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // ❗ magic link / social logins won't have passwords
    },
    profilePicture: {
      type: String,
      default: getDefaultProfilePictureUrl,
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
