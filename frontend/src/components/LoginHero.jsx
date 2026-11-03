
import { useEffect, useState } from "react";
import { Brain } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleAuthButton from "./auth/GoogleAuthButton";
import { getApiErrorMessage } from "../services/api";

export default function LoginHero() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    // Read the current connection state and keep it updated.
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      await signIn({ email: email.trim().toLowerCase(), password });

      const requestedPath = location.state?.from;
      const destination =
        typeof requestedPath === "string" &&
        requestedPath.startsWith("/") &&
        !requestedPath.startsWith("//")
          ? requestedPath
          : "/home";

      navigate(destination, { replace: true });
    } catch (error) {
      setFormError(
        getApiErrorMessage(
          error,
          error.message || "Sign-in failed. Please check your details."
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ========== LEFT PANEL ========== */}
      <div className="flex flex-col justify-between order-2 lg:order-1 text-center lg:text-left py-3 lg:min-h-[calc(100vh-7rem)]">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-10 lg:mb-12">
            <div className="w-[42px] h-[42px] rounded-[10px] bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <img
                className="size-[46px] flex-none rounded-[11px] border border-blue-400/55 object-cover shadow-[0_0_12px_rgba(59,130,246,.55)]"
                src="/logo.png"
                alt="IDP logo"
                width="46"
                height="46"
              />
            </div>

            <div className="flex flex-col">
              <strong className="text-[1.35rem] font-bold tracking-tight text-white">
                IDP
              </strong>
              <span className="text-[0.72rem] text-slate-400 tracking-wide">
                Intelligent Document Processing
              </span>
            </div>
          </div>

          {/* Hero title */}
          <h1 className="text-[clamp(1.65rem,7vw,2.2rem)] lg:text-[clamp(2.2rem,3.5vw,3.1rem)] font-extrabold leading-tight tracking-tight mb-4">
            <span className="text-white">Intelligent</span>
            <br />
            <span className="text-blue-500">Document</span>{" "}
            <span className="text-purple-500">Processing</span>
          </h1>

          <p className="text-base text-slate-400 max-w-[420px] leading-relaxed mb-10 lg:mb-12 mx-auto lg:mx-0">
            Upload, extract, and classify documents with AI — all in one place.
          </p>

          {/* Illustration */}
          <div className="relative flex items-center justify-center gap-3 sm:gap-[22px] h-[145px] sm:h-[165px] lg:h-0 translate-y-0 lg:translate-y-[108px] mt-2 sm:mt-4 lg:mt-0">
            {/* Left: Document Card */}
            <div className="w-[62px] h-[78px] sm:w-[78px] sm:h-24 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-[0_0_0_1px_rgba(96,165,250,0.3),0_8px_28px_rgba(37,99,235,0.35)] flex items-center justify-center flex-shrink-0">
              <div className="flex flex-col gap-2 w-[42px]">
                <span className="h-[5px] bg-blue-300/55 rounded-[3px]" />
                <span className="h-[5px] bg-blue-300/55 rounded-[3px] w-[85%]" />
                <span className="h-[5px] bg-blue-300/55 rounded-[3px] w-[70%]" />
                <span className="h-[5px] bg-blue-300/55 rounded-[3px] w-[90%]" />
              </div>
            </div>

            {/* Center: Badges */}
            <div className="flex flex-col gap-2.5 items-center justify-center">
              <span className="text-[0.72rem] font-semibold px-3 py-1.5 rounded-lg border border-red-400/40 bg-gradient-to-br from-red-900 to-red-700 text-red-200">
                PDF
              </span>
              <span className="text-[0.72rem] font-semibold px-3 py-1.5 rounded-lg border border-blue-400/40 bg-gradient-to-br from-blue-900 to-blue-700 text-blue-200">
                DOCX
              </span>
              <span className="text-[0.72rem] font-semibold px-3 py-1.5 rounded-lg border border-purple-400/40 bg-gradient-to-br from-purple-900 to-violet-600 text-purple-200">
                JPG
              </span>
            </div>

            {/* Right: Brain Logo */}
            <div className="ml-2 sm:ml-3 lg:ml-4 w-[88px] h-[88px] sm:w-[110px] sm:h-[110px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,#0f172a)] border-2 border-blue-400/50 flex items-center justify-center shadow-[0_0_36px_rgba(59,130,246,0.4),inset_0_0_28px_rgba(59,130,246,0.15)] flex-shrink-0">
              <Brain
                size={40}
                strokeWidth={1.8}
                className="text-violet-400"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-[520px] mx-auto lg:max-w-none lg:mx-0 text-left mt-7 sm:mt-8 lg:mt-auto">
          <div className="flex flex-col gap-2.5">
            <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center border-[1.5px] border-blue-500/50 bg-blue-500/10 text-blue-400">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <circle cx="11.5" cy="14.5" r="2.5" />
                <path d="M13.5 16.5L16 19" />
              </svg>
            </div>

            <h4 className="text-[0.92rem] font-semibold text-slate-100">
              Smart Extraction
            </h4>
            <p className="text-xs text-slate-400 leading-snug">
              Get accurate data from any document.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center border-[1.5px] border-purple-500/50 bg-purple-500/10 text-purple-300">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1 2.5 3.3V13a3.5 3.5 0 0 1-1.5 2.9V18a2 2 0 0 1-2 2h-1.2a3.5 3.5 0 0 1-6.6 0H6a2 2 0 0 1-2-2v-2.1A3.5 3.5 0 0 1 2.5 13v-2.2A3.5 3.5 0 0 1 5 7.5V6a4 4 0 0 1 4-4h3z" />
                <circle cx="9.5" cy="11" r="1" />
                <circle cx="14.5" cy="11" r="1" />
              </svg>
            </div>

            <h4 className="text-[0.92rem] font-semibold text-slate-100">
              AI Classification
            </h4>
            <p className="text-xs text-slate-400 leading-snug">
              Organize documents automatically.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="w-[42px] h-[42px] rounded-full flex items-center justify-center border-[1.5px] border-cyan-400/50 bg-cyan-400/10 text-cyan-400">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>

            <h4 className="text-[0.92rem] font-semibold text-slate-100">
              Secure Document Management
            </h4>
            <p className="text-xs text-slate-400 leading-snug">
              Your data, always safe.
            </p>
          </div>
        </div>
      </div>

      {/* ========== RIGHT: Login Form ========== */}
      <div className="flex items-center justify-center order-1 lg:order-2 w-full min-w-0">
        <div className="w-full min-w-0 max-w-[420px] bg-[rgba(12,22,48,0.72)] backdrop-blur-xl border border-blue-500/35 rounded-2xl px-5 sm:px-8 py-7 sm:py-9 shadow-[0_0_0_1px_rgba(59,130,246,0.08),0_25px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.04)]">
          <h1 className="text-[1.75rem] font-bold tracking-tight mb-1.5">
            Welcome <span className="text-blue-500">Back</span>
          </h1>

          <p className="text-sm text-slate-400 mb-7">
            Sign in to your IDP account
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-[18px]">
              <label
                htmlFor="email"
                className="block text-[0.82rem] font-medium text-slate-300 mb-1.5"
              >
                Email Address
              </label>

              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <svg
                    className="w-[18px] h-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 7l-10 7L2 7" />
                  </svg>
                </span>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full py-3 pl-11 pr-3.5 bg-slate-900/60 border border-blue-500/25 rounded-[10px] text-slate-100 text-[0.92rem] outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-[3px] focus:ring-blue-500/15"
                />
              </div>
            </div>

            <div className="mb-[18px]">
              <label
                htmlFor="password"
                className="block text-[0.82rem] font-medium text-slate-300 mb-1.5"
              >
                Password
              </label>

              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                  <svg
                    className="w-[18px] h-[18px]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full py-3 pl-11 pr-11 bg-slate-900/60 border border-blue-500/25 rounded-[10px] text-slate-100 text-[0.92rem] outline-none transition-all placeholder:text-slate-500 focus:border-blue-500/60 focus:ring-[3px] focus:ring-blue-500/15"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 text-slate-400 hover:text-slate-300 p-1"
                >
                  {showPassword ? (
                    <svg
                      className="w-[18px] h-[18px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      className="w-[18px] h-[18px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-[22px] text-[0.82rem]">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 select-none">
                <input
                  type="checkbox"
                  name="remember"
                  defaultChecked
                  className="appearance-none w-4 h-4 border-[1.5px] border-blue-500/50 rounded bg-transparent cursor-pointer relative shrink-0 checked:bg-blue-500 checked:border-blue-500 checked:after:content-[''] checked:after:absolute checked:after:left-[4px] checked:after:top-[1px] checked:after:w-[5px] checked:after:h-[9px] checked:after:border-white checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-400 font-medium hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {formError && (
              <p
                className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300"
                role="alert"
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-500 to-violet-500 border-none rounded-[10px] text-white text-[0.98rem] font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_4px_20px_rgba(59,130,246,0.35)] hover:brightness-110 hover:shadow-[0_6px_28px_rgba(59,130,246,0.45)] hover:-translate-y-px active:translate-y-0"
            >
              {isSubmitting ? "Signing in…" : "Sign In"}

              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </form>

          <div className="flex items-center gap-3.5 my-[22px] text-slate-400 text-xs">
            <div className="flex-1 h-px bg-slate-400/20" />
            or continue with
            <div className="flex-1 h-px bg-slate-400/20" />
          </div>

          <GoogleAuthButton
            className="w-full py-2.5 px-4 bg-transparent border border-blue-500/30 rounded-[10px] text-slate-200 text-sm font-medium flex items-center justify-center gap-2.5 cursor-pointer transition-all mb-3 hover:bg-blue-500/10 hover:border-blue-500/50"
          >
            <svg
              className="w-[18px] h-[18px] shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                fill="#4285F4"
              />
              <path
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.2v3.15C3.18 21.32 7.23 24 12 24z"
                fill="#34A853"
              />
              <path
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.2C.44 8.1 0 9.99 0 12s.44 3.9 1.2 5.42l4.08-3.15z"
                fill="#FBBC05"
              />
              <path
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.68 1.2 6.58l4.08 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </GoogleAuthButton>

          <p className="text-center mt-[18px] text-[0.85rem] text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-400 font-medium hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 max-w-[1400px] mx-auto px-2 sm:px-8 lg:px-10 py-4 sm:py-5 text-xs text-slate-400 text-center sm:text-left w-full min-w-0 col-span-full order-3">
        <div className="flex items-center gap-2">
          <p
            role="status"
            aria-live="polite"
            className="mb-[7px] flex items-center gap-3 text-[11px] group-[.sidebar-collapsed]/app:min-[701px]:justify-center group-[.sidebar-collapsed]/app:min-[701px]:gap-0 group-[.sidebar-collapsed]/app:min-[701px]:text-[0px]"
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isOnline
                  ? "bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse"
                  : "bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"
              }`}
            />
            {isOnline ? "System Online" : "System Offline"}
          </p>
        </div>

        <div>© 2026 IDP – Intelligent Document Processing</div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <svg
            className="w-3.5 h-3.5 text-blue-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Secure AI-powered workspace
        </div>
      </footer>
    </>
  );
}
