// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    loginId?: string;
    accessToken?: string;
    nickname?: string;
    profileImageUrl?: string;
    refreshToken?: string;
  }

  interface Session {
    user: User;
  }
}
