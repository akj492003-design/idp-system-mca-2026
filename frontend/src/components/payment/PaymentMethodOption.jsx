export default function PaymentMethodOption({
  value,
  selected,
  onChange,
  children,
  icon,
}) {
  return (
    <label className="group flex cursor-pointer items-center justify-between rounded-xl border border-[#1E3A6E] bg-[#0B1730] p-4 transition duration-300 hover:border-cyan-400/70 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] has-[:checked]:border-cyan-400 has-[:checked]:shadow-[0_0_20px_rgba(34,211,238,0.25)] active:scale-[0.99]">
      <span className="flex items-center gap-4">
        <input
          type="radio"
          name="method"
          value={value}
          checked={selected}
          onChange={() => onChange(value)}
          className="h-6 w-6 cursor-pointer accent-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1730]"
        />
        <span className="font-semibold">{children}</span>
      </span>
      {icon}
    </label>
  );
}
