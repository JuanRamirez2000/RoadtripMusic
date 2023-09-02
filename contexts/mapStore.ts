import { create } from "zustand";
import type { MapData } from "types/GoogleMaps";

const useMapStore = create<MapData>((set) => ({
  origin: {
    place_id: "",
    formatted_address: "",
    coordinates: { lat: 0, lng: 0 },
  },
  destination: {
    place_id: "",
    formatted_address: "",
    coordinates: { lat: 0, lng: 0 },
  },
  renderDirection: false,
  totalTime: { text: "", value: 0 },
  setTotalTime: (duration: google.maps.Duration) =>
    set(() => ({ totalTime: duration })),
  setLocationID: (
    location: google.maps.places.PlaceResult,
    locationType: string
  ) =>
    set(() => {
      return locationType === "origin"
        ? {
            origin: {
              place_id: location.place_id,
              formatted_address: location.formatted_address,
              coordinates: location.geometry?.location?.toJSON(),
            },
          }
        : {
            destination: {
              place_id: location.place_id,
              formatted_address: location.formatted_address,
              coordinates: location.geometry?.location?.toJSON(),
            },
          };
    }),
  setRenderDirection: (renderBoolean: boolean) =>
    set(() => ({ renderDirection: renderBoolean })),
}));

export { useMapStore };
