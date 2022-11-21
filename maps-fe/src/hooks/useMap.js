import { useRef, useState, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";
import { Subject } from "rxjs";

mapboxgl.accessToken = process.env.REACT_APP_MAPS_API_KEY;

export const useMap = (puntoInicial) => {
  // Referencia al DIV del mapa
  const mapContainerRef = useRef();
  const setRef = useCallback((node) => {
    mapContainerRef.current = node;
  }, []);

  // Referencia los marcadores
  const markers = useRef({});

  // Observables de Rxjs
  const makerMovements = useRef(new Subject());
  const newMarker = useRef(new Subject());

  // Mapa y coords
  const mapRef = useRef();
  const [coords, setCoords] = useState(puntoInicial);

  // función para agregar marcadores
  const addMarker = useCallback((ev, id) => {
    const { lng, lat } = ev.lngLat || ev;

    const marker = new mapboxgl.Marker();
    marker.id = id ?? v4();

    marker.setLngLat([lng, lat]).addTo(mapRef.current).setDraggable(true);

    // Asignamos al objeto de marcadores
    markers.current[marker.id] = marker;

    if (!id) {
      newMarker.current.next({
        id: marker.id,
        lng,
        lat,
      });
    }

    // escuchar movimientos del marcador
    marker.on("drag", ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();
      makerMovements.current.next({ id, lng, lat });
    });
  }, []);

  // Funcion para actualizar la ubicación del marcador
  const updatePosition = useCallback(({ id, lng, lat }) => {
    markers.current[id].setLngLat([lng, lat]);
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [puntoInicial.lng, puntoInicial.lat],
      zoom: puntoInicial.zoom,
    });

    mapRef.current = map;
  }, [puntoInicial]);

  // Cuando se mueve el mapa
  useEffect(() => {
    mapRef.current?.on("move", () => {
      const { lng, lat } = mapRef.current.getCenter();
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapRef.current.getZoom().toFixed(2),
      });
    });
  }, []);

  // Agregar marcadores cuando hago click
  useEffect(() => {
    mapRef.current?.on("click", addMarker);
  }, [addMarker]);

  return {
    agregarMarcador: addMarker,
    actualizarPosicion: updatePosition,
    coords,
     markers,
    newMarker$: newMarker.current,
    markerMovements$: makerMovements.current,
    setRef,
  };
};
