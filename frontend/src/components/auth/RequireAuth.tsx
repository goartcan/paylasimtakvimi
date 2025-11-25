import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/lib/api/auth";
import type { ReactNode } from "react";

interface RequireAuthProps {
  children: ReactNode;
}

// Protected route wrapper
// Token yoksa kullanıcıyı login sayfasına yönlendirir
const RequireAuth = ({ children }: RequireAuthProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Kullanıcıyı login'e yönlendir, geldiği yeri state olarak sakla
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;

