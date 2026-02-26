// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { Phone, ArrowRight } from "lucide-react";
// import { sendOtpApi } from "../../api/auth.api";

// export default function Login() {
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     if (e) e.preventDefault();

//     if (phone.length < 10) {
//       setError("Please enter a valid phone number");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       await sendOtpApi({ phone });

//       navigate("/verify-otp", {
//         state: { phone },
//       });
//     } catch (err) {
//       if (err.response?.data?.message?.toLowerCase().includes("full name")) {
//         navigate("/signup", { state: { phone } });
//       } else {
//         setError(
//           err.response?.data?.message || "Something went wrong. Try again.",
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4 relative overflow-hidden">
//       <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C6A45C]" />

//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, ease: "easeOut" }}
//         className="bg-white shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 w-full max-w-[450px] relative"
//       >
//         <div className="text-center mb-10">
//           <motion.span
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.3 }}
//             className="text-[#C6A45C] uppercase tracking-[0.4em] text-[10px] font-bold block mb-3"
//           >
//            Hotel The Galaxy
//           </motion.span>
//           <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">
//             Welcome Back
//           </h2>
//           <p className="text-gray-400 text-sm mt-3 font-light">
//             Enter your details to continue your journey
//           </p>
//         </div>
 
//         <form onSubmit={handleLogin} className="space-y-8">
//           <div className="relative group">
//             <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 block">
//               Phone Number
//             </label>
//             <div className="flex items-center border-b border-gray-200 group-focus-within:border-[#C6A45C] transition-colors duration-300">
//               <span className="text-gray-400 mr-2 text-sm">+91</span>
//               <input
//                 type="tel"
//                 placeholder="00000 00000"
//                 value={phone}
//                 maxLength={10}
//                 onChange={(e) => {
//                   const val = e.target.value.replace(/\D/g, "");
//                   setPhone(val);
//                   setError("");
//                 }}
//                 className="w-full py-3 outline-none text-lg tracking-widest bg-transparent"
//                 autoFocus
//               />
//               <Phone size={18} className="text-gray-300" />
//             </div>
//           </div>

//           {error && (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-red-500 text-[11px] text-center italic"
//             >
//               {error}
//             </motion.p>
//           )}

//           <button
//             disabled={loading || phone.length < 10}
//             className="w-full bg-[#C6A45C] text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase 
//                        hover:bg-[#C6A45C] transition-all duration-500 disabled:opacity-40 disabled:hover:bg-[#1a1a1a]
//                        flex items-center justify-center gap-2 group"
//           >
//             {loading ? (
//               "Requesting Code..."
//             ) : (
//               <>
//                 Continue{" "}
//                 <ArrowRight
//                   size={14}
//                   className="group-hover:translate-x-1 transition-transform"
//                 />
//               </>
//             )}
//           </button>
//         </form>

//         <div className="mt-12 text-center">
//           <p className="text-gray-400 text-[12px] tracking-wide">
//             New to Hotel The Galaxy?
//             <button
//               onClick={() => navigate("/signup", { state: { phone } })}
//               className="text-[#C6A45C] font-bold ml-2 border-b border-transparent hover:border-[#C6A45C] transition-all"
//             >
//               Create Membership
//             </button>
//           </p>
//         </div>
//         <div className="absolute bottom-0 right-0 w-12 h-12 opacity-[0.03] pointer-events-none">
//           <svg
//             viewBox="0 0 100 100"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path d="M0 100H100V0" stroke="currentColor" strokeWidth="2" />
//           </svg>
//         </div>
//       </motion.div>
//     </div>
//   );
// }


import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";
import { sendOtpApi } from "../../api/auth.api";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e?.preventDefault();

    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await sendOtpApi({ phone });

      navigate("/verify-otp", {
        state: {
          phone,
          redirect: location.state?.redirect,
          autoPlaceOrder: location.state?.autoPlaceOrder,
        },
      });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Try again.";

      if (message.toLowerCase().includes("full name")) {
        navigate("/signup", {
          state: {
            phone,
            redirect: location.state?.redirect,
            autoPlaceOrder: location.state?.autoPlaceOrder,
          },
        });
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C6A45C]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="bg-white shadow-[0_10px_50px_rgba(0,0,0,0.04)] border border-gray-100 p-8 md:p-12 w-full max-w-md relative"
      >
        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-[#C6A45C] uppercase tracking-[0.4em] text-[10px] font-bold block mb-3"
          >
            Hotel The Galaxy
          </motion.span>

          <h2 className="text-3xl md:text-4xl font-serif text-[#1a1a1a]">
            Welcome Back
          </h2>

          <p className="text-gray-400 text-sm mt-3 font-light">
            Enter your details to continue your journey
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="relative group">
            <label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1 block">
              Phone Number
            </label>

            <div className="flex items-center border-b border-gray-200 group-focus-within:border-[#C6A45C] transition-colors duration-300">
              <span className="text-gray-400 mr-2 text-sm">+91</span>

              <input
                type="tel"
                inputMode="numeric"
                placeholder="00000 00000"
                value={phone}
                maxLength={10}
                autoFocus
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhone(val);
                  setError("");
                }}
                className="w-full py-3 outline-none text-lg tracking-widest bg-transparent"
              />

              <Phone size={18} className="text-gray-300" />
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-[11px] text-center italic"
            >
              {error}
            </motion.p>
          )}

          <button
            disabled={loading || phone.length < 10}
            className="w-full bg-[#C6A45C] text-white py-5 text-[11px] font-bold tracking-[0.2em] uppercase disabled:opacity-40 flex items-center justify-center gap-2 group transition-all"
          >
            {loading ? (
              "Requesting Code..."
            ) : (
              <>
                Continue
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-gray-400 text-[12px] tracking-wide">
            New to Hotel The Galaxy?
            <button
              onClick={() =>
                navigate("/signup", {
                  state: {
                    phone,
                    redirect: location.state?.redirect,
                    autoPlaceOrder: location.state?.autoPlaceOrder,
                  },
                })
              }
              className="text-[#C6A45C] font-bold ml-2 border-b border-transparent hover:border-[#C6A45C] transition-all"
            >
              Create Membership
            </button>
          </p>
        </div>

        <div className="absolute bottom-0 right-0 w-12 h-12 opacity-[0.03] pointer-events-none">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 100H100V0" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}