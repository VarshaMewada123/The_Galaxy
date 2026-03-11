import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, MapPin, Utensils, Hotel, Send, Loader2 } from "lucide-react";
import axiosClient from "@/api/axiosClient";
export default function Contact() {
  const prefersReducedMotion = useReducedMotion();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Hotel Booking",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "phone") {
      const digitsOnly = e.target.value.replace(/\D/g, " ");
      setForm((prev) => ({ ...prev, phone: digitsOnly }));
    }
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await axiosClient.post("/enquiries", form);
      toast.success("Enquiry sent successfully");

      setForm({
        name: "",
        email: "",
        phone: "",
        type: "Hotel Booking",
        message: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send enquiry");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const cardMotion = useMemo(
    () =>
      prefersReducedMotion
        ? {}
        : {
            whileHover: { y: -6 },
            transition: { duration: 0.25, ease: "easeOut" },
          },
    [prefersReducedMotion],
  );

  const inputStyle =
    "w-full rounded-lg border border-[#020617]/10 bg-[#F5F5F0]/60 px-4 py-3 outline-none transition focus:border-[#C6A45C] focus-visible:ring-2 focus-visible:ring-[#C6A45C]/40";

  return (
    <div className="bg-[#F5F5F0] text-[#020617] min-h-screen overflow-x-hidden">
      <section className="border-b border-[#020617]/5 pt-20 sm:pt-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 pt-10 pb-14 sm:pt-14 sm:pb-16 lg:py-20 text-center">
          <h1 className="font-bold leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Contact <span className="text-[#C6A45C]">Hotel The Galaxy</span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-[#020617]/60">
            Hotel stays, buffet dining, and banquet reservations — we're here to
            assist you.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            {...cardMotion}
            className="bg-white rounded-2xl border border-[#020617]/5 shadow-sm p-6 sm:p-8 flex flex-col"
          >
            <Hotel className="text-[#C6A45C] mb-4" size={30} />
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Hotel Bookings
            </h3>
            <p className="text-[#020617]/60 mb-4 text-sm sm:text-base">
              Rooms, stays & banquet hall reservations.
            </p>
            <p className="text-[#C6A45C] font-semibold text-lg">
              +91 62626 33305
            </p>
          </motion.div>

          <motion.div
            {...cardMotion}
            className="bg-white rounded-2xl border border-[#020617]/5 shadow-sm p-6 sm:p-8 flex flex-col"
          >
            <Utensils className="text-[#C6A45C] mb-4" size={30} />
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              Restaurant & Buffet
            </h3>
            <p className="text-[#020617]/60 mb-4 text-sm sm:text-base">
              Table reservations & buffet enquiries.
            </p>
            <p className="text-[#C6A45C] font-semibold text-lg">
              Unlimited Buffet & Fine Dining
            </p>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                <Phone className="text-[#C6A45C]" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#020617]/50">
                  Call Us
                </p>
                <p className="font-medium">+91 62626 33305</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
                <MapPin className="text-[#C6A45C]" size={20} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-[#020617]/50">
                  Location
                </p>
                <p>
                  PG College Road, Lalbagh,
                  <br />
                  Chhindwara, MP 480001
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#020617]/10 shadow-md w-full aspect-[16/10] sm:aspect-[16/9]">
              <iframe
                title="map"
                loading="lazy"
                src="https://maps.google.com/maps?q=PG%20College%20Road%20Lalbagh%20Chhindwara&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
              />
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-[#020617]/5 w-full"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Make an <span className="text-[#C6A45C]">Enquiry</span>
            </h2>

            <div className="space-y-4">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputStyle}
              >
                <option>Hotel Booking</option>
                <option>Restaurant Reservation</option>
                <option>Buffet Enquiry</option>
                <option>Banquet Hall</option>
              </select>

              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                value={form.name}
                placeholder="Full Name"
                onChange={handleChange}
                className={inputStyle}
              />
              <input
                type="email"
                name="email"
                required
                value={form.email}
                placeholder="Email"
                onChange={handleChange}
                className={inputStyle}
              />
              <input
                name="phone"
                required
                type="tel"
                placeholder="Phone Number"
                maxLength={10}
                min={0}
                minLength={10}
                pattern="[6-9]{1}[0-9]{9}"
                value={form.phone}
                onChange={handleChange}
                className={inputStyle}
              />
              <textarea
                name="message"
                rows={4}
                required
                minLength={10}
                maxLength={2000}
                value={form.message}
                placeholder="Your message..."
                onChange={handleChange}
                className={`${inputStyle} resize-none`}
              />

              <motion.button
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                type="submit"
                className="w-full bg-[#C6A45C] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A45C]/50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spin">
                      <Loader2 size={18} />
                    </span>
                  </>
                ) : (
                  <>
                    Send Enquiry <Send size={18} />
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </section>
      <style>
        {`
          .spin {
            animation : loader infinite 1s linear 
          }

          @keyframes loader{
           100% {
            transform: rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
}
