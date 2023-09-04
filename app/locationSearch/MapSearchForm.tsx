"use client";
import { useMapStore } from "contexts/mapStore";
import { useState, type FormEvent, useRef } from "react";
import PlacesSearch from "./PlacesSearch";
import generatePlaylist from "./generatePlaylistServerAction";
import { toast } from "react-toastify";
import {
  Cog8ToothIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function MapSearchForm() {
  const mapData = useMapStore((state) => state);
  const setRenderDirection = useMapStore((state) => state.setRenderDirection);
  const [showLoadingState, setShowLoadingState] = useState<boolean>(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

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
              className="btn-secondary btn-block btn"
              onClick={() => void handlePlaylistGeneration()}
            >
              Generate Playlist
              <PlusCircleIcon className="h-6 w-6" />
            </button>
            <button
              className="btn-secondary btn-block btn"
              onClick={() => dialogRef.current?.showModal()}
            >
              Spotify Options
              <Cog8ToothIcon className="h-6 w-6" />
            </button>
            <dialog ref={dialogRef} className="modal ">
              <form method="dialog" className=" modal-box h-4/5 max-w-5xl">
                <button className="btn-ghost btn-circle btn absolute right-2 top-2">
                  <XMarkIcon className="h-10 w-10 text-error" />
                </button>
                <h3 className="text-2xl font-semibold tracking-tight lg:text-4xl">
                  Spotify Settings
                </h3>
                <div></div>
              </form>
              <form method="dialog" className="modal-backdrop">
                <button>close</button>
              </form>
            </dialog>
          </>
        ) : (
          <></>
        )}
        {showLoadingState && (
          <button className="btn-secondary btn">
            <span className="loading loading-spinner"></span>
            Generating Playlist
          </button>
        )}
      </div>
    </>
  );
}
