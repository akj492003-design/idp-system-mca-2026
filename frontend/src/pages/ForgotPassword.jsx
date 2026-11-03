
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResetMethodOption from "../components/ResetMethodOption";

export default function ForgotPassword() {
  const [method, setMethod] = useState("email");
  const [revealed, setRevealed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setRevealed(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const handleContinue = () => {
    if (method === "email") {
      navigate("/reset-email");
    } else if (method === "phone") {
      navigate("/reset-phone");
    }
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#040a1c] bg-[radial-gradient(ellipse_at_top,#1e3a8a_0%,#0b1a3d_45%,#040a1c_85%)] font-sans text-slate-100 antialiased">
      <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl motion-safe:animate-pulse"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl motion-safe:animate-pulse [animation-delay:1.5s]"
        />

        <section
          id="card"
          className={`relative w-full max-w-md rounded-3xl border border-[#1e3a8a]/60 bg-[#0a1733]/80 p-6 shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] backdrop-blur-xl transition duration-700 ease-out sm:p-8 motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
            revealed
              ? "translate-y-0 opacity-100"
              : "translate-y-6 opacity-0"
          }`}
        >
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="group inline-flex items-center gap-2 rounded-md text-sm text-sky-300 transition duration-300 ease-in-out hover:text-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <svg
              className="h-4 w-4 transition duration-300 ease-in-out group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back to Login
          </button>

          <div className="mt-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Forgot Password?
              </h1>

              <p className="mt-2 text-sm text-slate-400 sm:text-base">
                No worries! Choose a method to reset your password.
              </p>
            </div>

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-sky-300 shadow-[0_0_30px_-6px_rgba(56,189,248,0.7)] motion-safe:animate-[bounce_4s_ease-in-out_infinite] sm:h-16 sm:w-16">
              <svg
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
          </div>

          <fieldset className="mt-8 space-y-4">
            <legend className="sr-only">Reset method</legend>

            <ResetMethodOption
              value="email"
              selected={method === "email"}
              onChange={setMethod}
              title="Reset via Email"
              description="Receive a 6-digit verification code by email"
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              }
            />

            <ResetMethodOption
              value="phone"
              selected={method === "phone"}
              onChange={setMethod}
              title="Reset via Phone Number"
              description="Receive a 6-digit verification code by SMS"
              icon={
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
              }
            />
          </fieldset>

          <button
            id="continue-btn"
            type="button"
            onClick={handleContinue}
            className="group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-300 ease-in-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-sky-500/50 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/50 active:translate-y-0 active:scale-[0.98]"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />

            Continue

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
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </section>
      </main>
    </div>
  );
}
