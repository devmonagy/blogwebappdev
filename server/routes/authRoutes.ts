import { Router, Request, Response } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  registerUser,
  loginUser,
  updateProfile,
  checkPassword,
  validateToken,
  sendMagicLink,
  magicLogin,
  magicRegister,
} from "../controllers/authController";

import {
  getUserProfile,
  uploadProfilePicture,
} from "../controllers/userController";

import authenticate from "../middleware/authenticate";
import { createUploadMiddleware } from "../middleware/upload";

const router = Router();
const profileImageUpload = createUploadMiddleware("UserProfilePics");

// ========== Traditional Auth Routes ==========
router.post("/register", registerUser);
router.post("/login", loginUser);

// ========== Magic Link Auth Routes ==========
router.post("/send-magic-link", sendMagicLink);
router.get("/magic-login", magicLogin);
router.post("/magic-register", magicRegister); // ✅ Register + send link

// ========== Protected Routes ==========
router.put("/update-profile", authenticate, updateProfile);
router.post("/check-password", authenticate, checkPassword);
router.get("/user-profile", authenticate, getUserProfile);

// ========== Profile Picture Upload ==========
router.post(
  "/upload-profile-picture",
  authenticate,
  profileImageUpload.single("profilePicture"),
  uploadProfilePicture
);

// ========== Token Validation ==========
router.post("/validate-token", validateToken);

// ========== Google OAuth ==========
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  async (req: Request, res: Response) => {
    const user = req.user as any;

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?token=${token}`;
    res.redirect(redirectUrl);
  }
);

// ========== Facebook OAuth ==========
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] }) // ✅ Request email explicitly
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/" }),
  async (req: Request, res: Response) => {
    const user = req.user as any;

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const redirectUrl = `${process.env.FRONTEND_URL}/oauth-success?token=${token}`;
    res.redirect(redirectUrl);
  }
);

export default router;
