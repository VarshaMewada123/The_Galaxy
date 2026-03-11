import { Navigate, Outlet, useNavigate } from "react-router-dom";

export const ProtactedRoutes = () => {
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  if (!token) {
    return <Navigate to={"/login"} replace={true} />;
  }
  return <Outlet />;
};
