import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SocketContextValue {
  /** The active Socket.IO instance, or null before the connection is ready. */
  socket: Socket | null;
  /** True once the socket has successfully connected to the server. */
  isConnected: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * Manages a singleton Socket.IO connection for the lifetime of the app.
 * The socket connects immediately on mount and disconnects on unmount.
 * Authentication is handled per-request via the Bearer token in HTTP headers,
 * not at the socket level — keeping the connection stateless w.r.t. auth.
 */
export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const serverUrl =
      import.meta.env.VITE_API_URL ?? "http://localhost:8000";

    const socket = io(serverUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSocket(): SocketContextValue {
  return useContext(SocketContext);
}