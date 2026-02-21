import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  X as CloseIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { State, City } from "country-state-city";

/* ===========================
    CUSTOM X (TWITTER) ICON
=========================== */
const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();
  const goldColor = "#C6A45C";
  const currentYear = new Date().getFullYear();
  const countryCode = "IN";

  const [cities, setCities] = useState([]);
  const [openNewsletter, setOpenNewsletter] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    state: "",
    stateCode: "",
    city: "",
    agree: false,
  });

  const states = State.getStatesOfCountry(countryCode);

  useEffect(() => {
    if (formData.stateCode) {
      setCities(City.getCitiesOfState(countryCode, formData.stateCode));
    }
  }, [formData.stateCode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "state") {
      const selected = states.find((s) => s.name === value);
      setFormData((p) => ({
        ...p,
        state: value,
        stateCode: selected?.isoCode || "",
        city: "",
      }));
    } else {
      setFormData((p) => ({
        ...p,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const goTo = (path) => {
    setOpenNewsletter(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => navigate(path), 200);
  };

  /* ===========================
      ANIMATION VARIANTS
  =========================== */
  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <footer className="bg-[#020617] text-slate-400 pt-20 pb-10 relative overflow-hidden">
        {/* TOP DIVIDER LINE */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C6A45C] to-transparent opacity-30" />

        <motion.div
          className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVars}
        >
          {/* 1. BRAND SECTION */}
          <motion.div variants={itemVars} className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-3xl font-serif text-white tracking-tight">
              Hotel <span style={{ color: goldColor }}>The Galaxy</span>
            </h3>
            <p className="text-sm leading-relaxed opacity-70 max-w-xs">
              Defining luxury through personalized service and exquisite
              surroundings in the heart of Chhindwara.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, link: "#" },
                { Icon: Instagram, link: "#" },
              ].map((item, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -5, color: goldColor, borderColor: goldColor }}
                  href={item.link}
                  className="p-3 border border-slate-800 rounded-full transition-colors duration-300"
                >
                  <item.Icon size={18} />
                </motion.a>
              ))}
              <motion.a
                whileHover={{ y: -5, color: goldColor, borderColor: goldColor }}
                href="#"
                className="p-3 border border-slate-800 rounded-full transition-colors duration-300"
              >
                <XIcon />
              </motion.a>
            </div>
          </motion.div>

          {/* 2. NAVIGATION */}
          <motion.div variants={itemVars} className="flex flex-col items-center md:items-start">
            <h4 className="text-white text-xs uppercase tracking-[0.3em] mb-8 font-bold">
              Discover
            </h4>
            <ul className="space-y-4 text-sm text-center md:text-left">
              {["Rooms", "Dining", "Banquet", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="relative transition-colors duration-300 hover:text-[#C6A45C] group"
                  >
                    {link}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C6A45C] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* 3. CONTACT */}
          <motion.div variants={itemVars} className="space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-white text-xs uppercase tracking-[0.3em] mb-2 font-bold">
              Contact Us
            </h4>
            <div className="flex flex-col items-center md:items-start gap-5 text-sm">
              <div className="flex gap-3 group cursor-default">
                <MapPin size={20} className="shrink-0 transition-transform group-hover:scale-110" style={{ color: goldColor }} />
                <p className="opacity-80 group-hover:opacity-100 transition-opacity">PG College Road, Lalbagh, Chhindwara MP – 480001</p>
              </div>
              <div className="flex gap-3 group cursor-default">
                <Phone size={20} className="shrink-0 transition-transform group-hover:scale-110" style={{ color: goldColor }} />
                <p className="opacity-80 group-hover:opacity-100 transition-opacity">+91 62626 33305</p>
              </div>
              <div className="flex gap-3 group cursor-default">
                <Mail size={20} className="shrink-0 transition-transform group-hover:scale-110" style={{ color: goldColor }} />
                <p className="opacity-80 group-hover:opacity-100 transition-opacity">info@hotelgalaxy.in</p>
              </div>
            </div>
          </motion.div>

          {/* 4. NEWSLETTER */}
          <motion.div variants={itemVars} className="flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-white text-xs uppercase tracking-[0.3em] mb-8 font-bold">
              Newsletter
            </h4>
            <p className="text-sm mb-8 opacity-70">
              Join our mailing list for exclusive events and luxury offers.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setOpenNewsletter(true)}
              className=" py-2 rounded-sm py-4 px-10 text-xs font-black tracking-widest text-slate-900 shadow-xl"
              style={{ backgroundColor: goldColor }}
            >
              SUBSCRIBE
            </motion.button>
          </motion.div>
        </motion.div>

  
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-8 text-[12px]  tracking-[0.2em]">
          <p className="opacity-80">© {currentYear} Hotel The Galaxy. All rights reserved.</p>

          <div className="flex gap-10">
            <button 
              onClick={() => goTo("/privacyy")} 
              className="hover:text-[#C6A45C] transition-colors duration-300 relative group"
            >
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C6A45C] transition-all duration-300 group-hover:w-full" />
            </button>
            <button 
              onClick={() => goTo("/terms-of-use")} 
              className="hover:text-[#C6A45C] transition-colors duration-300 relative group"
            >
              Terms of Use
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C6A45C] transition-all duration-300 group-hover:w-full" />
            </button>
          </div>
        </div>
      </footer>

      {/* ================= NEWSLETTER MODAL ================= */}
      <AnimatePresence>
        {openNewsletter && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[999] flex justify-center items-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-lg w-full p-12 relative rounded-sm shadow-2xl"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <button
                onClick={() => setOpenNewsletter(false)}
                className="absolute right-6 top-6 text-slate-400 hover:text-black transition-colors"
              >
                <CloseIcon size={24} />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-2xl font-serif text-slate-900 mb-2">Join The Galaxy Circle</h2>
                <div className="w-12 h-[2px] bg-[#C6A45C] mx-auto" />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpenNewsletter(false);
                }}
                className="space-y-8"
              >
                <div className="relative group">
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        required
                        onChange={handleChange}
                        className="w-full border-b border-slate-200 py-3 outline-none focus:border-[#C6A45C] transition-colors bg-transparent text-slate-900"
                    />
                </div>

                <div className="flex gap-4 items-start">
                  <input
                    type="checkbox"
                    id="agree"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    required
                    className="mt-1.5 w-4 h-4 accent-[#C6A45C] cursor-pointer"
                  />
                  <label htmlFor="agree" className="text-[11px] leading-relaxed text-slate-500 uppercase tracking-wider">
                    I agree to the{" "}
                    <button type="button" onClick={() => goTo("/privacyy")} className="text-[#C6A45C] font-bold hover:underline">Privacy Policy</button>
                    {" "}and{" "}
                    <button type="button" onClick={() => goTo("/terms-of-use")} className="text-[#C6A45C] font-bold hover:underline">Terms of Use</button>.
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={!formData.agree}
                  whileHover={formData.agree ? { scale: 1.02 } : {}}
                  whileTap={formData.agree ? { scale: 0.98 } : {}}
                  className={`w-full py-4 font-black tracking-widest text-white transition-all shadow-lg ${
                    !formData.agree
                      ? "bg-slate-200 cursor-not-allowed text-slate-400"
                      : "hover:shadow-xl"
                  }`}
                  style={{ backgroundColor: formData.agree ? goldColor : "" }}
                >
                  SUBMIT
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
