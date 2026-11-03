import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, checkingSession } = useAuth();
  const location = useLocation();

  if (checkingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#050b1f] px-6 text-slate-200">
        <p className="text-sm text-slate-400" role="status">Checking your session…</p>
      </main>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
