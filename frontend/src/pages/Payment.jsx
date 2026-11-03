import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PaymentMethodOption from "../components/payment/PaymentMethodOption";
import { createPaymentOrder, verifyPayment } from "../services/idpService.js";
import { getApiErrorMessage } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector('script[data-razorpay-checkout="true"]');
    if (existing) { existing.addEventListener("load", () => resolve(Boolean(window.Razorpay)), { once: true }); existing.addEventListener("error", () => resolve(false), { once: true }); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true; script.dataset.razorpayCheckout = "true";
    script.onload = () => resolve(Boolean(window.Razorpay)); script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Payment() {
  const [method, setMethod] = useState("upi");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const params = new URLSearchParams(window.location.search);
  const planId = params.get("plan") || "unlimited";
  const cycle = params.get("cycle") === "yearly" ? "yearly" : "monthly";

  const changeMethod = (nextMethod) => { setMethod(nextMethod); setStatus(""); };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true); setStatus("");
    try {
      const order = await createPaymentOrder(planId, cycle);
      const ready = await loadRazorpay();
      if (!ready) throw new Error("The secure payment checkout could not be loaded. Check your connection and try again.");
      const checkout = new window.Razorpay({
        key: order.key_id, amount: order.amount, currency: order.currency, name: "IDP System",
        description: `${order.plan.name} subscription (${cycle})`, order_id: order.order_id,
        prefill: { name: user?.full_name || user?.name || "", email: user?.email || "" },
        notes: { plan_id: planId, billing_cycle: cycle, selected_method: method },
        theme: { color: "#1d6bff" },
        handler: async (response) => {
          try {
            await verifyPayment(response);
            navigate("/subscription?payment=success", { replace: true });
          } catch (error) {
            setStatus(getApiErrorMessage(error, "Payment verification failed. Contact support with your payment receipt."));
            setBusy(false);
          }
        },
        modal: { ondismiss: () => { setBusy(false); setStatus("Checkout was closed before payment was completed."); } },
      });
      checkout.on("payment.failed", (response) => { setBusy(false); setStatus(response?.error?.description || "Payment failed. No subscription was activated."); });
      checkout.open();
    } catch (error) {
      setStatus(getApiErrorMessage(error, "Could not start secure payment."));
      setBusy(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050B18] text-slate-100 [.light_&]:bg-[#eef3fb] [.light_&]:text-[#1b2b45] font-sans antialiased">
      <div aria-hidden="true" className="pointer-events-none fixed -top-32 left-0 -z-10 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl motion-safe:animate-pulse" />
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 h-72 bg-gradient-to-t from-[#1E1B4B]/60 to-transparent" />
      <main className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6 sm:py-10 2xl:max-w-2xl">
        <Link to={`/checkout${window.location.search}`} id="back-link" className="group inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-cyan-400 transition duration-300 hover:-translate-x-1 hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 active:scale-95"><svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m0 0 6-6m-6 6 6 6" /></svg>Back to Checkout</Link>
        <section className="mt-8 flex items-center gap-4"><div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 shadow-[0_0_25px_rgba(99,102,241,0.4)]"><svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><path strokeLinecap="round" d="M2 10h20M6 15h4" /></svg></div><div className="min-w-0"><h1 className="text-2xl font-bold sm:text-3xl">Select Payment Method</h1><p className="mt-1 text-sm text-slate-400 sm:text-base">Choose a preferred payment option to continue.</p></div></section>
        <form id="payment-form" onSubmit={handleSubmit} className="mt-7 space-y-4">
          <fieldset className="space-y-3"><legend className="sr-only">Choose payment method</legend>
            <PaymentMethodOption value="upi" selected={method === "upi"} onChange={changeMethod} icon={<svg className="h-7 w-7 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>}>UPI</PaymentMethodOption>
            <PaymentMethodOption value="card" selected={method === "card"} onChange={changeMethod} icon={<svg className="h-7 w-7 text-cyan-300 transition duration-300 group-hover:text-cyan-200" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></svg>}>Credit / Debit Card</PaymentMethodOption>
            <PaymentMethodOption value="netbanking" selected={method === "netbanking"} onChange={changeMethod} icon={<svg className="h-7 w-7 text-slate-400 transition duration-300 group-hover:text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinejoin="round" d="M3 10l9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" /></svg>}>Net Banking</PaymentMethodOption>
          </fieldset>
          <section className="space-y-3 rounded-xl border border-cyan-500/30 bg-[#0B1730]/80 p-4 transition duration-300 sm:p-5"><div className="flex items-start gap-3"><svg className="mt-0.5 h-6 w-6 shrink-0 text-cyan-300" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3l8 4v5c0 5-3.4 8-8 9-4.6-1-8-4-8-9V7l8-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" /></svg><div><h2 className="text-sm font-semibold text-white">Secure hosted checkout</h2><p className="mt-1 text-sm leading-6 text-slate-300">Your selected payment preference is {method === "upi" ? "UPI" : method === "card" ? "Card" : "Net Banking"}. Razorpay collects payment credentials in its hosted checkout. Card numbers, expiry dates, CVV and UPI credentials are never sent to or stored by the IDP backend.</p></div></div></section>
          <div role="status" className="flex items-center gap-3 rounded-xl border border-cyan-500/40 bg-[#0B1730] p-4 text-sm shadow-[0_0_20px_rgba(34,211,238,0.12)] sm:p-5"><svg className="h-6 w-6 shrink-0 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v.01M12 11v5" /></svg><span>Payment is processed by Razorpay. The subscription activates only after server-side signature verification.</span></div>
          {status && <p role="alert" aria-live="polite" className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-4 text-sm text-rose-200">{status}</p>}
          <button type="submit" disabled={busy} className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-fuchsia-600 px-6 py-4 text-base font-semibold text-white shadow-[0_0_25px_rgba(37,99,235,0.35)] transition duration-300 hover:brightness-110 hover:shadow-[0_0_35px_rgba(217,70,239,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B18] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"><span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition duration-700 ease-in-out group-hover:translate-x-full" /><span className="relative">{busy ? "Opening secure checkout…" : "Continue"}<span aria-hidden="true" className="ml-1 inline-block transition duration-300 group-hover:translate-x-1">→</span></span></button>
        </form>
      </main>
    </div>
  );
}
