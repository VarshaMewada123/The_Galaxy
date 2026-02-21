import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  throw new Error("VITE_API_URL is not defined in environment variables");
}

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    return Promise.reject({
      status,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    });
  },
);

export default axiosClient;
