import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ roles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-espresso-700">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-espresso-200 border-t-accent-600" />
          <p className="text-sm">Checking your session…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(user?.role)) {
    return <Navigate to="/incidents" replace />;
  }

  return <Outlet />;
}
