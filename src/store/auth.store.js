import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken"),

  setAuth: ({ user, accessToken }) => {
    localStorage.setItem("accessToken", accessToken);
    set({ user, accessToken });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null });
  },
}));
