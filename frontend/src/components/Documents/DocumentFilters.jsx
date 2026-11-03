export default function DocumentFilters({
  f,
  folders,
  onTypeChange,
  onFolderChange,
  onSortChange,
  onViewChange,
  onClear,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-lg border border-[#1c48a0] p-0.5" role="group" aria-label="View mode">
        <button
          id="vList"
          aria-label="List view"
          onClick={() => onViewChange('list')}
          className={`rounded-md p-2 ${f.view === 'list' ? 'bg-[#1d6bff]' : 'text-[#a0b6e1]'}`}
        >
          <i data-lucide="list" className="h-4 w-4" />
        </button>
        <button
          id="vGrid"
          aria-label="Grid view"
          onClick={() => onViewChange('grid')}
          className={`rounded-md p-2 ${f.view === 'grid' ? 'bg-[#1d6bff]' : 'text-[#a0b6e1]'}`}
        >
          <i data-lucide="layout-grid" className="h-4 w-4" />
        </button>
      </div>
      <select
        id="fType"
        aria-label="File type"
        value={f.type}
        onChange={(e) => onTypeChange(e.target.value)}
        className="rounded-lg border border-[#1c48a0] bg-[#051840] px-3 py-2 text-sm"
      >
        <option value="all">All File Types</option>
        <option value="pdf">PDF</option>
        <option value="image">Images</option>
        <option value="doc">Documents</option>
        <option value="sheet">Spreadsheets</option>
        <option value="other">Other</option>
      </select>
      <select
        id="fFolder"
        aria-label="Folder"
        value={f.folder}
        onChange={(e) => onFolderChange(e.target.value)}
        className="rounded-lg border border-[#1c48a0] bg-[#051840] px-3 py-2 text-sm"
      >
        {['All', ...folders].map((n) => (
          <option key={n} value={n}>
            {n === 'All' ? 'All Folders' : n}
          </option>
        ))}
      </select>
      <select
        id="fSort"
        aria-label="Sort order"
        value={f.sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="rounded-lg border border-[#1c48a0] bg-[#051840] px-3 py-2 text-sm"
      >
        <option value="new">Newest First</option>
        <option value="old">Oldest First</option>
        <option value="name">Name A–Z</option>
        <option value="size">Largest First</option>
      </select>
      <button
        id="clear"
        onClick={onClear}
        className="ml-auto inline-flex items-center gap-2 rounded-lg border border-[#1c48a0] px-3 py-2 text-sm hover:bg-[#1d6bff]/20 transition"
      >
        <i data-lucide="rotate-cw" className="h-4 w-4" />
        Clear Filters
      </button>
    </div>
  );
}