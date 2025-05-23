"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useUserStore } from "@/components/store/userStore";

const SessionSync = () => {
  const { data: session, status } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const resetUser = useUserStore((state) => state.resetUser);

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user) {
      const { loginId, id, nickname, accessToken, profileImageUrl } =
        session.user as {
          loginId: string;
          id: string;
          nickname?: string;
          accessToken: string;
          profileImageUrl?: string;
        };

      setUser({
        loginId,
        id,
        nickname,
        accessToken,
        profileImageUrl,
      });
    } else {
      resetUser();
    }
  }, [session, setUser, resetUser, status]);
  return null;
};

const NextAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
};

export default NextAuthProvider;
