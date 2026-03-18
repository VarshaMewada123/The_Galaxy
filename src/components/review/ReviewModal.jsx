import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import { X, Star } from "lucide-react";
import axiosClient from "@/api/axiosClient";

export default function ReviewModal({ order, orderId, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order?.items) {
      const initial = order.items.map((item) => ({
        menuItem: item.menuItem._id || item.menuItem,
        rating: 0,
        comment: "",
        name: item.name || "Item",
      }));
      setReviews(initial);
    }
  }, [order]);

  const updateReview = (index, field, value) => {
    setReviews((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const submitReviews = async () => {
    const hasEmptyRating = reviews.some((r) => r.rating === 0);
    if (hasEmptyRating) {
      toast.error("Please provide a rating for all items");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosClient.post("/reviews", {
        order: orderId,
        reviews,
      });
      toast.success(response.data.message || "Reviews submitted successfully!");
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit reviews");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-[#FCF9F5] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          role="dialog"
          aria-modal="true"
        >
          <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-800">Review Items</h2>
              <p className="text-sm text-stone-500">Order #{orderId?.slice(-6)}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-stone-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {reviews.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="font-semibold text-stone-700 text-lg">
                    {item.name}
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => updateReview(index, "rating", star)}
                        className="focus:outline-none transition-transform active:scale-90"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            item.rating >= star
                              ? "fill-[#C5A059] text-[#C5A059]"
                              : "text-stone-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Tell us about your experience..."
                  value={item.comment}
                  onChange={(e) => updateReview(index, "comment", e.target.value)}
                  className="w-full p-4 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] outline-none transition-all resize-none min-h-[100px] text-stone-600 bg-stone-50/50"
                />
              </div>
            ))}
          </div>

          <div className="p-6 bg-white border-t border-stone-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-50 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={submitReviews}
              disabled={isSubmitting}
              className="flex-[2] px-6 py-3.5 bg-[#C5A059] hover:bg-[#b38f4d] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-[#C5A059]/20 transition-all transform active:scale-[0.98] order-1 sm:order-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </motion.div>
        <Toaster position="bottom-center" />
      </div>
    </AnimatePresence>
  );
}