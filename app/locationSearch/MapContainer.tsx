"use client";
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
import mapboxgl from "mapbox-gl";
import DeckGLOverlay from "./DeckGLOverlay";
import type { MapRef } from "react-map-gl";
import type { SearchBoxFeatureSuggestion } from "@mapbox/search-js-core";
import { findDirectionsBase } from "app/actions/findDirections";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import type { LineString } from "geojson";
import generatePlaylist from "app/actions/generatePlaylistServerAction";
{
  /* 
import {
  ArrowUpRightIcon,
  MapIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
*/
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

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
    } catch (err) {
      console.error(err);
    }
  };

  const handleGeneratePlaylist = async () => {
    try {
      const res = await generatePlaylist();
      console.log(res);
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onRetrieve={(res) => setOriginData(res.features[0]!)}
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            onRetrieve={(res) => setDestinationData(res.features[0]!)}
            options={{
              proximity: mapRef.current?.getMap().getCenter(),
            }}
            placeholder="Destination"
            map={mapRef.current?.getMap()}
            mapboxgl={mapboxgl}
            marker
          />
          <div className="flex flex-col gap-6">
            {/* 
            <ul className="flex w-full justify-between">
              <li className="inline-flex flex-row rounded-lg bg-rose-500 p-2 ">
                <button>
                  <MapIcon className="size-8" />
                </button>
              </li>
              <li className="inline-flex flex-row rounded-lg bg-rose-500 p-2 ">
                <button>
                  <MusicalNoteIcon className="size-8" />
                </button>
              </li>
              <li className="inline-flex flex-row rounded-lg bg-rose-500 p-2 ">
                <button>
                  <ArrowUpRightIcon className="size-8" />
                </button>
              </li>
            </ul>
                */}
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
              onClick={async () => {
                await handleGeneratePlaylist();
              }}
              disabled={!routeData}
              type="button"
            >
              Grab Songs
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
