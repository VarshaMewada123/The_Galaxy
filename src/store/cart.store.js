import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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
              i._id === product._id
                ? { ...i, qty: i.qty + 1 }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                _id: product._id,
                name: product.name,
                basePrice: product.basePrice,
                images: product.images || [],
                qty: 1,
              },
            ],
          });
        }
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i._id !== id),
        })),

      increaseQty: (id) =>
        set((state) => ({
          items: state.items.map((i) =>
            i._id === id ? { ...i, qty: i.qty + 1 } : i
          ),
        })),

      decreaseQty: (id) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i._id === id ? { ...i, qty: i.qty - 1 } : i
            )
            .filter((i) => i.qty > 0),
        })),

      clearCart: () => set({ items: [] }),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.basePrice * item.qty,
          0
        ),

      getTotalItems: () =>
        get().items.reduce((acc, item) => acc + item.qty, 0),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);