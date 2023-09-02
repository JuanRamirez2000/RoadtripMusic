"use client";
import { useEffect, useRef, useState } from "react";
import { useMapStore } from "contexts/mapStore";

export default function PlacesSearch({
  locationType,
}: {
  locationType: string;
}) {
  const [autoCompleteWidget, setAutoCompleteWidget] = useState<
    google.maps.places.Autocomplete | undefined
  >(undefined);
  const autoCompleteRef = useRef<HTMLInputElement>(null);
  const setLocationID = useMapStore((state) => state.setLocationID);
  const setRenderDirection = useMapStore((state) => state.setRenderDirection);

  autoCompleteWidget?.addListener("place_changed", () => {
    const place = autoCompleteWidget.getPlace();
    if (place.place_id) {
      setRenderDirection(false);
      setLocationID(place, locationType);
    }
  });

  useEffect(() => {
    if (autoCompleteRef.current && !autoCompleteWidget) {
      setAutoCompleteWidget(
        new google.maps.places.Autocomplete(autoCompleteRef.current, {
          fields: ["formatted_address", "place_id", "geometry"],
        })
      );
    }
  }, [autoCompleteRef, autoCompleteWidget]);

  return (
    <input
      className="input-bordered input-ghost input-primary input max-w-xs"
      type="text"
      ref={autoCompleteRef}
    />
  );
}
