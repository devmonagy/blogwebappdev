"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the userId is correctly attached by the middleware
        const user = yield User_1.default.findById(req.userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return; // Explicitly return to ensure the function ends
        }
        // Return the user data
        res.status(200).json({
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserProfile = getUserProfile;
