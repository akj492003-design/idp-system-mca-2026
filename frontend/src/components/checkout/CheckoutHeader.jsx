export default function CheckoutHeader() {
  return (
    <section className="mt-5 flex items-center gap-4">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 shadow-[0_0_25px_rgba(37,99,235,0.6)] motion-safe:animate-pulse">
        <svg
          className="h-8 w-8 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l2.4 11.2a1 1 0 001 .8h9.2a1 1 0 001-.8L21 7H6M9 20a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2z"
          />
        </svg>
      </div>

      <div>
        <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>
        <p className="text-sm text-slate-400 sm:text-base">
          Review your selected plan and proceed to payment.
        </p>
      </div>
    </section>
  );
}
