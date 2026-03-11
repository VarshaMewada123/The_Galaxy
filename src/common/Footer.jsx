import { Link, useNavigate } from "react-router-dom";
import axiosClient from "@/api/axiosClient";
import { useState, useEffect, useCallback, memo } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  X as CloseIcon,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const XIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153ZM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644Z" />
  </svg>
);

const GOLD_COLOR = "#C6A45C";

const Footer = memo(function Footer() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const [openNewsletter, setOpenNewsletter] = useState(false);
  const [formData, setFormData] = useState({ email: "", agree: false });

  const currentYear = new Date().getFullYear();

  const goTo = useCallback(
    (path) => {
      setOpenNewsletter(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      navigate(path);
    },
    [navigate],
  );

  useEffect(() => {
    if (openNewsletter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openNewsletter]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.1,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosClient.post("/newsletter/subscribe", {
        email: formData.email,
      });

      alert(res.data.message);

      setFormData({ email: "", agree: false });
      setOpenNewsletter(false);
    } catch (error) {
      alert(error.message || "Subscription failed");
    }
  };

  return (
    <>
      <footer className="relative w-full bg-[#020617] text-slate-400 pt-16 md:pt-24 pb-10 border-t border-white/5 overflow-hidden">
        <motion.div
          className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVars}
        >
          <motion.div
            variants={itemVars}
            className="flex flex-col items-center sm:items-start space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-serif text-white tracking-tight">
              Hotel <span style={{ color: GOLD_COLOR }}>The Galaxy</span>
            </h3>
            <p className="text-sm leading-relaxed opacity-70 max-w-xs text-center sm:text-left">
              Defining luxury through personalized service and exquisite
              surroundings in the heart of Chhindwara.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Instagram, href: "#", label: "Instagram" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={!prefersReducedMotion ? { y: -3 } : {}}
                  className="p-3 border border-slate-800 rounded-full hover:text-[#C6A45C] hover:border-[#C6A45C] transition-all duration-300 cursor-pointer"
                >
                  <social.Icon size={18} />
                </motion.a>
              ))}
              <motion.a
                href="#"
                aria-label="X (formerly Twitter)"
                whileHover={!prefersReducedMotion ? { y: -3 } : {}}
                className="p-3 border border-slate-800 rounded-full hover:text-[#C6A45C] hover:border-[#C6A45C] transition-all duration-300 cursor-pointer"
              >
                <XIcon />
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            variants={itemVars}
            className="flex flex-col items-center sm:items-start"
          >
            <h4 className="text-white text-[10px] uppercase tracking-[0.3em] mb-8 font-bold">
              Discover
            </h4>
            <ul className="space-y-4 text-sm text-center sm:text-left">
              {["Rooms", "Dining", "Banquet", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="hover:text-[#C6A45C] transition-colors inline-block py-1 cursor-pointer"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.address
            variants={itemVars}
            className="not-italic flex flex-col items-center sm:items-start"
          >
            <h4 className="text-white text-[10px] uppercase tracking-[0.3em] mb-8 font-bold">
              Contact Us
            </h4>
            <div className="space-y-5 text-sm">
              <div className="flex items-start gap-4 justify-center sm:justify-start group">
                <MapPin
                  size={20}
                  className="shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: GOLD_COLOR }}
                />
                <span className="leading-relaxed">
                  PG College Road, Lalbagh,
                  <br />
                  Chhindwara MP – 480001
                </span>
              </div>
              <a
                href="tel:+916262633305"
                className="flex items-center gap-4 justify-center sm:justify-start group hover:text-white transition-colors cursor-pointer"
              >
                <Phone
                  size={20}
                  className="shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: GOLD_COLOR }}
                />
                +91 62626 33305
              </a>
              <a
                href="mailto:info@hotelgalaxy.in"
                className="flex items-center gap-4 justify-center sm:justify-start group hover:text-white transition-colors cursor-pointer"
              >
                <Mail
                  size={20}
                  className="shrink-0 transition-transform group-hover:scale-110"
                  style={{ color: GOLD_COLOR }}
                />
                info@hotelgalaxy.in
              </a>
            </div>
          </motion.address>

          <motion.div
            variants={itemVars}
            className="flex flex-col items-center sm:items-start"
          >
            <h4 className="text-white text-[10px] uppercase tracking-[0.3em] mb-8 font-bold">
              Newsletter
            </h4>
            <p className="text-xs mb-6 opacity-60 text-center sm:text-left">
              Join our mailing list for exclusive offers.
            </p>
            <motion.button
              whileHover={!prefersReducedMotion ? { scale: 1.05 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.95 } : {}}
              onClick={() => setOpenNewsletter(true)}
              className="w-full sm:w-auto py-4 px-10 text-[10px] font-black tracking-[0.2em] text-slate-900 rounded-sm shadow-lg hover:brightness-110 transition-all cursor-pointer"
              style={{ backgroundColor: GOLD_COLOR }}
            >
              SUBSCRIBE
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 mt-20 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] tracking-[0.2em]">
          <p className="font-medium text-#90A1B9">
            © {currentYear} HOTEL THE GALAXY. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-8">
            <button
              onClick={() => goTo("/privacyy")}
              className="text-#90A1B9 hover:text-[#C6A45C] transition-colors uppercase cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => goTo("/terms-of-use")}
              className="text-#90A1B9 hover:text-[#C6A45C] transition-colors uppercase cursor-pointer"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {openNewsletter && (
          <motion.div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-[999] flex justify-center items-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="bg-white max-w-md w-full p-8 md:p-12 relative rounded-sm shadow-2xl"
              initial={{ scale: prefersReducedMotion ? 1 : 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: prefersReducedMotion ? 1 : 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setOpenNewsletter(false)}
                className="absolute right-6 top-6 text-slate-400 hover:text-black transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <CloseIcon size={24} />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif mb-2 text-slate-900">
                  Join the Club
                </h2>
                <p className="text-slate-500 text-sm">
                  Experience luxury in your inbox.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <div className="space-y-2">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-b-2 border-slate-100 py-3 outline-none focus:border-[#C6A45C] transition-colors text-slate-800 bg-transparent"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="agree"
                    required
                    checked={formData.agree}
                    onChange={handleChange}
                    className="mt-1 accent-[#C6A45C] cursor-pointer"
                  />
                  <span className="text-[11px] leading-relaxed text-slate-500 group-hover:text-slate-700">
                    I agree to receive marketing communications and acknowledge
                    the privacy policy.
                  </span>
                </label>

                <motion.button
                  type="submit"
                  disabled={!formData.agree}
                  whileHover={
                    formData.agree && !prefersReducedMotion
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    formData.agree && !prefersReducedMotion
                      ? { scale: 0.98 }
                      : {}
                  }
                  className="w-full py-4 text-[10px] font-black tracking-[0.2em] text-white rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  style={{
                    backgroundColor: formData.agree ? GOLD_COLOR : "#cbd5e1",
                  }}
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
});

export default Footer;
