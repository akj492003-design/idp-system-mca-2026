export default function EmailAddressField({
  value,
  onChange,
  invalid,
  onBlur,
}) {
  return (
    <div>
      <label
        htmlFor="email"
        className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300"
      >
        <svg
          className="h-4 w-4 text-sky-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0-9.75 6.5-9.75-6.5"
          />
        </svg>
        Email Address
      </label>

      <input
        id="email"
        name="email"
        type="email"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        autoComplete="email"
        aria-invalid={invalid ? "true" : "false"}
        aria-describedby="email-error"
        className="w-full rounded-xl border border-[#1e3a8a] bg-[#0b1a3d] px-4 py-3.5 text-slate-100 placeholder-slate-500 transition duration-300 ease-in-out hover:border-sky-400/50 focus:border-sky-400 focus:outline-none focus:ring-4 focus:ring-sky-500/20 aria-invalid:border-rose-500 aria-invalid:ring-rose-500/20"
      />

      <p
        id="email-error"
        className={`mt-2 text-sm text-rose-400 ${invalid ? "" : "hidden"}`}
      >
        Please enter a valid email address.
      </p>
    </div>
  );
}
