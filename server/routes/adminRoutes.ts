// server/routes/adminRoutes.ts
import express from "express";
import authenticate from "../middleware/authenticate";
import { checkAdmin } from "../middleware/checkAdmin";
import { getAllUsers, updateUserRole } from "../controllers/adminController";

const router = express.Router();

router.get("/users", authenticate, checkAdmin, getAllUsers);
router.patch("/users/role", authenticate, checkAdmin, updateUserRole);

export default router;
