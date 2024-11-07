// server/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

// Define an interface for a User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

// Create a User schema
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

// Create a User model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
