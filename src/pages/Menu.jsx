import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { useMemo } from "react";
import { useCartStore } from "@/store/cart.store";
import { useNavigate } from "react-router-dom";

const fetchMenu = async () => {
  const { data } = await axiosClient.get("/menu");
  return data.data;
};

export default function Menu() {
  const navigate = useNavigate();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: fetchMenu,
  });

  const groupedMenu = useMemo(() => {
    const grouped = {};

    items.forEach((item) => {
      const category = item.category?.name || "Others";
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(item);
    });

    return grouped;
  }, [items]);

  if (isLoading) {
    return <div className="p-10 text-center">Loading menu...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-28">
      <h1 className="text-3xl font-bold mb-10">Our Menu</h1>

      {Object.entries(groupedMenu).map(([category, list]) => (
        <div key={category} className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{category}</h2>

          <div className="space-y-6">
            {list.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      ))}

      <StickyCart navigate={navigate} />
    </div>
  );
}

/* ================= ITEM CARD ================= */

function MenuItemCard({ item }) {
  const { addItem, increaseQty, decreaseQty, items } = useCartStore();

  const cartItem = items.find(i => i._id === item._id);

  return (
    <div className="bg-white rounded-2xl shadow-sm flex gap-4 p-4 hover:shadow-md transition">

      <div className="flex-1">
        <h3 className="font-bold text-lg">{item.name}</h3>

        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
          {item.description}
        </p>

        <p className="font-extrabold mt-2 text-lg">
          ₹{item.basePrice}
        </p>
      </div>

      <div className="relative w-28 h-28 shrink-0">
        <img
          src={item.images?.[0] || "https://placehold.co/200"}
          className="w-full h-full object-cover rounded-xl"
        />

        {!cartItem ? (
          <button
            onClick={() => addItem(item)}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border px-4 py-1 rounded-lg shadow font-bold"
          >
            ADD +
          </button>
        ) : (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white border rounded-lg shadow flex items-center">
            <button
              onClick={() => decreaseQty(item._id)}
              className="px-3 py-1 font-bold"
            >
              −
            </button>
            <span className="px-2 font-bold">
              {cartItem.qty}
            </span>
            <button
              onClick={() => increaseQty(item._id)}
              className="px-3 py-1 font-bold"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= STICKY CART ================= */

function StickyCart({ navigate }) {
  const items = useCartStore((s) => s.items);

  const totalItems = items.reduce((a, b) => a + b.qty, 0);
  const totalPrice = items.reduce(
    (a, b) => a + b.qty * b.basePrice,
    0
  );

  if (!totalItems) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white px-6 py-4 flex justify-between items-center">
      <div>
        <p className="font-bold">{totalItems} ITEMS</p>
        <p className="text-sm">₹{totalPrice}</p>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="bg-white text-black px-6 py-2 rounded-lg font-bold"
      >
        View Cart →
      </button>
    </div>
  );
}