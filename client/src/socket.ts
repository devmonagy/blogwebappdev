import io, { Socket } from "socket.io-client";

// ✅ Use REACT_APP_BACKEND_URL from .env or fallback to localhost
const ENDPOINT: string =
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

// ✅ Use WebSocket only (Render Starter Plan supports it)
const socket: Socket = io(ENDPOINT, {
  transports: ["websocket"], // ⛔️ No more polling
  withCredentials: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
});

// ✅ Debug logging
socket.on("connect", () => {
  console.log("✅ Connected to Socket.IO server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔌 Disconnected from Socket.IO server");
});

socket.on("reconnect_attempt", (attempt) => {
  console.log(`♻️ Reconnect attempt ${attempt}`);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket.IO connection error:", error);
});

// ✅ Export
export type AppSocket = typeof socket;
export default socket;
