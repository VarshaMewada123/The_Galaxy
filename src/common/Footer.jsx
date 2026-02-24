import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  X as CloseIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const XIcon = ({ size = 18 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();
  const goldColor = "#C6A45C";
  const currentYear = new Date().getFullYear();

  const [openNewsletter, setOpenNewsletter] = useState(false);
  const [formData, setFormData] = useState({ email: "", agree: false });

  const goTo = useCallback(
    (path) => {
      setOpenNewsletter(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate(path);
    },
    [navigate],
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <>
      <footer className="bg-[#020617] text-slate-400 pt-16 sm:pt-24 pb-10 relative overflow-hidden border-t border-white/5">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C6A45C] to-transparent opacity-40" />

        <motion.div
          className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVars}
        >
          <motion.div
            variants={itemVars}
            className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
              Hotel <span style={{ color: goldColor }}>The Galaxy</span>
            </h3>
            <p className="text-sm leading-relaxed opacity-70 max-w-xs">
              Defining luxury through personalized service and exquisite
              surroundings in the heart of Chhindwara.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, link: "#", label: "Facebook" },
                { Icon: Instagram, link: "#", label: "Instagram" },
              ].map((item, i) => (
                <motion.a
                  key={i}
                  whileHover={{
                    y: -3,
                    color: goldColor,
                    borderColor: goldColor,
                  }}
                  href={item.link}
                  aria-label={item.label}
                  className="p-2.5 border border-slate-800 rounded-full transition-colors duration-300 flex items-center justify-center"
                >
                  <item.Icon size={18} />
                </motion.a>
              ))}
              <motion.a
                whileHover={{ y: -3, color: goldColor, borderColor: goldColor }}
                href="#"
                aria-label="X (Twitter)"
                className="p-2.5 border border-slate-800 rounded-full transition-colors duration-300 flex items-center justify-center"
              >
                <XIcon size={18} />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            variants={itemVars}
            className="flex flex-col items-center sm:items-start"
          >
            <h4 className="text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-8 font-bold">
              Discover
            </h4>
            <nav>
              <ul className="space-y-4 text-sm text-center sm:text-left">
                {["Rooms", "Dining", "Banquet", "Contact"].map((link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase()}`}
                      className="inline-block relative transition-colors duration-300 hover:text-[#C6A45C] group"
                    >
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C6A45C] transition-all duration-300 group-hover:w-full" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          <motion.div
            variants={itemVars}
            className="flex flex-col items-center sm:items-start space-y-6"
          >
            <h4 className="text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-2 font-bold">
              Contact Us
            </h4>
            <address className="not-italic flex flex-col items-center sm:items-start gap-5 text-sm text-center sm:text-left">
              <div className="flex gap-3 group cursor-pointer">
                <MapPin
                  size={20}
                  className="shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: goldColor }}
                />
                <p className="opacity-80 group-hover:opacity-100 transition-opacity">
                  PG College Road, Lalbagh, Chhindwara MP – 480001
                </p>
              </div>
              <a href="tel:+916262633305" className="flex gap-3 group">
                <Phone
                  size={20}
                  className="shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: goldColor }}
                />
                <p className="opacity-80 group-hover:opacity-100 transition-opacity">
                  +91 62626 33305
                </p>
              </a>
              <a href="mailto:info@hotelgalaxy.in" className="flex gap-3 group">
                <Mail
                  size={20}
                  className="shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: goldColor }}
                />
                <p className="opacity-80 group-hover:opacity-100 transition-opacity">
                  info@hotelgalaxy.in
                </p>
              </a>
            </address>
          </motion.div>

          <motion.div
            variants={itemVars}
            className="flex flex-col items-center sm:items-start text-center sm:text-left"
          >
            <h4 className="text-white text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-8 font-bold">
              Newsletter
            </h4>
            <p className="text-sm mb-8 opacity-70">
              Join our mailing list for exclusive events and luxury offers.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setOpenNewsletter(true)}
              className="w-full sm:w-auto py-4 px-10 text-[10px] font-black tracking-widest text-slate-900 shadow-xl transition-all rounded-sm"
              style={{ backgroundColor: goldColor }}
            >
              SUBSCRIBE
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] tracking-[0.2em] text-center">
          <p className="opacity-60">
            © {currentYear} HOTEL THE GALAXY. ALL RIGHTS RESERVED.
          </p>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            <button
              onClick={() => goTo("/privacyy")}
              className="hover:text-[#C6A45C] transition-colors relative group uppercase"
            >
              Privacy Policy
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C6A45C] transition-all duration-300 group-hover:w-full" />
            </button>
            <button
              onClick={() => goTo("/terms-of-use")}
              className="hover:text-[#C6A45C] transition-colors relative group uppercase"
            >
              Terms of Use
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#C6A45C] transition-all duration-300 group-hover:w-full" />
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {openNewsletter && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999] flex justify-center items-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="bg-white max-w-lg w-full p-8 sm:p-12 relative rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                onClick={() => setOpenNewsletter(false)}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 text-slate-400 hover:text-black transition-colors"
                aria-label="Close Modal"
              >
                <CloseIcon size={24} />
              </button>

              <div className="text-center mb-10">
                <h2 className="text-xl sm:text-2xl font-serif text-slate-900 mb-3">
                  Join The Galaxy Circle
                </h2>
                <div className="w-12 h-[2px] bg-[#C6A45C] mx-auto" />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  setOpenNewsletter(false);
                }}
                className="space-y-8"
              >
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    required
                    autoFocus
                    onChange={handleChange}
                    className="w-full border-b border-slate-200 py-3 outline-none focus:border-[#C6A45C] transition-colors bg-transparent text-slate-900 text-sm"
                  />
                </div>

                <div className="flex gap-4 items-start text-left">
                  <input
                    type="checkbox"
                    id="agree"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    required
                    className="mt-1 w-4 h-4 accent-[#C6A45C] cursor-pointer"
                  />
                  <label
                    htmlFor="agree"
                    className="text-[10px] leading-relaxed text-slate-500 uppercase tracking-wider select-none"
                  >
                    I agree to the{" "}
                    <button
                      type="button"
                      onClick={() => goTo("/privacyy")}
                      className="text-[#C6A45C] font-bold"
                    >
                      Privacy Policy
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      onClick={() => goTo("/terms-of-use")}
                      className="text-[#C6A45C] font-bold"
                    >
                      Terms of Use
                    </button>
                    .
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={!formData.agree}
                  whileHover={formData.agree ? { scale: 1.01 } : {}}
                  whileTap={formData.agree ? { scale: 0.99 } : {}}
                  className={`w-full py-4 text-[10px] font-black tracking-[0.2em] text-white transition-all shadow-md ${
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
