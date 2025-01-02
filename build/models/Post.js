"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/models/Post.ts
const mongoose_1 = __importDefault(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
});
exports.default = mongoose_1.default.model("Post", postSchema);
