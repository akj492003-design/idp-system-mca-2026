const inputClass =
  "w-full rounded-xl border border-[#1E3A6E] bg-[#050B18] px-4 py-3 text-sm text-white outline-none transition duration-300 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 aria-invalid:border-red-500";

const labelClass = "block text-sm font-medium text-slate-300";

export default function PaymentField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  ...inputProps
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-error`}
        className={inputClass}
        {...inputProps}
      />
      <p
        id={`${id}-error`}
        className={`text-xs text-red-400 ${error ? "" : "hidden"}`}
      >
        {error || ""}
      </p>
    </div>
  );
}
