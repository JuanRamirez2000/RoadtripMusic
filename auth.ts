import NextAuth, { type NextAuthConfig } from "next-auth";
import Spotify from "@auth/core/providers/spotify";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  debug: false,
  providers: [Spotify],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig);
