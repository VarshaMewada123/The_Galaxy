import { useState } from "react";
import axiosClient from "@/api/axiosClient";

export default function ReviewModal({ orderId, onClose }) {
  const [foodRating, setFoodRating] = useState(0);
  const [serviceRating, setServiceRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    try {
      await axiosClient.post("/reviews", {
        order: orderId,
        foodRating,
        serviceRating,
        overallRating,
        comment,
      });

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[420px]">

        <h2 className="text-xl font-bold mb-4">
          How was your experience?
        </h2>

        <Rating label="Food Quality" value={foodRating} setValue={setFoodRating}/>
        <Rating label="Service" value={serviceRating} setValue={setServiceRating}/>
        <Rating label="Overall Experience" value={overallRating} setValue={setOverallRating}/>

        <textarea
          placeholder="Write feedback..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded mt-4"
        />

        <button
          onClick={submitReview}
          className="bg-black text-white w-full py-2 mt-4 rounded"
        >
          Submit Review
        </button>

      </div>
    </div>
  );
}

function Rating({ label, value, setValue }) {
  return (
    <div className="mt-3">
      <p className="mb-1">{label}</p>

      <div className="flex gap-2 text-2xl">
        {[1,2,3,4,5].map((star)=>(
          <span
            key={star}
            onClick={()=>setValue(star)}
            className={`cursor-pointer ${star <= value ? "text-yellow-500" : "text-gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}