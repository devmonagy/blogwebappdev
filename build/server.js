"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
dotenv_1.default.config(); // Load environment variables from .env file
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, db_1.default)();
// Define the allowed origins for CORS
const allowedOrigins = [
    "http://localhost:3000",
    "http://192.168.1.204:3000", // Replace with your actual local network IP
];
// Use cors middleware to enable requests from the allowed origins
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true, // Enable credentials if needed
}));
app.use(express_1.default.json()); // Middleware to parse JSON
// Example route to test the server
app.get("/", (req, res) => {
    res.send("Hello, MongoDB is connected!");
});
// Authentication routes
app.use("/auth", authRoutes_1.default);
// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
