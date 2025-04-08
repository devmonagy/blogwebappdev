import io, { Socket } from "socket.io-client";

// Dynamically choose endpoint for local vs production
const ENDPOINT: string =
  process.env.NODE_ENV === "production"
    ? window.location.origin // ✅ resolves to https://blogwebapp.monagy.com
    : process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000";

// Create the socket connection (supports both websocket and polling)
const socket: Socket = io(ENDPOINT, {
  transports: ["websocket", "polling"], // ✅ Allow fallback if WebSocket fails
  withCredentials: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
});

// Connection debug logs
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

// Export socket instance and type
export type AppSocket = typeof socket;
export default socket;
