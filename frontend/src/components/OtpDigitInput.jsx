export default function OtpDigitInput({
  value,
  index,
  inputRef,
  onChange,
  onKeyDown,
  onPaste,
  invalid,
  disabled = false,
}) {
  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      maxLength={index === 0 ? 6 : 1}
      autoComplete={index === 0 ? 'one-time-code' : 'off'}
      aria-label={`OTP digit ${index + 1}`}
      aria-invalid={invalid}
      disabled={disabled}
      value={value}
      onChange={(event) => onChange(index, event.target.value)}
      onKeyDown={(event) => onKeyDown(index, event)}
      onPaste={onPaste}
      className="h-12 min-w-0 rounded-lg border border-[#1e3a8a] bg-[#0b1a3d] text-center text-xl font-semibold text-slate-100 transition duration-300 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 aria-invalid:border-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}
