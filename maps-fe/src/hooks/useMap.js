import { useCallback, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { v4 } from "uuid";
import { Subject } from "rxjs";

mapboxgl.accessToken = process.env.REACT_APP_MAPS_API_KEY;

export const useMap = (initailPoint) => {
  const refContainerMap = useRef();
  const setRef = useCallback((node) => {
    refContainerMap.current = node;
  }, []);
  const refMap = useRef();
  const [coords, setCoords] = useState(initailPoint);
  const markers = useRef({});
  // observables
  const movementMarket = useRef(new Subject());
  const newMarker = useRef(new Subject());

  const addMarker = useCallback((event) => {
    const { lng, lat } = event.lngLat;
    const marker = new mapboxgl.Marker();
    marker.id = v4();
    marker.setLngLat([lng, lat]).addTo(refMap.current).setDraggable(true);

    markers.current[marker.id] = marker;

    // TODO: if marker has id not create one
    newMarker.current.next({
      id: marker.id,
      lng,
      lat,
    });

    marker.on("dragstart", ({ target }) => {
      const id = target.id;
      const { lng, lat } = target.getLngLat();

      movementMarket.current.next({
        id,
        lat,
        lng,
        movement: "start",
      });
    });
    marker.on("dragend", ({ target }) => {
      const id = target.id;
      const { lng, lat } = target.getLngLat();

      movementMarket.current.next({
        id,
        lat,
        lng,
        movement: "end",
      });
    });
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: refContainerMap.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [initailPoint.lng, initailPoint.lat],
      zoom: initailPoint.zoom,
    });

    refMap.current = map;
  }, [initailPoint]);

  useEffect(() => {
    if (!refMap.current) return;

    refMap.current.on("move", () => {
      const { lng, lat } = refMap.current.getCenter();

      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: refMap.current.getZoom().toFixed(2),
      });
    });
  }, []);

  useEffect(() => {
    refMap.current?.on("click", (event) => {
      addMarker(event);
    });
  }, [addMarker]);

  return {
    addMarker,
    coords,
    markers,
    newMarker$: newMarker.current,
    movementMarket$: movementMarket.current,
    setRef,
  };
};
