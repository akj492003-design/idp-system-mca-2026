
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerAccount } from "../services/authService";
import { getApiErrorMessage } from "../services/api";
import GoogleAuthButton from "./auth/GoogleAuthButton";
import {Brain,Eye,EyeOff,Zap,CircleCheck,Cloud,ArrowRight,ShieldCheck,} from "lucide-react";

// LOGO
export function Logo() {

  return (
    <div className="flex items-center gap-3 mb-7">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-violet-500 rounded-[10px] flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)]">
     <img
  className="size-[46px] flex-none rounded-[11px] border border-blue-400/55 object-cover shadow-[0_0_12px_rgba(59,130,246,.55)]"
  src="/logo.png"
  alt="IDP logo"
  width="46"
  height="46"
/>
      </div>

      <div className="flex flex-col">
        <strong className="text-xl font-bold tracking-tight text-white">
          IDP
        </strong>
        <span className="text-[0.7rem] text-slate-400 tracking-wide">
          Intelligent Document Processing
        </span>
      </div>
    </div>
  );
}

// ILLUSTRATION
export function Illustration() {
  return (
    <div className="relative flex items-center justify-center gap-[22px] h-40 translate-y-[127px]">
      <div className="w-[78px] h-24 bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-[0_0_0_1px_rgba(96,165,250,0.3),0_8px_28px_rgba(37,99,235,0.35)] flex items-center justify-center flex-shrink-0">
        <div className="flex flex-col gap-2 w-[42px]">
          <span className="h-[5px] bg-blue-300/55 rounded-[3px]" />
          <span className="h-[5px] bg-blue-300/55 rounded-[3px] w-[85%]" />
          <span className="h-[5px] bg-blue-300/55 rounded-[3px] w-[70%]" />
          <span className="h-[5px] bg-blue-300/55 rounded-[3px] w-[90%]" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
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

      <div className="w-[110px] h-[110px] rounded-full bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,#0f172a)] border-2 border-blue-400/50 flex items-center justify-center shadow-[0_0_36px_rgba(59,130,246,0.4),inset_0_0_28px_rgba(59,130,246,0.15)] flex-shrink-0">
        <Brain size={48} strokeWidth={1.8} className="text-violet-400" />
      </div>
    </div>
  );
}

// FEATURES
const features = [
  {
    icon: Zap,
    title: "Faster Processing",
    description: "Save time with AI automation.",
    classes: "border-blue-500/50 bg-blue-500/10 text-blue-400",
  },
  {
    icon: CircleCheck,
    title: "High Accuracy",
    description: "Get reliable and precise results.",
    classes: "border-purple-500/50 bg-purple-500/10 text-purple-400",
  },
  {
    icon: Cloud,
    title: "Secure & Private",
    description: "Your data is always protected.",
    classes: "border-cyan-400/50 bg-cyan-400/10 text-cyan-400",
  },
];

export function Features() {
  return (
    <div className="grid grid-cols-3 gap-4 mt-auto">
      {features.map((feature) => {
        const FeatureIcon = feature.icon;

        return (
          <div key={feature.title} className="flex flex-col gap-1.5">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center border ${feature.classes}`}
            >
              <FeatureIcon size={18} strokeWidth={2} />
            </div>

            <h4 className="text-[0.85rem] font-semibold text-slate-100">
              {feature.title}
            </h4>

            <p className="text-[0.72rem] text-slate-400 leading-snug">
              {feature.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}

// FORM FIELD
function FormField({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false);

  const inputType =
    type === "password" && visible ? "text" : type;

  return (
    <div className="mb-3">
      <label
        htmlFor={name}
        className="block text-[0.78rem] font-medium text-slate-300 mb-1.5"
      >
        {label}
      </label>

      <div className="relative flex items-center">
        <input
          type={inputType}
          id={name}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full py-2.5 pl-3 pr-10 bg-[rgba(15,23,42,0.6)] border border-blue-500/25 rounded-[9px] text-slate-100 text-[0.88rem] outline-none focus:border-blue-500/60 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)] placeholder:text-slate-500"
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setVisible((previous) => !previous)}
            className="absolute right-2.5 text-slate-400 hover:text-blue-400 p-1"
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}

// SIGNUP FORM
export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password.length < 10) {
      setFormError("Use a password with at least 10 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerAccount({
        full_name: String(formData.get("fullname") || "").trim(),
        email: String(formData.get("email") || "").trim().toLowerCase(),
        phone: String(formData.get("phone") || "").trim(),
        password,
      });
      form.reset();
      setSuccessMessage("Your account has been created. You can now sign in.");
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Could not create your account."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Full Name"
        name="fullname"
        placeholder="Enter your full name"
        autoComplete="name"
      />

      <FormField
        label="Email Address"
        name="email"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
      />

      <FormField
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="+91 98765 43210"
        autoComplete="tel"
      />

      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Create a strong password"
        autoComplete="new-password"
      />

      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm your password"
        autoComplete="new-password"
      />

      <label className="flex items-start gap-2 my-3 mb-4 text-[0.78rem] text-slate-300 cursor-pointer">
        <input
          type="checkbox"
          name="terms"
          required
          className="mt-0.5 accent-blue-500"
        />

        <span>
          I agree to the{" "}
          <a href="/terms" className="text-blue-400 hover:underline">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>
        </span>
      </label>

      {formError && <p className="mb-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300" role="alert">{formError}</p>}
      {successMessage && <p className="mb-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300" role="status">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-[11px] px-[18px] bg-gradient-to-r from-blue-500 to-violet-500 rounded-[9px] text-white text-[0.92rem] font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_18px_rgba(59,130,246,0.35)] hover:brightness-110"
      >
        {isSubmitting ? "Creating account…" : "Create Account"} <ArrowRight size={18} />
      </button>
    </form>
  );
}

// SOCIAL SIGNUP
export function SocialSignup() {
  const [phoneNotice, setPhoneNotice] = useState("");

  return (
    <>
      <div className="flex items-center gap-3 my-4 text-slate-400 text-xs">
        <div className="flex-1 h-px bg-slate-400/20" />
        or sign up with
        <div className="flex-1 h-px bg-slate-400/20" />
      </div>

      <GoogleAuthButton
        className="w-full py-2.5 px-4 bg-transparent border border-blue-500/30 rounded-[10px] text-slate-200 text-sm font-medium flex items-center justify-center gap-2.5 cursor-pointer transition-all mb-3 hover:bg-blue-500/10 hover:border-blue-500/50"
      >
        <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4" />
          <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.2v3.15C3.18 21.32 7.23 24 12 24z" fill="#34A853" />
          <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.2C.44 8.1 0 9.99 0 12s.44 3.9 1.2 5.42l4.08-3.15z" fill="#FBBC05" />
          <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.68 1.2 6.58l4.08 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335" />
        </svg>
        Sign up with Google
      </GoogleAuthButton>

      <button
        type="button"
        onClick={() => setPhoneNotice("Phone-number sign-up is not enabled yet. Please create your account with email.")}
        className="w-full py-2.5 px-4 bg-transparent border border-blue-500/30 rounded-[10px] text-slate-200 text-sm font-medium flex items-center justify-center gap-2.5 cursor-pointer transition-all mb-3 hover:bg-blue-500/10 hover:border-blue-500/50"
      >
        <svg className="w-[18px] h-[18px] shrink-0 text-cyan-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17 2H7C5.34 2 4 3.34 4 5v14c0 1.66 1.34 3 3 3h10c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3zm-5 1.5c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5zM12 20.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5-3.5H7V5h10v12z" />
        </svg>
        Sign up with Phone Number
      </button>
      {phoneNotice && <p className="mb-2 text-xs text-amber-300" role="status">{phoneNotice}</p>}

      <p className="text-center mt-3 text-xs text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-400 font-medium hover:underline"
        >
          Sign In
        </Link>
      </p>
    </>
  );
}

// FOOTER
export function Footer() {
  return (
    <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2 px-5 sm:px-9 pb-3.5 max-w-[1400px] mx-auto text-[0.7rem] text-slate-400">
      <div className="flex items-center gap-2">
        <span className="w-[7px] h-[7px] bg-green-500 rounded-full shadow-[0_0_8px_#22c55e] animate-pulse" />
        <span>System Online</span>
      </div>

      <div>© 2026 IDP – Intelligent Document Processing</div>

      <div className="flex items-center gap-1.5 text-slate-400">
        <ShieldCheck size={16} className="text-blue-400" />
        Secure AI-powered workspace
      </div>
    </footer>
  );
}
