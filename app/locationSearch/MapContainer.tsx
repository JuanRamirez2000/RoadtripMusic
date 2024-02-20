"use client";
import { useTheme } from "next-themes";
import { useRef } from "react";
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";

import type { MapRef } from "react-map-gl";
import GeocodeControl from "./GeocodeControl";
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapContainer() {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);

  if (!MAPBOX_ACCESS_TOKEN) return <h1>Error Loading</h1>;
  if (!mapRef) return <h1>Loading...</h1>;

  return (
    <>
      <Map
        mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        initialViewState={{
          longitude: -122.4,
          latitude: 37.8,
          zoom: 14,
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={
          theme === "light"
            ? "mapbox://styles/mapbox/light-v11"
            : "mapbox://styles/mapbox/dark-v11"
        }
        ref={mapRef}
      >
        <GeocodeControl
          position="top-left"
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        />
        <GeocodeControl
          position="top-left"
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        />
        <GeolocateControl />
        <ScaleControl />
        <NavigationControl />
        <FullscreenControl />
      </Map>
    </>
  );
}
