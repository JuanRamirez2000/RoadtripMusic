"use client";
//! This will be added back when the library is more stable
//import { SearchBox } from "@mapbox/search-js-react";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  NavigationControl,
  ScaleControl,
} from "react-map-gl";
import mapboxgl from "mapbox-gl";
import DeckGLOverlay from "./DeckGLOverlay";
import type { MapRef } from "react-map-gl";
import type {
  SearchBoxFeatureSuggestion,
  SearchBoxRetrieveResponse,
} from "@mapbox/search-js-core";
import { findDirectionsBase } from "app/actions/findDirections";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import type { LineString } from "geojson";
import {
  grabSongsForPlaylist,
  generatePlaylist,
} from "app/actions/generatePlaylistServerAction";

import dynamic from "next/dynamic";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const SearchBox = dynamic(
  () =>
    import("@mapbox/search-js-react").then(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      /* eslint-disable @typescript-eslint/no-unsafe-return */
      (module) => module.AddressAutofill as any
    ),
  { ssr: false }
  /* eslint-disable @typescript-eslint/no-explicit-any */
) as any;

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

type RouteDuration = {
  distance: number;
  duration: number;
};

export default function MapContainer() {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);

  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [originData, setOriginData] =
    useState<SearchBoxFeatureSuggestion | null>(null);
  const [destinationData, setDestinationData] =
    useState<SearchBoxFeatureSuggestion | null>(null);

  const [routeData, setRouteData] = useState<LineString>();
  const [durationData, setDurationData] = useState<RouteDuration | null>(null);

  const [spotifySongURIs, setSpotifySongURIs] = useState<string[] | null>(null);

  if (!MAPBOX_ACCESS_TOKEN) return <h1>Error Loading</h1>;
  if (!mapRef) return <h1>Loading...</h1>;

  const handleFindDirections = async () => {
    if (!originData) return;
    if (!destinationData) return;

    try {
      const directions = await findDirectionsBase({
        origin: originData,
        destination: destinationData,
      });

      if (!directions)
        throw new Error("Failed grabbing directions from backend");

      const { routes } = directions;

      setRouteData(routes[0]?.geometry);
      setDurationData({
        duration: routes[0]?.duration as number,
        distance: routes[0]?.distance as number,
      });

      //* Clear out everything
      setSpotifySongURIs(null);
    } catch (err) {
      console.error(err);
    }
  };

  const hangleGrabSongs = async () => {
    try {
      if (!durationData) return;

      const res = await grabSongsForPlaylist(durationData.duration);
      if (res.songs) {
        setSpotifySongURIs(res.songs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePlaylist = async () => {
    try {
      if (!spotifySongURIs) return;

      await generatePlaylist("roadtripMusic", spotifySongURIs);
    } catch (err) {
      console.error(err);
    }
  };

  const routeLayer = new GeoJsonLayer({
    id: "route-layer",
    data: routeData,
    filled: true,
    getLineColor: [236, 72, 153, 255],
    lineWidthScale: 20,
    lineWidthMinPixels: 3,
    getLineWidth: 1,
  });

  return (
    <section className="flex h-full w-full flex-row">
      <div className="flex h-full w-1/4 flex-col items-center pt-24">
        {/*This needs to be a form at some point for now this is fine */}
        <div className="flex w-3/4 flex-col gap-12">
          <SearchBox
            accessToken={MAPBOX_ACCESS_TOKEN}
            value={originSearch}
            onChange={setOriginSearch}
            onRetrieve={(res: SearchBoxRetrieveResponse) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              setOriginData(res.features[0]!)
            }
            options={{
              proximity: mapRef.current?.getMap().getCenter(),
            }}
            placeholder="Origin"
            map={mapRef.current?.getMap()}
            mapboxgl={mapboxgl}
            marker
          />
          <SearchBox
            accessToken={MAPBOX_ACCESS_TOKEN}
            value={destinationSearch}
            onChange={setDestinationSearch}
            onRetrieve={(res: SearchBoxRetrieveResponse) =>
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              setDestinationData(res.features[0]!)
            }
            options={{
              proximity: mapRef.current?.getMap().getCenter(),
            }}
            placeholder="Destination"
            map={mapRef.current?.getMap()}
            mapboxgl={mapboxgl}
            marker
          />
          <div className="flex flex-col gap-6">
            <button
              className={`rounded-lg px-3 py-2.5 ${
                originData && destinationData ? "bg-rose-600" : "bg-slate-600"
              }`}
              disabled={!(originData && destinationData)}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                await handleFindDirections();
              }}
              type="button"
            >
              Find Directions
            </button>
            <button
              className={`rounded-lg px-3 py-2.5 ${
                routeData ? "bg-rose-600" : "bg-slate-600"
              }`}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                await hangleGrabSongs();
              }}
              disabled={!routeData}
              type="button"
            >
              Grab Songs
            </button>
            <button
              className={`rounded-lg px-3 py-2.5 ${
                spotifySongURIs ? "bg-rose-600" : "bg-slate-600"
              }`}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                await handleGeneratePlaylist();
              }}
              disabled={!spotifySongURIs}
              type="button"
            >
              Save Playlist
            </button>
          </div>
        </div>
      </div>
      <div className="h-full w-3/4">
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapLib={mapboxgl}
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
          <DeckGLOverlay layers={[routeLayer]} />
          <GeolocateControl />
          <ScaleControl />
          <NavigationControl />
          <FullscreenControl />
        </Map>
      </div>
    </section>
  );
}
