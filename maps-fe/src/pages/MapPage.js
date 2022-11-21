import React, { useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { useMap } from "../hooks/useMap";

const puntoInicial = {
  lng: -122.4725,
  lat: 37.801,
  zoom: 13.5,
};

export const MapPage = () => {
  const {
    setRef,
    coords,
    newMarker$,
    markerMovements$,
    agregarMarcador,
    actualizarPosicion,
  } = useMap(puntoInicial);
  const { socket } = useSocket();

  // Escuchar los marcadores existentes
  useEffect(() => {
    socket.on("actives-markers", (marcadores) => {
      for (const key of Object.keys(marcadores)) {
        agregarMarcador(marcadores[key], key);
      }
    });
  }, [socket, agregarMarcador]);

  // Nuevo marcador
  useEffect(() => {
    newMarker$.subscribe((marcador) => {
      socket.emit("new-marker", marcador);
    });
  }, [newMarker$, socket]);

  // Movimiento de Marcador
  useEffect(() => {
    markerMovements$.subscribe((marcador) => {
      socket.emit("updated-marker", marcador);
    });
  }, [socket, markerMovements$]);

  // Mover marcador mediante sockets
  useEffect(() => {
    socket.on("updated-marker", (marcador) => {
      actualizarPosicion(marcador);
    });
  }, [socket, actualizarPosicion]);

  // Escuchar nuevos marcadores
  useEffect(() => {
    socket.on("new-marker", (marcador) => {
      agregarMarcador(marcador, marcador.id);
    });
  }, [socket, agregarMarcador]);

  return (
    <>
      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>

      <div ref={setRef} className="mapContainer" />
    </>
  );
};
