import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAuth: ({ user, accessToken }) =>
        set({
          user,
          accessToken,
        }),

      updateUser: (user) =>
        set((state) => ({
          user: { ...state.user, ...user },
        })),

      logout: () =>
        set({
          user: null,
          accessToken: null,
        }),
    }),
    {
      name: "auth-storage",
    },
  ),
);
