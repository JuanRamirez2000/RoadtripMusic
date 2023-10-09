"use client";

import { forwardRef } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import retrieveUserData from "./retrieveUserSpotifyData";

export const SpotifyOptionsModal = forwardRef<HTMLDialogElement>(
  function SpotifyOptionsModal(props, ref) {
    const { data: session } = useSession();
    const { data } = useQuery({
      queryKey: ["spotifyUserData"],
      queryFn: async () => {
        try {
          if (!session?.accessToken) {
            throw "No Access Token Provided";
          }
          const data = await retrieveUserData(session?.accessToken);
          return data;
        } catch (error) {
          console.error("Failed Retrieving User Data");
        }
      },
      enabled: !!session?.accessToken,
    });

    console.log(data);

    if (!session)
      return (
        <dialog ref={ref} className="modal">
          <h1>Loading...</h1>
        </dialog>
      );
    if (!data)
      return (
        <dialog ref={ref} className="modal">
          <h1>Loading User Data...</h1>
        </dialog>
      );
    return (
      <dialog ref={ref} className="modal">
        <form method="dialog" className="modal-box h-4/5 max-w-5xl">
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
    );
  }
);
