import io, { Socket } from "socket.io-client";

const ENDPOINT: string =
  process.env.REACT_APP_SOCKET_ENDPOINT || "http://localhost:5000";

// Create the socket connection with reconnection strategy
const socket: Socket = io(ENDPOINT, {
  reconnectionAttempts: 10,
  reconnectionDelay: 3000,
});

// Connection event listeners (optional but recommended for debugging)
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
