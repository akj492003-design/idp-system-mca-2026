export default function SettingsSection({
  sectionKey,
  title,
  description,
  icon,
  open,
  onToggle,
  delayClass = "",
  children,
}) {
  return (
    <section
      className={`overflow-hidden rounded-lg border border-[#123765] bg-linear-to-b from-[#071d44] to-[#061a3b] shadow-lg shadow-black/10 [.light_&]:border-[#d3dcea] [.light_&]:bg-none [.light_&]:bg-white motion-safe:starting:translate-y-3 motion-safe:starting:opacity-0 motion-safe:transition-[opacity,translate] motion-safe:duration-700 motion-safe:ease-out ${delayClass}`}
    >
      <button
        type="button"
        data-toggle={sectionKey}
        aria-expanded={open}
        onClick={onToggle}
        className="group flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-200 hover:bg-white/5 [.light_&]:hover:bg-[#1677ff]/5 motion-reduce:transition-none sm:px-5 sm:py-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1677ff]"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#1677ff] transition duration-200 motion-safe:group-hover:scale-110 motion-reduce:transition-none sm:size-10">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-base font-semibold leading-tight">{title}</span>
          <span className="block text-xs leading-tight sm:text-[0.8125rem] text-[#91a9cf] [.light_&]:text-[#5b6b85]">
            {description}
          </span>
        </span>
        <svg
          data-chevron
          className={`size-4 shrink-0 text-[#91a9cf] transition-transform duration-300 ease-out motion-reduce:transition-none [.light_&]:text-[#5b6b85] ${open ? "" : "rotate-180"}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>

      <div
        data-body={sectionKey}
        hidden={!open}
        className="border-t px-4 py-3 sm:px-5 sm:py-4 border-[#123765] [.light_&]:border-[#d3dcea] motion-safe:starting:-translate-y-1 motion-safe:starting:opacity-0 motion-safe:transition-[opacity,translate] motion-safe:duration-300 motion-safe:ease-out"
      >
        {children}
      </div>
    </section>
  );
}
