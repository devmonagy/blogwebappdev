import io, { Socket } from "socket.io-client";

// Determine endpoint dynamically based on environment
const ENDPOINT: string =
  process.env.NODE_ENV === "production"
    ? "https://blogwebapp.monagy.com"
    : process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000";

// Create the socket connection with reconnection strategy
const socket: Socket = io(ENDPOINT, {
  withCredentials: true,
  transports: ["websocket"], // ensure WebSocket transport is used
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
});

// Connection event listeners (recommended for debugging)
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

// Export the socket and its type
export type AppSocket = typeof socket;

export default socket;
