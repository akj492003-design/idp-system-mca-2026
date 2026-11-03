export default function SuccessIndicator() {
  return (
    <div className="relative mx-auto mt-6 flex h-28 w-28 items-center justify-center">
      <span className="absolute inset-0 rounded-full border-2 border-emerald-400/60 motion-safe:animate-ping" />
      <span className="absolute inset-2 rounded-full bg-emerald-500/15 shadow-[0_0_40px_-5px_rgba(52,211,153,0.8)]" />
      <svg
        className="relative h-14 w-14 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.9)]"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2.5"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
    </div>
  );
}
