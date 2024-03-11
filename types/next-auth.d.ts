import { type DefaultSession } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    user?: {
      id?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    user?: Session["user"];
  }
}
