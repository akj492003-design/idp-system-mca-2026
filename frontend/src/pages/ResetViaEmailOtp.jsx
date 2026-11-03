import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordResetLink } from "../services/authService";
import { getApiErrorMessage } from "../services/api";

function validateEmail(value) {
  const clean = value.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean) ? "" : "Enter a valid email address.";
}

export default function ResetViaEmailOtp() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    const validation = validateEmail(email);
    if (validation) { setError(validation); return; }
    setSending(true);
    try {
      const response = await requestPasswordResetLink({ email: email.trim().toLowerCase() });
      setMessage(response?.message || "If an account matches that address, a password reset link has been sent.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "The reset email could not be sent. Please try again."));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#040a1c] bg-[radial-gradient(ellipse_at_top,#1e3a8a_0%,#0b1a3d_45%,#040a1c_85%)] font-sans text-slate-100 antialiased">
      <main className="relative flex min-h-dvh items-center justify-center overflow-visible px-4 py-8 sm:px-6 sm:py-10 lg:py-16">
        <section className="w-full max-w-md rounded-3xl border border-[#1e3a8a]/60 bg-[#0a1733]/90 p-6 shadow-[0_0_60px_-15px_rgba(37,99,235,0.45)] backdrop-blur-xl sm:p-8 motion-safe:animate-[fade-in-up_.45s_ease-out_both]">
          <Link to="/forgot-password" className="inline-flex rounded-md text-sm text-sky-300 transition hover:text-sky-200 focus-visible:outline-2 focus-visible:outline-sky-400">← Back</Link>
          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Reset via Email</h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">Enter the email address associated with your IDP account. We will send a single-use password reset link.</p>
          </div>
          <form noValidate onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="reset-email" className="mb-2 block text-sm font-medium text-slate-200">Email Address</label>
              <input id="reset-email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setError(""); setMessage(""); }} autoComplete="email" placeholder="name@example.com" aria-invalid={Boolean(error)} required className="w-full rounded-xl border border-[#31518e] bg-[#0b1a3d] px-4 py-3.5 text-slate-100 placeholder-slate-400 transition hover:border-sky-400/60 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 aria-invalid:border-rose-500" />
              {error && <p className="mt-2 text-sm text-rose-300" role="alert">{error}</p>}
            </div>
            {message && <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm leading-relaxed text-emerald-200" role="status">{message}</p>}
            <button type="submit" disabled={sending} className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 disabled:cursor-wait disabled:opacity-70 motion-reduce:transform-none">
              {sending ? "Sending reset link…" : "Send password reset link"}
            </button>
          </form>
          <p className="mt-5 text-center text-xs leading-relaxed text-slate-400">For account privacy, the response is the same whether or not the email address is registered.</p>
        </section>
      </main>
    </div>
  );
}
