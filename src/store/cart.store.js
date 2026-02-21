import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],

  addItem: (item) => {
    const existing = get().items.find(i => i._id === item._id);

    if (existing) {
      set({
        items: get().items.map(i =>
          i._id === item._id
            ? { ...i, qty: i.qty + 1 }
            : i
        ),
      });
    } else {
      set({
        items: [...get().items, { ...item, qty: 1 }],
      });
    }
  },

  increaseQty: (id) =>
    set({
      items: get().items.map(i =>
        i._id === id ? { ...i, qty: i.qty + 1 } : i
      ),
    }),

  decreaseQty: (id) =>
    set({
      items: get()
        .items
        .map(i =>
          i._id === id ? { ...i, qty: i.qty - 1 } : i
        )
        .filter(i => i.qty > 0),
    }),

  clearCart: () => set({ items: [] }),
}));