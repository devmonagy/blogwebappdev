import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AuthenticatedRequest } from "../middleware/authenticate";
import { sendEmail } from "../utils/mailer";

const TOKEN_EXPIRY = "7d";
const MAGIC_EXPIRY = "15m";

// REGISTER
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { username, firstName, lastName, email, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    const newUser = new User({
      ...(username && { username }),
      firstName,
      lastName,
      email,
      ...(hashedPassword && { password: hashedPassword }),
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// MAGIC REGISTER (register + send magic link if not found)
export const magicRegister = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    let user = await User.findOne({ email });

    // Create user if not found
    if (!user) {
      user = new User({ email });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_MAGIC_SECRET!,
      { expiresIn: MAGIC_EXPIRY }
    );

    const magicUrl = `${process.env.FRONTEND_URL}/magic-login?token=${token}`;

    try {
      await sendEmail({ to: email, link: magicUrl });
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      res.status(500).json({ error: "Email service error." });
      return;
    }

    res.status(200).json({ message: "Magic link sent! Check your email." });
  } catch (error) {
    console.error("Error during magic registration:", error);
    res.status(500).json({ error: "Server error during magic registration" });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (!user.password) {
      res
        .status(400)
        .json({ error: "Password login not available for this account." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.get("username") || null,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: user.role,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// MAGIC LINK LOGIN (send)
export const sendMagicLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ error: "No account found with this email." });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_MAGIC_SECRET!,
      { expiresIn: MAGIC_EXPIRY }
    );

    const magicUrl = `${process.env.FRONTEND_URL}/magic-login?token=${token}`;

    try {
      await sendEmail({ to: email, link: magicUrl });
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
      res.status(500).json({ error: "Email service error." });
      return;
    }

    res.status(200).json({ message: "Magic link sent! Check your email." });
  } catch (error) {
    console.error("Error sending magic link:", error);
    res.status(500).json({ error: "Server error. Could not send magic link." });
  }
};

// MAGIC LOGIN (verify token)
export const magicLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Missing or invalid token." });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_MAGIC_SECRET!) as {
      userId: string;
      email: string;
    };

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const authToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.status(200).json({
      token: authToken,
      user: {
        _id: user._id,
        username: user.get("username") || null,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: user.role,
        profilePicture: user.profilePicture || "",
      },
    });
  } catch (error) {
    console.error("Magic login error:", error);
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// UPDATE PROFILE
export const updateProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { firstName, lastName, email, newPassword } = req.body;
  const profilePicture = req.file?.path;
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

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;

    if (newPassword) {
      if (!user.password) {
        res
          .status(400)
          .json({ error: "No existing password found for this user." });
        return;
      }

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

// CHECK PASSWORD
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

    if (!user.password) {
      res.status(400).json({ error: "No password set for this account." });
      return;
    }

    const isSame = await bcrypt.compare(password, user.password);
    res.status(200).json({ isSame });
  } catch (error) {
    console.error("Error checking password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// VALIDATE TOKEN
export const validateToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ valid: false, error: "Token is missing" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId).select(
      "username email firstName lastName profilePicture role"
    );

    if (!user) {
      res.status(404).json({ valid: false, error: "User not found" });
      return;
    }

    res.status(200).json({
      valid: true,
      user: {
        _id: user._id,
        username: user.get("username") || null,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profilePicture: user.profilePicture || "",
        role: user.role,
      },
    });
  } catch (error) {
    res.status(401).json({ valid: false, error: "Invalid token" });
  }
};
