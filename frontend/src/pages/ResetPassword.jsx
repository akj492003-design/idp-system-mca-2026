import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "../services/authService";
import { getApiErrorMessage } from "../services/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!resetToken) return <Navigate to="/forgot-password" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (password.length < 10) { setError("Your new password must contain at least 10 characters."); return; }
    if (password !== confirmPassword) { setError("The passwords do not match."); return; }
    setSubmitting(true);
    try {
      await confirmPasswordReset({ resetToken, password });
      navigate("/reset-successful", { replace: true, state: { resetComplete: true } });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Could not update your password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center overflow-x-hidden bg-[#040a1c] bg-[radial-gradient(ellipse_at_top,#1e3a8a_0%,#0b1a3d_45%,#040a1c_85%)] px-4 py-10 font-sans text-slate-100">
      <section className="w-full max-w-md rounded-3xl border border-[#1e3a8a]/60 bg-[#0a1733]/90 p-6 shadow-[0_0_60px_-15px_rgba(37,99,235,0.45)] backdrop-blur-xl sm:p-8">
        <Link to="/login" className="text-sm text-sky-300 transition hover:text-sky-200">← Back to login</Link>
        <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl">Create a new password</h1>
        <p className="mt-2 text-sm text-slate-300">Choose a strong password for your IDP account. The reset link can only be used once.</p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-200">New password</label>
            <input id="new-password" type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#31518e] bg-[#0b1a3d] px-4 py-3.5 text-slate-100 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20" placeholder="At least 10 characters" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-200">Confirm new password</label>
            <input id="confirm-password" type="password" autoComplete="new-password" required minLength={10} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full rounded-xl border border-[#31518e] bg-[#0b1a3d] px-4 py-3.5 text-slate-100 placeholder-slate-400 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20" placeholder="Re-enter your password" />
          </div>
          {error && <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200" role="alert">{error}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-wait disabled:opacity-60">{submitting ? "Updating password…" : "Update password"}</button>
        </form>
      </section>
    </div>
  );
}
