// components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// components/ProtectedRoute.jsx
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (!user?.verified && user?.role !== "admin") {
    return <Navigate to="/verification-pending" replace />;
  }

  return children;
}