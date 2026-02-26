const ACCESS_KEY = "adminAccessToken";
const REFRESH_KEY = "adminRefreshToken";
const USER_KEY = "adminUser";

export const saveAdminSession = ({ accessToken, refreshToken, user }) => {
  localStorage.setItem(ACCESS_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAdminSession = () => {
  try {
    const token = localStorage.getItem(ACCESS_KEY);
    const user = localStorage.getItem(USER_KEY);

    if (!token || !user) return null;

    return {
      accessToken: token,
      user: JSON.parse(user),
    };
  } catch {
    return null;
  }
};

export const clearAdminSession = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
};