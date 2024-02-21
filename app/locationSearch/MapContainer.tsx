"use client";
import type {
  SearchBoxRetrieveResponse,
  SearchBoxFeatureSuggestion,
} from "@mapbox/search-js-core";
import { SearchBox } from "@mapbox/search-js-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";

import { ScatterplotLayer } from "@deck.gl/layers/typed";

import type { MapRef } from "react-map-gl";
import DeckGLOverlay from "./DeckGLOverlay";

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function MapContainer() {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [originPoint, setOriginPoint] =
    useState<SearchBoxFeatureSuggestion | null>(null);
  const [destinationPoint, setDestinationPoint] =
    useState<SearchBoxFeatureSuggestion | null>(null);

  const waypointData = [];
  if (originPoint) waypointData.push(originPoint);
  if (destinationPoint) waypointData.push(destinationPoint);
  if (!MAPBOX_ACCESS_TOKEN) return <h1>Error Loading</h1>;
  if (!mapRef) return <h1>Loading...</h1>;

  const handleSelectedLocation = (
    locationType: string,
    res: SearchBoxRetrieveResponse
  ) => {
    const location = res.features[0];
    if (!location) return;
    if (locationType === "Origin") {
      setOriginPoint(location);
    } else {
      setDestinationPoint(location);
    }
  };

  const waypoints = new ScatterplotLayer({
    id: "icon-layer",
    data: waypointData,
    getPosition: (d: SearchBoxFeatureSuggestion) => [
      d.geometry.coordinates[0] as number,
      d.geometry.coordinates[1] as number,
    ],
    sizeScale: 15,
    filled: true,
    radiusScale: 8,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
  });
  return (
    <section className="flex h-full w-full flex-row">
      <div className="flex h-full w-1/4 flex-col items-center pt-24">
        <form action="" className="flex w-3/4 flex-col gap-12">
          <SearchBox
            accessToken={MAPBOX_ACCESS_TOKEN}
            value={originSearch}
            onChange={setOriginSearch}
            onRetrieve={(res) => handleSelectedLocation("origin", res)}
            options={{
              proximity: mapRef.current?.getMap().getCenter(),
            }}
            placeholder="Origin"
            map={mapRef.current?.getMap()}
          />
          <SearchBox
            accessToken={MAPBOX_ACCESS_TOKEN}
            value={destinationSearch}
            onChange={setDestinationSearch}
            onRetrieve={(res) => handleSelectedLocation("destination", res)}
            options={{
              proximity: mapRef.current?.getMap().getCenter(),
            }}
            placeholder="Destination"
            map={mapRef.current?.getMap()}
          />
        </form>
      </div>
      <div className="h-full w-3/4">
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
          <DeckGLOverlay layers={[waypoints]} />
          <GeolocateControl />
          <ScaleControl />
          <NavigationControl />
          <FullscreenControl />
        </Map>
      </div>
    </section>
  );
}
