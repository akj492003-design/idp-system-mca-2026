import { Link} from "react-router-dom";
import CheckoutHeader from "../components/checkout/CheckoutHeader";
import OrderSummary from "../components/checkout/OrderSummary";
import PlanIncludes from "../components/checkout/PlanIncludes";
import { useEffect, useMemo, useState } from "react";
import { getPlans } from "../services/idpService.js";

const PLANS = {
  basic: {
    name: "Basic",
    price: 0,
    items: [
      "Process up to 5 documents",
      "Basic text extraction (OCR)",
      "Document classification",
      "View processing history (last 7 days)",
    ],
  },
  intermediate: {
    name: "Intermediate",
    price: 199,
    items: [
      "Process up to 20+ documents per month",
      "Higher accuracy OCR",
      "Detailed analytics & reports",
      "Priority processing",
    ],
  },
  unlimited: {
    name: "Unlimited",
    price: 399,
    items: [
      "Unlimited document processing",
      "Highest accuracy OCR",
      "Detailed analytics & custom reports",
      "Priority processing",
      "All upcoming IDP features",
    ],
  },
};

function getCheckoutSelection(search) {
  const params = new URLSearchParams(search);
  const requestedPlan = params.get("plan") || "unlimited";
  const planKey = Object.prototype.hasOwnProperty.call(PLANS, requestedPlan)
    ? requestedPlan
    : "unlimited";
  const yearly = params.get("cycle") === "yearly";

  return {
    planKey,
    plan: PLANS[planKey],
    yearly,
  };
}

export default function Checkout() {
  const [revealed, setRevealed] = useState(false);
  const [serverPlans, setServerPlans] = useState(null);
  useEffect(() => { let active = true; getPlans().then((payload) => { if (active) setServerPlans(payload?.plans || null); }).catch(() => {}); return () => { active = false; }; }, []);

  const selection = useMemo(() => {
    const search =
      typeof window !== "undefined" ? window.location.search : "";
    return getCheckoutSelection(search);
  }, []);

  const { planKey, plan: defaultPlan, yearly } = selection;
  const apiPlan = serverPlans?.find((item) => item.id === planKey);
  const plan = apiPlan ? { ...defaultPlan, name: apiPlan.name, price: Number(apiPlan.monthly_price), yearlyPrice: Number(apiPlan.yearly_price), items: apiPlan.features } : defaultPlan;
  const cycle = yearly ? "Yearly" : "Monthly";
  const monthlyPrice = plan.price;
  const shownPrice = yearly ? Math.round((plan.yearlyPrice ?? Math.round(monthlyPrice * 0.8 * 12)) / 12) : monthlyPrice;
  const total = yearly ? (plan.yearlyPrice ?? Math.round(monthlyPrice * 0.8 * 12)) : shownPrice;

  const checkoutQuery = `?plan=${encodeURIComponent(planKey)}&cycle=${
    yearly ? "yearly" : "monthly"
  }`;

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setRevealed(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050B18] text-slate-100 [.light_&]:bg-[#eef3fb] [.light_&]:text-[#1b2b45] font-sans antialiased">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-32 right-0 -z-10 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl motion-safe:animate-pulse"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-72 bg-linear-to-t from-[#1E1B4B]/60 to-transparent"
      />

      <main className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6 sm:py-10 2xl:max-w-2xl">      
   {/* Back navigation */}
        <Link
          to="/subscription"
          id="back-link"
          className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-cyan-400 transition duration-300 ease-in-out hover:text-cyan-300 hover:-translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 12H5m0 0l6-6m-6 6l6 6"
            />
          </svg>
          Back to Subscription
        </Link>

        {/* Header */}
        <div
          data-reveal
          className={`transition duration-700 ease-out motion-reduce:transition-none ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <CheckoutHeader />
        </div>

        {/* Order summary */}
        <div
          data-reveal
          className={`mt-6 transition duration-700 ease-out motion-reduce:transition-none ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <OrderSummary
            plan={plan}
            cycle={cycle}
            planPrice={shownPrice}
            total={total}
          />
        </div>

        {/* Plan includes */}
        <div
          data-reveal
          className={`mt-6 transition duration-700 ease-out motion-reduce:transition-none ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <PlanIncludes items={plan.items} />
        </div>

        {/* Proceed to payment */}
        <div
          data-reveal
          className={`mt-8 transition duration-700 ease-out motion-reduce:transition-none ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
         <Link
            id="proceed-link"
            to={`/payment${checkoutQuery}`}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-violet-600 px-6 py-4 text-base font-semibold text-white shadow-[0_0_25px_rgba(37,99,235,0.5)] transition duration-300 ease-in-out hover:brightness-110 hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B18] active:scale-95"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition duration-700 ease-in-out group-hover:translate-x-full"
            />
            <span className="relative">Proceed to Payment</span>
            <span
              className="relative transition duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
