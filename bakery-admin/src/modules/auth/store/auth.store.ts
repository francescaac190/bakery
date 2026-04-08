import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";

const TOKEN_KEY = "auth_token";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  setSession: (token: string, user: User) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setSession: (token, user) => set({ token, user, isAuthenticated: true }),
      clearSession: () =>
        set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: TOKEN_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
