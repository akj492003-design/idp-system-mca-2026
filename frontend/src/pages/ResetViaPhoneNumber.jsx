import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OtpDigitInput from "../components/OtpDigitInput";
import CountryCodeSelect from "../components/CountryCodeSelect";
import { countries } from "../Data/countries";
import { requestPasswordResetOtp, verifyPasswordResetOtp } from "../services/authService";
import { getApiErrorMessage } from "../services/api";

const nationalLengths = {
  IN: [10, 10], US: [10, 10], CA: [10, 10], GB: [10, 10], AU: [9, 9],
  NZ: [8, 10], DE: [7, 12], FR: [9, 9], SG: [8, 8], AE: [9, 9],
  SA: [9, 9], PK: [10, 10], BD: [10, 10], LK: [9, 9], NP: [10, 10],
  JP: [10, 10], CN: [11, 11], BR: [10, 11], MX: [10, 10], ZA: [9, 9],
  NG: [10, 10], KE: [9, 10], RU: [10, 10], IT: [6, 11], ES: [9, 9],
  NL: [9, 9], BE: [8, 9], CH: [9, 9], SE: [7, 10], NO: [8, 8],
  DK: [8, 8], FI: [5, 12], IE: [7, 10], IL: [9, 9], KR: [9, 11],
  ID: [9, 12], PH: [10, 10], TH: [9, 9], VN: [9, 10], TR: [10, 10],
  EG: [10, 10], AR: [10, 11], CL: [9, 9], CO: [10, 10], PE: [9, 9],
};

const buttonClass = "group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/30 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400/50 disabled:cursor-wait disabled:opacity-60";

function ButtonShimmer() {
  return <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 group-hover:translate-x-full" />;
}

function saveResetToken(token) {
  if (!token) throw new Error("The server did not return a password-reset token.");
  try {
    window.sessionStorage.setItem("docupilotPasswordResetToken", token);
  } catch {
    throw new Error("Your browser blocked session storage. Allow session storage and request a new code.");
  }
}

export default function ResetViaPhoneNumber() {
  const navigate = useNavigate();
  const [cardVisible, setCardVisible] = useState(false);
  const [countryIso, setCountryIso] = useState("IN");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otpPanelVisible, setOtpPanelVisible] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [remaining, setRemaining] = useState(300);
  const [otpExpired, setOtpExpired] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const otpInputRefs = useRef([]);
  const phoneInputRef = useRef(null);
  const selectedCountry = useMemo(
    () => countries.find((country) => country.iso === countryIso) || countries.find((country) => country.iso === "IN"),
    [countryIso],
  );
  const otpValue = otpDigits.join("");
  const timerText = `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  const phoneDigits = phone.replace(/\D/g, "");
  const phoneE164 = `+${selectedCountry.dial}${phoneDigits}`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setCardVisible(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!otpPanelVisible || otpExpired || remaining <= 0) return undefined;
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [otpPanelVisible, otpExpired, remaining]);

  useEffect(() => {
    if (otpPanelVisible && remaining === 0) {
      setOtpExpired(true);
      setMessage("The code expired. Request a new code to continue.");
      setMessageType("error");
    }
  }, [remaining, otpPanelVisible]);

  useEffect(() => {
    if (!otpPanelVisible) return undefined;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById("otp-panel")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      otpInputRefs.current[0]?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [otpPanelVisible]);

  const validatePhone = () => {
    const [min, max] = nationalLengths[selectedCountry.iso] || [7, 12];
    const valid = phoneDigits.length >= min && phoneDigits.length <= max;
    setPhoneError(valid ? "" : `Enter a valid ${selectedCountry.name} phone number (${min === max ? `${min} digits` : `${min}–${max} digits`}).`);
    return valid;
  };

  const requestCode = async (event) => {
    event?.preventDefault();
    setOtpError("");
    setMessage("");
    if (!validatePhone()) {
      phoneInputRef.current?.focus();
      return;
    }
    setIsSending(true);
    try {
      const result = await requestPasswordResetOtp({ channel: "sms", destination: phoneE164 });
      const nextChallenge = result?.challenge_id ?? result?.challengeId;
      if (!nextChallenge) throw new Error("The server did not return a recovery challenge ID.");
      setChallengeId(nextChallenge);
      setOtpDigits(["", "", "", "", "", ""]);
      setRemaining(Number(result?.expires_in) > 0 ? Number(result.expires_in) : 300);
      setOtpExpired(false);
      setOtpPanelVisible(true);
      setMessage("If an account matches this phone number, a verification code has been sent.");
      setMessageType("success");
    } catch (error) {
      setMessage(getApiErrorMessage(error, error.message || "Could not send a verification code."));
      setMessageType("error");
    } finally {
      setIsSending(false);
    }
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value.replace(/[^\d\s()+.-]/g, ""));
    setPhoneError("");
    if (otpPanelVisible) {
      setOtpPanelVisible(false);
      setChallengeId("");
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpExpired(false);
      setMessage("Phone number changed. Request a new verification code.");
      setMessageType("info");
    }
  };

  const handleCountryChange = (nextCountry) => {
    setCountryIso(nextCountry);
    setPhoneError("");
    if (otpPanelVisible) {
      setOtpPanelVisible(false);
      setChallengeId("");
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpExpired(false);
      setMessage("Country changed. Request a new verification code.");
      setMessageType("info");
    }
  };

  const handleOtpChange = (index, rawValue) => {
    const entered = rawValue.replace(/\D/g, "").slice(0, 6 - index);
    setOtpDigits((current) => current.map((digit, position) => (
      position >= index && position < index + entered.length ? entered[position - index] : digit
    )));
    setOtpError("");
    if (entered && index < 5) otpInputRefs.current[Math.min(index + entered.length, 5)]?.focus();
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) otpInputRefs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) otpInputRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < 5) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpPaste = (event) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    event.preventDefault();
    setOtpDigits(Array.from({ length: 6 }, (_, index) => pasted[index] || ""));
    setOtpError("");
    otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    if (!challengeId) {
      setOtpError("Request a new verification code first.");
      return;
    }
    if (otpExpired || remaining <= 0) {
      setOtpError("This code has expired. Request a new code.");
      return;
    }
    if (!/^\d{6}$/.test(otpValue)) {
      setOtpError("Enter the complete 6-digit code.");
      otpInputRefs.current[0]?.focus();
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    setMessage("");
    try {
      const result = await verifyPasswordResetOtp({ challengeId, otp: otpValue });
      saveResetToken(result?.reset_token ?? result?.resetToken);
      navigate("/reset-password", { replace: true });
    } catch (error) {
      setOtpError(getApiErrorMessage(error, "The verification code is invalid or expired."));
      otpInputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-dvh overflow-x-hidden bg-[#040a1c] bg-[radial-gradient(ellipse_at_top,#1e3a8a_0%,#0b1a3d_45%,#040a1c_85%)] font-sans text-slate-100 antialiased">
      <main className="relative flex min-h-dvh items-center justify-center overflow-visible px-4 py-8 sm:px-6 sm:py-10 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 top-16 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl motion-safe:animate-pulse" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 bottom-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl motion-safe:animate-pulse [animation-delay:1.5s]" />

        <section className={`relative w-full max-w-md rounded-3xl border border-[#1e3a8a]/60 bg-[#0a1733]/80 p-6 shadow-[0_0_60px_-15px_rgba(37,99,235,0.6)] backdrop-blur-xl transition duration-700 ease-out sm:p-8 ${cardVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
          <Link to="/forgot-password" className="group inline-flex items-center gap-2 rounded-md text-sm text-sky-300 transition hover:text-sky-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">← Back</Link>
          <div className="mt-6 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Reset via Phone Number</h1>
              <p className="mt-2 text-sm text-slate-400 sm:text-base">Enter your phone number and verify the code sent by SMS.</p>
            </div>
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/15 text-sky-300 shadow-[0_0_30px_-6px_rgba(56,189,248,0.7)] sm:h-16 sm:w-16">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
              <span className="absolute -right-3 -top-2 rounded-full bg-sky-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">OTP</span>
            </div>
          </div>

          <form noValidate onSubmit={requestCode} className="mt-8 space-y-5">
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-300">Phone Number</label>
              <div className="grid grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] gap-2 sm:gap-3">
                <CountryCodeSelect countries={countries} value={countryIso} onChange={handleCountryChange} />
                <input id="phone" ref={phoneInputRef} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Enter phone number" value={phone} onChange={handlePhoneChange} aria-invalid={Boolean(phoneError)} className="w-full min-w-0 rounded-xl border border-[#1e3a8a] bg-[#0b1a3d] px-3 py-3.5 text-sm text-slate-100 placeholder-slate-500 transition hover:border-sky-400/50 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 aria-invalid:border-rose-500 sm:px-4" />
              </div>
              {phoneError && <p className="mt-2 text-sm text-rose-400" role="alert">{phoneError}</p>}
              {otpPanelVisible && <p className="mt-2 text-xs text-slate-400">Sending to {phoneE164}</p>}
            </div>

            <button type="submit" disabled={isSending} className={buttonClass}>
              <ButtonShimmer />
              <span className="relative">{isSending ? "Sending code…" : otpPanelVisible ? "Send new code" : "Send OTP"}</span>
            </button>

            {otpPanelVisible && (
              <section id="otp-panel" className="space-y-4 rounded-xl border border-[#1e3a8a]/60 bg-[#0b1a3d]/60 p-4 sm:p-5" aria-live="polite">
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-300">Enter the 6-digit code</label>
                  <div className="grid grid-cols-6 gap-2 sm:gap-3" role="group" aria-label="Six-digit verification code">
                    {otpDigits.map((digit, index) => (
                      <OtpDigitInput key={index} value={digit} index={index} inputRef={(element) => { otpInputRefs.current[index] = element; }} onChange={handleOtpChange} onKeyDown={handleOtpKeyDown} onPaste={handleOtpPaste} invalid={Boolean(otpError)} />
                    ))}
                  </div>
                  {otpError && <p className="mt-2 text-sm text-rose-400" role="alert">{otpError}</p>}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <p className="text-slate-400">Code expires in <span className="font-semibold text-cyan-300 tabular-nums">{timerText}</span></p>
                  <button type="button" onClick={requestCode} disabled={!otpExpired || isSending} className="rounded-md font-medium text-sky-300 hover:text-sky-200 disabled:cursor-not-allowed disabled:text-slate-600">Resend code</button>
                </div>
                <button type="button" onClick={handleVerify} disabled={isVerifying || otpExpired} className={buttonClass}>
                  <ButtonShimmer />
                  <span className="relative">{isVerifying ? "Verifying…" : "Verify code →"}</span>
                </button>
              </section>
            )}

            {message && <p className={`rounded-xl border p-3 text-center text-sm ${messageType === "error" ? "border-rose-500/40 bg-rose-500/10 text-rose-300" : "border-sky-500/30 bg-sky-500/10 text-sky-200"}`} role="status">{message}</p>}
            <p className="rounded-xl border border-[#1e3a8a]/60 bg-[#0b1a3d]/60 p-4 text-sm text-slate-400">The OTP is generated and verified by the Flask backend. It is never exposed in the browser.</p>
          </form>
        </section>
      </main>
    </div>
  );
}
