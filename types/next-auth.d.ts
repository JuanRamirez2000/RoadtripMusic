import type { DefaultSession, Account as NextAuthAccount } from "next-auth";
import type { JWT as NextAuthJWT } from "next-auth/jwt";
declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
  }

  interface Account extends NextAuthAccount {
    expires_at: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: "RefreshAccessTokenError";
    user?: Session["user"];
  }
}
