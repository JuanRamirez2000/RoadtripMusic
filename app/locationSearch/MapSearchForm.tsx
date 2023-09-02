"use client";
import { useMapStore } from "contexts/mapStore";
import { type FormEvent } from "react";
import PlacesSearch from "./PlacesSearch";
import generatePlaylist from "./generatePlaylistServerAction";

export default function MapSearchForm() {
  const mapData = useMapStore((state) => state);
  const setRenderDirection = useMapStore((state) => state.setRenderDirection);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mapData.origin.place_id !== "" && mapData.destination.place_id !== "") {
      setRenderDirection(true);
    }
  };

  return (
    <>
      <form
        className="flex flex-col items-center gap-6 p-4"
        onSubmit={handleFormSubmit}
      >
        <div>
          <label className="label">
            <span className="label-text text-xl">From:</span>
          </label>
          <PlacesSearch locationType={"origin"} />
        </div>

        <div>
          <label className="label">
            <span className="label-text text-xl">To:</span>
          </label>
          <PlacesSearch locationType={"destination"} />
        </div>
        {mapData.origin.place_id !== "" &&
          mapData.destination.place_id !== "" && (
            <button className="btn-primary btn" type="submit">
              Find Dections
            </button>
          )}
      </form>
      <div className="flex flex-col items-center gap-2 p-4">
        {mapData.totalTime.text !== "" ? (
          <>
            <div className="text-center">
              <p className="text-sm">Total Time</p>
              <p className="text-xl">{mapData.totalTime.text}</p>
            </div>
            <button
              className="btn-secondary btn"
              onClick={() => void generatePlaylist(mapData.totalTime.value)}
            >
              Generate Songs
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
