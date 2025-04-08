import io, { Socket } from "socket.io-client";

// Dynamically determine the endpoint
const ENDPOINT: string =
  process.env.NODE_ENV === "production"
    ? window.location.origin
    : process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000";

// ✅ Force polling and explicitly define the path
const socket: Socket = io(ENDPOINT, {
  transports: ["polling"],
  withCredentials: true,
  path: "/socket.io", // <-- this is important for Render
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
  console.log(`♻️ Reconnecting attempt ${attempt}`);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket.IO connection error:", error);
});

export type AppSocket = typeof socket;
export default socket;
