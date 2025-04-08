import io, { Socket } from "socket.io-client";

// Dynamically choose endpoint for local vs production
const ENDPOINT: string =
  process.env.NODE_ENV === "production"
    ? window.location.origin // ✅ resolves to your domain
    : process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000";

// Create the socket connection with polling fallback for Render
const socket: Socket = io(ENDPOINT, {
  withCredentials: true,
  transports: ["polling"], // ✅ Force long-polling transport (Render doesn't support WebSocket)
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
});

// Debug logs
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

// Export the socket
export type AppSocket = typeof socket;
export default socket;
