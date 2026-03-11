import { create } from "zustand";

const getInitialCart = () => {
  const saved = localStorage.getItem("cart");
  return saved ? JSON.parse(saved) : { items: [] };
};

export const useCartStore = create((set, get) => ({
  cart: getInitialCart(),

  addItem: (item) => {
    const cart = { ...get().cart };

    const existing = cart.items.find(i => i.dishId === item._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({
        dishId: item._id,
        name: item.name,
        price: item.basePrice,
        image: item.images?.[0]?.url,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    set({ cart });
  },

  removeItem: (dishId) => {
    const cart = {
      items: get().cart.items.filter(i => i.dishId !== dishId)
    };

    localStorage.setItem("cart", JSON.stringify(cart));
    set({ cart });
  },

  clearCart: () => {
    localStorage.removeItem("cart");
    set({ cart: { items: [] } });
  }
}));