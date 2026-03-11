import axiosClient from "@/api/axiosClient";

export const placeOrder = async (payload) => {
  const res = await axiosClient.post("/orders", payload);
  return res.data;
};

export const placeOrderAfterLogin = async (cartData) => {
  const { data } = await axiosClient.post("/orders", cartData);
  return data;
};
