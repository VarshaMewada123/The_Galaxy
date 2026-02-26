import axiosClient from "./axiosClient";
import {
  saveAdminSession,
  clearAdminSession,
} from "../services/adminSession.service";

export const loginAdmin = async (credentials) => {
  const { data } = await axiosClient.post("/admin/login", credentials);

  const session = {
    accessToken: data.tokens.accessToken,
    refreshToken: data.tokens.refreshToken,
    user: data.admin,
  };

  saveAdminSession(session);

  return session;
};

export const logoutAdmin = () => {
  clearAdminSession();
};

export const signupApi = async (payload) => {
  const { data } = await axiosClient.post("/auth/signup", payload);
  return data;
};

export const sendOtpApi = async (payload) => {
  const { data } = await axiosClient.post("/auth/send-otp", payload);
  return data;
};

export const loginApi = async (payload) => {
  const { data } = await axiosClient.post("/auth/login", payload);
  return data;
};

export const verifyOtpApi = async (payload) => {
  const response = await axiosClient.post("/auth/verify-otp", payload);

  const body = response.data;

  const user =
    body?.user ||
    body?.data?.user ||
    body?.data?.data?.user;

  const token =
    body?.token ||
    body?.accessToken ||
    body?.data?.token ||
    body?.data?.accessToken;

  if (!user || !token) {
    console.error("VERIFY OTP RESPONSE:", body);
    throw new Error("Invalid authentication response");
  }

  return { user, token };
};
