import { MapPage } from "./pages/MapPage";
import { SocketProvider } from "./context/SocketContex";

export const MapsApp = () => {
  return (
    <SocketProvider>
      <MapPage />
    </SocketProvider>
  );
};
