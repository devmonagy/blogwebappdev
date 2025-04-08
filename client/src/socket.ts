import io, { Socket } from "socket.io-client";

// Use REACT_APP_BACKEND_URL explicitly
const ENDPOINT: string =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const socket: Socket = io(ENDPOINT, {
  transports: ["polling"], // Stick to polling unless you're 100% sure WebSocket works
  withCredentials: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
});

socket.on("connect", () => {
  console.log("✅ Connected to Socket.IO server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from Socket.IO server");
});

socket.on("reconnect_attempt", (attempt) => {
  console.log(`♻️ Attempting to reconnect (Attempt ${attempt})`);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket.IO connection error:", error);
});

export type AppSocket = typeof socket;
export default socket;
