"use client";
import { forwardRef } from "react";
import Map, {
  FullscreenControl,
  GeolocateControl,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";

import type { MapProps, MapRef } from "react-map-gl";

interface MapboxWrapperProps extends MapProps {
  accessToken: string;
}

const MapboxWrapper = forwardRef<MapRef, MapboxWrapperProps>(
  ({ accessToken, ...props }, ref) => {
    return (
      <section className="h-full w-full">
        <Map
          mapboxAccessToken={accessToken}
          initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 14,
          }}
          style={{ width: "width: 100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          ref={ref}
        >
          <FullscreenControl />
          <GeolocateControl />
          <NavigationControl />
          <ScaleControl />
        </Map>
      </section>
    );
  }
);

MapboxWrapper.displayName = "MapboxWrapper";

export { MapboxWrapper };
