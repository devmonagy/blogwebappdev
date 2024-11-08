// server/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date; // Include createdAt in the interface
}

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
  },
  { timestamps: true } // This adds createdAt and updatedAt fields automatically
);

export default mongoose.model<IUser>("User", UserSchema);
