import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isValidEmail, isValidPhone } from "@/utils/validators";

export default function useLogin() {
  const navigate = useNavigate();

  const [loginMethod, setLoginMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleMethodChange = (method) => {
    setLoginMethod(method);
    setFormData({ identifier: "", password: "" });
    setError("");
  };

  const handleIdentifierChange = (e) => {
    let value = e.target.value;

    if (loginMethod === "email") value = value.toLowerCase().trim();
    if (loginMethod === "phone") value = value.replace(/[^0-9]/g, "");

    setFormData((prev) => ({ ...prev, identifier: value }));
    setError("");
  };

  const handlePasswordChange = (e) => {
    setFormData((prev) => ({ ...prev, password: e.target.value }));
    setError("");
  };

  const handleLogin = async () => {
    const { identifier, password } = formData;

    if (!identifier || !password) {
      setError("All fields are required");
      return;
    }

    if (loginMethod === "email" && !isValidEmail(identifier)) {
      setError("Enter a valid email address");
      return;
    }

    if (loginMethod === "phone" && !isValidPhone(identifier)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { identifier, password },
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Server error. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loginMethod,
    showPassword,
    loading,
    error,
    formData,

    setShowPassword,

    handleMethodChange,
    handleIdentifierChange,
    handlePasswordChange,
    handleLogin,
  };
}
