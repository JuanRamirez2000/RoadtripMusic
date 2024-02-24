//* https://docs.mapbox.com/api/navigation/directions/

import type { LineString } from "geojson";

type DirectionsRoute = {
  duration: number;
  distance: number;
  weight_name: string;
  weight: number;
  duration_typical: number;
  weight_typical: number;
  geometry: LineString;
  legs: DirectionRouteLeg[];
  voiceLocale: string;
  waypoints: [];
};

type DirectionRouteLeg = {
  distance: number;
  duration: number;
  weight: number;
  duration_typical: number;
  weight_typical: number;
  steps: []; //!Need typings for this
  summary: string;
  admins: [];
  incidents: [];
  closures: [];
  "admins.iso_3166_1": string;
  "admins.iso_3166_1_alpha3": string;
  annotations: object; //!Need typings for this
  "annotation.congestion": string;
  "annotation.congestion_numeric": number | null;
  "annotation.distance": number;
  "annotation.duration": number;
  "annotation.maxspeed": object; //!Need typings for this
  "annotation.state_of_charge": number;
  "annotation.speed": number;
  via_waypoints: []; //!Need typings for this
  "via_waypoints.waypoint_index": number;
  "via_waypoints.distance_from_start": number;
  "via_waypoints.geometry_index": number;
  notifications: []; //!Need typings for this
};

type RetrieveDirectionsParams = {
  profile:
    | "mapbox/driving-traffic"
    | "mapbox/driving"
    | "mapbox/walking"
    | "mapbox/cycling";
  coorindates: number[];

  alternatives?: boolean;
  annotations?:
    | "distance"
    | "duration"
    | "speed"
    | "congestion"
    | "congestion_numeric"
    | "maxspeed"
    | "closure"
    | "state_of_charge";

  avoid_maneuver_radius?: number;
  bearings?: number;
  layers?: number;
  continue_straight?: boolean;
  exclude?:
    | "motorway"
    | "toll"
    | "ferry"
    | "unpaved"
    | "cash_only_tolls"
    //| "point(longitude latitude)"
    | "country_border"
    | "state_border";
  geometries?: "geojson" | "polyline" | "polyline6";
  include?: "hov2" | "hov3" | "hot";
  overview?: "full" | "simplified" | "false";
  radiuses?: number | "unlimited";
  approaches?: string;
  steps?: boolean;
  banner_instructions?: boolean;
  language?: string;
  roundabout_exists?: boolean;
  voice_instructions?: boolean;
  voice_units?: "imperial" | "metric";
  waypoints?: number;
  waypoints_per_route?: boolean;
  waypoint_names?: string;
  waypoint_targets?: number;
  notifications?: "all" | "none";
};

type RetrieveDirectionsResponse = {
  code: string;
  routes: DirectionsRoute[];
  uuid: string;
};

export type {
  DirectionsRoute,
  DirectionRouteLeg,
  RetrieveDirectionsParams,
  RetrieveDirectionsResponse,
};
