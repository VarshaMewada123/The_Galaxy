export default function PriceBox({ price }) {
  return (
    <div className="sticky top-24 border p-8 bg-white shadow-xl">
      <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
        Starting From
      </p>
      <p className="text-4xl font-serif text-[#C6A45C] mb-6">
        ₹{price.toLocaleString()}
      </p>
      <button className="w-full py-4 bg-black text-white text-xs tracking-[0.3em] font-bold hover:bg-[#C6A45C] transition">
        BOOK NOW
      </button>
    </div>
  );
}
