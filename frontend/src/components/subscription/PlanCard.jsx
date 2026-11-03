import { Link } from "react-router-dom";
function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-emerald-400"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function PlanCard({ plan, billingCycle, revealed }) {
  const price =
    billingCycle === "yearly"
      ? Math.round(plan.monthlyPrice * 0.8)
      : plan.monthlyPrice;

  return (
    <article
      data-reveal
      className={`relative flex flex-col rounded-2xl p-5 shadow-lg transition duration-300 ease-in-out hover:-translate-y-1 motion-reduce:transition-none sm:p-6 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${plan.cardClass}`}
    >
      {plan.badge === "★ Best Value" && (
        <span className={plan.badgeClass}>{plan.badge}</span>
      )}

      {plan.badge === "Free" ? (
        <div className="flex items-start justify-between">
          <div className={plan.iconClass}>{plan.icon}</div>
          <span className={plan.badgeClass}>{plan.badge}</span>
        </div>
      ) : (
        <div className={plan.iconClass}>{plan.icon}</div>
      )}

      <h2 className="mt-4 text-xl font-bold">{plan.name}</h2>
      <p className="text-sm text-slate-400 [.light_&]:text-[#526782]">{plan.description}</p>

      <p className="mt-4 flex items-end gap-1 border-b border-[#1E3A6E] pb-5 [.light_&]:border-[#d8e1ee]">
        <span className={`text-3xl font-extrabold ${plan.priceClass || ""} [.light_&]:text-fuchsia-700`}>
          <span data-price data-monthly={plan.monthlyPrice}>
            ₹{price}
          </span>
        </span>
        <span className="pb-1 text-sm text-slate-400 [.light_&]:text-[#526782]">/month</span>
      </p>

      <ul className="mt-5 space-y-3 text-sm text-slate-200 [.light_&]:text-[#273e5f]">
        {plan.features.map((feature) => (
          <li className="flex gap-3" key={feature}>
            <CheckIcon />
            {feature}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        {plan.current ? (
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-600 bg-[#0F2347] px-4 py-3 text-sm font-semibold text-slate-300 opacity-90 [.light_&]:border-[#cbd8ea] [.light_&]:bg-[#edf3fb] [.light_&]:text-[#405573]"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Current Plan
          </button>
        ) : (
          <Link
            to={`/checkout?plan=${plan.slug}&cycle=${billingCycle}`}
            data-plan={plan.slug}
            className={plan.linkClass}
          >
            {plan.shine && (
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition duration-700 ease-in-out group-hover:translate-x-full"
              />
            )}
            <span className="relative">{plan.actionLabel}</span>
          </Link>
        )}
      </div>
    </article>
  );
}
