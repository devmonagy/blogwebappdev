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
exports.validateToken = exports.checkPassword = exports.updateProfile = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// Token expiration set to a longer duration, e.g., 7 days
const TOKEN_EXPIRY = "7d";
// Register User
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, firstName, lastName, email, password } = req.body;
    try {
        const existingUsername = yield User_1.default.findOne({ username });
        if (existingUsername) {
            res.status(400).json({ error: "Username already taken" });
            return;
        }
        const existingEmail = yield User_1.default.findOne({ email });
        if (existingEmail) {
            res.status(400).json({ error: "Email already registered" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        yield newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.registerUser = registerUser;
// Login User
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { usernameOrEmail, password } = req.body;
    try {
        const user = yield User_1.default.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: TOKEN_EXPIRY,
        });
        res.status(200).json({
            token,
            user: {
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                profilePicture: user.profilePicture,
            },
        });
    }
    catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.loginUser = loginUser;
// Update User Profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { firstName, lastName, email, newPassword } = req.body;
    const profilePicture = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        if (firstName)
            user.firstName = firstName;
        if (lastName)
            user.lastName = lastName;
        if (email)
            user.email = email;
        if (profilePicture)
            user.profilePicture = profilePicture;
        if (newPassword) {
            const isSamePassword = yield bcrypt_1.default.compare(newPassword, user.password);
            if (isSamePassword) {
                res.status(400).json({ error: "Password can't be your current one!" });
                return;
            }
            user.password = yield bcrypt_1.default.hash(newPassword, 10);
        }
        yield user.save();
        res.status(200).json({ message: "Profile updated successfully" });
    }
    catch (error) {
        console.error("Error during profile update:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateProfile = updateProfile;
// Check Password
const checkPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ error: "User not authenticated" });
        return;
    }
    try {
        const user = yield User_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        const isSame = yield bcrypt_1.default.compare(password, user.password);
        res.status(200).json({ isSame });
    }
    catch (error) {
        console.error("Error checking password:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.checkPassword = checkPassword;
// Validate Token
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ valid: false, error: "Token is missing" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = yield User_1.default.findById(decoded.userId);
        if (!user) {
            res.status(404).json({ valid: false, error: "User not found" });
            return;
        }
        res.status(200).json({
            valid: true,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
            },
        });
    }
    catch (error) {
        res.status(401).json({ valid: false, error: "Invalid token" });
    }
});
exports.validateToken = validateToken;
