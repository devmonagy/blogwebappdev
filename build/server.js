"use strict";
// server/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import necessary Node.js modules and middleware
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Import custom database connection function and route handlers
const db_1 = __importDefault(require("./config/db"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes")); // Use default import for postRoutes
// Load environment variables from .env file
dotenv_1.default.config();
// Create an Express application
const app = (0, express_1.default)();
// Define the port on which the server will run. Default to 5000 if not specified in the environment
const PORT = process.env.PORT || 5000;
// Establish connection to MongoDB using the custom function
(0, db_1.default)();
// Define the allowed origins for CORS (Cross-Origin Resource Sharing)
const allowedOrigins = [
    "http://localhost:3000", // Allow frontend application on localhost for development
    "http://192.168.1.204:3000", // Allow frontend application on the local network, useful for testing on multiple devices
];
// Apply CORS middleware to enable requests from the allowed origins and support credentials
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true, // This is necessary for sites that use cookies, HTTP authentication, etc.
}));
// Add middleware to parse JSON bodies. This is necessary for handling JSON requests
app.use(express_1.default.json());
// Serve static files from the 'uploads' directory. Necessary for any uploaded files like images
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Simple route to test if the server is running and connected to the database
app.get("/", (req, res) => {
    res.send("Hello, MongoDB is connected!");
});
// Use authentication routes as specified in the authRoutes module
app.use("/auth", authRoutes_1.default);
// Use blog post routes as specified in the postRoutes module
app.use("/posts", postRoutes_1.default); // Use default import
// Start the server on the specified port and log a message to the console
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
