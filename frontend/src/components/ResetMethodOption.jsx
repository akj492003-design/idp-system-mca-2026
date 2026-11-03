export default function ResetMethodOption({
  value,
  selected,
  onChange,
  title,
  description,
  icon,
}) {
  return (
    <label className="group block cursor-pointer">
      <input
        type="radio"
        name="method"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />

      <div className="flex items-center gap-4 rounded-2xl border border-[#1e3a8a] bg-[#0b1a3d]/60 p-4 transition duration-300 ease-in-out hover:border-sky-400/60 peer-focus-visible:ring-4 peer-focus-visible:ring-sky-400/30 group-has-checked:border-sky-400 group-has-checked:bg-blue-600/15 group-has-checked:shadow-[0_0_25px_-8px_rgba(56,189,248,0.7)]">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/20 text-sky-300">
          {icon}
        </span>

        <span className="flex-1">
          <span className="block font-semibold text-white">{title}</span>
          <span className="block text-sm text-slate-400">
            {description}
          </span>
        </span>

        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-slate-500 transition duration-300 ease-in-out group-has-checked:border-sky-400">
          <span className="h-2.5 w-2.5 scale-0 rounded-full bg-sky-400 transition duration-300 ease-in-out group-has-checked:scale-100" />
        </span>
      </div>
    </label>
  );
}
