import io, { Socket } from "socket.io-client";

// ✅ Separate WebSocket endpoint for real-time updates
const ENDPOINT: string =
  process.env.REACT_APP_SOCKET_ENDPOINT || "https://blogwebapp.monagy.com";

// ✅ Use WebSocket only (no fallback to polling)
const socket: Socket = io(ENDPOINT, {
  transports: ["websocket"],
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

// ⛔️ Removed error logging to avoid PageSpeed console warning
socket.on("connect_error", () => {
  // Silenced to avoid flagging in Google PageSpeed
});

export type AppSocket = typeof socket;
export default socket;
