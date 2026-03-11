import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCheckoutStore = create(
  persist(
    (set) => ({
      address: {
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        stateCode: "",
        pincode: "",
      },

      setAddressField: (key, value) =>
        set((state) => ({
          address: { ...state.address, [key]: value },
        })),

      setFullAddress: (data) =>
        set(() => ({ address: data })),

      clearAddress: () =>
        set({
          address: {
            fullName: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            stateCode: "",
            pincode: "",
          },
        }),
    }),
    {
      name: "checkout-storage",
    }
  )
);