import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isValidEmail, isValidPhone } from "@/utils/validators";

export default function useSignup() {
  const navigate = useNavigate();

  const [signupMethod, setSignupMethod] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    identifier: "",
    password: "",
  });

  const handleMethodChange = (method) => {
    setSignupMethod(method);
    setFormData((prev) => ({ ...prev, identifier: "" }));
    setError("");
  };

  const handleNameChange = (e) => {
    setFormData((prev) => ({ ...prev, fullName: e.target.value }));
    setError("");
  };

  const handleIdentifierChange = (e) => {
    let value = e.target.value;

    if (signupMethod === "email") value = value.toLowerCase().trim();
    if (signupMethod === "phone") value = value.replace(/[^0-9]/g, "");

    setFormData((prev) => ({ ...prev, identifier: value }));
    setError("");
  };

  const handlePasswordChange = (e) => {
    setFormData((prev) => ({ ...prev, password: e.target.value }));
    setError("");
  };

  const handleSignup = async () => {
    const { fullName, identifier, password } = formData;

    if (!fullName || !identifier || !password) {
      setError("All fields are required");
      return;
    }

    if (signupMethod === "email" && !isValidEmail(identifier)) {
      setError("Enter a valid lowercase email (example@gmail.com)");
      return;
    }

    if (signupMethod === "phone" && !isValidPhone(identifier)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("http://localhost:5000/api/auth/signup", {
        fullName,
        identifier,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Server error. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    signupMethod,
    loading,
    error,
    formData,

    handleMethodChange,
    handleNameChange,
    handleIdentifierChange,
    handlePasswordChange,
    handleSignup,
  };
}
