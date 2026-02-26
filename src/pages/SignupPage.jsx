// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Link, useNavigate } from "react-router-dom";
// import { isValidPhone } from "../utils/validators";
// import { isValidEmail } from "../utils/validators";

// export default function Signup() {
//   const navigate = useNavigate();

//   const [signupMethod, setSignupMethod] = useState("email");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     fullName: "",
//     identifier: "",
//     password: "",
//   });

//   const fadeInUp = {
//     initial: { opacity: 0, y: 15 },
//     animate: { opacity: 1, y: 0 },
//     transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
//   };

//   const handleSignup = async () => {
//     const { fullName, identifier, password } = formData;

//     if (!fullName || !identifier || !password) {
//       setError("All fields are required");
//       return;
//     }

//     if (signupMethod === "email" && !isValidEmail(identifier)) {
//       setError("Enter a valid lowercase email");
//       return;
//     }

//     if (signupMethod === "phone" && !isValidPhone(identifier)) {
//       setError("Phone number must be exactly 10 digits");
//       return;
//     }

//     const payload = {
//       fullName,
//       identifier,
//       password,
//     };

//     try {
//       setLoading(true);
//       setError("");

//       const res = await fetch("http://localhost:5000/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Signup failed");
//         return;
//       }

//       alert("Account created successfully 🎉");
//       navigate("/login");
//     } catch (error) {
//       setError("Server error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4 relative overflow-hidden">
//       <div className="absolute top-0 left-0 w-full h-1 bg-[#C6A45C]" />

//       <motion.div
//         initial={{ opacity: 0, scale: 0.98 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white p-6 md:p-10 w-full max-w-[440px] border border-gray-100 shadow-sm"
//       >
//         <div className="text-center mb-8">
//           <motion.span
//             {...fadeInUp}
//             className="text-[#C6A45C] text-[9px] tracking-[0.3em] uppercase font-bold"
//           >
//             Become a Member
//           </motion.span>
//           <motion.h2 {...fadeInUp} className="text-3xl font-serif mt-2">
//             Join The Galaxy
//           </motion.h2>
//         </div>

//         <div className="flex mb-6 bg-gray-50 p-1">
//           {["email", "phone"].map((method) => (
//             <button
//               key={method}
//               type="button"
//               onClick={() => {
//                 setSignupMethod(method);
//                 setFormData({ ...formData, identifier: "" });
//                 setError("");
//               }}
//               className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-widest transition ${
//                 signupMethod === method
//                   ? "bg-white shadow-sm text-[#C6A45C]"
//                   : "text-gray-400"
//               }`}
//             >
//               {method}
//             </button>
//           ))}
//         </div>

//         <form
//           className="space-y-5"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleSignup();
//           }}
//         >
//           <motion.div {...fadeInUp}>
//             <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter your name"
//               value={formData.fullName}
//               onChange={(e) =>
//                 setFormData({ ...formData, fullName: e.target.value })
//               }
//               className="w-full border-b py-2 outline-none bg-transparent text-sm"
//             />
//           </motion.div>

//           <motion.div {...fadeInUp}>
//             <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
//               {signupMethod === "email" ? "Email Address" : "Phone Number"}
//             </label>
//             <input
//               type={signupMethod === "email" ? "email" : "text"}
//               inputMode={signupMethod === "phone" ? "numeric" : "text"}
//               maxLength={signupMethod === "phone" ? 10 : undefined}
//               placeholder={
//                 signupMethod === "email"
//                   ? "luxury@example.com"
//                   : "Enter 10 digit number"
//               }
//               value={formData.identifier}
//               onChange={(e) => {
//                 let value = e.target.value;

//                 if (signupMethod === "email") {
//                   value = value.toLowerCase().trim();
//                 }

//                 if (signupMethod === "phone") {
//                   value = value.replace(/[^0-9]/g, "");
//                 }

//                 setFormData({ ...formData, identifier: value });
//                 setError("");
//               }}
//               className="w-full border-b py-2 outline-none bg-transparent text-sm"
//             />
//           </motion.div>

//           <motion.div {...fadeInUp}>
//             <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={(e) =>
//                 setFormData({ ...formData, password: e.target.value })
//               }
//               className="w-full border-b py-2 outline-none bg-transparent text-sm"
//             />
//           </motion.div>

//           {error && (
//             <p className="text-red-500 text-[11px] text-center">{error}</p>
//           )}

//           <motion.button
//             type="submit"
//             disabled={loading}
//             whileTap={{ scale: 0.98 }}
//             className="w-full bg-[#1c1c1c] text-white py-4 text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-60"
//           >
//             {loading ? "Creating Account..." : "Create Account"}
//           </motion.button>
//         </form>

//         <div className="mt-8 text-center">
//           <p className="text-gray-400 text-[12px]">
//             Already have a membership?
//             <Link to="/login" className="text-[#C6A45C] font-bold ml-1">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }


import { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { isValidPhone, isValidEmail } from "../utils/validators";
import { signupApi } from "../api/auth.api";

export default function Signup() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const [signupMethod, setSignupMethod] = useState("email");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "",
    password: "",
  });

  /* ---------------- Animation ---------------- */

  const fadeInUp = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, ease: "easeOut" },
  };

  /* ---------------- Handlers ---------------- */

  const updateField = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const validateForm = () => {
    const { fullName, identifier, password } = formData;

    if (!fullName || !identifier || !password) {
      toast.error("All fields are required");
      return false;
    }

    if (signupMethod === "email" && !isValidEmail(identifier)) {
      toast.error("Enter a valid email address");
      return false;
    }

    if (signupMethod === "phone" && !isValidPhone(identifier)) {
      toast.error("Phone number must be 10 digits");
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      await signupApi(formData);

      toast.success("Account created successfully 🎉");

      navigate("/login");
    } catch (err) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4 py-10 overflow-x-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#C6A45C]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="
          w-full
          max-w-md
          bg-white
          border border-gray-100
          shadow-sm
          rounded-sm
          p-6
          sm:p-8
          md:p-10
        "
      >
        {/* HEADER */}
        <div className="text-center mb-8 space-y-2">
          <motion.span
            {...fadeInUp}
            className="text-[#C6A45C] text-[10px] tracking-[0.3em] uppercase font-semibold"
          >
            Become a Member
          </motion.span>

          <motion.h2
            {...fadeInUp}
            className="font-serif text-2xl sm:text-3xl"
          >
            Join The Galaxy
          </motion.h2>
        </div>

        {/* METHOD SWITCH */}
        <div className="flex mb-7 bg-gray-50 p-1 rounded-sm">
          {["email", "phone"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => {
                setSignupMethod(method);
                updateField("identifier", "");
              }}
              className={`
                flex-1 py-2 text-[11px] uppercase tracking-widest font-semibold
                transition-all duration-200
                ${
                  signupMethod === method
                    ? "bg-white shadow-sm text-[#C6A45C]"
                    : "text-gray-400 hover:text-gray-600"
                }
              `}
            >
              {method}
            </button>
          ))}
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSignup}
          className="space-y-6"
          noValidate
        >
          {/* NAME */}
          <motion.div {...fadeInUp}>
            <label className="label">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                updateField("fullName", e.target.value)
              }
              className="input"
              placeholder="Enter your name"
            />
          </motion.div>

          {/* EMAIL / PHONE */}
          <motion.div {...fadeInUp}>
            <label className="label">
              {signupMethod === "email"
                ? "Email Address"
                : "Phone Number"}
            </label>

            <input
              type={signupMethod === "email" ? "email" : "text"}
              inputMode={
                signupMethod === "phone" ? "numeric" : "text"
              }
              maxLength={signupMethod === "phone" ? 10 : undefined}
              value={formData.identifier}
              placeholder={
                signupMethod === "email"
                  ? "luxury@example.com"
                  : "Enter 10 digit number"
              }
              onChange={(e) => {
                let value = e.target.value;

                if (signupMethod === "email")
                  value = value.toLowerCase().trim();

                if (signupMethod === "phone")
                  value = value.replace(/[^0-9]/g, "");

                updateField("identifier", value);
              }}
              className="input"
            />
          </motion.div>

          {/* PASSWORD */}
          <motion.div {...fadeInUp}>
            <label className="label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                updateField("password", e.target.value)
              }
              placeholder="••••••••"
              className="input"
            />
          </motion.div>

          {/* SUBMIT */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="
              w-full
              bg-[#1c1c1c]
              text-white
              py-3.5
              text-[11px]
              tracking-[0.2em]
              uppercase
              font-semibold
              disabled:opacity-60
              transition
            "
          >
            {loading ? "Creating Account..." : "Create Account"}
          </motion.button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-gray-400 text-xs mt-8">
          Already have a membership?
          <Link
            to="/login"
            className="text-[#C6A45C] font-semibold ml-1"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}