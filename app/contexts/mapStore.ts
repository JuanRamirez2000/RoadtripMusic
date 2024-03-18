import { create } from "zustand";
import type { SearchBoxFeatureSuggestion } from "@mapbox/search-js-core";

type LocationState = {
  origin: SearchBoxFeatureSuggestion | null;
  destination: SearchBoxFeatureSuggestion | null;
};

type LocationAction = {
  updateOrigin: (origin: SearchBoxFeatureSuggestion) => void;
  updateDestination: (destination: SearchBoxFeatureSuggestion) => void;
};

const useLocationsStore = create<LocationState & LocationAction>((set) => ({
  origin: null,
  destination: null,
  updateOrigin: (origin) => set(() => ({ origin: origin })),
  updateDestination: (destination) => set(() => ({ destination: destination })),
}));

export { useLocationsStore };
