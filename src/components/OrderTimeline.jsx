import React from "react";

export default function OrderTimeline({ status }) {
  const steps = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
  ];

  const labels = {
    pending: "Order placed",
    confirmed: "Restaurant confirmed",
    preparing: "Preparing food",
    out_for_delivery: "Out for delivery",
    delivered: "Delivered",
  };

  const currentIndex = steps.indexOf(status);

  return (
    <div className="space-y-6">
      {steps.map((step, index) => {
        const completed = index <= currentIndex;

        return (
          <div key={step} className="flex items-center gap-4">
            <div
              className={`w-4 h-4 rounded-full ${
                completed ? "bg-green-500" : "bg-gray-300"
              }`}
            />

            <p
              className={`font-medium ${
                completed ? "text-black" : "text-gray-400"
              }`}
            >
              {labels[step]}
            </p>
          </div>
        );
      })}
    </div>
  );
}
