import {
  Marker,
  useControl,
  type ControlPosition,
  type MarkerProps,
} from "react-map-gl";
import MapboxGeocoder, {
  type GeocoderOptions,
  type Result,
} from "@mapbox/mapbox-gl-geocoder";
import { type ReactElement, useState } from "react";

type GeocoderControlProps = Omit<
  GeocoderOptions,
  "accessToken" | "mapboxgl" | "marker"
> & {
  mapboxAccessToken: string;
  defaultMarker?: boolean | Omit<MarkerProps, "longitude" | "latitude">;

  position: ControlPosition;
};

export default function GeocodeControl({
  mapboxAccessToken,
  defaultMarker = true,
}: GeocoderControlProps) {
  const [marker, setMarker] = useState<ReactElement | null>(null);

  useControl<MapboxGeocoder>(
    () => {
      const control = new MapboxGeocoder({
        marker: false,
        accessToken: mapboxAccessToken,
      });

      control.on("result", (evt) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const { result }: { result: Result } = evt;

        const location =
          result &&
          (result.center ||
            (result.geometry?.type === "Point" && result.geometry.coordinates));
        if (location && defaultMarker) {
          setMarker(
            <Marker
              longitude={location[0] as number}
              latitude={location[1] as number}
              anchor="bottom"
            />
          );
        } else {
          setMarker(null);
        }
      });

      return control;
    },
    {
      position: "top-left",
    }
  );

  return marker;
}
