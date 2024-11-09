// server/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authenticate";

// Token expiration set to a longer duration, e.g., 7 days
const TOKEN_EXPIRY = "7d"; // Adjust as needed

// Register User
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, firstName, lastName, email, password } = req.body;

  try {
    // Check if the username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(400).json({ error: "Username already taken" });
      return;
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance and save to the database
    const newUser = new User({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Find user by either username or email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate a JWT token with extended expiration
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: TOKEN_EXPIRY,
    });

    res.status(200).json({
      token,
      user: {
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        profilePicture: user.profilePicture, // Include profile picture in the response
      },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update User Profile
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { firstName, lastName, email, newPassword } = req.body;
  const profilePicture = req.file?.path; // Retrieve the profile picture path from the uploaded file
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Update user fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture; // Update profile picture if provided

    // Hash and update the new password if provided
    if (newPassword) {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        res.status(400).json({ error: "Password can't be your current one!" });
        return;
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Check Password
export const checkPassword = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { password } = req.body;
  const userId = req.userId;

  if (!userId) {
    res.status(401).json({ error: "User not authenticated" });
    return;
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isSame = await bcrypt.compare(password, user.password);
    res.status(200).json({ isSame });
  } catch (error) {
    console.error("Error checking password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
