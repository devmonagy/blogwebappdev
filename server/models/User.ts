import mongoose, { Schema, Document } from "mongoose";

// Interface defining the User document structure
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
}

// User schema definition
const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true, // Ensure the username is unique
    trim: true, // Remove whitespace from the beginning and end
    lowercase: true, // Convert the username to lowercase
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // Ensure the email is unique
    trim: true, // Remove whitespace from the beginning and end
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
});

// Export the User model
export default mongoose.model<IUser>("User", UserSchema);
