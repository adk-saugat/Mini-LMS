import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  // No token - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role - redirect to their dashboard
  if (requiredRole && role !== requiredRole) {
    if (role === "instructor") {
      return <Navigate to="/instructor/dashboard" replace />;
    } else if (role === "student") {
      return <Navigate to="/student/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
