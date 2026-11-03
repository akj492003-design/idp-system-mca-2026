export default function StatCard({
  icon: Icon,
  label,
  value = "—",
  tone = "blue",
  note = "—",
}) {
  const tones = {
    blue: "bg-(color:--c-secondary) text-[#bcd7ff]",
    green: "bg-[#034a45] text-emerald-300",
    red: "bg-[#5a2230] text-red-300",
    violet: "bg-[#2c1a78] text-violet-300",
    sky: "bg-[#003a7e] text-sky-300",
    orange: "bg-[#5a3a22] text-orange-300",
  };

  return (
    <article className="flex min-w-0 items-center gap-4 rounded-lg border border-(color:--c-line) bg-(color:--c-panel) p-3.5 transition duration-300 hover:-translate-y-0.5 hover:border-(color:--c-accent)/60 sm:p-4">
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg sm:h-14 sm:w-14 ${tones[tone] || tones.blue}`}
      >
        <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-xs">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>

      <div className="text-right text-[11px] text-(color:--c-muted)">
        <p>{note}</p>
        <p className="mt-3">vs. last 7 days</p>
      </div>
    </article>
  );
}