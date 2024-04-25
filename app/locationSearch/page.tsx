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
import Image from "next/image";
import along from "@turf/along";
import type { DirectionsRoute } from "types/mapboxDirections";
import type { Feature, Point } from "geojson";
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

type TrackWithDistance = SpotifyApi.TrackObjectFull & {
  distanceTraveled?: number;
  point?: Feature<Point>;
};
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function LocationsSearchPage() {
  const { theme } = useTheme();
  const mapRef = useRef<MapRef>(null);

  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [originData, setOriginData] =
    useState<SearchBoxFeatureSuggestion | null>(null);
  const [destinationData, setDestinationData] =
    useState<SearchBoxFeatureSuggestion | null>(null);

  const [routeData, setRouteData] = useState<DirectionsRoute>();

  const [spotifyTracks, setSpotifyTracks] = useState<TrackWithDistance[]>([]);

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

      setRouteData(directions.routes[0]);

      //* Clear out everything
      setSpotifyTracks([]);
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
      if (!routeData) return;

      const res = await grabSongsForPlaylist(routeData.duration);
      if (res.songs) {
        const songs = res.songs;
        const routeDistance = convertToMiles(routeData.distance);
        const playlistDuration = songs.reduce((acc, track) => {
          return acc + track.duration_ms;
        }, 0);

        let distanceUsed = 0;

        const tracksWithDistance: TrackWithDistance[] = songs.map((track) => {
          const trackTimePercentage = track.duration_ms / playlistDuration;
          const trackDistanceMI = routeDistance * trackTimePercentage;
          const trackDistanceFromOrigin = trackDistanceMI + distanceUsed;
          distanceUsed += trackDistanceMI;

          const point = along(routeData?.geometry, trackDistanceFromOrigin, {
            units: "miles",
          });
          return {
            ...track,
            distanceTraveled: trackDistanceFromOrigin,
            point: point,
          };
        });
        setSpotifyTracks(tracksWithDistance);
      }
      if (res.status === "Ok") {
        toast.success("Generated some music!", {
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
      if (!spotifyTracks) return;

      const trackURIs = spotifyTracks.map((track) => track.uri);

      await generatePlaylist("roadtripMusic", trackURIs);
      toast.success("Playlist Done!", {
        theme: theme === "light" ? "light" : "dark",
      });
    } catch (err) {
      console.error(err);
    }
  };

  const routeLayer = new GeoJsonLayer({
    id: "route-layer",
    data: routeData?.geometry,
    filled: true,
    getLineColor: () =>
      theme === "light" ? [16, 185, 129, 255] : [8, 145, 178, 255],
    lineWidthScale: 20,
    lineWidthMinPixels: 3,
    getLineWidth: 1,
  });

  /* 
  const tracksLayer = new ScatterplotLayer({
    id: "tracksLayer",
    data: spotifyTracks,
    pickable: true,
    filled: true,
    stroked: true,
    radiusScale: 8,
    getPosition: (data: TrackWithDistance) => data.point?.geometry.coordinates,
    getRadius: () => 50,
    getFillColor: () => [255, 140, 0],
  });
  */
  if (!MAPBOX_ACCESS_TOKEN) return <h1>Error Loading</h1>;
  if (!mapRef) return <h1>Loading...</h1>;

  return (
    <main className="flex h-screen w-full flex-row">
      <section className="relative">
        <div className="flex h-full w-full min-w-96 max-w-xl flex-col items-center gap-12 overflow-y-auto py-24 lg:w-1/4">
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
                ? "bg-emerald-500 dark:bg-cyan-600"
                : "bg-zinc-600"
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
          {!!routeData && (
            <>
              <div className=" inline-flex h-fit w-full max-w-72 flex-row items-center gap-4 rounded-lg bg-zinc-200 p-5 dark:bg-zinc-700">
                <ClockIcon className="h-9 w-9 text-emerald-500 dark:text-cyan-600" />
                <div className="px-2.5">
                  <h2 className="text-sm text-zinc-700 dark:text-zinc-300">
                    Duration
                  </h2>
                  <p className="text-2xl font-semibold">
                    {convertToMinutes(routeData.duration)} minutes
                  </p>
                </div>
              </div>
              <div className="inline-flex h-fit w-full max-w-72 flex-row items-center gap-4 rounded-lg bg-zinc-200 p-5 dark:bg-zinc-700">
                <GiPathDistance className="h-9 w-9 text-emerald-500 dark:text-cyan-600" />

                <div className="px-2.5">
                  <h2 className="text-sm text-zinc-700 dark:text-zinc-300">
                    Distance
                  </h2>
                  <p className="text-2xl font-semibold">
                    {convertToMiles(routeData.distance)} miles
                  </p>
                </div>
              </div>
              <button
                className={`align-center inline-flex w-48 flex-row gap-4 rounded-lg p-3 text-emerald-50 ${
                  originData && destinationData
                    ? "bg-emerald-500 dark:bg-cyan-600"
                    : "bg-zinc-600"
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
          {spotifyTracks.length !== 0 && (
            <>
              <ul className="flex w-full max-w-72 flex-col gap-5">
                {spotifyTracks.map((track) => {
                  return (
                    <li
                      key={track.id}
                      className="relative flex flex-col rounded-lg bg-zinc-200 p-5 dark:bg-zinc-700"
                    >
                      <p className="truncate text-lg font-semibold text-emerald-500 dark:text-cyan-600">
                        {track.name}
                      </p>

                      <h2 className="text-sm text-zinc-700 dark:text-zinc-300">
                        {track.artists[0]?.name}
                      </h2>
                      <div className="flex flex-row items-center gap-1">
                        <ClockIcon className="size-4 text-xs text-zinc-700/50 dark:text-zinc-300/50" />
                        <p className="text-xs text-zinc-700/50 dark:text-zinc-300/50">
                          {Math.round((track.duration_ms / 60000) * 100) / 100}
                          min
                        </p>
                      </div>
                      {track.album.images[0]?.url ? (
                        <div className="absolute inset-y-3 -right-2">
                          <div className="relative size-20">
                            <Image
                              src={track.album.images[0].url}
                              alt={track.album.name}
                              fill
                              sizes="100vw"
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </li>
                  );
                })}
              </ul>
              <button
                className={`align-center inline-flex w-48 flex-row gap-4 rounded-lg p-3 text-emerald-50 ${
                  spotifyTracks
                    ? "bg-emerald-500 dark:bg-cyan-600"
                    : "bg-zinc-600"
                }`}
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => {
                  await handleGeneratePlaylist();
                }}
                disabled={!spotifyTracks}
                type="button"
              >
                <ArrowDownTrayIcon className="h-7 w-7" />
                <p className="text-lg">Save Playlist</p>
              </button>
            </>
          )}
        </div>
      </section>
      <section className="h-full w-full grow">
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
      </section>
    </main>
  );
}

const convertToMinutes = (durationSeconds: number) => {
  return Math.floor(durationSeconds / 60);
};

const convertToMiles = (distanceMeters: number) => {
  return Math.round((distanceMeters / 1609.344) * 100) / 100;
};
