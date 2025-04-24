import { create } from "zustand";

type User = {
  loginId?: string;
  nickname?: string | null;
  accessToken?: string;
  profileImageUrl?: string;
};

type State = {
  user: User | null;
  setUser: (user: User) => void;
  resetUser: () => void;
};

export const useUserStore = create<State>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
}));
