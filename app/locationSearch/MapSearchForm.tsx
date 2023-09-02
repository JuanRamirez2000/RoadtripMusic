"use client";
import { useMapStore } from "contexts/mapStore";
import { useState, type FormEvent } from "react";
import PlacesSearch from "./PlacesSearch";
import generatePlaylist from "./generatePlaylistServerAction";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

export default function MapSearchForm() {
  const mapData = useMapStore((state) => state);
  const setRenderDirection = useMapStore((state) => state.setRenderDirection);
  const [showLoadingState, setShowLoadingState] = useState<boolean>(false);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mapData.origin.place_id !== "" && mapData.destination.place_id !== "") {
      setRenderDirection(true);
    }
  };

  const handlePlaylistGeneration = async () => {
    setShowLoadingState(true);
    const { status } = await generatePlaylist(mapData.totalTime.value);
    setShowLoadingState(false);
    if (status === "OK") {
      toast.success("Playlist Generated!");
    }
    if (status === "Error") {
      toast.error("Playlist failed!");
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
        {mapData.totalTime.text !== "" && !showLoadingState ? (
          <>
            <div className="text-center">
              <p className="text-sm">Total Time</p>
              <p className="text-xl">{mapData.totalTime.text}</p>
            </div>
            <button
              className="btn-secondary btn"
              onClick={() => void handlePlaylistGeneration()}
            >
              Generate Songs
            </button>
          </>
        ) : (
          <></>
        )}
        {showLoadingState && (
          <button className="btn-secondary btn">
            <ArrowPathIcon className="h-6 w-6 animate-spin-slow" />
            <p>GeneratingSongs</p>
          </button>
        )}
      </div>
    </>
  );
}
