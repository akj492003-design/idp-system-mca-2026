export default function SummaryCards({
  foldersCount,
  tagsCount,
  archivedCount,
  onManageFolders,
  onManageTags,
  onViewArchived,
}) {
  return (
    <section className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 lg:grid-cols-3" aria-label="Summary">
      <div
        data-reveal
        className="flex items-center gap-4 rounded-2xl border border-[#1c48a0] bg-[#051840] p-4 transition hover:-translate-y-0.5 hover:border-[#1d6bff] motion-reduce:translate-none"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1d6bff]">
          <i data-lucide="folder-open" className="h-7 w-7 text-white" />
        </span>
        <div>
          <p className="text-sm text-[#a0b6e1]">Folders</p>
          <p id="stF" className="text-2xl font-bold">
            {foldersCount}
          </p>
          <button data-go="folders" onClick={onManageFolders} className="text-sm text-sky-400 hover:underline">
            Manage folders →
          </button>
        </div>
      </div>
      <div
        data-reveal
        className="flex items-center gap-4 rounded-2xl border border-[#1c48a0] bg-[#051840] p-4 transition hover:-translate-y-0.5 hover:border-[#1d6bff] motion-reduce:translate-none"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-violet-700">
          <i data-lucide="tag" className="h-7 w-7 text-white" />
        </span>
        <div>
          <p className="text-sm text-[#a0b6e1]">Tags</p>
          <p id="stT" className="text-2xl font-bold">
            {tagsCount}
          </p>
          <button data-go="tags" onClick={onManageTags} className="text-sm text-sky-400 hover:underline">
            Manage tags →
          </button>
        </div>
      </div>
      <div
        data-reveal
        className="min-[480px]:max-lg:col-span-2 flex items-center gap-4 rounded-2xl border border-[#1c48a0] bg-[#051840] p-4 transition hover:-translate-y-0.5 hover:border-[#1d6bff] motion-reduce:translate-none"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#1d6bff]">
          <i data-lucide="archive" className="h-7 w-7 text-white" />
        </span>
        <div>
          <p className="text-sm text-[#a0b6e1]">Archived</p>
          <p id="stA" className="text-2xl font-bold">
            {archivedCount}
          </p>
          <button data-go="archived" onClick={onViewArchived} className="text-sm text-sky-400 hover:underline">
            View archived →
          </button>
        </div>
      </div>
    </section>
  );
}