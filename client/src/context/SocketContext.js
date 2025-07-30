import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ userId, children }) => {
  const socketRef = useRef(null);
  const [socketInstance, setSocketInstance] = useState(null);

  useEffect(() => {
    if (!userId) return;

    // Only connect if not already connected
    if (!socketRef.current) {
      const socket = io("http://localhost:5000", {
        withCredentials: true,
      });

      socket.on("connect", () => {
        socket.emit("register-user", userId);
      });

      socketRef.current = socket;
      setSocketInstance(socket);
    }

    // Disconnect only when component unmounts or user logs out
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
      }
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};
