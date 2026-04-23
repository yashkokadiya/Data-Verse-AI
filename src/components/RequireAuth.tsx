import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

const AUTH_KEY = "dv_auth";

export const isAuthenticated = () => {
  try {
    return localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
};

export const setAuthenticated = (value: boolean) => {
  try {
    if (value) localStorage.setItem(AUTH_KEY, "1");
    else localStorage.removeItem(AUTH_KEY);
  } catch {
    /* ignore */
  }
};

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;
