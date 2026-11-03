export default function Header({ stats, fmt }) {
  const { u, p } = stats;
  return (
    <section
      data-reveal
      className="relative overflow-hidden rounded-2xl border border-[#1c48a0] bg-linear-to-r from-[#051840] via-[#1d6bff]/20 to-[#051840] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1d6bff] shadow-lg shadow-[#1d6bff]/40 sm:h-16 sm:w-16">
          <i data-lucide="folder" className="h-7 w-7 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold sm:text-3xl">Track &amp; Manage</h1>
          <p className="text-sm text-[#a0b6e1] sm:text-base">
            Organize, manage and control your documents and storage.
          </p>
        </div>
        <div className="flex w-full items-center gap-4 rounded-xl border border-[#1c48a0] bg-[#03102e]/40 p-3 sm:w-auto sm:min-w-[22rem]">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1d6bff]">
            <i data-lucide="database" className="h-6 w-6 text-white" />
          </span>
          <div className="flex-1">
            <p className="text-sm text-[#a0b6e1]">Storage Used</p>
            <p className="text-xl font-semibold">
              <span className="sUsed">{fmt(u).replace(/^0 B$/, '0 GB')}</span>{' '}
              <span className="text-sm font-normal text-[#a0b6e1]">/ 5 GB</span>
            </p>
            <div className="mt-1 flex items-center gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#1c48a0]/50">
                <div
                  className="sBar h-full w-full origin-left rounded-full bg-[#1d6bff] transition-transform duration-300 ease-out"
                  style={{ transform: `scaleX(${p / 100})` }}
                />
              </div>
              <span className="sPct text-xs font-semibold">
                {p < 1 && u ? '<1' : Math.round(p)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}