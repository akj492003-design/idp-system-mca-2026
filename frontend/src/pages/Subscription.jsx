import { useEffect, useState } from "react";
import BillingToggle from "../components/subscription/BillingToggle";
import PlanCard from "../components/subscription/PlanCard";
import { getPlans, getCurrentSubscription } from "../services/idpService.js";

const plans = [
  {
    slug: "basic",
    name: "Basic",
    description: "For learning & academic use",
    monthlyPrice: 0,
    current: true,
    iconClass:
      "flex h-11 w-11 items-center justify-center rounded-xl bg-blue-900/60 text-cyan-300",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21V11m0 0C12 7 9 4 4 4c0 4 3 7 8 7zm0 0c0-4 3-7 8-7-0 4-3 7-8 7z"
        />
      </svg>
    ),
    badge: "Free",
    badgeClass:
      "rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-[0_0_15px_rgba(34,197,94,0.6)]",
    cardClass:
      "border border-[#1E3A6E] bg-[#0B1730]/80 [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:shadow-[0_8px_24px_rgba(15,35,70,.08)] hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.25)]",
    features: [
      "Process up to 5 documents",
      "Basic text extraction (OCR)",
      "Document classification",
      "View processing history (last 7 days)",
    ],
  },
  {
    slug: "intermediate",
    name: "Intermediate",
    description: "For regular project & extended use",
    monthlyPrice: 199,
    iconClass:
      "flex h-11 w-11 items-center justify-center rounded-xl bg-violet-700 text-white shadow-[0_0_18px_rgba(124,58,237,0.7)]",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 2L4 14h7l-1 8 9-12h-7z"
        />
      </svg>
    ),
    cardClass:
      "border border-violet-500/50 bg-[#0B1730]/80 [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:shadow-[0_8px_24px_rgba(15,35,70,.08)] hover:border-violet-400 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]",
    priceClass: "text-fuchsia-400",
    features: [
      "Process up to 20+ documents per month",
      "Higher accuracy OCR",
      "Detailed analytics & reports",
      "Priority processing",
    ],
    actionLabel: "Upgrade to Intermediate →",
    linkClass:
      "group relative block overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_0_20px_rgba(37,99,235,0.45)] transition duration-300 ease-in-out hover:brightness-110 hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] focus-visible:outline-none focus-visible:ring-2focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B18] active:scale-95",
    shine: true,
  },
  {
    slug: "unlimited",
    name: "Unlimited",
    description: "For heavy usage & full access",
    monthlyPrice: 399,
    iconClass:
      "flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-fuchsia-600 to-purple-700 text-white shadow-[0_0_18px_rgba(217,70,239,0.7)]",
    icon: (
      <svg
        className="h-6 w-6"
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
    ),
    badge: "★ Best Value",
    badgeClass:
      "absolute -top-3 right-4 rounded-full bg-linear-to-r from-fuchsia-600 to-purple-600 px-3 py-1 text-xs font-bold text-white shadow-[0_0_15px_rgba(217,70,239,0.7)] motion-safe:animate-pulse",
    cardClass:
      "border border-fuchsia-500/70 bg-[#0B1730]/80 [.light_&]:border-[#cbd8ea] [.light_&]:bg-white [.light_&]:shadow-[0_8px_24px_rgba(15,35,70,.08)] shadow-[0_0_35px_rgba(217,70,239,0.25)] hover:shadow-[0_0_45px_rgba(217,70,239,0.45)]",
    priceClass: "text-fuchsia-400",
    features: [
      "Unlimited document processing",
      "Highest accuracy OCR",
      "Detailed analytics & custom reports",
      "Priority processing",
      "All upcoming IDP features",
    ],
    actionLabel: "Upgrade to Unlimited →",
    linkClass:
      "group relative block overflow-hidden rounded-xl bg-linear-to-r from-blue-600 via-violet-600 to-fuchsia-600 bg-[length:200%_100%] px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_0_20px_rgba(217,70,239,0.45)] transition duration-300 ease-in-out hover:bg-right hover:shadow-[0_0_30px_rgba(217,70,239,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B18] active:scale-95",
    shine: true,
  },
];

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [revealed, setRevealed] = useState(false);
  const [serverPlans, setServerPlans] = useState(null);
  const [currentPlan, setCurrentPlan] = useState("basic");

  useEffect(() => {
    let active = true;

    Promise.all([getPlans(), getCurrentSubscription()])
      .then(([planPayload, currentPayload]) => {
        if (!active) return;

        setServerPlans(planPayload?.plans || null);
        setCurrentPlan(currentPayload?.subscription?.plan_id || "basic");
      })
      .catch(() => {
        if (active) setServerPlans(null);
      });

    return () => {
      active = false;
    };
  }, []);

  const displayPlans = plans.map((plan) => {
    const apiPlan = serverPlans?.find((item) => item.id === plan.slug);

    return {
      ...plan,
      monthlyPrice: apiPlan
        ? Number(apiPlan.monthly_price)
        : plan.monthlyPrice,
      features: apiPlan?.features || plan.features,
      description: apiPlan?.description || plan.description,
      current: currentPlan === plan.slug,
    };
  });

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setRevealed(true);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050B18] text-slate-100 [.light_&]:bg-[#eef3fb] [.light_&]:text-[#1b2b45] font-sans antialiased">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl motion-safe:animate-pulse"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-72 bg-linear-to-t from-[#1E1B4B]/60 to-transparent"
      />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8 2xl:max-w-screen-2xl">
        {/* Header banner */}
        <section
          data-reveal
          className={`transition duration-700 ease-out motion-reduce:transition-none ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-linear-to-r from-[#0B1730] via-[#111C4E] to-[#1E1B4B] p-5 shadow-[0_0_40px_rgba(59,130,246,0.15)] [.light_&]:border-[#cbd8ea] [.light_&]:bg-[linear-gradient(100deg,#ffffff,#e8f0ff)] [.light_&]:shadow-[0_8px_24px_rgba(15,35,70,.08)] sm:p-7">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-violet-600 shadow-[0_0_25px_rgba(124,58,237,0.6)] motion-safe:animate-pulse sm:h-16 sm:w-16">
                <svg
                  className="h-7 w-7 text-white"
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
              </div>

              <div className="min-w-0">
                <h1 className="text-xl font-bold sm:text-3xl">
                  Upgrade <span className="text-cyan-400">Your</span> Plan
                </h1>
                <p className="mt-1 text-sm text-slate-300 sm:text-base [.light_&]:text-[#526782]">
                  Choose the right plan for your document processing needs and
                  unlock more powerful IDP features.
                </p>
              </div>

              <div className="ml-auto hidden h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-cyan-300 motion-safe:animate-bounce [animation-duration:3s] md:flex lg:h-24 lg:w-24">
                <svg
                  className="h-12 w-12 lg:h-14 lg:w-14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 3h7l5 5v13H7zM9 12h6M9 16h6M4 19l4-4 3 2 5-6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Billing toggle */}
        <BillingToggle
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
          revealed={revealed}
        />

        {/* Plans */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3 lg:gap-6">
          {displayPlans.map((plan) => (
            <PlanCard
              key={plan.slug}
              plan={plan}
              billingCycle={billingCycle}
              revealed={revealed}
            />
          ))}
        </div>
      </main>
    </div>
  );
}