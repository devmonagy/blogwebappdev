import io, { Socket } from "socket.io-client";

// Dynamically choose endpoint for local vs production
const ENDPOINT: string =
  process.env.NODE_ENV === "production"
    ? window.location.origin // ✅ resolves to your domain like https://blogwebapp.monagy.com
    : process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000";

// Create the socket connection with polling-only transport for Render
const socket: Socket = io(ENDPOINT, {
  transports: ["polling"], // ✅ Enforce long-polling (Render doesn't support WebSockets without upgrade)
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
