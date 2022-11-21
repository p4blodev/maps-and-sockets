import { useState, useEffect, useMemo } from "react";
import { createContext } from "react";
import io from "socket.io-client";

const socketServerPath = "http://localhost:8080";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [onLine, setOnline] = useState(false);
  const socket = useMemo(() => {
    return io.connect(socketServerPath, {
      transports: ["websocket"],
    });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setOnline(true);
    });

    socket.on("disconnect", () => {
      setOnline(false);
    });

    socket.on("pong", () => {
      // setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ onLine, socket }}>
      {children}
    </SocketContext.Provider>
  );
};
