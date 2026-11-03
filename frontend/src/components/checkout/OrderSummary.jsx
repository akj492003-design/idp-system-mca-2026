export default function OrderSummary({ plan, cycle, planPrice, total }) {
  return (
    <section className="rounded-2xl border border-[#1E3A6E] bg-[#0B1730]/80 p-5 shadow-lg transition duration-700 ease-out hover:border-blue-500/60 motion-reduce:transition-none sm:p-6">
      <h2 className="text-lg font-semibold">Order Summary</h2>

      <dl className="mt-4 divide-y divide-[#1E3A6E] text-sm sm:text-base">
        <div className="flex items-center justify-between py-3">
          <dt className="flex items-center gap-2 text-slate-300">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-700 text-white">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinejoin="round"
                  d="M3 8l4.5 4L12 6l4.5 6L21 8l-2 11H5L3 8z"
                />
              </svg>
            </span>
            Selected Plan
          </dt>
          <dd id="plan-name" className="font-semibold">
            {plan.name}
          </dd>
        </div>

        <div className="flex items-center justify-between py-3">
          <dt className="text-slate-300">Billing Cycle</dt>
          <dd id="cycle-name" className="font-semibold">
            {cycle}
          </dd>
        </div>

        <div className="flex items-center justify-between py-3">
          <dt className="text-slate-300">Plan Price</dt>
          <dd id="plan-price" className="font-semibold">
            ₹{planPrice}
          </dd>
        </div>
      </dl>

      <div className="mt-2 flex items-center justify-between border-t border-[#1E3A6E] pt-4">
        <span className="text-lg font-bold">Total Payable</span>
        <span
          id="total"
          className="text-2xl font-extrabold text-fuchsia-400 drop-shadow-[0_0_10px_rgba(217,70,239,0.6)]"
        >
          ₹{total}
        </span>
      </div>
    </section>
  );
}
