import { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import DocumentBadge from "../components/success/DocumentBadge";
import SuccessIndicator from "../components/success/SuccessIndicator";

export default function ResetSuccessful() {
  const location = useLocation();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setRevealed(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  if (!location.state?.resetComplete) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#040a1c] bg-[radial-gradient(ellipse_at_top,#1e3a8a_0%,#0b1a3d_45%,#040a1c_85%)] font-sans text-slate-100 antialiased">
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:py-16">
        {/* Background effects */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl motion-safe:animate-pulse"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl motion-safe:animate-pulse [animation-delay:1.5s]"
        />

        {/* Password reset success card */}
        <section
          id="card"
          className={`relative w-full max-w-md rounded-3xl border border-[#1e3a8a]/60 bg-[#0a1733]/80 p-6 text-center shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] backdrop-blur-xl transition duration-700 ease-out sm:p-10 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <DocumentBadge />

          <SuccessIndicator />

          <h1 className="mt-8 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Password Reset Successful!
          </h1>

          <p className="mx-auto mt-3 max-w-xs text-sm text-slate-400 sm:text-base">
            Your password has been updated successfully. You can now login with
            your new password.
          </p>

          <Link
            to="/login"
            className="group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-sky-500/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/50 active:translate-y-0 active:scale-[0.98]"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />

            <svg
              className="h-5 w-5 transition duration-300 ease-in-out group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
              />
            </svg>

            Go to Login
          </Link>
        </section>
      </main>
    </div>
  );
}
