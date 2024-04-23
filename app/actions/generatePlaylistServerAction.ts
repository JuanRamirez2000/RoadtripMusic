"use server";
import { auth, clerkClient, type OauthAccessToken } from "@clerk/nextjs/server";

const BASE_URL = "https://api.spotify.com/v1";
const MS_TO_S_CONVERSION = 1000;
const TRACK_AMOUNT_PER_RECOMMENDATION = 2;

const grabSongsForPlaylist = async (travelTime = 2400 * 2) => {
  try {
    //* Authenticate the user
    const { userId } = auth();

    if (!userId) {
      throw new Error("No Authenticated User");
    }

    const accessTokenResponse =
      (await clerkClient.users.getUserOauthAccessToken(
        userId,
        "oauth_spotify"
      )) as unknown as OauthAccessToken[];

    const accessToken = accessTokenResponse[0]?.token;
    if (!accessToken) {
      throw new Error("No Access Token");
    }

    const spotifyTopTracksResponse = await fetch(BASE_URL + "/me/top/tracks", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!spotifyTopTracksResponse.ok) {
      throw new Error("Couldnt grab users top tracks");
    }

    const userTopTracks: SpotifyApi.UsersTopTracksResponse =
      (await spotifyTopTracksResponse.json()) as SpotifyApi.UsersTopTracksResponse;

    //* Grabbing recommendations based on the top track URIs
    const totalTracks: SpotifyApi.TrackObjectFull[] = [];
    totalTracks.push(...userTopTracks.items);
    while (!checkIfPlaylistIsLongerThanMaxTime(totalTracks, travelTime)) {
      const newTracks = await generateTracks(userTopTracks, accessToken);
      if (newTracks) {
        totalTracks.push(
          ...(newTracks.tracks as unknown as SpotifyApi.TrackObjectFull[])
        );
      }
    }

    return { status: "Ok", songs: totalTracks };
  } catch (error) {
    console.error(error);
    return { status: "Error", songs: [] };
  }
};

const generatePlaylist = async (
  playlistName = "Roadtrip Music",
  trackURIs: string[]
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("No Authenticated User");
    }

    const accessTokenResponse =
      (await clerkClient.users.getUserOauthAccessToken(
        userId,
        "oauth_spotify"
      )) as unknown as OauthAccessToken[];

    const accessToken = accessTokenResponse[0]?.token;
    if (!accessToken) {
      throw new Error("No Access Token");
    }
    const grabUserResponse = await fetch(BASE_URL + "/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!grabUserResponse.ok) {
      throw new Error("Failed grabbing current user");
    }
    const currentUser =
      (await grabUserResponse.json()) as SpotifyApi.UserObjectPublic;

    //* Deleting a playlist by the provided name if it already exists on the user
    const duplicatePlaylist = await findDuplicatePlaylist(
      playlistName,
      accessToken
    );
    if (duplicatePlaylist) {
      await fetch(`${BASE_URL}/playlists/${duplicatePlaylist.id}/followers`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    //* Create a playlist for the user with the provided name
    const createPlaylistReponse = await fetch(
      `${BASE_URL}/users/${currentUser.id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: playlistName,
          public: "true",
          description: "Playlist made with code",
        }),
      }
    );

    if (!createPlaylistReponse.ok) {
      throw new Error("Failed to create the playlist for the user");
    }

    //* Add songs to the playlist
    const playlist =
      (await createPlaylistReponse.json()) as SpotifyApi.CreatePlaylistResponse;

    //const shuffledURIs = shuffleTracks(trackURIs);

    const populatePlaylistParams = new URLSearchParams({
      uris: trackURIs.join(),
    }).toString();

    const populatePlaylistResponse = await fetch(
      `${BASE_URL}/playlists/${playlist.id}/tracks?${populatePlaylistParams}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!populatePlaylistResponse.ok) {
      throw new Error("Failed to populate playlist");
    }
  } catch (error) {
    throw new Error("Failed generating playlist");
  }
};

//Generates tracks for a user based on the current track list
const generateTracks = async (
  spotifyTopTracksResponse: SpotifyApi.UsersTopTracksResponse,
  access_token: string
): Promise<SpotifyApi.RecommendationsObject | undefined> => {
  const trackIDs = spotifyTopTracksResponse.items.map((track) => track.id);

  for (let i = 0; i < trackIDs.length / 2; i += 2) {
    const params = new URLSearchParams({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      seed_tracks: `${trackIDs[i]!},${trackIDs[i + 1]!}`,
      limit: TRACK_AMOUNT_PER_RECOMMENDATION.toString(),
    }).toString();

    const trackRecommendationResponse = await fetch(
      `${BASE_URL}/recommendations?${params}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (trackRecommendationResponse.status === 200) {
      return (await trackRecommendationResponse.json()) as SpotifyApi.RecommendationsObject;
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

/* 
const shuffleTracks = (tracks: string[]) => {
  return tracks.sort(() => Math.random() - 0.5);
};
*/

//Finds duplicate playlist in a user's profile
const findDuplicatePlaylist = async (
  playlistName: string,
  accessToken: string
): Promise<SpotifyApi.PlaylistObjectSimplified | undefined> => {
  const userPlaylistRequest = await fetch(BASE_URL + "/me/playlists", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!userPlaylistRequest.ok) {
    throw new Error("Failed finding the users current playlists");
  }

  const userCurrentPlaylists =
    (await userPlaylistRequest.json()) as SpotifyApi.ListOfCurrentUsersPlaylistsResponse;

  const duplicatePlaylist = userCurrentPlaylists.items.find(
    (playlist) => playlist.name === playlistName
  );
  if (duplicatePlaylist) {
    return duplicatePlaylist;
  }
};

export { grabSongsForPlaylist, generatePlaylist };
