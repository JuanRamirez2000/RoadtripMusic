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
import {
  ArrowDownTrayIcon,
  ClockIcon,
  MapIcon,
  MusicalNoteIcon,
} from "@heroicons/react/24/outline";
import { GiPathDistance } from "react-icons/gi";
import { toast } from "react-toastify";
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const SearchBox = dynamic(
  () =>
    import("@mapbox/search-js-react").then(
      /* eslint-disable @typescript-eslint/no-explicit-any */
      /* eslint-disable @typescript-eslint/no-unsafe-return */
      (module) => module.SearchBox as any
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

      if (!directions) {
        toast.error("Finding directions failed D:", {
          theme: theme === "light" ? "light" : "dark",
        });
        throw new Error("Failed grabbing directions from backend");
      }

      const { routes } = directions;

      setRouteData(routes[0]?.geometry);
      setDurationData({
        duration: routes[0]?.duration as number,
        distance: routes[0]?.distance as number,
      });

      //* Clear out everything
      setSpotifySongURIs(null);
      toast.success("Found directions!", {
        theme: theme === "light" ? "light" : "dark",
      });
    } catch (err) {
      toast.error("An error occured finding directions", {
        theme: theme === "light" ? "light" : "dark",
      });
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
      if (res.status === "Ok") {
        toast.success("Generated some music!", {
          theme: theme === "light" ? "light" : "dark",
        });
      }
      if (res.status === "Error") {
        toast.error("Music generation failed D:", {
          theme: theme === "light" ? "light" : "dark",
        });
      }
    } catch (err) {
      toast.error("Some error occured generating music", {
        theme: theme === "light" ? "light" : "dark",
      });
      console.error(err);
    }
  };

  const handleGeneratePlaylist = async () => {
    try {
      if (!spotifySongURIs) return;

      await generatePlaylist("roadtripMusic", spotifySongURIs);
      toast("Playlist Done!", {
        theme: theme === "light" ? "light" : "dark",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const convertToMinutes = (durationSeconds: number) => {
    return Math.floor(durationSeconds / 60);
  };

  const convertToMiles = (distanceMeters: number) => {
    return Math.round((distanceMeters / 1609.344) * 100) / 100;
  };

  const routeLayer = new GeoJsonLayer({
    id: "route-layer",
    data: routeData,
    filled: true,
    getLineColor: () =>
      theme === "light" ? [16, 185, 129, 255] : [236, 72, 153, 255],
    lineWidthScale: 20,
    lineWidthMinPixels: 3,
    getLineWidth: 1,
  });

  return (
    <section className="flex h-full w-full flex-row">
      <div className="flex h-full w-1/5 flex-col items-center pt-24">
        {/*This needs to be a form at some point for now this is fine */}
        <div className="flex w-3/4 flex-col items-center gap-12">
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
          <button
            className={`align-center inline-flex w-48 flex-row  gap-4 rounded-lg p-3 text-emerald-50 ${
              originData && destinationData
                ? "bg-emerald-500 dark:bg-rose-600"
                : "bg-slate-600"
            }`}
            disabled={!(originData && destinationData)}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              await handleFindDirections();
            }}
            type="button"
          >
            <MapIcon className="h-7 w-7" />
            <p className="text-lg">Find directions</p>
          </button>
          {!!durationData && (
            <>
              <div className=" inline-flex h-fit w-full max-w-72 flex-row items-center gap-4 rounded-lg bg-slate-50 p-5 dark:bg-zinc-700">
                <GiPathDistance className="h-9 w-9 text-emerald-500 dark:text-rose-600" />
                <div className="px-2.5">
                  <h2 className="text-sm text-slate-700 dark:text-zinc-300">
                    Duration
                  </h2>
                  <p className="text-2xl font-semibold">
                    {convertToMinutes(durationData.duration)} minutes
                  </p>
                </div>
              </div>
              <div className="inline-flex h-fit w-full max-w-72 flex-row items-center gap-4 rounded-lg bg-slate-50 p-5 dark:bg-zinc-700">
                <ClockIcon className="h-9 w-9 text-emerald-500 dark:text-rose-600" />
                <div className="px-2.5">
                  <h2 className="text-sm text-slate-700 dark:text-zinc-300">
                    Distance
                  </h2>
                  <p className="text-2xl font-semibold">
                    {convertToMiles(durationData.distance)} miles
                  </p>
                </div>
              </div>
              <button
                className={`align-center inline-flex w-48 flex-row gap-4 rounded-lg p-3 text-emerald-50 ${
                  originData && destinationData
                    ? "bg-emerald-500 dark:bg-rose-600"
                    : "bg-slate-600"
                }`}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => {
                  await hangleGrabSongs();
                }}
                disabled={!routeData}
                type="button"
              >
                <MusicalNoteIcon className="h-7 w-7" />
                <p className="text-lg">Make Playlist</p>
              </button>
            </>
          )}
        </div>
      </div>
      <div className="h-full w-4/5">
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

{
  /* 
            <button
              className={`rounded-lg p-3 ${
                routeData ? "bg-rose-600" : "bg-slate-600"
              }`}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                await hangleGrabSongs();
              }}
              disabled={!routeData}
              type="button"
            >
              <MusicalNoteIcon className="h-9 w-9" />
            </button>
            <button
              className={`rounded-lg p-3 ${
                spotifySongURIs ? "bg-rose-600" : "bg-slate-600"
              }`}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={async () => {
                await handleGeneratePlaylist();
              }}
              disabled={!spotifySongURIs}
              type="button"
            >
              <ArrowDownTrayIcon className="h-9 w-9" />
            </button>
              */
}
