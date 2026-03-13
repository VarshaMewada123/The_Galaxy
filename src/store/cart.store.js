import { create } from "zustand";

const getInitialCart = () => {
  const saved = localStorage.getItem("cart");

  if (saved) {
    console.log("🟡 CART LOADED FROM STORAGE:", JSON.parse(saved));
    return JSON.parse(saved);
  }

  return { items: [] };
};

export const useCartStore = create((set, get) => ({
  cart: getInitialCart(),

  addItem: (item) => {
    console.log("🟢 ADDING ITEM TO CART:", item);

    const cart = { ...get().cart };

    const existing = cart.items.find(
      (i) => i.dishId === item._id
    );

    if (existing) {
      existing.quantity += 1;
      console.log("🔁 Quantity Increased");
    } else {
      cart.items.push({
        dishId: item._id,
        name: item.name,
        price: item.basePrice,
        image: item.images?.[0]?.url,
        quantity: 1,
        combo : item.isCombo ? true : false
      });

      console.log("➕ New Item Added");
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("💾 CART SAVED:", cart);

    set({ cart });
  },

removeItem: (dishId) => {
  set((state) => {
    const existingItem = state.cart.items.find(i => i.dishId === dishId);
    
    if (existingItem.quantity > 1) {
      // Quantity kam karo
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.map(i => 
            i.dishId === dishId ? { ...i, quantity: i.quantity - 1 } : i
          )
        }
      };
    } else {
   
      return {
        cart: {
          ...state.cart,
          items: state.cart.items.filter(i => i.dishId !== dishId)
        }
      };
    }
  });
},

  clearCart: () => {
    console.log("🧹 CART CLEARED");
    localStorage.removeItem("cart");
    set({ cart: { items: [] } });
  },
}));