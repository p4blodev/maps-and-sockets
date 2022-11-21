import { useContext } from "react";
import { SocketContext } from "../context/SocketContex";

export const useSocket = () => {
  const { onLine, socket } = useContext(SocketContext);

  return { onLine, socket };
};
