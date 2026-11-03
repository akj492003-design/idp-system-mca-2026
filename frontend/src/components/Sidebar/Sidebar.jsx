
export default function Sidebar({
  folders,
  tags,
  f,
  cnt,
  docs,
  sideOpen,
  onClose,
  onSelectFolder,
  onSelectTag,
  onAddFolder,
  onAddTag,
}) {
  return (
    <aside
      id="side"
      className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] overflow-auto border-r border-[#1c48a0] bg-[#03102e] p-4 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:rounded-2xl lg:border lg:bg-[#051840]/60 ${
        sideOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Folders and tags"
    >
      {/* Sidebar header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Folders</h2>

        <div className="flex items-center gap-2">
          {/* Add folder */}
          <button
            id="addFolder"
            type="button"
            aria-label="Add folder"
            onClick={onAddFolder}
            className="rounded-lg border border-[#1c48a0] p-1.5 transition hover:bg-[#1d6bff]/20"
          >
            <i data-lucide="plus" className="h-4 w-4" />
          </button>

          {/* Close sidebar - mobile only */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-lg border border-[#1c48a0] p-1.5 transition hover:bg-[#1d6bff]/20 lg:hidden"
          >
            <i data-lucide="x" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Folder list */}
      <nav id="folderList" className="space-y-1">
        {['All', ...folders].map((n) => (
          <button
            key={n}
            type="button"
            data-f={n}
            onClick={() => onSelectFolder(n)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
              f.folder === n && !f.arch
                ? 'bg-[#1d6bff] text-white'
                : 'hover:bg-[#1d6bff]/20'
            }`}
          >
            <i
              data-lucide={n === 'All' ? 'folder-open' : 'folder'}
              className="h-5 w-5"
            />

            <span className="flex-1 truncate">
              {n === 'All' ? 'All Documents' : n}
            </span>

            <span>{cnt(n)}</span>
          </button>
        ))}
      </nav>

      <hr className="my-4 border-[#1c48a0]" />

      {/* Tags header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Tags</h2>

        <button
          id="addTag"
          type="button"
          aria-label="Add tag"
          onClick={onAddTag}
          className="rounded-lg border border-[#1c48a0] p-1.5 transition hover:bg-[#1d6bff]/20"
        >
          <i data-lucide="plus" className="h-4 w-4" />
        </button>
      </div>

      {/* Tag list */}
      <div id="tagList" className="space-y-3">
        {tags.map((t) => (
          <button
            key={t.n}
            type="button"
            data-t={t.n}
            onClick={() => onSelectTag(t.n)}
            className="flex w-full items-center gap-2 text-sm"
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-medium text-white transition hover:brightness-110 ${t.c} ${
                f.tag === t.n ? 'ring-2 ring-white' : ''
              }`}
            >
              <i
                data-lucide="star"
                className="h-3.5 w-3.5 fill-white"
              />

              {t.n}
            </span>

            <span className="ml-auto">
              {docs.filter(
                (d) => !d.arch && d.tags.includes(t.n)
              ).length}
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
