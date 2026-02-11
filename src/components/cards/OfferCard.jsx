import { Link } from "react-router-dom";

export default function OfferCard({ offer }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
      <div className="relative h-[260px]">
        <img
          src={offer.image}
          alt={offer.title}
          className="w-full h-full object-cover"
        />
        {offer.badge && (
          <span className="absolute top-4 left-4 bg-[#D4AF37] text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-widest">
            {offer.badge}
          </span>
        )}
      </div>

      <div className="p-8">
        <h3 className="text-2xl font-serif mb-2">{offer.title}</h3>
        <p className="text-gray-500 text-sm mb-6">{offer.description}</p>

        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-[#D4AF37] text-2xl font-serif">
              ₹{offer.discountPrice.toLocaleString()}
            </p>
            <p className="text-xs text-gray-400 line-through">
              ₹{offer.originalPrice.toLocaleString()}
            </p>
          </div>
          <span className="text-green-600 text-xs font-bold">
            {offer.savings}
          </span>
        </div>

        <Link
          to={`/offer/${offer.id}`}
          className="block w-full text-center py-4 bg-black text-white text-xs tracking-[0.3em] font-bold hover:bg-[#D4AF37] transition"
        >
          VIEW DETAILS
        </Link>
      </div>
    </div>
  );
}
