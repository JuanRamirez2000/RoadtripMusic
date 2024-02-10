/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
//import { authOptions } from "app/api/auth/[...nextauth]/route";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

const BASE_URL = "https://api.spotify.com/v1";
const MS_TO_S_CONVERSION = 1000;
const TRACK_AMOUNT_PER_RECOMMENDATION = 10;

export default async function generatePlaylist(
  travelTime: number,
  playlistName = "roadtripMusic"
) {
  try {
    //* Authenticate the user
    const session = await getSession();
    const access_token = session?.accessToken;

    if (!access_token) {
      throw "No access token found";
    }
    const api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    //If authenticated, generate a playlist
    //API Call to grab top tracks
    const {
      data: spotifyTopTracksResponse,
    }: AxiosResponse<SpotifyApi.UsersTopTracksResponse> = await api.get(
      "/me/top/tracks"
    );

    //* Grabbing recommendations based on the top track URIs
    //Checks if the travelTime meets the playlist time
    const totalTracks: SpotifyApi.TrackObjectFull[] = [];
    totalTracks.push(...spotifyTopTracksResponse.items);
    while (!checkIfPlaylistIsLongerThanMaxTime(totalTracks, travelTime)) {
      const newTracks = await generateTracks(spotifyTopTracksResponse, api);
      if (newTracks) {
        totalTracks.push(
          ...(newTracks as unknown as SpotifyApi.TrackObjectFull[])
        );
      }
    }

    //* Deleting a playlist by the provided name if it already exists on the user
    const duplicatePlaylist = await findDuplicatePlaylist(api, playlistName);
    if (duplicatePlaylist) {
      await api.delete(`/playlists/${duplicatePlaylist.id}/followers`);
    }

    //* Create a playlist for the user with the provided name
    const {
      data: playlist,
      status: playlistCreationStatus,
    }: AxiosResponse<SpotifyApi.CreatePlaylistResponse> = await api.post(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `/users/${session.user?.id}/playlists`,
      {
        name: playlistName,
      }
    );

    //* Add songs to the playlist
    if (playlistCreationStatus !== 201) {
      throw "Failed to create playlist";
    }
    const trackURIs = totalTracks.map((track) => track.uri);
    const shuffledURIs = shuffleTracks(trackURIs);
    await api.post(`/playlists/${playlist.id}/tracks`, {
      uris: shuffledURIs,
    });

    return { status: "OK" };
  } catch (error) {
    console.error(error);
    return { status: "Error" };
  }
}

//Finds duplicate playlist in a user's profile
const findDuplicatePlaylist = async (
  api: AxiosInstance,
  playlistName: string
): Promise<SpotifyApi.PlaylistObjectSimplified | undefined> => {
  const {
    data: userPlaylists,
  }: AxiosResponse<SpotifyApi.ListOfCurrentUsersPlaylistsResponse> =
    await api.get("/me/playlists");
  if (userPlaylists) {
    const duplicatePlaylist = userPlaylists.items.find(
      (playlist) => playlist.name === playlistName
    );
    if (duplicatePlaylist) {
      return duplicatePlaylist;
    }
  }
};

//Generates tracks for a user based on the current track list
const generateTracks = async (
  spotifyTopTracksResponse: SpotifyApi.UsersTopTracksResponse,
  api: AxiosInstance
): Promise<SpotifyApi.RecommendationTrackObject[] | undefined> => {
  const trackIDs = spotifyTopTracksResponse.items.map((track) => track.id);

  for (let i = 0; i < trackIDs.length / 2; i += 2) {
    const {
      data: recommendedTrack,
      status,
    }: AxiosResponse<SpotifyApi.RecommendationsObject> = await api.get(
      "/recommendations",
      {
        params: {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          seed_tracks: `${trackIDs[i]!},${trackIDs[i + 1]!}`,
          limit: TRACK_AMOUNT_PER_RECOMMENDATION,
        },
      }
    );
    if (status === 200) {
      return recommendedTrack.tracks;
    }
  }
};

//False unless the travelTime is smaller
const checkIfPlaylistIsLongerThanMaxTime = (
  tracks: SpotifyApi.TrackObjectFull[],
  travelTime: number
): boolean => {
  const currentTime = tracks.reduce((acc, track) => {
    return acc + track.duration_ms / MS_TO_S_CONVERSION;
  }, 0);
  if (currentTime > travelTime) {
    return true;
  }
  return false;
};

const shuffleTracks = (tracks: string[]) => {
  return tracks.sort(() => Math.random() - 0.5);
};
