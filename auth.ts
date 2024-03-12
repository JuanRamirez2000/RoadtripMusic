//https://www.reddit.com/r/nextjs/comments/10o6aup/next_auth_spotify_reauthentication_access_token/

import NextAuth, { type NextAuthConfig } from "next-auth";
import Spotify from "@auth/core/providers/spotify";
import type { JWT } from "next-auth/jwt";
import { type TokenSet } from "@auth/core/types";

const AUTH_SPOTIFY_ID = process.env.AUTH_SPOTIFY_ID as string;
const AUTH_SPOTIFY_SECRET = process.env.AUTH_SPOTIFY_SECRET as string;

const scope =
  "user-read-email,user-read-private,user-top-read,user-read-currently-playing,playlist-modify-public,playlist-modify-private";
const SPOTIFY_REFRESH_TOKEN_URL = "https://accounts.spotify.com/api/token";

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const basicAuth = Buffer.from(
      `${AUTH_SPOTIFY_ID}:${AUTH_SPOTIFY_SECRET}`
    ).toString("base64");

    const refreshTokenReponse = await fetch(SPOTIFY_REFRESH_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    if (!refreshTokenReponse.ok) {
      throw new Error("Failed to refresh access token");
    }

    const data = (await refreshTokenReponse.json()) as TokenSet;

    return {
      ...token,
      accessToken: data.access_token,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      accessTokenExpires: Math.floor(Date.now() / data.expires_in! + 1000),
      refreshToken: data.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: false,
  providers: [
    Spotify({
      clientId: AUTH_SPOTIFY_ID,
      clientSecret: AUTH_SPOTIFY_SECRET,
      authorization: `https://accounts.spotify.com/authorize?scope=${scope}`,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: Math.floor(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            account.expires_at! * 1000
          ),
          user,
        };
      }
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
      const newToken = await refreshAccessToken(token);
      return newToken;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      session.user = token.user;
      return session;
    },
  },
} satisfies NextAuthConfig);
