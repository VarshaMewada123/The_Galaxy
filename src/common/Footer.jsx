import { Link, useNavigate } from "react-router-dom";
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

const goldColor = "#C6A45C";

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
    document.body.style.overflow = openNewsletter ? "hidden" : "";
  }, [openNewsletter]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const containerVars = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      };

  const itemVars = prefersReducedMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: "easeOut" },
        },
      };

  return (
    <>
      <footer className="bg-[#020617] text-slate-400 pt-16 sm:pt-24 pb-10 border-t border-white/5 overflow-x-hidden">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVars}
        >
          <motion.div
            variants={itemVars}
            className="space-y-6 text-center sm:text-left"
          >
            <h3 className="text-2xl sm:text-3xl font-serif text-white">
              Hotel <span style={{ color: goldColor }}>The Galaxy</span>
            </h3>

            <p className="text-sm opacity-70 max-w-xs mx-auto sm:mx-0">
              Defining luxury through personalized service and exquisite
              surroundings in the heart of Chhindwara.
            </p>

            <div className="flex justify-center sm:justify-start gap-4">
              {[Facebook, Instagram].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={!prefersReducedMotion ? { y: -3 } : {}}
                  className="p-2.5 border border-slate-800 rounded-full hover:text-[#C6A45C] transition-colors"
                  href="#"
                >
                  <Icon size={18} />
                </motion.a>
              ))}

              <motion.a
                whileHover={!prefersReducedMotion ? { y: -3 } : {}}
                className="p-2.5 border border-slate-800 rounded-full hover:text-[#C6A45C]"
                href="#"
              >
                <XIcon />
              </motion.a>
            </div>
          </motion.div>

          <motion.div variants={itemVars}>
            <h4 className="text-white text-xs uppercase tracking-[0.3em] mb-8 font-bold text-center sm:text-left">
              Discover
            </h4>

            <ul className="space-y-4 text-sm text-center sm:text-left">
              {["Rooms", "Dining", "Banquet", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="hover:text-[#C6A45C] transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.address
            variants={itemVars}
            className="not-italic space-y-5 text-sm text-center sm:text-left"
          >
            <h4 className="text-white text-xs uppercase tracking-[0.3em] font-bold">
              Contact Us
            </h4>

            <p className="flex gap-3 justify-center sm:justify-start">
              <MapPin size={20} style={{ color: goldColor }} />
              PG College Road, Lalbagh, Chhindwara MP – 480001
            </p>

            <a
              href="tel:+916262633305"
              className="flex gap-3 justify-center sm:justify-start"
            >
              <Phone size={20} style={{ color: goldColor }} />
              +91 62626 33305
            </a>

            <a
              href="mailto:info@hotelgalaxy.in"
              className="flex gap-3 justify-center sm:justify-start"
            >
              <Mail size={20} style={{ color: goldColor }} />
              info@hotelgalaxy.in
            </a>
          </motion.address>

          <motion.div variants={itemVars} className="text-center sm:text-left">
            <h4 className="text-white text-xs uppercase tracking-[0.3em] mb-6 font-bold">
              Newsletter
            </h4>

            <motion.button
              whileHover={!prefersReducedMotion ? { scale: 1.02 } : {}}
              whileTap={!prefersReducedMotion ? { scale: 0.98 } : {}}
              onClick={() => setOpenNewsletter(true)}
              className="py-4 px-10 text-[10px] font-black tracking-widest text-slate-900 rounded-sm"
              style={{ backgroundColor: goldColor }}
            >
              SUBSCRIBE
            </motion.button>
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[11px] tracking-[0.2em] text-center">
          <p className="opacity-60">
            © {currentYear} HOTEL THE GALAXY. ALL RIGHTS RESERVED.
          </p>

          <div className="flex gap-8">
            <button
              onClick={() => goTo("/privacyy")}
              className="hover:text-[#C6A45C]"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => goTo("/terms-of-use")}
              className="hover:text-[#C6A45C]"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {openNewsletter && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[999] flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              className="bg-white max-w-lg w-full p-8 relative rounded-sm shadow-2xl"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
            >
              <button
                onClick={() => setOpenNewsletter(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-black"
                aria-label="Close"
              >
                <CloseIcon size={24} />
              </button>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setOpenNewsletter(false);
                }}
                className="space-y-6"
              >
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="w-full border-b border-slate-200 py-3 outline-none focus:border-[#C6A45C]"
                />

                <motion.button
                  type="submit"
                  disabled={!formData.agree}
                  className="w-full py-4 text-[10px] font-black tracking-[0.2em] text-white"
                  style={{
                    backgroundColor: formData.agree ? goldColor : "#e2e8f0",
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
