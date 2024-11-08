"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        res.status(401).json({ error: "Access denied. No token provided." });
        return; // Add a return statement to end the function
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Attach the userId to the request object
        next(); // Call the next middleware
    }
    catch (error) {
        res.status(400).json({ error: "Invalid token." });
        return; // Add a return statement to end the function
    }
};
exports.default = authenticate;
