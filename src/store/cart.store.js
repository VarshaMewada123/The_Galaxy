import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        const existing = items.find((i) => i._id === product._id);

        if (existing) {
          set({
            items: items.map((i) =>
              i._id === product._id ? { ...i, qty: i.qty + 1 } : i,
            ),
          });
        } else {
          set({
            items: [...items, { ...product, qty: 1 }],
          });
        }
      },

      removeItem: (id) =>
        set({
          items: get().items.filter((i) => i._id !== id),
        }),

      increaseQty: (id) =>
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, qty: i.qty + 1 } : i,
          ),
        }),

      decreaseQty: (id) =>
        set({
          items: get()
            .items.map((i) => (i._id === id ? { ...i, qty: i.qty - 1 } : i))
            .filter((i) => i.qty > 0),
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    },
  ),
);
