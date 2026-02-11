import axiosClient from "./axiosClient";

// 🔐 Admin Login
export const loginAdmin = async (credentials) => {
  const res = await axiosClient.post(
    "/admin/login",
    credentials
  );

  const { tokens, admin } = res.data;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: admin,
  };
};

// 💾 Save Session
export const saveAdminSession = ({
  accessToken,
  refreshToken,
  user,
}) => {
  localStorage.setItem("adminAccessToken", accessToken);
  localStorage.setItem("adminRefreshToken", refreshToken);
  localStorage.setItem("adminUser", JSON.stringify(user));
};

// 📦 Get Session
export const getAdminSession = () => {
  try {
    const token = localStorage.getItem("adminAccessToken");
    const user = localStorage.getItem("adminUser");

    if (!token || !user) return null;

    return {
      token,
      user: JSON.parse(user),
    };
  } catch {
    return null;
  }
};

// 🚪 Logout
export const logoutAdmin = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminUser");

  window.location.href = "/admin/login";
};
