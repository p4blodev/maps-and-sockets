import { useEffect } from "react";
import { useMap } from "../hooks/useMap";

const INITIAL_POINT = {
  lng: -122.4725,
  lat: 37.801,
  zoom: 13.5,
};

export const MapPage = () => {
  const { coords, newMarker$, movementMarket$, setRef } = useMap(INITIAL_POINT);

  useEffect(() => {
    newMarker$.subscribe((marker) => {
      console.log(
        "TURBO-CL -> file: MapPage.js -> line 18 -> useEffect -> marker",
        marker
      );
    });
  }, [newMarker$]);

  useEffect(() => {
    movementMarket$.subscribe((marker) => {
      console.log(
        "TURBO-CL -> file: MapPage.js -> line 27 -> movementMarket$.subscribe -> marker",
        marker
      );
    });
  }, [movementMarket$]);

  return (
    <>
      <div className="info">
        lng: {coords.lng} | lat:{coords.lat} | zoom: {coords.zoom}
      </div>
      <div ref={setRef} className="map-container" />
    </>
  );
};
