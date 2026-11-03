export default function BillingToggle({ billingCycle, onBillingCycleChange, revealed }) {
  return (
    <div
      data-reveal
      className={`mt-6 flex justify-center transition duration-700 ease-out delay-100 motion-reduce:transition-none ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div
        role="group"
        aria-label="Billing period"
        className="inline-flex max-w-full items-center rounded-full border border-[#1E3A6E] bg-[#0B1730] p-1"
      >
        <button
          type="button"
          data-period="monthly"
          aria-pressed={billingCycle === "monthly"}
          onClick={() => onBillingCycleChange("monthly")}
          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition duration-300 ease-in-out hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 aria-pressed:bg-blue-600 aria-pressed:text-white aria-pressed:shadow-[0_0_20px_rgba(37,99,235,0.6)] sm:px-6"
        >
          Monthly
        </button>
        <button
          type="button"
          data-period="yearly"
          aria-pressed={billingCycle === "yearly"}
          onClick={() => onBillingCycleChange("yearly")}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-300 transition duration-300 ease-in-out hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95 aria-pressed:bg-blue-600 aria-pressed:text-white aria-pressed:shadow-[0_0_20px_rgba(37,99,235,0.6)] sm:px-6"
        >
          Yearly
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
            Save up to 20%
          </span>
        </button>
      </div>
    </div>
  );
}
