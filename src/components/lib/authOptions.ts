import { AxiosError } from "axios";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

interface User {
  id: string;
  loginId: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        loginId: { label: "ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { loginId, password } = credentials;

        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/auth/login`,
            {
              loginId,
              password,
            }
          );

          const user: User = res.data?.user;
          const tokens = res.data?.tokens;

          if (!user || !tokens) return null;

          return {
            id: user.id,
            loginId: user.loginId,
            nickname: user.nickname,
            profileImageUrl: user.profileImageUrl,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          };
        } catch (err) {
          if (err instanceof AxiosError) {
            console.error("Login error:", err.response?.data);
          } else {
            console.error("Unexpected error:", err);
          }
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/" },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id as string;
        token.loginId = user.loginId as string;
        token.nickname = user.nickname as string;
        token.profileImageUrl = user.profileImageUrl as string;
        token.accessToken = user.accessToken as string;
        token.refreshToken = user.refreshToken as string;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = {
        id: token.id as string,
        loginId: token.loginId as string,
        nickname: token.nickname as string,
        profileImageUrl: token.profileImageUrl as string,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
