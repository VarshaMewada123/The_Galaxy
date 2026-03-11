import { useEffect, useState } from "react";
import axiosClient from "@/api/axiosClient";
import { Package } from "lucide-react";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get("/orders");
      setOrders(res.data.data);
    } catch (err) {
      console.error("Orders fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading orders...</p>;
  }

  if (!orders.length) {
    return (
      <div className="text-center">
        <Package size={40} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">No Orders Yet</h2>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {orders.map((order) => (
        <div
          key={order._id}
          className="border rounded-xl p-6 hover:shadow-md transition"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="font-bold text-gray-800">
                {order.orderNumber}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-semibold">
              {order.status || "Placed"}
            </span>
          </div>

          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>

                <span className="font-medium">
                  ₹{item.total}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between font-semibold text-[#C6A45C]">
            <span>Total</span>
            <span>₹{order.pricing.total}</span>
          </div>
        </div>
      ))}
    </div>
  );
}