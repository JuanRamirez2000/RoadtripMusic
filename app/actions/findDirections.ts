"use server";

import type { SearchBoxFeatureSuggestion } from "@mapbox/search-js-core";
import type { RetrieveDirectionsResponse } from "types/mapboxDirections";

const MAPBOX_DIRECTIONS_URL_BASE = "https://api.mapbox.com/directions/v5/";
const MAPBOX_ACCESS_TOKEN = process.env
  .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

type WaypointData = {
  origin: SearchBoxFeatureSuggestion;
  destination: SearchBoxFeatureSuggestion;
  profile?:
    | "mapbox/driving-traffic"
    | "mapbox/driving"
    | "mapbox/walking"
    | "mapbox/cycling";
};

const findDirectionsBase = async ({
  origin,
  destination,
  profile = "mapbox/driving",
}: WaypointData) => {
  try {
    if (!origin || !destination) {
      throw new Error("One or more waypoint nodes not found");
    }

    const coordinates = `${origin.geometry.coordinates.toString()};${destination.geometry.coordinates.toString()}`;

    const params = new URLSearchParams({
      access_token: MAPBOX_ACCESS_TOKEN,
      geometries: "geojson",
    }).toString();

    const directionsRes = await fetch(
      MAPBOX_DIRECTIONS_URL_BASE + `${profile}/${coordinates}?${params}`
    );
    if (!directionsRes.ok) {
      throw new Error("Directions Failed");
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (await directionsRes.json()) as RetrieveDirectionsResponse;
  } catch (err) {
    console.error(err);
  }
};

export { findDirectionsBase };
