import axios from "axios";

// 🔐 Base URL from environment
const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

// 🚀 Create Axios Instance
const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 Request Interceptor (Attach Token)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🛑 Response Interceptor (Global Error Handling)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Unauthorized → clear session
    if (status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // Redirect only if not already on login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Production-safe error object
    const formattedError = {
      status,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };

    if (import.meta.env.DEV) {
      console.error("API Error:", formattedError);
    }

    return Promise.reject(formattedError);
  }
);

export default axiosClient;
