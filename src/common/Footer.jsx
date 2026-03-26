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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"; // eslint-disable-line no-unused-vars
import toast, { Toaster } from "react-hot-toast";

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
    document.body.style.overflow = openNewsletter ? "hidden" : "";
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

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Subscribing...");
    try {
      await axiosClient.post("/newsletter/subscribe", {
        email: formData.email,
      });
      toast.success("Welcome to the Galaxy Club!", { id: loadingToast });
      setFormData({ email: "", agree: false });
      setOpenNewsletter(false);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message, {
        id: loadingToast,
      });
    }
  };

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.15 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <footer className="w-full bg-[#FAF9F6] text-slate-600 pt-16 pb-10 border-t border-slate-200 overflow-hidden">
        <motion.div
          className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVars}
        >
          <motion.div
            variants={itemVars}
            className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start space-y-6"
          >
            <h3 className="text-2xl md:text-3xl font-serif text-slate-900 tracking-tight text-center lg:text-left">
              Hotel <span style={{ color: GOLD_COLOR }}>The Galaxy</span>
            </h3>
            <p className="text-sm leading-relaxed text-center lg:text-left max-w-sm mx-auto lg:mx-0">
              Defining luxury through personalized service and exquisite
              surroundings in the heart of Chhindwara.
            </p>
            <div className="flex gap-3 justify-center lg:justify-start">
              {[
                {
                  Icon: Facebook,
                  href: "https://www.facebook.com/share/G1kgjzf1gCert22Y/",
                  label: "Facebook",
                },
                {
                  Icon: Instagram,
                  href: "https://www.instagram.com/hotel_the_galaxy_?igsh=MWl0Y3Zyb295am4zYw==",
                  label: "Instagram",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 border border-slate-200 rounded-full text-slate-400 hover:text-[#C6A45C] hover:border-[#C6A45C] transition-all duration-300 cursor-pointer bg-white shadow-sm"
                >
                  <social.Icon size={18} />
                </a>
              ))}
              <a
                href="https://x.com"
                className="p-3 border border-slate-200 rounded-full text-slate-400 hover:text-[#C6A45C] hover:border-[#C6A45C] transition-all duration-300 cursor-pointer bg-white shadow-sm"
              >
                <XIcon />
              </a>
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="flex flex-col items-start">
            <h4 className="text-slate-900 text-[10px] uppercase tracking-widest mb-6 font-bold">
              Discover
            </h4>
            <ul className="space-y-3 text-sm">
              {["Rooms", "Dining", "Offers", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase()}`}
                    className="hover:text-[#C6A45C] transition-colors py-1 cursor-pointer block font-medium"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.address
            variants={itemVars}
            className="not-italic flex flex-col items-start"
          >
            <h4 className="text-slate-900 text-[10px] uppercase tracking-widest mb-6 font-bold">
              Contact Us
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin
                  size={18}
                  style={{ color: GOLD_COLOR }}
                  className="shrink-0 mt-1"
                />
                <span className="leading-tight font-medium">
                  PG College Road,
                  <br />
                  Lalbagh, Chhindwara
                </span>
              </div>

              <a
                href="tel:+916262633305"
                className="flex items-center gap-3 hover:text-[#C6A45C] transition-colors"
              >
                <Phone size={18} style={{ color: GOLD_COLOR }} />
                <span className="font-medium whitespace-nowrap">
                  +91 6262633305
                </span>
              </a>

              <a
                href="mailto:contact@thegalaxyhotel.com"
                className="flex items-center gap-3 hover:text-[#C6A45C] transition-colors"
              >
                <Mail size={18} style={{ color: GOLD_COLOR }} />
                <span className="font-medium">gmhotelthegalaxy@gmail.com</span>
              </a>
            </div>
          </motion.address>

          <motion.div
            variants={itemVars}
            className="col-span-2 lg:col-span-1 flex flex-col items-center lg:items-start border-t lg:border-none pt-8 lg:pt-0"
          >
            <h4 className="text-slate-900 text-[10px] uppercase tracking-widest mb-4 font-bold">
              Newsletter
            </h4>
            <p className="text-xs mb-6 text-center lg:text-left text-slate-500 max-w-xs">
              Join our mailing list for exclusive luxury offers.
            </p>
            <button
              onClick={() => setOpenNewsletter(true)}
              className="w-full lg:w-auto py-4 px-10 text-[10px] font-bold tracking-[0.2em] rounded-sm text-white rounded-none shadow-xl hover:brightness-90 transition-all cursor-pointer"
              style={{ backgroundColor: GOLD_COLOR }}
            >
              SUBSCRIBE
            </button>
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] tracking-[0.15em] text-slate-700 font-bold uppercase text-center">
          <p>© {currentYear} HOTEL THE GALAXY. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <button
              onClick={() => goTo("/privacy-policy")}
              className="hover:text-[#C6A45C] cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => goTo("/terms-of-use")}
              className="hover:text-[#C6A45C] cursor-pointer"
            >
              Terms & Conditions
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {openNewsletter && (
          <motion.div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-md w-full p-8 md:p-10 relative shadow-2xl border-t-4"
              style={{ borderColor: GOLD_COLOR }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setOpenNewsletter(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 cursor-pointer"
              >
                <CloseIcon size={20} />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif mb-2 text-slate-900">
                  The Galaxy Club
                </h2>
                <p className="text-slate-500 text-sm italic">
                  Sign up for member-only privileges.
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="space-y-6">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-b border-slate-200 py-3 outline-none focus:border-[#C6A45C] transition-colors text-slate-800 bg-transparent text-sm"
                />

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agree"
                    required
                    checked={formData.agree}
                    onChange={handleChange}
                    className="mt-1 accent-[#C6A45C] cursor-pointer"
                  />
                  <span className="text-[10px] leading-relaxed text-slate-500 uppercase tracking-tighter text-left">
                    I agree to the privacy policy and marketing communications.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!formData.agree}
                  className="w-full py-4 text-[10px] font-bold tracking-[0.2em] text-white disabled:bg-slate-300 transition-all cursor-pointer shadow-md"
                  style={{ backgroundColor: formData.agree ? GOLD_COLOR : "" }}
                >
                  JOIN NOW
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default Footer;
