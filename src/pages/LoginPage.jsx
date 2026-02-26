// import { useState } from "react";
// import { motion } from "framer-motion";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { Eye, EyeOff } from "lucide-react";
// import axios from "axios";
// import { isValidEmail, isValidPhone } from "../utils/validators";
// import { useAuthStore } from "@/store/auth.store";
// import { useCartStore } from "@/store/cart.store";

// export default function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const redirectPath = location.state?.redirect || "/";
//   const setAuth = useAuthStore((s) => s.setAuth);
//   const clearCart = useCartStore((s) => s.clearCart);

//   const [loginMethod, setLoginMethod] = useState("email");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [formData, setFormData] = useState({
//     identifier: "",
//     password: "",
//   });

//   const handleMethodChange = (method) => {
//     setLoginMethod(method);
//     setFormData({ identifier: "", password: "" });
//     setError("");
//   };

//   const handleChange = (e) => {
//     let value = e.target.value;

//     if (loginMethod === "email") value = value.toLowerCase().trim();
//     if (loginMethod === "phone") value = value.replace(/[^0-9]/g, "");

//     setFormData((prev) => ({ ...prev, identifier: value }));
//     setError("");
//   };

//   const handlePasswordChange = (e) => {
//     setFormData((prev) => ({ ...prev, password: e.target.value }));
//     setError("");
//   };
//   const autoPlaceOrderAfterLogin = async (cartData) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.post(
//         "http://localhost:5000/api/orders",
//         cartData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       clearCart();

//       navigate("/order-success", {
//         state: {
//           order: res.data.data,
//           autoPlaced: true,
//           message: "Order placed successfully after login!",
//         },
//         replace: true,
//       });
//     } catch (err) {
//       console.error("Auto order failed:", err);
//       navigate("/checkout", {
//         state: {
//           error: "Order placement failed. Please try again from checkout.",
//         },
//       });
//     }
//   };

//   const handleLogin = async () => {
//     const { identifier, password } = formData;

//     if (!identifier || !password) {
//       setError("All fields are required");
//       return;
//     }

//     if (loginMethod === "email" && !isValidEmail(identifier)) {
//       setError("Enter a valid email address");
//       return;
//     }

//     if (loginMethod === "phone" && !isValidPhone(identifier)) {
//       setError("Phone number must be exactly 10 digits");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");

//       const { data } = await axios.post(
//         "http://localhost:5000/api/auth/login",
//         { identifier, password },
//       );

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));
//       setAuth(data.user, data.token);

//       const { autoPlaceOrder, cartData, redirect } = location.state || {};

//       if (autoPlaceOrder && cartData) {
//         await autoPlaceOrderAfterLogin(cartData);
//       } else {
//         navigate(redirect || "/", {
//           replace: true,
//           state: location.state,
//         });
//       }
//     } catch (err) {
//       setError(
//         err?.response?.data?.message || "Server error. Please try again.",
//       );
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
//         className="bg-white shadow-sm border border-gray-100 p-6 md:p-10 w-full max-w-[440px]"
//       >
//         <div className="text-center mb-8">
//           <motion.span className="text-[#C6A45C] uppercase tracking-[0.3em] text-[9px] font-bold">
//             The Rivora Experience
//           </motion.span>
//           <motion.h2 className="text-3xl font-serif mt-2">
//             Welcome Back
//           </motion.h2>
//         </div>

//         <div className="flex mb-6 bg-gray-50 p-1">
//           {["email", "phone"].map((method) => (
//             <button
//               key={method}
//               type="button"
//               onClick={() => handleMethodChange(method)}
//               className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase ${
//                 loginMethod === method
//                   ? "bg-white shadow-sm text-[#C6A45C]"
//                   : "text-gray-400"
//               }`}
//             >
//               {method === "email" ? "Email" : "Phone"}
//             </button>
//           ))}
//         </div>

//         <form
//           className="space-y-5"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handleLogin();
//           }}
//         >
//           <input
//             placeholder={
//               loginMethod === "email"
//                 ? "luxury@example.com"
//                 : "Enter 10 digit number"
//             }
//             value={formData.identifier}
//             onChange={handleChange}
//             className="w-full border-b py-2 outline-none focus:border-[#C6A45C] focus:border-b-2"
//           />

//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={handlePasswordChange}
//               className="w-full border-b py-2 pr-10 outline-none focus:border-[#C6A45C] focus:border-b-2"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((p) => !p)}
//               className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
//             >
//               {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//             </button>
//           </div>

//           {error && (
//             <p className="text-red-500 text-[11px] text-center bg-red-50 p-2 rounded">
//               {error}
//             </p>
//           )}

//           <button
//             disabled={loading}
//             className="w-full bg-[#1a1a1a] text-white py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed transition-all"
//           >
//             {loading ? "Signing In..." : "Sign In Securely"}
//           </button>
//         </form>

//         <div className="mt-8 text-center">
//           <p className="text-gray-400 text-[12px]">
//             Don't have an account?{" "}
//             <Link
//               to="/signup"
//               className="text-[#C6A45C] font-bold ml-1 hover:underline"
//             >
//               Create membership
//             </Link>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   );
// }


import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { loginApi } from "@/api/auth.api";
import { placeOrderAfterLogin } from "@/services/order.service";
import { isValidEmail, isValidPhone } from "../utils/validators";

import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const setAuth = useAuthStore((s) => s.setAuth);
  const clearCart = useCartStore((s) => s.clearCart);

  const [loginMethod, setLoginMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleMethodChange = useCallback((method) => {
    setLoginMethod(method);
    setFormData({ identifier: "", password: "" });
    setError("");
  }, []);

  const handleChange = useCallback(
    (e) => {
      let value = e.target.value;

      if (loginMethod === "email") value = value.toLowerCase().trim();
      if (loginMethod === "phone") value = value.replace(/[^0-9]/g, "");

      setFormData((p) => ({ ...p, identifier: value }));
      setError("");
    },
    [loginMethod]
  );

  const handlePasswordChange = useCallback((e) => {
    setFormData((p) => ({ ...p, password: e.target.value }));
    setError("");
  }, []);

  const handleLogin = async () => {
    const { identifier, password } = formData;

    if (!identifier || !password)
      return setError("All fields are required");

    if (loginMethod === "email" && !isValidEmail(identifier))
      return setError("Enter a valid email address");

    if (loginMethod === "phone" && !isValidPhone(identifier))
      return setError("Phone number must be exactly 10 digits");

    try {
      setLoading(true);
      setError("");

      const data = await loginApi({ identifier, password });

      setAuth(data.user, data.token);

      const { autoPlaceOrder, cartData, redirect } =
        location.state || {};

      if (autoPlaceOrder && cartData) {
        const order = await placeOrderAfterLogin(cartData);

        clearCart();

        navigate("/order-success", {
          replace: true,
          state: {
            order: order.data,
            autoPlaced: true,
          },
        });
        return;
      }

      navigate(redirect || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FAF9F6] px-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#C6A45C]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-sm border border-gray-100 p-6 md:p-10 w-full max-w-[440px]"
      >
        <div className="text-center mb-8">
          <motion.span className="text-[#C6A45C] uppercase tracking-[0.3em] text-[9px] font-bold">
            The Rivora Experience
          </motion.span>
          <motion.h2 className="text-3xl font-serif mt-2">
            Welcome Back
          </motion.h2>
        </div>

        <div className="flex mb-6 bg-gray-50 p-1">
          {["email", "phone"].map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => handleMethodChange(method)}
              className={`flex-1 py-2 text-[10px] font-bold tracking-widest uppercase ${
                loginMethod === method
                  ? "bg-white shadow-sm text-[#C6A45C]"
                  : "text-gray-400"
              }`}
            >
              {method === "email" ? "Email" : "Phone"}
            </button>
          ))}
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <input
            placeholder={
              loginMethod === "email"
                ? "luxury@example.com"
                : "Enter 10 digit number"
            }
            value={formData.identifier}
            onChange={handleChange}
            className="w-full border-b py-2 outline-none focus:border-[#C6A45C] focus:border-b-2"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handlePasswordChange}
              className="w-full border-b py-2 pr-10 outline-none focus:border-[#C6A45C] focus:border-b-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-[11px] text-center bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="w-full bg-[#1a1a1a] text-white py-4 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Signing In..." : "Sign In Securely"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-[12px]">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[#C6A45C] font-bold ml-1 hover:underline"
            >
              Create membership
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}