import axiosClient from "../../api/axiosClient";

 
export const adminLogin = async (credentials) => {
  const res = await axiosClient.post(
    "/v1/admin/login",
    credentials
  );

  const { tokens, admin } = res.data;

  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: admin,
  };
};

 
export const saveAdminSession = ({
  accessToken,
  refreshToken,
  user,
}) => {
  localStorage.setItem("adminAccessToken", accessToken);
  localStorage.setItem("adminRefreshToken", refreshToken);
  localStorage.setItem("adminUser", JSON.stringify(user));
};

 
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

 
export const logoutAdmin = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminUser");

  window.location.href = "/admin/login";
};
