interface GoogleMapsPlace {
  place_id: string | undefined;
  formatted_address: string | undefined;
  coordinates: google.maps.LatLngLiteral | undefined;
}

interface MapData {
  origin: GoogleMapsPlace;
  destination: GoogleMapsPlace;
  totalTime: { text: string; value: number };
  renderDirection: boolean;
  setLocationID: (
    location: google.maps.places.PlaceResult,
    locationType: string
  ) => void;
  setRenderDirection: (renderBoolean: boolean) => void;
  setTotalTime: (duration: google.maps.Duration) => void;
}

export type { MapData, GoogleMapsPlace };
