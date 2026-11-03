export default function OtpInputGroup({ digits, onDigitChange, onKeyDown, onPaste, invalid, inputRefs }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:gap-3" role="group" aria-label="Six-digit verification code">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => { inputRefs.current[index] = element; }}
          data-otp-digit
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`OTP digit ${index + 1}`}
          aria-invalid={invalid ? "true" : "false"}
          value={digit}
          onChange={(event) => onDigitChange(index, event.target.value)}
          onKeyDown={(event) => onKeyDown(index, event)}
          onPaste={onPaste}
          className="h-12 min-w-0 rounded-lg border border-[#1e3a8a] bg-[#0b1a3d] text-center text-xl font-semibold text-slate-100 transition duration-300 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 aria-invalid:border-rose-500"
        />
      ))}
    </div>
  );
}
