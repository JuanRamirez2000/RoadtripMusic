import axios, { type AxiosResponse } from "axios";

const BASE_URL = "https://api.spotify.com/v1";

// Function to grab spotify user data to allow users to select
// What the playlist should contain
export default async function retrieveUserData(access_token: string) {
  try {
    const api = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const {
      data: spotifyTopArtistsResponse,
    }: AxiosResponse<SpotifyApi.UsersTopArtistsResponse> = await api.get(
      "/me/top/artists"
    );

    const usersGenres = grabGenresFromArtists(spotifyTopArtistsResponse.items);

    return {
      userArtist: spotifyTopArtistsResponse.items,
      usersGenres: usersGenres,
    };
  } catch (error) {
    console.error(error);
  }
}

const grabGenresFromArtists = (
  artists: SpotifyApi.ArtistObjectFull[]
): string[] => {
  const genres: string[] = [];
  artists.map((artist) => {
    genres.push(...artist.genres);
  });
  return genres;
};
