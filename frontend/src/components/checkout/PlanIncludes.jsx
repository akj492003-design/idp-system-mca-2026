export default function PlanIncludes({ items }) {
  return (
    <section className="rounded-2xl border border-[#1E3A6E] bg-[#0B1730]/80 p-5 shadow-lg transition duration-700 ease-out hover:border-blue-500/60 motion-reduce:transition-none sm:p-6">
      <h2 className="text-lg font-semibold">Plan Includes</h2>

      <ul
        id="plan-items"
        className="mt-4 space-y-3 rounded-xl border border-[#1E3A6E] bg-[#050B18]/60 p-4 text-sm sm:text-base"
      >
        {items.map((item) => (
          <li key={item} className="flex items-center gap-3">
            <svg
              className="h-5 w-5 shrink-0 text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
